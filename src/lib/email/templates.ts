// Define types locally since they're not in the types file
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

interface NewsletterSignupData {
  email: string;
  name?: string;
  preferences?: string[];
  source?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}
import { createHash } from "crypto";

// Get the correct base URL for the current environment
function getBaseUrl(): string {
  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development' || 
                       process.env.NODE_ENV === undefined ||
                       process.env.VERCEL_ENV === 'development';
  
  // In development, use localhost
  if (isDevelopment) {
    return 'http://localhost:3000';
  }
  
  // In production, use the configured base URL or default to chezik.eu
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://chezik.eu';
}

// Generate secure tokens for unsubscribe and preferences links
export function generateUnsubscribeToken(email: string): string {
  const secret = process.env.UNSUBSCRIBE_SECRET || "default-secret-key";
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily rotation
  const data = `${email}-unsubscribe-${timestamp}`;
  return createHash('sha256').update(data + secret).digest('hex').substring(0, 16);
}

export function generatePreferencesToken(email: string): string {
  const secret = process.env.PREFERENCES_SECRET || "default-secret-key";
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24)); // Daily rotation
  const data = `${email}-preferences-${timestamp}`;
  return createHash('sha256').update(data + secret).digest('hex').substring(0, 16);
}

export function generateContactConfirmationEmail(
  data: ContactFormData,
): EmailTemplate {
  const subject = "Message received - John Chezik";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #007aff, #5856d6);
            color: white;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }
        .message-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #007aff;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 30px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #007aff;
            text-decoration: none;
            margin: 0 10px;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #000000;
                color: #ffffff;
            }
            .content {
                background: #111111;
                border-color: #333333;
            }
            .message-box {
                background: #1a1a1a;
                border-color: #007aff;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>John Chezik</h1>
            <p>Platinum-Selling Songwriter-Singer & Guitar Player</p>
        </div>
        
        <div class="content">
            <h2>Message received.</h2>
            
            <p><strong>From:</strong> ${data.name} (${data.email})</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong> ${data.message}</p>
            
            <p>Someone will get back to you as soon as possible.</p>
        </div>
        
        <div class="footer">
            <p>This is an automated response. Please do not reply to this email.</p>
            <p>© 2025 John Chezik. All rights reserved.</p>
            <p>If you did not contact us, please ignore this email.</p>
        </div>
    </div>
</body>
</html>`;

  const text = `
Message received.

Someone will get back to you as soon as possible.

This is an automated response. Please do not reply to this email.

© 2025 John Chezik. All rights reserved.

If you did not contact us, please ignore this email.
`;

  return { subject, html, text };
}

export function generateContactNotificationEmail(
  data: ContactFormData,
): EmailTemplate {
  const subject = `New Contact Form Submission from ${data.name}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #007aff, #5856d6);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .content {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
        }
        .contact-info {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            border-left: 4px solid #007aff;
        }
        .message-content {
            background: white;
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            border: 1px solid #e9ecef;
        }
        .footer {
            text-align: center;
            padding: 20px 0;
            color: #6c757d;
            font-size: 12px;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #000000;
                color: #ffffff;
            }
            .content {
                background: #111111;
                border-color: #333333;
            }
            .contact-info, .message-content {
                background: #1a1a1a;
                border-color: #333333;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>From: ${data.name} (${data.email})</p>
        </div>
        
        <div class="content">
            <div class="contact-info">
                <h3>Contact Information</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><strong>Subject:</strong> ${data.subject || "No subject provided"}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
            
            <div class="message-content">
                <h3>Message</h3>
                <p>${data.message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <p><strong>Quick Actions:</strong></p>
            <ul>
                <li><a href="mailto:${data.email}?subject=Re: ${data.subject || "Your inquiry"}&body=Hi ${data.name},%0D%0A%0D%0AThank you for your message.%0D%0A%0D%0ABest regards,%0D%0AJohn">Reply to ${data.name}</a></li>
                <li><a href="https://chezik.eu/admin/contacts">View all contacts</a></li>
            </ul>
        </div>
        
        <div class="footer">
            <p>This notification was sent from your website contact form.</p>
        </div>
    </div>
</body>
</html>`;

  const text = `
New Contact Form Submission

From: ${data.name} (${data.email})
Subject: ${data.subject || "No subject provided"}
Timestamp: ${new Date().toLocaleString()}

Message:
${data.message}

Quick Actions:
- Reply to ${data.name}: mailto:${data.email}?subject=Re: ${data.subject || "Your inquiry"}
- View all contacts: https://chezik.eu/admin/contacts

This notification was sent from your website contact form.
`;

  return { subject, html, text };
}

export function generateNewsletterWelcomeEmail(
  data: NewsletterSignupData,
): EmailTemplate {
  const subject = "Welcome to John Chezik Newsletter";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #007aff, #5856d6);
            color: white;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 12px;
            border: 1px solid #e9ecef;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            border: 1px solid #e9ecef;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #007aff, #5856d6);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 30px 0;
            color: #6c757d;
            font-size: 14px;
        }
        .unsubscribe {
            margin-top: 20px;
            font-size: 12px;
        }
        @media (max-width: 600px) {
            .feature-grid {
                grid-template-columns: 1fr;
            }
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: #000000;
                color: #ffffff;
            }
            .content {
                background: #111111;
                border-color: #333333;
            }
            .feature {
                background: #1a1a1a;
                border-color: #333333;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to the Family!</h1>
            <p>You're now part of John Chezik's inner circle</p>
        </div>
        
        <div class="content">
            <h2>Thank you for subscribing!</h2>
            
            <p>I'm thrilled to have you join my community of music lovers and book readers. You'll now be the first to know about:</p>
            
            <div class="feature-grid">
                <div class="feature">
                    <div class="feature-icon">🎵</div>
                    <h3>New Album Releases</h3>
                    <p>Exclusive previews and behind-the-scenes content</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📚</div>
                    <h3>Book Updates</h3>
                    <p>Early access to new chapters and insights</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎸</div>
                    <h3>Studio Sessions</h3>
                    <p>Behind-the-scenes footage and stories</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🎤</div>
                    <h3>Live Events</h3>
                    <p>Concert dates, book signings, and meetups</p>
                </div>
            </div>
            
            <h3>What's Coming Next:</h3>
            <ul>
                <li><strong>Album #7:</strong> Currently in pre-production with incredible session musicians</li>
                <li><strong>"What Women Really Want":</strong> New book coming Spring 2026</li>
                <li><strong>Studio Renovation:</strong> Major expansion with vintage acoustics</li>
                <li><strong>Exclusive Content:</strong> Behind-the-scenes access to my creative process</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="https://chezik.eu" class="cta-button">Explore My Work</a>
            </div>
            
            <p>I believe in authentic connection and sharing the real journey of creativity. You'll get honest insights into the music industry, the writing process, and what it takes to build a lasting career in the arts.</p>
            
            <p>Welcome aboard!</p>
            <p><strong>John Chezik</strong><br>
            Platinum-Selling Songwriter-Singer & Guitar Player</p>
        </div>
        
        <div class="footer">
            
            <div class="unsubscribe">
                <p>You received this email because you subscribed to John Chezik's newsletter.</p>
                <p><a href="${getBaseUrl()}/unsubscribe?email=${encodeURIComponent(data.email)}&token=${generateUnsubscribeToken(data.email)}">Unsubscribe</a> | <a href="${getBaseUrl()}/preferences?email=${encodeURIComponent(data.email)}&token=${generatePreferencesToken(data.email)}">Email Preferences</a></p>
            </div>
        </div>
    </div>
</body>
</html>`;

  const text = `
Welcome to John Chezik's Newsletter!

Thank you for subscribing! I'm thrilled to have you join my community of music lovers and book readers.

You'll now be the first to know about:
- New Album Releases: Exclusive previews and behind-the-scenes content
- Book Updates: Early access to new chapters and insights  
- Studio Sessions: Behind-the-scenes footage and stories
- Live Events: Concert dates, book signings, and meetups

What's Coming Next:
- Album #7: Currently in pre-production with incredible session musicians
- "What Women Really Want": New book coming Spring 2026
- Studio Renovation: Major expansion with vintage acoustics
- Exclusive Content: Behind-the-scenes access to my creative process

Explore my work: https://chezik.eu

I believe in authentic connection and sharing the real journey of creativity. You'll get honest insights into the music industry, the writing process, and what it takes to build a lasting career in the arts.

Welcome aboard!

John Chezik
Platinum-Selling Songwriter-Singer & Guitar Player

You received this email because you subscribed to John Chezik's newsletter.
Unsubscribe: ${getBaseUrl()}/unsubscribe?email=${encodeURIComponent(data.email)}&token=${generateUnsubscribeToken(data.email)}
Email Preferences: ${getBaseUrl()}/preferences?email=${encodeURIComponent(data.email)}&token=${generatePreferencesToken(data.email)}
`;

  return { subject, html, text };
}
