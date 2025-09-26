/**
 * Structured Data Generation Utilities
 * 
 * Provides utilities for generating JSON-LD structured data for SEO optimization.
 * All structured data follows Schema.org standards for maximum search engine compatibility.
 * 
 * @fileoverview Structured data utilities for person, organization, music, and book schemas
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 * 
 * @example
 * ```tsx
 * import { generatePersonStructuredData } from '@/lib/seo/structured-data';
 * 
 * const personData = generatePersonStructuredData({
 *   contactPhone: '+1-555-123-4567'
 * });
 * ```
 */

/**
 * Environment variables for structured data
 */
export interface StructuredDataEnv {
  /** Contact phone number for business inquiries */
  readonly contactPhone?: string | undefined;
  /** Google verification code for search console */
  readonly googleVerificationCode?: string | undefined;
  /** Yandex verification code for search console */
  readonly yandexVerificationCode?: string | undefined;
  /** Yahoo verification code for search console */
  readonly yahooVerificationCode?: string | undefined;
}

/**
 * Base URL for the website
 */
const BASE_URL = 'https://chezik.eu' as const;

/**
 * Default contact phone when environment variable is not set
 */
const DEFAULT_CONTACT_PHONE = '+1-XXX-XXX-XXXX' as const;

/**
 * Generates Person structured data for John Chezik
 * 
 * @param env - Environment variables for contact information
 * @returns JSON-LD structured data for Person schema
 * 
 * @example
 * ```tsx
 * const personData = generatePersonStructuredData({
 *   contactPhone: '+1-555-123-4567'
 * });
 * ```
 */
export function generatePersonStructuredData(env: StructuredDataEnv) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "John Chezik",
    "jobTitle": "Musician, Songwriter, Author",
    "description": "Platinum-selling songwriter-singer, guitar player and published author with decades of creating",
    "url": BASE_URL,
    "image": `${BASE_URL}/John_Studio_High_quality.png`,
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
    "telephone": env.contactPhone ?? DEFAULT_CONTACT_PHONE
  } as const;
}

/**
 * Generates MusicGroup structured data with album information
 * 
 * @returns JSON-LD structured data for MusicGroup schema
 * 
 * @example
 * ```tsx
 * const musicData = generateMusicGroupStructuredData();
 * ```
 */
export function generateMusicGroupStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "John Chezik",
    "description": "Platinum-selling musician, songwriter, and performer",
    "url": BASE_URL,
    "image": `${BASE_URL}/John_Studio_High_quality.png`,
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
        "image": `${BASE_URL}/John_Chezik_greatest_hits.png`,
        "url": `${BASE_URL}/#albums`,
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
        "image": `${BASE_URL}/The_visual_Man_Cover.png`,
        "url": `${BASE_URL}/#albums`,
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
        "image": `${BASE_URL}/John Chezik_The_Revealing_album_cover.png`,
        "url": `${BASE_URL}/#albums`,
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
        "url": `${BASE_URL}/#albums`,
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
        "url": `${BASE_URL}/#albums`,
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
        "image": `${BASE_URL}/John_Chezik_Look_At_Me-Album_Cover.png`,
        "url": `${BASE_URL}/#albums`,
        "numTracks": 1
      }
    ]
  } as const;
}

/**
 * Generates Book structured data for "The Alpha Code"
 * 
 * @returns JSON-LD structured data for Book schema
 * 
 * @example
 * ```tsx
 * const bookData = generateBookStructuredData();
 * ```
 */
export function generateBookStructuredData() {
  return {
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
    "image": `${BASE_URL}/The_Alfa_Code.png`,
    "url": `${BASE_URL}/#books`,
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
  } as const;
}

/**
 * Generates WebSite structured data
 * 
 * @returns JSON-LD structured data for WebSite schema
 * 
 * @example
 * ```tsx
 * const websiteData = generateWebSiteStructuredData();
 * ```
 */
export function generateWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "John Chezik",
    "description": "Official website of John Chezik - Platinum-selling songwriter, singer, guitar player and author",
    "url": BASE_URL,
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
      "target": `${BASE_URL}/?search={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://twitter.com/johnchezik",
      "https://instagram.com/johnchezik",
      "https://linkedin.com/in/johnchezik"
    ]
  } as const;
}

/**
 * Generates Organization structured data
 * 
 * @param env - Environment variables for contact information
 * @returns JSON-LD structured data for Organization schema
 * 
 * @example
 * ```tsx
 * const orgData = generateOrganizationStructuredData({
 *   contactPhone: '+1-555-123-4567'
 * });
 * ```
 */
export function generateOrganizationStructuredData(env: StructuredDataEnv) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "John Chezik",
    "description": "Independent music and publishing organization",
    "url": BASE_URL,
    "logo": `${BASE_URL}/John_Studio_High_quality.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": env.contactPhone ?? DEFAULT_CONTACT_PHONE,
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
  } as const;
}
