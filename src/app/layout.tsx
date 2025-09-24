/**
 * Root Layout for Next.js App
 * 
 * Provides the main layout structure with metadata, fonts, and global styles.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

const inter = Inter({ subsets: ['latin'] });

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
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/John_Studio_High_quality.png" as="image" type="image/png" />
        
        {/* JSON-LD Structured Data - Person */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "John Chezik",
              "jobTitle": "Musician, Songwriter, Author",
              "description": "Platinum-selling songwriter-singer, guitar player and published author with decades of creating",
              "url": "https://chezik.eu",
              "image": "https://chezik.eu/John_Studio_High_quality.png",
              "sameAs": [
                "https://twitter.com/johnchezik",
                "https://instagram.com/johnchezik",
                "https://linkedin.com/in/johnchezik"
              ],
              "worksFor": {
                "@type": "Organization",
                "name": "Independent Artist"
              },
              "hasOccupation": [
                {
                  "@type": "Occupation",
                  "name": "Musician",
                  "occupationalCategory": "Arts, Entertainment, and Recreation"
                },
                {
                  "@type": "Occupation", 
                  "name": "Author",
                  "occupationalCategory": "Arts, Entertainment, and Recreation"
                }
              ],
              "knowsAbout": [
                "Music Production",
                "Songwriting",
                "Guitar Playing",
                "Book Writing",
                "Music Publishing",
                "Hard Rock",
                "Blues",
                "Instrumental Music",
                "Creative Writing",
                "Self-Development"
              ],
              "award": "Platinum-selling Artist",
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "Music Industry"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "email": "media@chezik.eu",
              "telephone": "+1-XXX-XXX-XXXX"
            })
          }}
        />
        
        {/* Music Albums Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              "name": "John Chezik",
              "description": "Platinum-selling musician, songwriter, and performer",
              "url": "https://chezik.eu",
              "image": "https://chezik.eu/John_Studio_High_quality.png",
              "member": {
                "@type": "Person",
                "name": "John Chezik"
              },
              "album": [
                {
                  "@type": "MusicAlbum",
                  "name": "Don't Say It's Over",
                  "datePublished": "2025",
                  "genre": "Hard Rock",
                  "description": "Latest album featuring powerful hard rock tracks",
                  "byArtist": {
                    "@type": "Person",
                    "name": "John Chezik"
                  },
                  "image": "https://chezik.eu/John_Chezik_greatest_hits.png",
                  "url": "https://chezik.eu/#albums",
                  "numTracks": 1,
                  "duration": "PT0M37S"
                },
                {
                  "@type": "MusicAlbum",
                  "name": "The Visual Man",
                  "datePublished": "2024",
                  "genre": "Hard Rock",
                  "description": "Hard rock album showcasing powerful vocals and guitar work",
                  "byArtist": {
                    "@type": "Person",
                    "name": "John Chezik"
                  },
                  "image": "https://chezik.eu/The_visual_Man_Cover.png",
                  "url": "https://chezik.eu/#albums",
                  "numTracks": 1,
                  "duration": "PT3M0S"
                },
                {
                  "@type": "MusicAlbum",
                  "name": "The Revealing",
                  "datePublished": "2023",
                  "genre": "Hard Rock/Blues/Instrumental",
                  "description": "Diverse album featuring hard rock, blues, and instrumental tracks",
                  "byArtist": {
                    "@type": "Person",
                    "name": "John Chezik"
                  },
                  "image": "https://chezik.eu/John Chezik_The_Revealing_album_cover.png",
                  "url": "https://chezik.eu/#albums",
                  "numTracks": 1,
                  "duration": "PT4M30S"
                },
                {
                  "@type": "MusicAlbum",
                  "name": "My Life",
                  "datePublished": "2022",
                  "genre": "Rock",
                  "description": "Personal rock album reflecting life experiences",
                  "byArtist": {
                    "@type": "Person",
                    "name": "John Chezik"
                  },
                  "url": "https://chezik.eu/#albums",
                  "numTracks": 1
                },
                {
                  "@type": "MusicAlbum",
                  "name": "Something More",
                  "datePublished": "2021",
                  "genre": "Rock",
                  "description": "Rock album exploring deeper themes",
                  "byArtist": {
                    "@type": "Person",
                    "name": "John Chezik"
                  },
                  "url": "https://chezik.eu/#albums",
                  "numTracks": 1
                },
                {
                  "@type": "MusicAlbum",
                  "name": "Look At Me",
                  "datePublished": "2020",
                  "genre": "Rock",
                  "description": "Rock album with powerful vocal performances",
                  "byArtist": {
                    "@type": "Person",
                    "name": "John Chezik"
                  },
                  "image": "https://chezik.eu/John_Chezik_Look_At_Me-Album_Cover.png",
                  "url": "https://chezik.eu/#albums",
                  "numTracks": 1
                }
              ]
            })
          }}
        />
        
        {/* Books Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              "name": "The Alpha Code",
              "author": {
                "@type": "Person",
                "name": "John Chezik"
              },
              "datePublished": "2024",
              "genre": "Self-Development",
              "description": "A bold guide for men ready to rise above mediocrity and step into their power.",
              "publisher": {
                "@type": "Organization",
                "name": "John Chezik Publishing"
              },
              "image": "https://chezik.eu/The_Alfa_Code.png",
              "url": "https://chezik.eu/#books",
              "isbn": "978-XXXXXXXXXX",
              "numberOfPages": 200,
              "inLanguage": "en",
              "bookFormat": "Paperback",
              "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "price": "19.99",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        
        {/* Website Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "John Chezik",
              "description": "Official website of John Chezik - Platinum-selling songwriter, singer, guitar player and author",
              "url": "https://chezik.eu",
              "author": {
                "@type": "Person",
                "name": "John Chezik"
              },
              "publisher": {
                "@type": "Person",
                "name": "John Chezik"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://chezik.eu/?search={search_term_string}",
                "query-input": "required name=search_term_string"
              },
              "sameAs": [
                "https://twitter.com/johnchezik",
                "https://instagram.com/johnchezik",
                "https://linkedin.com/in/johnchezik"
              ]
            })
          }}
        />
        
        {/* Organization Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "John Chezik",
              "description": "Independent music and publishing organization",
              "url": "https://chezik.eu",
              "logo": "https://chezik.eu/John_Studio_High_quality.png",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-XXX-XXX-XXXX",
                "contactType": "customer service",
                "email": "media@chezik.eu",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "sameAs": [
                "https://twitter.com/johnchezik",
                "https://instagram.com/johnchezik",
                "https://linkedin.com/in/johnchezik"
              ]
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
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
        <PWAInstallPrompt />
      </body>
    </html>
  );
}
