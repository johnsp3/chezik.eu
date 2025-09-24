/**
 * Dynamic Robots.txt Generator
 * 
 * Generates a dynamic robots.txt file for better SEO control.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { MetadataRoute } from 'next'

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
