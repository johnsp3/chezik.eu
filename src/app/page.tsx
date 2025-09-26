/**
 * Home Page Component
 * 
 * Main page component that displays all sections of John Chezik's website.
 * Includes hero, albums, books, blog, about, and contact sections with
 * scroll-based animations using intersection observer.
 * 
 * @fileoverview Home page component with comprehensive section layout and
 * scroll animations for enhanced user experience.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // This component is automatically rendered at the root route
 * export default function HomePage() {
 *   return <div>Home page content</div>;
 * }
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages}
 */

'use client';

import React, { Suspense, lazy } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import { useIntersectionObserver } from '@/lib/hooks/use-intersection-observer';

// Lazy load non-critical components for better performance
const AlbumsSection = lazy(() => import('@/components/AlbumsSection'));
const BooksSection = lazy(() => import('@/components/BooksSection'));
const BlogSection = lazy(() => import('@/components/BlogSection'));
const PhotoGallery = lazy(() => import('@/components/PhotoGallery'));
const AboutSection = lazy(() => import('@/components/AboutSection'));
const ContactSection = lazy(() => import('@/components/ContactSection'));
const Footer = lazy(() => import('@/components/Footer'));

/**
 * Home page component with scroll animations
 * 
 * Renders the complete home page layout with all sections and manages
 * scroll-based animations using intersection observer.
 * 
 * @returns JSX element representing the home page
 * 
 * @example
 * ```tsx
 * <HomePage />
 * ```
 */
export default function HomePage() {
  // Initialize intersection observer for scroll animations
  useIntersectionObserver('.section', {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    animationClass: 'animate-fade-in',
  });

  return (
    <div className="page">
      <Navigation />
        <main id="main-content" aria-label="Main content" aria-live="polite">
        <Hero />
        <Suspense fallback={<div className="section-loading">Loading albums...</div>}>
          <AlbumsSection />
        </Suspense>
        <Suspense fallback={<div className="section-loading">Loading books...</div>}>
          <BooksSection />
        </Suspense>
        <Suspense fallback={<div className="section-loading">Loading blog...</div>}>
          <BlogSection />
        </Suspense>
        <Suspense fallback={<div className="section-loading">Loading gallery...</div>}>
          <PhotoGallery />
        </Suspense>
        <Suspense fallback={<div className="section-loading">Loading about...</div>}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<div className="section-loading">Loading contact...</div>}>
          <ContactSection />
        </Suspense>
      </main>
      <Suspense fallback={<div className="footer-loading">Loading footer...</div>}>
        <Footer />
      </Suspense>
    </div>
  );
}
