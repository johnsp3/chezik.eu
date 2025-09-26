/**
 * Search API Route
 * 
 * Handles comprehensive search requests across all website content including
 * albums, books, blog posts, gallery photos, and sections. Features advanced
 * search algorithms with relevance scoring and performance monitoring.
 * 
 * @fileoverview Search API with comprehensive content search and advanced algorithms
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // Search across all content
 * const response = await fetch('/api/search?q=studio&limit=10');
 * 
 * // Search with specific parameters
 * const search = await fetch('/api/search?q=john&limit=5');
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers}
 */

import { NextRequest, NextResponse } from 'next/server';
// import { setCacheHeaders } from '@/lib/cache/vercel-cache'; // Removed - using manual cache headers
import { withPerformanceMonitoring, trackUserBehavior } from '@/lib/monitoring/vercel-monitoring';
import { withRateLimit } from '@/lib/security/vercel-security';

interface SearchResult {
  type: 'album' | 'book' | 'blog' | 'section' | 'gallery';
  title: string;
  description: string;
  href: string;
  anchorId?: string;
  category?: string;
  relevance?: number;
  location?: string;
  year?: string;
  genre?: string;
  tags?: string[];
  imageUrl?: string;
}

interface SearchApiResponse {
  success: boolean;
  data?: SearchResult[];
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  message?: string;
  timestamp: string;
  request_id?: string;
  total?: number;
  query?: string;
}

// Enterprise-level search data with enhanced metadata
const searchData: SearchResult[] = [
  // Albums - From AlbumsSection.tsx
  {
    type: 'album',
    title: "Don't Say It's Over",
    description: 'A heartfelt plea to hold on to love. The song captures the pain of separation, the hope for reconciliation, and the enduring belief that true love is worth one more chance.',
    href: '#albums',
    anchorId: 'album-dont-say-its-over',
    category: 'music',
    location: 'Albums Section',
    year: '2025',
    genre: 'Hard Rock',
    tags: ['love', 'heartbreak', 'reconciliation', 'hard rock', '2025'],
    relevance: 1.0
  },
  {
    type: 'album',
    title: 'The Visual Man',
    description: 'The Visual Man is about seduction, energy, and connection. It explores the hypnotic pull of desire and the promise of being lifted into a world of passion and ecstasy.',
    href: '#albums',
    anchorId: 'album-the-visual-man',
    category: 'music',
    location: 'Albums Section',
    year: '2024',
    genre: 'Hard Rock',
    tags: ['seduction', 'energy', 'connection', 'hard rock', '2024'],
    relevance: 1.0
  },
  {
    type: 'album',
    title: 'The Revealing',
    description: 'About embracing who you truly are and opening yourself to passion and emotion. It\'s a journey of self-discovery, vulnerability, and the pleasure of letting your inner feelings shine.',
    href: '#albums',
    anchorId: 'album-the-revealing',
    category: 'music',
    location: 'Albums Section',
    year: '2023',
    genre: 'Hard Rock/Blues/Instrumental',
    tags: ['self-discovery', 'vulnerability', 'passion', 'hard rock', 'blues', '2023'],
    relevance: 1.0
  },
  {
    type: 'album',
    title: 'Look At Me',
    description: 'Hard Rock • 2022 • A dark and haunting exploration of fear and power',
    href: '#albums',
    anchorId: 'album-look-at-me',
    category: 'music',
    relevance: 1.0
  },
  {
    type: 'album',
    title: 'My Life',
    description: 'Soft/Acoustic • 2021 • A reflective anthem about chasing the rock dream',
    href: '#albums',
    anchorId: 'album-my-life',
    category: 'music',
    relevance: 1.0
  },
  {
    type: 'album',
    title: 'Something More',
    description: 'Soft/Piano • 2020 • A heartfelt ballad about enduring love',
    href: '#albums',
    anchorId: 'album-something-more',
    category: 'music',
    relevance: 1.0
  },

  // Books - From BooksSection.tsx
  {
    type: 'book',
    title: 'The Alpha Code',
    description: 'Self-Development • 2024 • A bold guide for men ready to rise above mediocrity',
    href: '#books',
    anchorId: 'book-the-alpha-code',
    category: 'books',
    relevance: 1.0
  },
  {
    type: 'book',
    title: 'The Visual Man',
    description: 'Psychology • 2025 • Exploring connection between psychology and attraction',
    href: '#books',
    anchorId: 'book-the-visual-man',
    category: 'books',
    relevance: 1.0
  },

  // Blog Posts - From BlogSection.tsx
  {
    type: 'blog',
    title: 'Recording Album #7',
    description: 'In the Studio • Currently in pre-production for my 7th studio album',
    href: '#blog',
    anchorId: 'blog-recording-album-7',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'blog',
    title: 'What Women Really Want',
    description: 'New Book • Spring 2026 • Exploring authentic masculinity and connection',
    href: '#blog',
    anchorId: 'blog-what-women-really-want',
    category: 'books',
    relevance: 1.0
  },
  {
    type: 'blog',
    title: 'Home Studio Renovation',
    description: 'Studio Expansion • 2025 • Major renovation with vintage acoustics',
    href: '#blog',
    anchorId: 'blog-home-studio-renovation',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'blog',
    title: 'Vintage Gibson Les Paul',
    description: 'New Acquisition • Recent • Rare 1970s Gibson with haunting tone',
    href: '#blog',
    anchorId: 'blog-vintage-gibson-les-paul',
    category: 'gear',
    relevance: 1.0
  },

  // Gallery Photos - ALL PHOTOS FROM PhotoGallery.tsx
  {
    type: 'gallery',
    title: 'Powerhouse Vocals',
    description: 'John in the studio singing, capturing the raw emotion and passion of musical creation. This intimate moment shows the artist in his element, bringing songs to life through pure vocal expression.',
    href: '#gallery',
    anchorId: 'photo-powerhouse-vocals',
    category: 'studio',
    location: 'Photo Gallery',
    year: '2025',
    tags: ['singing', 'studio', 'vocals', 'emotion', 'music creation', '2025'],
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'Trying To Look Serious',
    description: 'Studio • 2024 • Professional portrait in the studio',
    href: '#gallery',
    anchorId: 'photo-trying-to-look-serious',
    imageUrl: '/gallery/thumbnails/john standing professional studio.png',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'My Favorite Acoustic',
    description: 'Studio • 2023 • John with his full acoustic guitar',
    href: '#gallery',
    anchorId: 'photo-my-favorite-acoustic',
    imageUrl: '/gallery/thumbnails/poor man\'s acoustic.png',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'In The Studio Somewhere',
    description: 'Studio • 1992 • Natural, youthful smile showing joy and passion',
    href: '#gallery',
    anchorId: 'photo-in-the-studio-somewhere',
    imageUrl: '/gallery/thumbnails/John Studio Young Normal Smiling.png',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'I Hope This Wire Goes Here',
    description: 'Studio • 2008 • Working on a guitar, demonstrating technical artistry',
    href: '#gallery',
    anchorId: 'photo-i-hope-this-wire-goes-here',
    imageUrl: '/gallery/thumbnails/John working on a guitar.png',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'Kitchen Rockstar',
    description: 'Vintage • 1980 • Early career photo in kitchen with guitar',
    href: '#gallery',
    anchorId: 'photo-kitchen-rockstar',
    imageUrl: '/gallery/thumbnails/John 1990 standing in kitchen with guitar.png',
    category: 'vintage',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'My First Grammy',
    description: 'Achievement • 1996 • Celebrating Best Film Grammy achievement',
    href: '#gallery',
    anchorId: 'photo-my-first-grammy',
    imageUrl: '/gallery/thumbnails/John and Studios 1990 Best Film Grammy.png',
    category: 'achievement',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'Trying To Look Cool',
    description: 'Lifestyle • 2003 • John in Monaco with his new Pagani Zonda',
    href: '#gallery',
    anchorId: 'photo-trying-to-look-cool',
    imageUrl: '/gallery/thumbnails/John in Monaco new Pagani Zonda.png',
    category: 'lifestyle',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'My Ferrari F50 - Just Got It',
    description: 'Lifestyle • 1996 • John with his stunning Ferrari F50 in Monaco',
    href: '#gallery',
    anchorId: 'photo-my-ferrari-f50',
    imageUrl: '/gallery/thumbnails/John, new F50 Ferrari Monaco.png',
    category: 'lifestyle',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'V Studios 1998',
    description: 'Studio • 1998 • John in studio during the 1980s, leaning against mixer board',
    href: '#gallery',
    anchorId: 'photo-v-studios-1998',
    imageUrl: '/gallery/thumbnails/John, in studio, 1980s, leaning against mixer board.png',
    category: 'studio',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'John, 17 Years Old',
    description: 'Vintage • 1981 • Youthful portrait showing early passion and determination',
    href: '#gallery',
    anchorId: 'photo-john-17-years-old',
    imageUrl: '/gallery/thumbnails/John, 17 years old.png',
    category: 'vintage',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'John, 16 Years Old',
    description: 'Vintage • 1980 • Early career photo showing raw talent and ambition',
    href: '#gallery',
    anchorId: 'photo-john-16-years-old',
    imageUrl: '/gallery/thumbnails/John, 16 years old.png',
    category: 'vintage',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'John, Early 1980s',
    description: 'Vintage • 1980s • Early career photo from the 1980s',
    href: '#gallery',
    anchorId: 'photo-john-early-1980s',
    imageUrl: '/gallery/thumbnails/John, early 1980s, 17 years old.png',
    category: 'vintage',
    relevance: 1.0
  },
  {
    type: 'gallery',
    title: 'John, Kneeling Next to Guitars',
    description: 'Studio • 1990s • John kneeling next to guitars in studio',
    href: '#gallery',
    anchorId: 'photo-john-kneeling-guitars',
    imageUrl: '/gallery/thumbnails/John, kneeling next to guitars in studio, 1990s.png',
    category: 'studio',
    relevance: 1.0
  },

  // Additional searchable terms for better coverage
  {
    type: 'gallery',
    title: 'John Chezik',
    description: 'All photos and content featuring John Chezik',
    href: '#gallery',
    anchorId: 'photo-john-chezik',
    imageUrl: '/gallery/thumbnails/John, 17 years old.png',
    category: 'all',
    relevance: 1.0
  },
  {
    type: 'album',
    title: 'John Chezik Music',
    description: 'All albums and music by John Chezik',
    href: '#albums',
    anchorId: 'album-john-chezik-music',
    category: 'music',
    relevance: 1.0
  },
  {
    type: 'book',
    title: 'John Chezik Books',
    description: 'All books written by John Chezik',
    href: '#books',
    anchorId: 'book-john-chezik-books',
    category: 'books',
    relevance: 1.0
  },
  {
    type: 'blog',
    title: 'John Chezik Blog',
    description: 'All blog posts by John Chezik',
    href: '#blog',
    anchorId: 'blog-john-chezik-blog',
    category: 'all',
    relevance: 1.0
  },

  // Years and decades for better search
  {
    type: 'gallery',
    title: '1980s Photos',
    description: 'Vintage photos from the 1980s',
    href: '#gallery',
    anchorId: 'photo-1980s',
    imageUrl: '/gallery/thumbnails/John, 16 years old.png',
    category: 'vintage',
    relevance: 0.8
  },
  {
    type: 'gallery',
    title: '1990s Photos',
    description: 'Photos from the 1990s',
    href: '#gallery',
    anchorId: 'photo-1990s',
    imageUrl: '/gallery/thumbnails/John, 17 years old.png',
    category: 'vintage',
    relevance: 0.8
  },
  {
    type: 'gallery',
    title: '2000s Photos',
    description: 'Photos from the 2000s',
    href: '#gallery',
    anchorId: 'photo-2000s',
    imageUrl: '/gallery/thumbnails/John in Monaco new Pagani Zonda.png',
    category: 'lifestyle',
    relevance: 0.8
  },
  {
    type: 'gallery',
    title: '2020s Photos',
    description: 'Recent photos from the 2020s',
    href: '#gallery',
    anchorId: 'photo-2020s',
    imageUrl: '/gallery/thumbnails/john singing studio 2025.png',
    category: 'studio',
    relevance: 0.8
  },

  // Specific years
  {
    type: 'gallery',
    title: '1977',
    description: 'Photos from 1977',
    href: '#gallery',
    anchorId: 'photo-1977',
    imageUrl: '/gallery/thumbnails/John, 16 years old.png',
    category: 'vintage',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '1980',
    description: 'Photos from 1980',
    href: '#gallery',
    anchorId: 'photo-1980',
    imageUrl: '/gallery/thumbnails/John, 16 years old.png',
    category: 'vintage',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '1981',
    description: 'Photos from 1981',
    href: '#gallery',
    anchorId: 'photo-1981',
    imageUrl: '/gallery/thumbnails/John, 17 years old.png',
    category: 'vintage',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '1992',
    description: 'Photos from 1992',
    href: '#gallery',
    anchorId: 'photo-1992',
    imageUrl: '/gallery/thumbnails/John Studio Young Normal Smiling.png',
    category: 'studio',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '1996',
    description: 'Photos from 1996',
    href: '#gallery',
    anchorId: 'photo-1996',
    imageUrl: '/gallery/thumbnails/John, new F50 Ferrari Monaco.png',
    category: 'lifestyle',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '2003',
    description: 'Photos from 2003',
    href: '#gallery',
    anchorId: 'photo-2003',
    imageUrl: '/gallery/thumbnails/John in Monaco new Pagani Zonda.png',
    category: 'lifestyle',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '2008',
    description: 'Photos from 2008',
    href: '#gallery',
    anchorId: 'photo-2008',
    imageUrl: '/gallery/thumbnails/John working on a guitar.png',
    category: 'studio',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '2023',
    description: 'Photos from 2023',
    href: '#gallery',
    anchorId: 'photo-2023',
    imageUrl: '/gallery/thumbnails/poor man\'s acoustic.png',
    category: 'studio',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '2024',
    description: 'Photos from 2024',
    href: '#gallery',
    anchorId: 'photo-2024',
    imageUrl: '/gallery/thumbnails/john standing professional studio.png',
    category: 'studio',
    relevance: 0.7
  },
  {
    type: 'gallery',
    title: '2025',
    description: 'Photos from 2025',
    href: '#gallery',
    anchorId: 'photo-2025',
    imageUrl: '/gallery/thumbnails/john singing studio 2025.png',
    category: 'studio',
    relevance: 0.7
  },

  // Sections
  {
    type: 'section',
    title: 'About',
    description: 'Learn more about John Chezik\'s creative journey and career',
    href: '#about',
    anchorId: 'section-about',
    category: 'info',
    relevance: 0.8
  },
  {
    type: 'section',
    title: 'Contact',
    description: 'Get in touch with John Chezik for professional inquiries',
    href: '#contact',
    anchorId: 'section-contact',
    category: 'info',
    relevance: 0.8
  },
  {
    type: 'section',
    title: 'Home',
    description: 'Welcome to John Chezik\'s official website',
    href: '#home',
    anchorId: 'section-home',
    category: 'info',
    relevance: 0.7
  }
];

/**
 * Handle search requests
 * 
 * Processes search requests across all website content with advanced algorithms,
 * relevance scoring, and comprehensive filtering. Returns ranked results with metadata.
 * 
 * @param request - The incoming request with search query parameters
 * @returns NextResponse with search results and metadata
 * 
 * @example
 * ```tsx
 * const response = await handleSearchRequest(request);
 * // Returns: { success: true, data: [...], total: 10, query: 'studio' }
 * ```
 */
async function handleSearchRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase().trim() || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    // Track user behavior
    trackUserBehavior(request, 'search_request', {
      query,
      limit
    });

    if (!query || query.length < 2) {
      const response: SearchApiResponse = {
        success: true,
        data: [],
        message: 'Query too short. Please enter at least 2 characters.',
        timestamp: new Date().toISOString(),
        request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        total: 0,
        query
      };
      return NextResponse.json(response);
    }

    // Enterprise-level search algorithm with advanced scoring
    const results = searchData
      .map(item => {
        const queryLower = query.toLowerCase();
        const titleLower = item.title.toLowerCase();
        const descriptionLower = item.description.toLowerCase();
        const categoryLower = item.category?.toLowerCase() || '';
        const locationLower = item.location?.toLowerCase() || '';
        const yearLower = item.year?.toLowerCase() || '';
        const genreLower = item.genre?.toLowerCase() || '';
        const tagsLower = item.tags?.join(' ').toLowerCase() || '';
        
        let relevance = 0;
        
        // Exact title match (highest priority)
        if (titleLower === queryLower) relevance += 100;
        
        // Title starts with query
        else if (titleLower.startsWith(queryLower)) relevance += 50;
        
        // Title contains query
        else if (titleLower.includes(queryLower)) relevance += 30;
        
        // Description contains query
        if (descriptionLower.includes(queryLower)) relevance += 15;
        
        // Category match
        if (categoryLower.includes(queryLower)) relevance += 10;
        
        // Location match
        if (locationLower.includes(queryLower)) relevance += 8;
        
        // Year match
        if (yearLower.includes(queryLower)) relevance += 12;
        
        // Genre match
        if (genreLower.includes(queryLower)) relevance += 10;
        
        // Tags match
        if (tagsLower.includes(queryLower)) relevance += 5;
        
        // Word boundary matches (more precise)
        const wordBoundaryRegex = new RegExp(`\\b${queryLower}\\b`, 'i');
        if (wordBoundaryRegex.test(titleLower)) relevance += 20;
        if (wordBoundaryRegex.test(descriptionLower)) relevance += 10;
        
        return { ...item, relevance };
      })
      .filter(item => item.relevance > 0)
      .sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
      .slice(0, limit);

    const response: SearchApiResponse = {
      success: true,
      data: results,
      message: `Found ${results.length} results for "${query}"`,
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      total: results.length,
      query
    };

    const nextResponse = NextResponse.json(response);
    
    // Add cache-busting headers for search results
    nextResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    nextResponse.headers.set('Pragma', 'no-cache');
    nextResponse.headers.set('Expires', '0');
    
    return nextResponse;

  } catch (error) {
    console.error('[SEARCH_API] Error:', error);
    
    const errorResponse: SearchApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to perform search',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

export const GET = withPerformanceMonitoring(
  withRateLimit(handleSearchRequest, 'API_LENIENT')
);
