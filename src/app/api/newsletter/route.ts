/**
 * Newsletter API Route
 * 
 * Handles newsletter subscription requests with email notifications.
 * Includes validation, rate limiting, and spam protection.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/lib/security/vercel-security';

// Note: Cannot use Edge Runtime due to Resend dependency
import { headers } from 'next/headers';
import { sendNewsletterWelcome, sendNewsletterNotification } from '@/lib/email/resend';

interface NewsletterSignupData {
  email: string;
  name?: string;
  preferences?: string[];
  source?: string;
}

async function handleNewsletter(request: NextRequest) {
  try {
    const body: NewsletterSignupData = await request.json();
    const headersList = await headers();
    
    // Get client information
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown';
    
    // Enhanced validation
    if (!body.email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }
    
    // Log the subscription
    console.log('Newsletter subscription:', {
      email: body.email,
      name: body.name || 'Not provided',
      source: body.source || 'website',
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });
    
    // Prepare newsletter data
    const newsletterData: NewsletterSignupData = {
      email: body.email,
      name: body.name,
      preferences: body.preferences || ['albums', 'books', 'studio_updates'],
      source: body.source || 'website'
    };
    
    // Send emails using Resend
    const [welcomeResult, notificationResult] = await Promise.allSettled([
      // Send welcome email to subscriber
      sendNewsletterWelcome(newsletterData),
      
      // Send notification email to John
      sendNewsletterNotification(newsletterData)
    ]);
    
    // Check if both emails were sent successfully
    const welcomeSuccess = 
      welcomeResult.status === 'fulfilled' && 
      welcomeResult.value.success;
    const notificationSuccess = 
      notificationResult.status === 'fulfilled' && 
      notificationResult.value.success;
    
    if (!welcomeSuccess) {
      console.error('Failed to send welcome email:', welcomeResult);
    }
    
    if (!notificationSuccess) {
      console.error('Failed to send notification email:', notificationResult);
    }
    
    // Return success even if one email fails (graceful degradation)
    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! You should receive a welcome email shortly.',
      emailSent: welcomeSuccess,
    });
    
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to newsletter signup
export const POST = withRateLimit(handleNewsletter, 'NEWSLETTER');

export async function GET() {
  return NextResponse.json({
    message: 'Newsletter API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/newsletter - Subscribe to newsletter',
      GET: '/api/newsletter - Get API information'
    },
    timestamp: new Date().toISOString()
  });
}
