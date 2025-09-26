/**
 * Advanced Navigation Component for Next.js v15
 * 
 * Production-ready navigation with glass morphism, search modal,
 * theme toggle, and your exact original beautiful design.
 * Built for Vercel deployment with advanced features.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Menu, X, Search, Sun } from 'lucide-react';
import EnterpriseSearchModal from './EnterpriseSearchModal';

interface NavItem {
  href: string;
  label: string;
}

interface SearchResult {
  type: 'album' | 'book' | 'blog' | 'section' | 'gallery';
  title: string;
  description: string;
  href: string;
  anchorId?: string;
  category?: string;
  location?: string;
  year?: string;
  genre?: string;
  tags?: string[];
}

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  const navItems: NavItem[] = [
    { href: '#home', label: 'Home' },
    { href: '#albums', label: 'Albums' },
    { href: '#books', label: 'Books' },
    { href: '#blog', label: 'Blog' },
    { href: '#gallery', label: 'Gallery' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  // Initialize theme and scroll listener
  useEffect(() => {
    setMounted(true);
    
    // Load saved theme only on client
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      // Remove all theme classes and add the new one
      const baseClasses = document.body.className.replace(/theme-\w+/g, '').trim();
      document.body.className = baseClasses + ` theme-${savedTheme}`;
    }

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    // Set initial scroll state only on client
    if (typeof window !== 'undefined') {
      handleScroll();
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const closeSearch = useCallback(() => {
    setShowSearchModal(false);
  }, []);

  const openSearch = useCallback(() => {
    setShowSearchModal(true);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        openSearch();
      }
      
      // Close search with Escape
      if (event.key === 'Escape' && showSearchModal) {
        closeSearch();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [showSearchModal, closeSearch, openSearch]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = useCallback((href: string) => {
    closeMobileMenu();
    
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, [closeMobileMenu]);

  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    // Remove all theme classes and add the new one
    const baseClasses = document.body.className.replace(/theme-\w+/g, '').trim();
    document.body.className = baseClasses + ` theme-${newTheme}`;
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  const handleSearchResultClick = useCallback((result: SearchResult) => {
    // First navigate to the section
    handleNavClick(result.href);
    
    // If there's a specific anchor ID, scroll to it after a short delay
    if (result.anchorId) {
      setTimeout(() => {
        const element = document.getElementById(result.anchorId!);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
          
          // Add a temporary highlight effect
          element.style.transition = 'background-color 0.3s ease';
          element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
          setTimeout(() => {
            element.style.backgroundColor = '';
          }, 2000);
        }
      }, 300);
    }
    
    // If it's a gallery result, trigger a custom event to filter the gallery
    if (result.type === 'gallery' && result.category) {
      // Dispatch a custom event to filter the gallery
      const filterEvent = new CustomEvent('galleryFilter', {
        detail: { category: result.category, title: result.title }
      });
      window.dispatchEvent(filterEvent);
    }
    
    closeSearch();
  }, [handleNavClick, closeSearch]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <nav className="navigation" role="navigation" aria-label="Main navigation">
        <div className="container">
          <div className="nav-content">
            <div className="logo">
              <a href="#home" aria-label="John Chezik - Go to homepage">
                <span className="logo-text">John Chezik</span>
              </a>
            </div>
            <div className="nav-right">
              <ul className="nav-links desktop-nav" role="menubar">
                {navItems.map((item) => (
                  <li key={item.href} role="none">
                    <a 
                      href={item.href} 
                      className="nav-link"
                      role="menuitem"
                      aria-label={`Navigate to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <button className="search-button" aria-label="Search (⌘K)" title="Search (⌘K)">
                <Search size={20} />
              </button>
              <button 
                className="theme-toggle" 
                aria-label="Toggle theme" 
                title="Toggle theme"
                onClick={toggleTheme}
              >
                <Sun size={20} />
              </button>
            </div>
            <button className="mobile-menu-button" aria-label="Toggle mobile menu">
              <Menu size={24} />
            </button>
          </div>
          
          {/* Mobile Menu - always present but hidden */}
          <div 
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            aria-hidden="true"
          >
            <div className="mobile-menu-content">
              <ul className="mobile-nav-links" role="menubar">
                {navItems.map((item) => (
                  <li key={item.href} role="none">
                    <a
                      href={item.href}
                      className="mobile-nav-link"
                      role="menuitem"
                      aria-label={`Navigate to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mobile-actions">
                <button className="mobile-action-btn">
                  <Search size={20} />
                  Search
                </button>
                
                <button className="mobile-action-btn">
                  <Sun size={20} />
                  Light Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav 
        className={`navigation ${isScrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
        suppressHydrationWarning
      >
        <div className="container">
          <div className="nav-content">
            {/* Logo */}
            <div className="logo">
              <a 
                href="#home" 
                onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
                aria-label="John Chezik - Go to homepage"
              >
                <span className="logo-text">John Chezik</span>
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <div className="nav-right">
              <ul className="nav-links desktop-nav" role="menubar">
                {navItems.map((item) => (
                  <li key={item.href} role="none">
                    <a 
                      href={item.href} 
                      onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                      className="nav-link"
                      role="menuitem"
                      aria-label={`Navigate to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <button 
                className="search-button"
                onClick={openSearch}
                aria-label="Search (⌘K)"
                title="Search (⌘K)"
              >
                <Search size={20} />
              </button>
              
              <button 
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title="Toggle theme"
                suppressHydrationWarning
              >
                <Sun size={20} />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              suppressHydrationWarning
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            aria-hidden={!isMobileMenuOpen}
            suppressHydrationWarning
          >
            <div className="mobile-menu-content">
              <ul className="mobile-nav-links" role="menubar">
                {navItems.map((item) => (
                  <li key={item.href} role="none">
                    <a
                      href={item.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(item.href); }}
                      className="mobile-nav-link"
                      role="menuitem"
                      aria-label={`Navigate to ${item.label} section`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              
              <div className="mobile-actions">
                <button 
                  className="mobile-action-btn"
                  onClick={openSearch}
                >
                  <Search size={20} />
                  Search
                </button>
                
                <button 
                  className="mobile-action-btn"
                  onClick={toggleTheme}
                  suppressHydrationWarning
                >
                  <Sun size={20} />
                  Light Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Enterprise Search Modal */}
      <EnterpriseSearchModal
        isOpen={showSearchModal}
        onClose={closeSearch}
        onResultClick={handleSearchResultClick}
      />
    </>
  );
};

export default Navigation;