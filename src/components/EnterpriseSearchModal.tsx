/**
 * Enterprise Search Modal Component
 * 
 * Advanced search interface with clean list-based results,
 * optimized for high-traffic scenarios (50,000+ visitors/week).
 * No image previews - pure list interface for fast navigation.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Search, X, Music, BookOpen, FileText, Camera, MapPin, Calendar, Tag } from 'lucide-react';

interface SearchResult {
  type: 'album' | 'book' | 'blog' | 'section' | 'gallery';
  title: string;
  description: string;
  href: string;
  anchorId?: string;
  category?: string;
  relevance?: number;
  location?: string;
  year?: string;
  genre?: string;
  tags?: string[];
}

interface EnterpriseSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultClick: (result: SearchResult) => void;
}

const EnterpriseSearchModal: React.FC<EnterpriseSearchModalProps> = ({
  isOpen,
  onClose,
  onResultClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout>();

  // Load search history from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('search-history');
      if (saved) {
        try {
          setSearchHistory(JSON.parse(saved));
        } catch (error) {
          console.warn('Failed to load search history:', error);
        }
      }
    }
  }, []);

  // Save search history to localStorage
  const saveSearchHistory = useCallback((query: string) => {
    if (query.length < 2) return;
    
    const newHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(newHistory);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('search-history', JSON.stringify(newHistory));
    }
  }, [searchHistory]);

  // Enterprise-level search with debouncing and caching
  const performSearch = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const timestamp = Date.now();
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20&_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setSearchResults(data.data);
        saveSearchHistory(query);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [saveSearchHistory]);

  // Debounced search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setSelectedIndex(-1);
    
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 150); // 150ms debounce for optimal performance
  }, [performSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          const selectedResult = searchResults[selectedIndex];
          if (selectedResult) {
            onResultClick(selectedResult);
          }
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  }, [isOpen, searchResults, selectedIndex, onResultClick, onClose]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get icon for result type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'album': return <Music size={16} className="text-blue-400" />;
      case 'book': return <BookOpen size={16} className="text-green-400" />;
      case 'blog': return <FileText size={16} className="text-orange-400" />;
      case 'gallery': return <Camera size={16} className="text-purple-400" />;
      case 'section': return <MapPin size={16} className="text-gray-400" />;
      default: return <Search size={16} className="text-gray-400" />;
    }
  };

  // Get type label
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'album': return 'Album';
      case 'book': return 'Book';
      case 'blog': return 'Blog Post';
      case 'gallery': return 'Photo';
      case 'section': return 'Section';
      default: return 'Content';
    }
  };

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div 
      className="search-modal-overlay"
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Search modal"
// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex, jsx-a11y/no-static-element-interactions, jsx-a11y/role-supports-aria-props */}
      <div 
        className="search-modal"
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        {/* Search Header */}
        <div className="search-header">
          <div className="flex items-center gap-3 flex-1">
            <Search size={20} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search everything..."
              className="search-input flex-1"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck="false"
            />
            {isSearching && <div className="search-spinner" />}
          </div>
          <button
            onClick={onClose}
            className="search-close"
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Results */}
        <div className="search-content">
          <div className="search-suggestions" ref={resultsRef}>
            {isSearching ? (
              <div className="search-placeholder">
                <div className="search-spinner mx-auto mb-4"></div>
                <p>Searching...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="search-results">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result.anchorId}-${index}`}
                    className={`search-result-item ${
                      selectedIndex === index ? 'bg-blue-600/20 border border-blue-500/30' : ''
                    }`}
                    onClick={() => onResultClick(result)}
                  >
                    <div className="search-result-content">
                      <div className="search-result-header">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(result.type)}
                          <h4 className="search-result-title">{result.title}</h4>
                        </div>
                        <span className="search-result-type-badge">{getTypeLabel(result.type)}</span>
                      </div>
                      <p className="search-result-description">{result.description}</p>
                      {(result.location || result.year || result.genre) && (
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                          {result.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span>{result.location}</span>
                            </div>
                          )}
                          {result.year && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{result.year}</span>
                            </div>
                          )}
                          {result.genre && (
                            <div className="flex items-center gap-1">
                              <Tag size={12} />
                              <span>{result.genre}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : searchQuery.length >= 2 ? (
              <div className="search-placeholder">
                <Search size={48} className="text-gray-600 mx-auto mb-4" />
                <p>No results found for &ldquo;{searchQuery}&rdquo;</p>
                <p className="text-gray-500 text-sm mt-1">Try different keywords or check spelling</p>
              </div>
            ) : (
              <div className="search-placeholder">
                {searchHistory.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-gray-400 text-sm font-medium mb-3">Recent Searches</h3>
                    <div className="space-y-2">
                      {searchHistory.slice(0, 5).map((query, index) => (
                        <button
                          key={index}
                          className="w-full p-3 text-left hover:bg-gray-800/50 rounded-lg transition-colors"
                          onClick={() => handleSearch(query)}
                        >
                          <div className="flex items-center gap-2">
                            <Search size={14} className="text-gray-500" />
                            <span className="text-gray-300">{query}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <Search size={48} className="text-gray-600 mx-auto mb-4" />
                <p>Search across all content</p>
                <p className="text-gray-500 text-sm mt-1">Type at least 2 characters to start searching</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default EnterpriseSearchModal;
