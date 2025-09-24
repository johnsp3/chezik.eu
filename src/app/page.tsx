/**
 * Home Page Component
 * 
 * Main page component that displays all sections of John Chezik's website.
 * Includes hero, albums, books, blog, about, and contact sections.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import AlbumsSection from '@/components/AlbumsSection';
import BooksSection from '@/components/BooksSection';
import BlogSection from '@/components/BlogSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Initialize intersection observer for scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);
    
    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => observer.observe(section));
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="page">
      <Navigation />
      <main id="main-content" aria-label="Main content">
        <Hero mounted={mounted} />
        <AlbumsSection mounted={mounted} />
        <BooksSection mounted={mounted} />
        <BlogSection mounted={mounted} />
        <AboutSection mounted={mounted} />
        <ContactSection mounted={mounted} />
      </main>
      <Footer />
    </div>
  );
}
