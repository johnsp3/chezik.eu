/**
 * Root Layout for Next.js App
 * 
 * Provides the main layout structure with metadata, fonts, and global styles.
 * This is the root layout component that wraps all pages in the application.
 * 
 * @fileoverview Root layout component with comprehensive metadata, structured data,
 * font optimization, and accessibility features for the John Chezik website.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // This layout is automatically applied to all pages
 * export default function Page() {
 *   return <div>Page content</div>;
 * }
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required}
 */

import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { 
  generatePersonStructuredData,
  generateMusicGroupStructuredData,
  generateBookStructuredData,
  generateWebSiteStructuredData,
  generateOrganizationStructuredData
} from '@/lib/seo/structured-data';
import { getContactInfo } from '@/lib/env/verification';

// Optimized font configuration with display swap and preload
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
});

// Display font for headings
const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-playfair',
  fallback: ['Georgia', 'Times New Roman', 'serif']
});

// Environment validation will be handled in API routes and server components
// where it's needed, not at the module level to avoid build issues

export const metadata: Metadata = {
  title: {
    default: 'John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player',
    template: '%s | John Chezik'
  },
  description: 'Official website of John Chezik. Explore 6 albums and 2 books from a platinum-selling songwriter-singer, guitar player and published author with decades of creating.',
  keywords: [
    'John Chezik',
    'musician',
    'songwriter',
    'singer',
    'guitar player',
    'platinum selling',
    'rock music',
    'hard rock',
    'blues',
    'instrumental',
    'books',
    'author',
    'The Alpha Code',
    'The Visual Man',
    'Don\'t Say It\'s Over',
    'The Revealing',
    'music production',
    'guitar lessons',
    'music publishing',
    'independent artist',
    'music industry',
    'creative writing',
    'self-development'
  ],
  authors: [{ name: 'John Chezik', url: 'https://chezik.eu' }],
  creator: 'John Chezik',
  publisher: 'John Chezik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://chezik.eu'),
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://chezik.eu',
    siteName: 'John Chezik',
    title: 'John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player',
    description: 'Explore 6 albums and 2 books from a platinum-selling songwriter-singer, guitar player and published author with decades of creating.',
    images: [
      {
        url: '/John_Studio_High_quality.png',
        width: 1200,
        height: 630,
        alt: 'John Chezik - Musician and Author',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@johnchezik',
    creator: '@johnchezik',
    title: 'John Chezik - Platinum-Selling Songwriter-Singer & Guitar Player',
    description: 'Explore 6 albums and 2 books from a platinum-selling songwriter-singer, guitar player and published author with decades of creating.',
    images: ['/John_Studio_High_quality.png'],
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_CODE,
    yandex: process.env.YANDEX_VERIFICATION_CODE,
    yahoo: process.env.YAHOO_VERIFICATION_CODE,
  },
  alternates: {
    canonical: 'https://chezik.eu',
    types: {
      'application/rss+xml': 'https://chezik.eu/feed.xml',
    },
  },
  category: 'Music',
  classification: 'Arts & Entertainment',
  other: {
    'msapplication-TileColor': '#007aff',
    'theme-color': '#007aff',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'John Chezik',
    'application-name': 'John Chezik',
    'mobile-web-app-capable': 'yes',
    'msapplication-config': '/browserconfig.xml',
  },
};

/**
 * Props for the RootLayout component
 */
interface RootLayoutProps {
  /** Child components to render within the layout */
  readonly children: ReactNode;
}

/**
 * Root layout component for the Next.js application
 * 
 * Provides the main layout structure with metadata, fonts, global styles,
 * structured data, and analytics. This component wraps all pages in the application.
 * 
 * @param props - Component props
 * @param props.children - Child components to render
 * @returns JSX element representing the root layout
 * 
 * @example
 * ```tsx
 * <RootLayout>
 *   <main>Page content</main>
 * </RootLayout>
 * ```
 */
export default function RootLayout({ children }: RootLayoutProps) {
  // Get environment variables with type safety
  const contactInfo = getContactInfo();
  
  // Generate structured data
  const personData = generatePersonStructuredData({ contactPhone: contactInfo.phone });
  const musicData = generateMusicGroupStructuredData();
  const bookData = generateBookStructuredData();
  const websiteData = generateWebSiteStructuredData();
  const organizationData = generateOrganizationStructuredData({ contactPhone: contactInfo.phone });
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/John_Studio_High_quality.png" as="image" type="image/png" />
        
        {/* JSON-LD Structured Data - Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personData)
          }}
        />
        
        {/* Music Albums Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(musicData)
          }}
        />
        
        {/* Books Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(bookData)
          }}
        />
        
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData)
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData)
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-accent-primary text-white px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        <div className="page min-h-screen bg-black text-white" style={{backgroundColor: '#000000'}}>
          {children}
        </div>
        
        
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
