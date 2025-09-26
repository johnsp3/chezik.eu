/**
 * Gallery Analytics API Route
 * 
 * Handles comprehensive analytics tracking for gallery interactions including
 * photo views, downloads, shares, and user behavior. Optimized for edge runtime
 * with proper validation, rate limiting, and performance monitoring.
 * 
 * @fileoverview Gallery analytics API with comprehensive event tracking and performance monitoring
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // Submit gallery analytics events
 * const response = await fetch('/api/gallery/analytics', {
 *   method: 'POST',
 *   body: JSON.stringify({ events: [...], sessionId: 'abc123' })
 * });
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers}
 */

import { NextRequest, NextResponse } from 'next/server';
import { withPerformanceMonitoring, trackUserBehavior } from '@/lib/monitoring/vercel-monitoring';
import { withRateLimit } from '@/lib/security/vercel-security';
import { storeSystemLog } from '@/lib/storage/vercel-blob';
import type { GalleryAnalyticsEvent, GalleryApiResponse } from '@/types/gallery';

export const runtime = 'edge';
export const revalidate = 0; // No caching for analytics

/**
 * Handle gallery analytics event submission
 * 
 * Processes gallery analytics events including photo views, downloads, shares,
 * and user behavior with comprehensive validation and processing.
 * 
 * @param request - The incoming request with analytics events
 * @returns NextResponse with processing results and analytics summary
 * 
 * @example
 * ```tsx
 * const response = await handleAnalyticsRequest(request);
 * // Returns: { success: true, data: { processed: 5, analytics: {...} } }
 * ```
 */
async function handleAnalyticsRequest(request: NextRequest): Promise<NextResponse> {
  try {
    if (request.method !== 'POST') {
      return NextResponse.json(
        { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST requests are allowed' } },
        { status: 405 }
      );
    }

    const body = await request.json();
    const { events } = body;

    if (!events || !Array.isArray(events)) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_REQUEST', message: 'Events array is required' } },
        { status: 400 }
      );
    }

    // Validate events
    const validatedEvents: GalleryAnalyticsEvent[] = [];
    for (const event of events) {
      if (validateAnalyticsEvent(event)) {
        validatedEvents.push(event);
      }
    }

    if (validatedEvents.length === 0) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_EVENTS', message: 'No valid events provided' } },
        { status: 400 }
      );
    }

    // Track user behavior
    trackUserBehavior(request, 'gallery_analytics', {
      eventCount: validatedEvents.length,
      eventTypes: validatedEvents.map(e => e.eventType)
    });

    // Store analytics events
    try {
      await storeSystemLog('info', 'Gallery Analytics Events', {
        events: validatedEvents,
        count: validatedEvents.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.warn('[GALLERY_ANALYTICS] Failed to store events:', error);
    }

    // Process events for real-time analytics
    const analytics = processAnalyticsEvents(validatedEvents);

    const response: GalleryApiResponse<{ processed: number; analytics: Record<string, unknown> }> = {
      success: true,
      data: {
        processed: validatedEvents.length,
        analytics
      },
      message: `Processed ${validatedEvents.length} analytics events`,
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[GALLERY_ANALYTICS] Error:', error);
    
    const errorResponse: GalleryApiResponse = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to process analytics events',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      timestamp: new Date().toISOString(),
      request_id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * Validate gallery analytics event
 * 
 * Validates that an event object conforms to the GalleryAnalyticsEvent interface
 * with proper type checking and structure validation.
 * 
 * @param event - The event object to validate
 * @returns True if the event is valid, false otherwise
 * 
 * @example
 * ```tsx
 * const isValid = validateAnalyticsEvent(event);
 * // Returns: true if event has all required properties with correct types
 * ```
 */
function validateAnalyticsEvent(event: unknown): event is GalleryAnalyticsEvent {
  return (
    Boolean(event) &&
    typeof event === 'object' &&
    event !== null &&
    'photoId' in event &&
    'photoTitle' in event &&
    'eventType' in event &&
    'timestamp' in event &&
    'userAgent' in event &&
    typeof (event as Record<string, unknown>).photoId === 'number' &&
    typeof (event as Record<string, unknown>).photoTitle === 'string' &&
    typeof (event as Record<string, unknown>).eventType === 'string' &&
    ['view', 'download', 'share', 'filter', 'search'].includes((event as Record<string, unknown>).eventType as string) &&
    Boolean((event as Record<string, unknown>).timestamp) &&
    typeof (event as Record<string, unknown>).userAgent === 'string' &&
    'viewport' in event &&
    'deviceType' in event &&
    'sessionId' in event &&
    typeof (event as Record<string, unknown>).viewport === 'object' &&
    (event as Record<string, unknown>).viewport !== null &&
    'width' in ((event as Record<string, unknown>).viewport as Record<string, unknown>) &&
    'height' in ((event as Record<string, unknown>).viewport as Record<string, unknown>) &&
    typeof (((event as Record<string, unknown>).viewport as Record<string, unknown>).width) === 'number' &&
    typeof (((event as Record<string, unknown>).viewport as Record<string, unknown>).height) === 'number' &&
    typeof (event as Record<string, unknown>).deviceType === 'string' &&
    ['mobile', 'tablet', 'desktop'].includes((event as Record<string, unknown>).deviceType as string) &&
    typeof (event as Record<string, unknown>).sessionId === 'string'
  );
}

/**
 * Process gallery analytics events
 * 
 * Processes an array of gallery analytics events to generate comprehensive
 * analytics summaries including event types, device types, popular photos,
 * and time distribution.
 * 
 * @param events - Array of validated gallery analytics events
 * @returns Analytics summary object with processed data
 * 
 * @example
 * ```tsx
 * const analytics = processAnalyticsEvents(events);
 * // Returns: { totalEvents: 10, eventTypes: {...}, deviceTypes: {...} }
 * ```
 */
function processAnalyticsEvents(events: GalleryAnalyticsEvent[]): Record<string, unknown> {
  const analytics = {
    totalEvents: events.length,
    eventTypes: {} as Record<string, number>,
    deviceTypes: {} as Record<string, number>,
    popularPhotos: {} as Record<number, number>,
    timeDistribution: {} as Record<string, number>,
    categories: {} as Record<string, number>
  };

  events.forEach(event => {
    // Count event types
    analytics.eventTypes[event.eventType] = (analytics.eventTypes[event.eventType] || 0) + 1;
    
    // Count device types
    analytics.deviceTypes[event.deviceType] = (analytics.deviceTypes[event.deviceType] || 0) + 1;
    
    // Count popular photos
    analytics.popularPhotos[event.photoId] = (analytics.popularPhotos[event.photoId] || 0) + 1;
    
    // Time distribution (hour of day)
    const hour = new Date(event.timestamp).getHours();
    const hourKey = `${hour}:00`;
    analytics.timeDistribution[hourKey] = (analytics.timeDistribution[hourKey] || 0) + 1;
    
    // Categories
    if (event.category) {
      analytics.categories[event.category] = (analytics.categories[event.category] || 0) + 1;
    }
  });

  return analytics;
}

export const POST = withPerformanceMonitoring(
  withRateLimit(handleAnalyticsRequest, 'API_MODERATE')
);

