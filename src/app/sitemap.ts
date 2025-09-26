/**
 * Dynamic Sitemap Generator
 * 
 * Generates a dynamic sitemap for better SEO and search engine indexing.
 * Provides comprehensive URL mapping with priority and change frequency
 * optimization for all major sections of the website.
 * 
 * @fileoverview Dynamic sitemap generation with SEO optimization
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // This function is automatically called by Next.js
 * // Access via: https://chezik.eu/sitemap.xml
 * export default function sitemap(): MetadataRoute.Sitemap {
 *   return [
 *     { url: 'https://chezik.eu', priority: 1.0, changeFrequency: 'weekly' }
 *   ];
 * }
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap}
 */

import { MetadataRoute } from 'next'

/**
 * Generate sitemap configuration
 * 
 * Creates a comprehensive sitemap configuration that includes all major
 * sections of the website with optimized priority and change frequency
 * settings for search engine indexing.
 * 
 * @returns Sitemap configuration array
 * 
 * @example
 * ```tsx
 * const sitemapConfig = sitemap();
 * // Returns: [{ url: 'https://chezik.eu', priority: 1.0, ... }, ...]
 * ```
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://chezik.eu'
  const currentDate = new Date().toISOString()

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/#albums`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#books`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/#contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/preferences`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/unsubscribe`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
