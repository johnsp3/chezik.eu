/**
 * Vercel Security & Rate Limiting
 * 
 * Comprehensive security implementation for Vercel deployment.
 * Includes rate limiting, request validation, and security headers.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import 'server-only';

import { NextRequest, NextResponse } from 'next/server';

// ============================================================================
// RATE LIMITING CONFIGURATION
// ============================================================================

export const RATE_LIMITS = {
  // API endpoints - strict limits
  API_STRICT: {
    requests: 10,
    window: 60, // 1 minute
    burst: 5,
  },
  
  // API endpoints - moderate limits
  API_MODERATE: {
    requests: 30,
    window: 60, // 1 minute
    burst: 10,
  },
  
  // API endpoints - lenient limits
  API_LENIENT: {
    requests: 100,
    window: 60, // 1 minute
    burst: 20,
  },
  
  // Audio streaming - higher limits
  AUDIO_STREAM: {
    requests: 200,
    window: 60, // 1 minute
    burst: 50,
  },
  
  // Contact form - very strict
  CONTACT_FORM: {
    requests: 3,
    window: 300, // 5 minutes
    burst: 1,
  },
  
  // Newsletter signup - moderate
  NEWSLETTER: {
    requests: 5,
    window: 300, // 5 minutes
    burst: 2,
  },
} as const;

// ============================================================================
// RATE LIMITING STORAGE
// ============================================================================

interface RateLimitEntry {
  count: number;
  resetTime: number;
  burstCount: number;
  burstResetTime: number;
}

// In-memory storage for rate limiting
// In production, use Redis or Vercel KV
const rateLimitStore = new Map<string, RateLimitEntry>();

// ============================================================================
// RATE LIMITING FUNCTIONS
// ============================================================================

/**
 * Check rate limit for request
 */
export function checkRateLimit(
  request: NextRequest,
  limit: keyof typeof RATE_LIMITS
): { allowed: boolean; remaining: number; resetTime: number } {
  const clientIP = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || '';
  const key = `${clientIP}:${userAgent}:${limit}`;
  
  const config = RATE_LIMITS[limit];
  const now = Date.now();
  const windowMs = config.window * 1000;
  const burstWindowMs = 1000; // 1 second for burst
  
  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = {
      count: 0,
      resetTime: now + windowMs,
      burstCount: 0,
      burstResetTime: now + burstWindowMs,
    };
    rateLimitStore.set(key, entry);
  }
  
  // Reset counters if window has passed
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + windowMs;
  }
  
  if (now > entry.burstResetTime) {
    entry.burstCount = 0;
    entry.burstResetTime = now + burstWindowMs;
  }
  
  // Check burst limit first
  if (entry.burstCount >= config.burst) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.burstResetTime,
    };
  }
  
  // Check main limit
  if (entry.count >= config.requests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment counters
  entry.count++;
  entry.burstCount++;
  
  return {
    allowed: true,
    remaining: config.requests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwardedFor) return (forwardedFor.split(',')[0] ?? forwardedFor).trim();
  
  return 'unknown';
}

// ============================================================================
// SECURITY VALIDATION
// ============================================================================

/**
 * Validate request security
 */
export function validateRequestSecurity(request: NextRequest): {
  valid: boolean;
  reason?: string;
} {
  // Check for suspicious patterns
  const url = request.url;
  const userAgent = request.headers.get('user-agent') || '';
  
  // Block known bad user agents (but allow curl for development)
  const badUserAgents = [
    'bot', 'crawler', 'spider', 'scraper', 'wget', 'python-requests'
  ];
  
  // Only block curl in production
  if (process.env.NODE_ENV === 'production' && userAgent.toLowerCase().includes('curl')) {
    return { valid: false, reason: 'Suspicious user agent' };
  }
  
  if (badUserAgents.some(bad => userAgent.toLowerCase().includes(bad))) {
    return { valid: false, reason: 'Suspicious user agent' };
  }
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i,
    /update\s+set/i,
    /or\s+1=1/i,
  ];
  
  if (sqlPatterns.some(pattern => pattern.test(url))) {
    return { valid: false, reason: 'SQL injection attempt' };
  }
  
  // Check for XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /onload=/i,
    /onerror=/i,
    /onclick=/i,
  ];
  
  if (xssPatterns.some(pattern => pattern.test(url))) {
    return { valid: false, reason: 'XSS attempt' };
  }
  
  // Check request size
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 1024 * 1024) { // 1MB
    return { valid: false, reason: 'Request too large' };
  }
  
  return { valid: true };
}

// ============================================================================
// SECURITY HEADERS
// ============================================================================

/**
 * Set security headers
 */
export function setSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://vitals.vercel-insights.com; frame-ancestors 'none';"
  );
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  
  // Strict-Transport-Security (only for HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }
  
  return response;
}

// ============================================================================
// RATE LIMITING MIDDLEWARE
// ============================================================================

/**
 * Rate limiting middleware
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  limit: keyof typeof RATE_LIMITS = 'API_MODERATE'
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // Validate request security
      const securityCheck = validateRequestSecurity(request);
      if (!securityCheck.valid) {
        console.warn(`[SECURITY] Blocked request: ${securityCheck.reason}`);
        return new NextResponse('Forbidden', { status: 403 });
      }
      
      // Check rate limit
      const rateLimit = checkRateLimit(request, limit);
      if (!rateLimit.allowed) {
        console.warn(`[RATE_LIMIT] Blocked request from ${getClientIP(request)}`);
        return new NextResponse('Too Many Requests', { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': RATE_LIMITS[limit].requests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(rateLimit.resetTime / 1000).toString(),
          }
        });
      }
      
      // Execute handler
      const response = await handler(request);
      
      // Set security headers
      setSecurityHeaders(response);
      
      // Add rate limit headers
      response.headers.set('X-RateLimit-Limit', RATE_LIMITS[limit].requests.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimit.remaining.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(rateLimit.resetTime / 1000).toString());
      
      return response;
    } catch (error) {
      console.error('[SECURITY] Error in security middleware:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  };
}

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Sanitize input string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate secure token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Clean up old rate limit entries
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime && now > entry.burstResetTime) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => rateLimitStore.delete(key));
}

// Clean up rate limit store every 5 minutes
setInterval(cleanupRateLimit, 5 * 60 * 1000);
