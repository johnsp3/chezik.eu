/**
 * Audio Analytics API Route
 * 
 * Collects and processes audio player analytics data with comprehensive
 * event tracking, performance metrics, and user behavior insights.
 * Optimized for edge runtime with proper validation and error handling.
 * 
 * @fileoverview Audio analytics API with comprehensive event tracking and performance monitoring
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // Submit audio analytics events
 * const response = await fetch('/api/audio/analytics', {
 *   method: 'POST',
 *   body: JSON.stringify({ events: [...], sessionId: 'abc123' })
 * });
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/route-handlers}
 */

import { NextRequest, NextResponse } from 'next/server';

// Enable Edge Runtime for better performance
export const runtime = 'edge';
import { headers } from 'next/headers';

interface AnalyticsEvent {
  trackId: number;
  trackTitle: string;
  eventType: 'play' | 'pause' | 'seek' | 'volume_change' | 'complete' | 'error' | 'load';
  timestamp: string;
  currentTime: number;
  duration: number;
  volume: number;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  deviceType: 'mobile' | 'tablet' | 'desktop';
  sessionId: string;
  networkType?: string;
  bitrate?: number;
  bufferHealth?: number;
}

interface AnalyticsRequest {
  events: AnalyticsEvent[];
  sessionId: string;
  timestamp: string;
}

/**
 * Handle audio analytics event submission
 * 
 * Processes audio player analytics events including play, pause, seek, volume changes,
 * and completion events with comprehensive validation and processing.
 * 
 * @param request - The incoming request with analytics events
 * @returns NextResponse with processing results and analytics summary
 * 
 * @example
 * ```tsx
 * const response = await POST(request);
 * // Returns: { success: true, processedEvents: 5, sessionId: 'abc123' }
 * ```
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AnalyticsRequest = await request.json();
    const headersList = await headers();
    
    // Get client information
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown';
    // const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Validate request
    if (!body.events || !Array.isArray(body.events) || body.events.length === 0) {
      return NextResponse.json(
        { error: 'Invalid analytics data' },
        { status: 400 }
      );
    }
    
    // Process each event
    const processedEvents = body.events.map(event => ({
      ...event,
      clientIP,
      serverTimestamp: new Date().toISOString(),
      processed: true
    }));
    
    // Log analytics data (in production, store in database)
    console.log(`[AUDIO_ANALYTICS] Received ${processedEvents.length} events for session ${body.sessionId}`);
    
    // Process analytics data
    const analytics = {
      sessionId: body.sessionId,
      totalEvents: processedEvents.length,
      events: processedEvents,
      summary: {
        totalPlayTime: processedEvents
          .filter(e => e.eventType === 'play')
          .reduce((sum, e) => sum + (e.duration - e.currentTime), 0),
        totalSeekTime: processedEvents
          .filter(e => e.eventType === 'seek')
          .length,
        uniqueTracks: new Set(processedEvents.map(e => e.trackId)).size,
        deviceTypes: new Set(processedEvents.map(e => e.deviceType)),
        averageVolume: processedEvents
          .filter(e => e.eventType === 'volume_change')
          .reduce((sum, e, _, arr) => sum + e.volume / arr.length, 0),
        errors: processedEvents.filter(e => e.eventType === 'error').length
      }
    };
    
    // In production, you would:
    // 1. Store in database (PostgreSQL, MongoDB, etc.)
    // 2. Send to analytics service (Google Analytics, Mixpanel, etc.)
    // 3. Update real-time dashboards
    // 4. Generate reports
    
    // For now, just log the processed data
    console.log('[AUDIO_ANALYTICS] Processed analytics:', {
      sessionId: analytics.sessionId,
      totalEvents: analytics.totalEvents,
      summary: analytics.summary
    });
    
    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Analytics data processed successfully',
      processedEvents: processedEvents.length,
      sessionId: body.sessionId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[AUDIO_ANALYTICS] Error processing analytics:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle audio analytics API information requests
 * 
 * Returns API documentation and available endpoints for the audio analytics service.
 * 
 * @returns NextResponse with API information and documentation
 * 
 * @example
 * ```tsx
 * const info = await GET();
 * // Returns: { message: 'Audio Analytics API', version: '1.0.0', endpoints: {...} }
 * ```
 */
export async function GET(): Promise<NextResponse> {
  // Return analytics summary (in production, fetch from database)
  return NextResponse.json({
    message: 'Audio Analytics API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/audio/analytics - Submit analytics events',
      GET: '/api/audio/analytics - Get API information'
    },
    timestamp: new Date().toISOString()
  });
}
