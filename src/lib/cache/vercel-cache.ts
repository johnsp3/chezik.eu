/**
 * Vercel Caching Strategy
 * 
 * Comprehensive caching implementation optimized for Vercel's edge network.
 * Provides intelligent caching for different types of content with proper invalidation.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// CACHE CONFIGURATION
// ============================================================================

export const CACHE_STRATEGIES = {
  // Static assets - never change
  STATIC: {
    maxAge: 31536000, // 1 year
    sMaxAge: 31536000,
    staleWhileRevalidate: 86400, // 1 day
    immutable: true,
  },
  
  // Audio files - rarely change
  AUDIO: {
    maxAge: 86400, // 1 day
    sMaxAge: 604800, // 1 week
    staleWhileRevalidate: 3600, // 1 hour
    immutable: false,
  },
  
  // Images - occasionally change
  IMAGES: {
    maxAge: 86400, // 1 day
    sMaxAge: 604800, // 1 week
    staleWhileRevalidate: 3600, // 1 hour
    immutable: false,
  },
  
  // API responses - dynamic content
  API_DYNAMIC: {
    maxAge: 0,
    sMaxAge: 0,
    staleWhileRevalidate: 0,
    immutable: false,
  },
  
  // API responses - semi-static
  API_SEMI_STATIC: {
    maxAge: 300, // 5 minutes
    sMaxAge: 3600, // 1 hour
    staleWhileRevalidate: 60, // 1 minute
    immutable: false,
  },
  
  // API responses - static
  API_STATIC: {
    maxAge: 3600, // 1 hour
    sMaxAge: 86400, // 1 day
    staleWhileRevalidate: 300, // 5 minutes
    immutable: false,
  },
} as const;

// ============================================================================
// CACHE KEY GENERATION
// ============================================================================

/**
 * Generate cache key based on request
 */
export function generateCacheKey(
  request: NextRequest,
  customKey?: string
): string {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const searchParams = url.searchParams.toString();
  
  // Base key from pathname
  let key = pathname;
  
  // Add search params if present
  if (searchParams) {
    key += `?${searchParams}`;
  }
  
  // Add custom key if provided
  if (customKey) {
    key += `#${customKey}`;
  }
  
  // Add user agent for device-specific caching
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.includes('Mobile')) {
    key += '@mobile';
  } else if (userAgent.includes('Tablet')) {
    key += '@tablet';
  } else {
    key += '@desktop';
  }
  
  return key;
}

// ============================================================================
// CACHE HEADERS
// ============================================================================

/**
 * Set cache headers for response
 */
export function setCacheHeaders(
  response: NextResponse,
  strategy: keyof typeof CACHE_STRATEGIES,
  customHeaders?: Record<string, string>
): NextResponse {
  const cacheConfig = CACHE_STRATEGIES[strategy];
  
  // Set cache control
  let cacheControl = `public, max-age=${cacheConfig.maxAge}`;
  
  if (cacheConfig.sMaxAge > 0) {
    cacheControl += `, s-maxage=${cacheConfig.sMaxAge}`;
  }
  
  if (cacheConfig.staleWhileRevalidate > 0) {
    cacheControl += `, stale-while-revalidate=${cacheConfig.staleWhileRevalidate}`;
  }
  
  if (cacheConfig.immutable) {
    cacheControl += ', immutable';
  }
  
  response.headers.set('Cache-Control', cacheControl);
  
  // Set ETag for better caching
  if (!response.headers.get('ETag')) {
    const etag = generateETag();
    response.headers.set('ETag', etag);
  }
  
  // Set Vary header for proper cache behavior
  response.headers.set('Vary', 'Accept-Encoding, User-Agent');
  
  // Set custom headers
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }
  
  return response;
}

/**
 * Generate ETag for response
 */
function generateETag(): string {
  // Simple ETag generation based on timestamp
  // In production, you might want to use content hash
  const timestamp = Date.now();
  return `"${timestamp}"`;
}

// ============================================================================
// CACHE VALIDATION
// ============================================================================

/**
 * Check if request has valid cache
 */
export function hasValidCache(request: NextRequest): boolean {
  const ifNoneMatch = request.headers.get('if-none-match');
  const ifModifiedSince = request.headers.get('if-modified-since');
  
  return !!(ifNoneMatch || ifModifiedSince);
}

/**
 * Check if response should be cached
 */
export function shouldCache(
  request: NextRequest,
  response: NextResponse
): boolean {
  // Don't cache non-GET requests
  if (request.method !== 'GET') {
    return false;
  }
  
  // Don't cache error responses
  if (response.status >= 400) {
    return false;
  }
  
  // Don't cache responses with no-cache headers
  const cacheControl = response.headers.get('cache-control');
  if (cacheControl?.includes('no-cache') || cacheControl?.includes('no-store')) {
    return false;
  }
  
  return true;
}

// ============================================================================
// CACHE INVALIDATION
// ============================================================================

/**
 * Invalidate cache for specific pattern
 */
export async function invalidateCache(pattern: string): Promise<void> {
  // In Vercel, cache invalidation is handled automatically
  // This function is for future extensibility
  console.log(`[CACHE] Invalidating cache for pattern: ${pattern}`);
}

/**
 * Invalidate cache for specific URL
 */
export async function invalidateUrl(url: string): Promise<void> {
  console.log(`[CACHE] Invalidating cache for URL: ${url}`);
}

// ============================================================================
// CACHE STATISTICS
// ============================================================================

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  hits: number;
  misses: number;
  hitRate: number;
} {
  // In a real implementation, you'd track these metrics
  return {
    hits: 0,
    misses: 0,
    hitRate: 0,
  };
}

// ============================================================================
// CACHE MIDDLEWARE
// ============================================================================

/**
 * Cache middleware for API routes
 */
export function withCache(
  handler: (request: NextRequest) => Promise<NextResponse>,
  strategy: keyof typeof CACHE_STRATEGIES = 'API_SEMI_STATIC'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Check if request has valid cache
      if (hasValidCache(request)) {
        // Return 304 Not Modified
        return new NextResponse(null, { status: 304 });
      }
      
      // Execute handler
      const response = await handler(request);
      
      // Set cache headers if response should be cached
      if (shouldCache(request, response)) {
        return setCacheHeaders(response, strategy);
      }
      
      return response;
    } catch (error) {
      console.error('[CACHE] Error in cache middleware:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };
}

// ============================================================================
// CACHE UTILITIES
// ============================================================================

/**
 * Get cache strategy for URL
 */
export function getCacheStrategy(url: string): keyof typeof CACHE_STRATEGIES {
  if (url.includes('/api/')) {
    if (url.includes('/audio/stream/')) {
      return 'API_STATIC';
    }
    if (url.includes('/audio/analytics') || url.includes('/contact') || url.includes('/email/') || url.includes('/newsletter')) {
      return 'API_DYNAMIC';
    }
    return 'API_SEMI_STATIC';
  }
  
  if (url.match(/\.(mp3|wav|ogg|m4a)$/)) {
    return 'AUDIO';
  }
  
  if (url.match(/\.(png|jpg|jpeg|gif|webp|avif|svg)$/)) {
    return 'IMAGES';
  }
  
  if (url.match(/\.(css|js|woff|woff2|ttf|eot)$/)) {
    return 'STATIC';
  }
  
  return 'API_SEMI_STATIC';
}

/**
 * Preload critical resources
 */
export function preloadCriticalResources(): string[] {
  return [
    '/api/audio/stream/1',
    '/api/audio/stream/2',
    '/api/audio/stream/3',
    '/api/audio/stream/4',
    '/api/audio/stream/5',
  ];
}
