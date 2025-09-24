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
import { Menu, X, Search, Moon, Sun } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

interface SearchResult {
  type: 'album' | 'book' | 'blog' | 'section';
  title: string;
  description: string;
  href: string;
}

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const navItems: NavItem[] = [
    { href: '#home', label: 'Home' },
    { href: '#albums', label: 'Albums' },
    { href: '#books', label: 'Books' },
    { href: '#blog', label: 'Blog' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  // Initialize theme and scroll listener
  useEffect(() => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Scroll listener
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeSearch = useCallback(() => {
    setShowSearchModal(false);
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const openSearch = useCallback(() => {
    setShowSearchModal(true);
    setSearchQuery('');
    setSearchResults([]);
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
    localStorage.setItem('theme', newTheme);
  }, [theme]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate search API call (replace with actual search logic)
    setTimeout(() => {
      const results: SearchResult[] = [
        {
          type: 'album' as const,
          title: "Don't Say It's Over",
          description: 'Hard Rock • 2025',
          href: '#albums'
        },
        {
          type: 'album' as const,
          title: 'The Visual Man',
          description: 'Hard Rock • 2024',
          href: '#albums'
        },
        {
          type: 'book' as const,
          title: 'The Alpha Code',
          description: 'Self-Development • 2024',
          href: '#books'
        },
        {
          type: 'section' as const,
          title: 'About',
          description: 'Learn more about John Chezik',
          href: '#about'
        }
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  }, []);

  const handleSearchResultClick = useCallback((result: SearchResult) => {
    handleNavClick(result.href);
    closeSearch();
  }, [handleNavClick, closeSearch]);

  return (
    <>
      <nav 
        className={`navigation ${isScrolled ? 'scrolled' : ''}`}
        role="navigation"
        aria-label="Main navigation"
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
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
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
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  {theme === 'dark' ? 'Light' : 'Dark'} Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Advanced Search Modal */}
      {showSearchModal && (
        <div 
          className="search-modal-overlay" 
          onClick={closeSearch}
          role="dialog"
          aria-modal="true"
          aria-label="Search modal"
        >
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-header">
              <h3 id="search-title">Search</h3>
              <button 
                className="search-close"
                onClick={closeSearch}
                aria-label="Close search modal"
                aria-describedby="search-title"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="search-content">
              <div className="search-input-container">
                <Search size={20} className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search albums, books, blog posts..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  autoFocus
                  aria-label="Search input"
                  aria-describedby="search-title"
                  role="searchbox"
                />
                {isSearching && <div className="search-spinner" />}
              </div>
              
              <div className="search-suggestions">
                {searchResults.length > 0 ? (
                  <div className="search-results" role="listbox" aria-label="Search results">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        className="search-result-item"
                        onClick={() => handleSearchResultClick(result)}
                        role="option"
                        aria-label={`${result.title} - ${result.description}`}
                      >
                        <div className="search-result-content">
                          <h4 className="search-result-title">{result.title}</h4>
                          <p className="search-result-description">{result.description}</p>
                        </div>
                        <div className="search-result-type" aria-label={`Type: ${result.type}`}>
                          {result.type}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : searchQuery.length >= 2 ? (
                  <p className="search-no-results">No results found for &quot;{searchQuery}&quot;</p>
                ) : (
                  <div className="search-placeholder">
                    <p>Start typing to search...</p>
                    <div className="search-shortcuts">
                      <span className="shortcut">⌘K</span> to open search
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;