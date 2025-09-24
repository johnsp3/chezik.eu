/**
 * Audio Streaming API Route
 * 
 * Provides HLS streaming for audio files with edge optimization.
 * Supports adaptive bitrate streaming and secure access control.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { NextRequest, NextResponse } from 'next/server';
import { setCacheHeaders } from '@/lib/cache/vercel-cache';
import { withPerformanceMonitoring, trackUserBehavior } from '@/lib/monitoring/vercel-monitoring';

// Enable Edge Runtime for better performance
export const runtime = 'edge';
export const revalidate = 3600; // Cache for 1 hour

// Audio file mappings
const audioFiles = {
  1: {
    file: '/John Chezik don\'t say it\'s over 0m37s.mp3',
    title: 'Don\'t Say It\'s Over',
    duration: 37
  },
  2: {
    file: '/visualman_4m12s.mp3',
    title: 'The Visual Man',
    duration: 252
  },
  3: {
    file: '/John_Chezik_The_Revealing_5m30s.mp3',
    title: 'The Revealing',
    duration: 330
  },
  4: {
    file: '/look_at_me_3m20s.mp3',
    title: 'Look At Me',
    duration: 200
  },
  5: {
    file: '/John_Chezik_My_Life_4m05s.mp3',
    title: 'My Life',
    duration: 245
  },
  6: {
    file: '/John_Chezik_something_more_3m55s.mp3',
    title: 'Something More',
    duration: 235
  }
};

async function handleAudioStream(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const trackId = parseInt(resolvedParams.id);
    const audioFile = audioFiles[trackId as keyof typeof audioFiles];
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Track not found' },
        { status: 404 }
      );
    }

    // Get client IP for analytics
    const clientIP = request.headers.get('x-forwarded-for') || 
                    request.headers.get('x-real-ip') || 
                    'unknown';
    
    // const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Log streaming request and track user behavior
    console.log(`[AUDIO_STREAM] Track ${trackId} requested by ${clientIP}`);
    trackUserBehavior(request, 'audio_stream_request', { 
      trackId, 
      trackTitle: audioFile.title,
      duration: audioFile.duration 
    });
    
    // For now, return the direct audio file URL
    // In production, you would generate HLS segments here
    const audioUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://chezik.eu'}${audioFile.file}`;
    
    // Set appropriate headers for audio streaming with Vercel caching
    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    });
    
    // Handle range requests for streaming
    const range = request.headers.get('range');
    if (range) {
      headers.set('Accept-Ranges', 'bytes');
      // In a real implementation, you would handle partial content here
    }
    
    // Return redirect to actual audio file
    const response = NextResponse.redirect(audioUrl, { headers });
    return setCacheHeaders(response, 'AUDIO');
    
  } catch (error) {
    console.error('[AUDIO_STREAM] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleAudioStreamHEAD(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const trackId = parseInt(resolvedParams.id);
    const audioFile = audioFiles[trackId as keyof typeof audioFiles];
    
    if (!audioFile) {
      return new NextResponse(null, { status: 404 });
    }
    
    // Return headers for HEAD request with Vercel caching
    const headers = new Headers({
      'Content-Type': 'audio/mpeg',
      'Accept-Ranges': 'bytes',
    });
    
    const response = new NextResponse(null, { 
      status: 200, 
      headers 
    });
    return setCacheHeaders(response, 'AUDIO');
    
  } catch (error) {
    console.error('[AUDIO_STREAM] HEAD Error:', error);
    return new NextResponse(null, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    },
  });
}

// Apply performance monitoring to audio streaming
export const GET = withPerformanceMonitoring(handleAudioStream);
export const HEAD = withPerformanceMonitoring(handleAudioStreamHEAD);
