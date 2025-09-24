/**
 * RSS Feed Generator
 * 
 * Generates an RSS feed for blog posts and updates.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://chezik.eu'
  const currentDate = new Date().toISOString()

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>John Chezik - Music & Books</title>
    <description>Latest updates from John Chezik - Platinum-selling songwriter, singer, guitar player and author</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/John_Studio_High_quality.png</url>
      <title>John Chezik</title>
      <link>${baseUrl}</link>
    </image>
    
    <item>
      <title>New Album: Don't Say It's Over</title>
      <description>Latest hard rock album featuring powerful tracks and exceptional guitar work.</description>
      <link>${baseUrl}/#albums</link>
      <guid isPermaLink="true">${baseUrl}/#albums</guid>
      <pubDate>2025-01-01T00:00:00Z</pubDate>
      <category>Music</category>
    </item>
    
    <item>
      <title>The Visual Man Album Release</title>
      <description>Hard rock album showcasing powerful vocals and exceptional guitar performances.</description>
      <link>${baseUrl}/#albums</link>
      <guid isPermaLink="true">${baseUrl}/#albums-visual-man</guid>
      <pubDate>2024-06-01T00:00:00Z</pubDate>
      <category>Music</category>
    </item>
    
    <item>
      <title>The Alpha Code Book Release</title>
      <description>A bold guide for men ready to rise above mediocrity and step into their power.</description>
      <link>${baseUrl}/#books</link>
      <guid isPermaLink="true">${baseUrl}/#books-alpha-code</guid>
      <pubDate>2024-03-01T00:00:00Z</pubDate>
      <category>Books</category>
    </item>
    
    <item>
      <title>The Revealing Album</title>
      <description>Diverse album featuring hard rock, blues, and instrumental tracks.</description>
      <link>${baseUrl}/#albums</link>
      <guid isPermaLink="true">${baseUrl}/#albums-revealing</guid>
      <pubDate>2023-09-01T00:00:00Z</pubDate>
      <category>Music</category>
    </item>
  </channel>
</rss>`

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
