/**
 * Gallery API Route
 * 
 * Handles GET requests for gallery photos with comprehensive filtering,
 * pagination, search capabilities, and performance monitoring. Optimized
 * for edge runtime with proper caching and rate limiting.
 * 
 * @fileoverview Gallery API with comprehensive photo management and search capabilities
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // Get gallery photos with filtering
 * const response = await fetch('/api/gallery?category=studio&page=1&limit=12');
 * 
 * // Search gallery photos
 * const search = await fetch('/api/gallery?search=studio&sortBy=date&sortOrder=desc');
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers}
 */

import { NextRequest, NextResponse } from 'next/server';
import { setCacheHeaders } from '@/lib/cache/vercel-cache';
import { withPerformanceMonitoring, trackUserBehavior } from '@/lib/monitoring/vercel-monitoring';
import { withRateLimit } from '@/lib/security/vercel-security';
import type { Photo, GalleryApiResponse, PhotoCategory } from '@/types/gallery';

export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

// Sample photo data - in production, this would come from a database
const photos: Photo[] = [
  {
    id: 1,
    title: "Studio Session 2024",
    description: "Recording the latest album in the renovated studio with vintage acoustics and state-of-the-art equipment",
    imageUrl: "/gallery/studio-session-2024.jpg",
    thumbnailUrl: "/gallery/thumbnails/studio-session-2024.jpg",
    category: "studio",
    tags: ["recording", "studio", "album", "2024", "music", "production"],
    date: "2024-01-15",
    location: "John Chezik Studio",
    photographer: "Studio Team",
    color: "from-blue-600 to-purple-600",
    aspectRatio: "landscape",
    dimensions: { width: 1920, height: 1080 },
    fileSize: 2048000,
    metadata: {
      camera: "Canon EOS R5",
      lens: "24-70mm f/2.8",
      settings: "f/4, 1/125s, ISO 400",
      edited: true
    }
  },
  {
    id: 2,
    title: "Live Performance",
    description: "Capturing the raw energy and emotion of a live performance at the intimate downtown venue",
      imageUrl: "/gallery/photo-2.jpg",
      thumbnailUrl: "/gallery/thumbnails/photo-2.jpg",
    category: "live",
    tags: ["live", "performance", "concert", "guitar", "stage", "energy"],
    date: "2024-02-20",
    location: "Downtown Music Hall",
    photographer: "Event Photographer",
    color: "from-red-600 to-orange-600",
    aspectRatio: "portrait",
    dimensions: { width: 1080, height: 1920 },
    fileSize: 1536000,
    metadata: {
      camera: "Sony A7R IV",
      lens: "85mm f/1.4",
      settings: "f/2.8, 1/250s, ISO 800",
      edited: true
    }
  },
  {
    id: 3,
    title: "Behind the Scenes",
    description: "A candid moment during the creative process, showing the real work that goes into making music",
      imageUrl: "/gallery/photo-3.jpg",
      thumbnailUrl: "/gallery/thumbnails/photo-3.jpg",
    category: "behind-scenes",
    tags: ["behind-scenes", "creative", "process", "candid", "authentic"],
    date: "2024-03-10",
    location: "John Chezik Studio",
    photographer: "Studio Team",
    color: "from-green-600 to-teal-600",
    aspectRatio: "square",
    dimensions: { width: 1080, height: 1080 },
    fileSize: 1024000,
    metadata: {
      camera: "iPhone 15 Pro",
      lens: "26mm f/1.78",
      settings: "f/1.8, 1/60s, ISO 200",
      edited: false
    }
  },
  {
    id: 4,
    title: "Personal Moment",
    description: "A quiet moment of reflection and inspiration in the home studio, where creativity begins",
      imageUrl: "/gallery/photo-4.jpg",
      thumbnailUrl: "/gallery/thumbnails/photo-4.jpg",
    category: "personal",
    tags: ["personal", "reflection", "inspiration", "quiet", "home"],
    date: "2024-03-25",
    location: "Home Studio",
    photographer: "Self",
    color: "from-purple-600 to-pink-600",
    aspectRatio: "landscape",
    dimensions: { width: 1920, height: 1080 },
    fileSize: 1800000,
    metadata: {
      camera: "Canon EOS R6",
      lens: "50mm f/1.2",
      settings: "f/2.8, 1/125s, ISO 320",
      edited: true
    }
  },
  {
    id: 5,
    title: "Event Highlights",
    description: "Highlights from the recent music industry event, networking with fellow artists and industry professionals",
      imageUrl: "/gallery/photo-5.jpg",
      thumbnailUrl: "/gallery/thumbnails/photo-5.jpg",
    category: "events",
    tags: ["event", "industry", "networking", "highlights", "professional"],
    date: "2024-04-05",
    location: "Music Industry Conference",
    photographer: "Event Team",
    color: "from-yellow-600 to-red-600",
    aspectRatio: "wide",
    dimensions: { width: 2560, height: 1440 },
    fileSize: 3200000,
    metadata: {
      camera: "Nikon Z9",
      lens: "24-120mm f/4",
      settings: "f/5.6, 1/200s, ISO 400",
      edited: true
    }
  },
  {
    id: 6,
    title: "Merchandise Collection",
    description: "Professional shots of the latest merchandise collection, showcasing quality and design",
      imageUrl: "/gallery/photo-6.jpg",
      thumbnailUrl: "/gallery/thumbnails/photo-6.jpg",
    category: "merchandise",
    tags: ["merchandise", "products", "collection", "professional", "design"],
    date: "2024-04-15",
    location: "Photo Studio",
    photographer: "Product Photographer",
    color: "from-indigo-600 to-blue-600",
    aspectRatio: "square",
    dimensions: { width: 1080, height: 1080 },
    fileSize: 1200000,
    metadata: {
      camera: "Canon EOS R5",
      lens: "100mm f/2.8 Macro",
      settings: "f/8, 1/125s, ISO 100",
      edited: true
    }
  },
  {
    id: 7,
    title: "Collaboration Session",
    description: "Working with talented musicians and producers on new collaborative projects",
    imageUrl: "/gallery/collaboration-2024.jpg",
    thumbnailUrl: "/gallery/thumbnails/collaboration-2024.jpg",
    category: "collaborations",
    tags: ["collaboration", "musicians", "producers", "creative", "teamwork"],
    date: "2024-05-01",
    location: "Collaborative Studio",
    photographer: "Studio Team",
    color: "from-cyan-600 to-blue-600",
    aspectRatio: "landscape",
    dimensions: { width: 1920, height: 1080 },
    fileSize: 2100000,
    metadata: {
      camera: "Sony A7R V",
      lens: "35mm f/1.4",
      settings: "f/3.2, 1/100s, ISO 500",
      edited: true
    }
  },
  {
    id: 8,
    title: "Studio Equipment",
    description: "Showcasing the professional studio equipment and instruments used in the recording process",
    imageUrl: "/gallery/studio-equipment-2024.jpg",
    thumbnailUrl: "/gallery/thumbnails/studio-equipment-2024.jpg",
    category: "studio",
    tags: ["equipment", "instruments", "studio", "professional", "gear"],
    date: "2024-05-10",
    location: "John Chezik Studio",
    photographer: "Studio Team",
    color: "from-gray-600 to-blue-600",
    aspectRatio: "wide",
    dimensions: { width: 2560, height: 1440 },
    fileSize: 2800000,
    metadata: {
      camera: "Canon EOS R5",
      lens: "16-35mm f/2.8",
      settings: "f/5.6, 1/125s, ISO 200",
      edited: true
    }
  }
];

/**
 * Handle gallery photo requests
 * 
 * Processes gallery photo requests with comprehensive filtering, pagination,
 * search capabilities, and sorting. Returns paginated results with metadata.
 * 
 * @param request - The incoming request with query parameters
 * @returns NextResponse with gallery photos and pagination metadata
 * 
 * @example
 * ```tsx
 * const response = await handleGalleryRequest(request);
 * // Returns: { success: true, data: [...], pagination: {...} }
 * ```
 */
async function handleGalleryRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category') as PhotoCategory | null;
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const search = searchParams.get('search')?.toLowerCase() || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Track user behavior
    trackUserBehavior(request, 'gallery_request', {
      page,
      limit,
      category,
      tags,
      search,
      sortBy,
      sortOrder
    });

    // Filter photos
    let filteredPhotos = [...photos];

    // Apply category filter
    if (category) {
      filteredPhotos = filteredPhotos.filter(photo => photo.category === category);
    }

    // Apply tag filter
    if (tags.length > 0) {
      filteredPhotos = filteredPhotos.filter(photo =>
        tags.some(tag => photo.tags.includes(tag))
      );
    }

    // Apply search filter
    if (search) {
      filteredPhotos = filteredPhotos.filter(photo =>
        photo.title.toLowerCase().includes(search) ||
        photo.description.toLowerCase().includes(search) ||
        photo.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    // Sort photos
    filteredPhotos.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'category':
          aValue = a.category;
          bValue = b.category;
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Calculate pagination
    const total = filteredPhotos.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex);

    // Prepare response
    const response: GalleryApiResponse<Photo[]> = {
      success: true,
      data: paginatedPhotos,
      message: `Retrieved ${paginatedPhotos.length} photos`,
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };

    const nextResponse = NextResponse.json(response);
    return setCacheHeaders(nextResponse, 'API_SEMI_STATIC');

  } catch (error) {
    console.error('[GALLERY_API] Error:', error);
    
    const errorResponse: GalleryApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to retrieve gallery photos',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export const GET = withPerformanceMonitoring(
  withRateLimit(handleGalleryRequest, 'API_LENIENT')
);

