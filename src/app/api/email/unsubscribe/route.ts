/**
 * Email Unsubscribe API Route
 * 
 * Handles email unsubscription requests with proper validation and security.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { NextRequest, NextResponse } from 'next/server';

// Note: Cannot use Edge Runtime due to Node.js crypto dependency
import { headers } from 'next/headers';
import { emailService } from '@/lib/email/service';

interface UnsubscribeRequest {
  email: string;
  token: string;
  reason?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UnsubscribeRequest = await request.json();
    const headersList = await headers();
    
    // Get client information
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Enhanced validation
    if (!body.email || !body.token) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Email and token are required'
          }
        },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { 
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please enter a valid email address'
          }
        },
        { status: 400 }
      );
    }
    
    // Log the unsubscription attempt
    console.log('Unsubscribe request:', {
      email: body.email,
      reason: body.reason || 'not_provided',
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });
    
    // Use the email service to handle unsubscription
    const result = await emailService.unsubscribe(
      {
        email: body.email,
        token: body.token,
        reason: body.reason,
        ip_address: clientIP,
        user_agent: userAgent
      },
      clientIP,
      userAgent
    );
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
    
  } catch (error) {
    console.error('Unsubscribe API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Something went wrong. Please try again later.'
        }
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Email Unsubscribe API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/email/unsubscribe - Unsubscribe from emails',
      GET: '/api/email/unsubscribe - Get API information'
    },
    timestamp: new Date().toISOString()
  });
}
