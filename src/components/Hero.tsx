/**
 * Hero Section Component
 * 
 * Beautiful hero section with profile image, gradient orbs, and parallax effects.
 * Converted from original SvelteKit design to Next.js.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { ChevronDown, Music, BookOpen } from 'lucide-react';
import Image from 'next/image';


export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    
    // Parallax effect for hero background
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        heroRef.current.style.transform = `translateY(${parallax}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function scrollToNext() {
    const nextSection = document.querySelector('#albums');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section 
      id="home" 
      className="hero" 
      ref={heroRef}
      role="banner"
      aria-label="Hero section - John Chezik introduction"
    >
      <div id="section-home" className="anchor-marker" aria-hidden="true"></div>
      <div className="hero-background" aria-hidden="true">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          {/* Profile Image */}
          <div className="profile-image">
            <div className="image-container">
              <Image 
                src="/John_Studio_High_quality.png" 
                alt="John Chezik in his professional studio, platinum-selling songwriter-singer and guitar player" 
                className="profile-img"
                width={300}
                height={300}
                priority
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 250px, 300px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
              />
              <div className="image-glow"></div>
            </div>
          </div>
          
          {/* Hero Text */}
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">John Chezik</span>
              <span className="title-subtitle">Platinum-selling songwriter-singer, guitar player and published author. 6 albums, 2 books, decades of creating.</span>
            </h1>
            
            <p className="hero-description">
              Explore the catalog of a career spanning decades of rock music and literary works. 
              From chart-topping albums to critically acclaimed books.
            </p>
            
            <div className="hero-stats">
              <div className="stat">
                <Music size={20} />
                <div className="stat-content">
                  <span className="stat-number">6</span>
                  <span className="stat-label">Albums</span>
                </div>
              </div>
              
              <div className="stat">
                <BookOpen size={20} />
                <div className="stat-content">
                  <span className="stat-number">2</span>
                  <span className="stat-label">Books</span>
                </div>
              </div>
            </div>
            
            <div className="hero-actions">
              <button 
                className="btn btn-primary" 
                onClick={scrollToNext}
                aria-label="Explore John Chezik's work - scroll to albums section"
              >
                Explore My Work
              </button>
              <a 
                href="#contact" 
                className="btn btn-secondary"
                aria-label="Get in touch with John Chezik - go to contact section"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <button 
        className="scroll-indicator" 
        onClick={scrollToNext} 
        aria-label="Scroll to next section - albums"
        title="Scroll to albums section"
      >
        <ChevronDown size={24} aria-hidden="true" />
      </button>
    </section>
  );
}