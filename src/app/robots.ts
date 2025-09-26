/**
 * Dynamic Robots.txt Generator
 * 
 * Generates a dynamic robots.txt file for better SEO control and search engine
 * optimization. Provides comprehensive crawling rules and sitemap references.
 * 
 * @fileoverview Dynamic robots.txt generation with SEO optimization
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // This function is automatically called by Next.js
 * // Access via: https://chezik.eu/robots.txt
 * export default function robots(): MetadataRoute.Robots {
 *   return {
 *     rules: { userAgent: '*', allow: '/', disallow: ['/admin/'] },
 *     sitemap: 'https://chezik.eu/sitemap.xml'
 *   };
 * }
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots}
 */

import { MetadataRoute } from 'next'

/**
 * Generate robots.txt configuration
 * 
 * Creates a robots.txt configuration that allows search engines to crawl
 * the public content while restricting access to admin, private, and API routes.
 * 
 * @returns Robots.txt configuration object
 * 
 * @example
 * ```tsx
 * const robotsConfig = robots();
 * // Returns: { rules: {...}, sitemap: 'https://chezik.eu/sitemap.xml' }
 * ```
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/', '/api/'],
    },
    sitemap: 'https://chezik.eu/sitemap.xml',
  }
}
