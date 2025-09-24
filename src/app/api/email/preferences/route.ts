/**
 * Email Preferences API Route
 * 
 * Handles email preferences retrieval and updates with proper validation and security.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { NextRequest, NextResponse } from 'next/server';

// Note: Cannot use Edge Runtime due to Node.js crypto dependency
import { headers } from 'next/headers';
import { emailService } from '@/lib/email/service';

interface PreferencesRequest {
  email: string;
  token: string;
  preferences?: Record<string, unknown>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    const headersList = await headers();
    
    // Get client information
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Enhanced validation
    if (!email || !token) {
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
    if (!emailRegex.test(email)) {
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
    
    // Log the preferences access
    console.log('Preferences GET request:', {
      email,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });
    
    // Use the email service to get preferences
    const result = await emailService.getPreferences(
      email,
      token,
      clientIP,
      userAgent
    );
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
    
  } catch (error) {
    console.error('Preferences GET API error:', error);
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

export async function POST(request: NextRequest) {
  try {
    const body: PreferencesRequest = await request.json();
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
    
    // Log the preferences update
    console.log('Preferences POST request:', {
      email: body.email,
      preferences: body.preferences,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });
    
    // Use the email service to update preferences
    const result = await emailService.updatePreferences(
      {
        email: body.email,
        token: body.token,
        preferences: body.preferences || {},
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
    console.error('Preferences POST API error:', error);
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
