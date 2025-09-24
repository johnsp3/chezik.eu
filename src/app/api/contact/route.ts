/**
 * Contact Form API Route
 * 
 * Handles contact form submissions with email notifications.
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
import { sendContactConfirmation, sendContactNotification } from '@/lib/email/resend';

interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

async function handleContact(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    const headersList = await headers();
    
    // Get client information
    const clientIP = headersList.get('x-forwarded-for') || 
                    headersList.get('x-real-ip') || 
                    'unknown';
    const userAgent = headersList.get('user-agent') || 'unknown';
    
    // Enhanced validation
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
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
    
    // Message length validation
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters long' },
        { status: 400 }
      );
    }
    
    if (body.message.length > 2000) {
      return NextResponse.json(
        { error: 'Message must be less than 2000 characters' },
        { status: 400 }
      );
    }
    
    // Name validation
    if (body.name.length < 2 || body.name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 100 characters' },
        { status: 400 }
      );
    }
    
    // Log the submission
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      subject: body.subject || 'Website Contact',
      message: body.message,
      timestamp: new Date().toISOString(),
      ip: clientIP,
    });
    
    // Send emails using the working email functions
    const [confirmationResult, notificationResult] = await Promise.allSettled([
      // Send confirmation email to user
      sendContactConfirmation({
        name: body.name,
        email: body.email,
        subject: body.subject || 'Website Contact',
        message: body.message
      }),
      
      // Send notification email to John
      sendContactNotification({
        name: body.name,
        email: body.email,
        subject: body.subject || 'Website Contact',
        message: body.message
      })
    ]);
    
    // Check if both emails were sent successfully
    const confirmationSuccess = 
      confirmationResult.status === 'fulfilled' && 
      confirmationResult.value.success;
    const notificationSuccess = 
      notificationResult.status === 'fulfilled' && 
      notificationResult.value.success;
    
    if (!confirmationSuccess) {
      console.error('Failed to send confirmation email:', confirmationResult);
      if (confirmationResult.status === 'rejected') {
        console.error('Confirmation email rejection reason:', confirmationResult.reason);
      } else if (confirmationResult.value.error) {
        console.error('Confirmation email error:', confirmationResult.value.error);
      }
    } else {
      console.log('Confirmation email sent successfully');
    }
    
    if (!notificationSuccess) {
      console.error('Failed to send notification email:', notificationResult);
      if (notificationResult.status === 'rejected') {
        console.error('Notification email rejection reason:', notificationResult.reason);
      } else if (notificationResult.value.error) {
        console.error('Notification email error:', notificationResult.value.error);
      }
    } else {
      console.log('Notification email sent successfully');
    }
    
    // Return success even if one email fails (graceful degradation)
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! You should receive a confirmation email shortly.',
      emailSent: confirmationSuccess,
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}

// Apply rate limiting to contact form
export const POST = withRateLimit(handleContact, 'CONTACT_FORM');

export async function GET() {
  return NextResponse.json({
    message: 'Contact Form API',
    version: '1.0.0',
    endpoints: {
      POST: '/api/contact - Submit contact form',
      GET: '/api/contact - Get API information'
    },
    timestamp: new Date().toISOString()
  });
}
