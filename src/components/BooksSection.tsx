/**
 * Books Section Component - EXACT Recreation of Original Design
 * 
 * Recreated exactly from your original SvelteKit BooksSection
 * but using Next.js v15 with all the original functionality.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen } from 'lucide-react';
import Image from 'next/image';

interface Book {
  id: number;
  title: string;
  subtitle: string;
  year: string;
  genre: string;
  pages: number;
  rating: number;
  description: string;
  cover: string;
  color: string;
  featured: boolean;
  comingSoon?: boolean;
}

interface BooksSectionProps {
  className?: string;
}

const BooksSection: React.FC<BooksSectionProps> = () => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewBook, setPreviewBook] = useState<Book | null>(null);

  // John Chezik's published books - Only 2 books as required
  const books: Book[] = [
    {
      id: 1,
      title: "The Visual Man",
      subtitle: "Explores the connection between psychology, attraction, and influence through advanced psychological frameworks. This work examines the subtle dynamics of human interaction and the art of authentic connection.",
      year: "2025",
      genre: "Psychology",
      pages: 285,
      rating: 4.7,
      description: "A comprehensive guide to understanding psychological dynamics and communication techniques.",
      cover: "/The Visual Man Cover V1.png",
      color: "from-purple-600 to-blue-600",
      featured: true,
      comingSoon: true
    },
    {
      id: 2,
      title: "The Alpha Code",
      subtitle: "A bold guide for men ready to rise above mediocrity and step into their power. It challenges you to cultivate self-reliance, confidence, and fearless decision-making while mastering conflict and living by a personal code that commands respect and influence.",
      year: "2024",
      genre: "Self-Development",
      pages: 280,
      rating: 4.9,
      description: "A guide to building authentic connections and understanding relationship dynamics.",
      cover: "/The_Alfa_Code.png",
      color: "from-green-600 to-teal-600",
      featured: true,
      comingSoon: false
    }
  ];

  useEffect(() => {
    // Component mounted
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showPreview) {
        closePreview();
      }
    };

    if (showPreview) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showPreview]);


  const handlePreviewBook = (book: Book) => {
    setPreviewBook(book);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewBook(null);
  };

  // Preview content for The Alpha Code - EXACT from old site
  const alfaCodePreview = {
    tableOfContents: [
      "Introduction: The Alpha Mindset",
      "Chapter 1: Leading with Confidence in Relationships", 
      "Chapter 2: Building Unshakeable Self-Worth",
      "Chapter 3: Mastering Communication and Influence",
      "Chapter 4: Creating Magnetic Presence",
      "Chapter 5: Handling Conflict with Authority"
    ],
    introduction: `The Alpha Code isn't about aggression or manipulation—it's about developing the authentic confidence and leadership that naturally attracts respect and admiration. In a world that often rewards mediocrity, this book provides the psychological tools and mindset shifts needed to stand apart and lead with purpose.`,
    chapter1: {
      title: "Leading with Confidence in Relationships",
      sections: [
        {
          title: "Establishing Your Leadership Presence",
          content: `True leadership in relationships isn't about control—it's about unwavering confidence that naturally draws people toward you. An alpha mindset means knowing your worth and maintaining your direction, regardless of external pressures. You don't seek validation or approval; you provide stability and certainty that others find irresistibly attractive.

Confidence isn't something you turn on and off—it's a core part of your identity. When you operate from a place of genuine self-assurance, you naturally become the person others look to for guidance and strength. This isn't about dominance; it's about being so secure in yourself that you become a source of stability for those around you.`
        },
        {
          title: "Building Deeper Connection Through Strength", 
          content: `Relationships thrive when there's a foundation of respect and genuine attraction. This comes from being authentic, consistent, and uncompromising about your values. Women are naturally drawn to men who know what they want and aren't afraid to pursue it with conviction.

Your strength isn't about being inflexible—it's about being reliable. When you demonstrate that you can be counted on to maintain your standards and direction, you create the kind of security that deepens emotional bonds. This consistency becomes the bedrock of lasting attraction.`
        }
      ]
    }
  };


  const sectionContent = (
    <section id="books" className="section books-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <BookOpen size={16} />
            <span>Published Works</span>
          </div>
          
          <h2 className="section-title">My Books</h2>
          
          <p className="section-description">
            Explore my written works that complement my musical journey, 
            covering topics from psychology to self-development and creative philosophy.
          </p>
        </div>

        {/* Books Display */}
        <div className="featured-books">
          <div className="featured-grid">
            {books.filter(book => book.featured).map((book, index) => (
              <div 
                key={book.id}
                id={`book-${book.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                className={`featured-book ${book.color}`}
                style={{ '--delay': `${index * 150}ms` } as React.CSSProperties}
              >
                <div className="book-cover">
                  {book.cover && !book.cover.includes('placeholder') ? (
                    <Image
                      src={book.cover}
                      alt={`${book.title} cover`}
                      width={200}
                      height={300}
                      className="cover-image"
                      priority={index === 0}
                    />
                  ) : (
                    <div className="cover-placeholder bg-gradient-to-br">
                      <BookOpen size={48} className="cover-icon" />
                    </div>
                  )}
                  
                  {book.comingSoon && (
                    <div className="coming-soon-badge">
                      Coming Soon
                    </div>
                  )}
                </div>
                
                <div className="book-info">
                  <div className="book-meta">
                    <span className="book-year">{book.year}</span>
                    <span className="book-genre">{book.genre}</span>
                  </div>
                  
                  <h4 className="book-title">{book.title}</h4>
                  <p className="book-subtitle">{book.subtitle}</p>
                  
                  
                  <div className="book-actions">
                    {!book.comingSoon && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handlePreviewBook(book)}
                      >
                        <BookOpen size={16} />
                        Preview
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );

  // Render modal as portal to document body to avoid layout issues
  const modalContent = showPreview && previewBook && (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div 
      className="modal-overlay" 
      onClick={closePreview}
      onKeyDown={(e) => e.key === 'Escape' && closePreview()}
      role="dialog"
      aria-modal="true"
      aria-label="Book preview modal"
// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex */}
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="document"
        tabIndex={-1}
      >
        <button className="modal-close" onClick={closePreview}>
          ×
        </button>
        
        <div className="modal-header">
          <div className="modal-category bg-green-500/10 text-green-400 border-green-500/30">
            📚 Book Preview
          </div>
          <h2 className="modal-title">{previewBook.title}</h2>
          <div className="modal-meta">
            <span className="post-date">{previewBook.year} • {previewBook.genre} • {previewBook.pages} pages</span>
          </div>
        </div>
        
        <div className="modal-body">
          <div className="post-content">
            {previewBook.title === "The Alpha Code" ? (
              <>
                {/* Table of Contents */}
                <div className="preview-section mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Table of Contents</h3>
                  <ul className="space-y-2">
                    {alfaCodePreview.tableOfContents.map((item, index) => (
                      <li key={index} className="text-gray-300 flex items-start">
                        <span className="text-green-400 mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Introduction */}
                <div className="preview-section mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Introduction</h3>
                  <p className="content-paragraph">{alfaCodePreview.introduction}</p>
                </div>
                
                {/* Chapter 1 */}
                <div className="preview-section mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">{alfaCodePreview.chapter1.title}</h3>
                  {alfaCodePreview.chapter1.sections.map((section, index) => (
                    <div key={index} className="mb-6">
                      <h4 className="text-lg font-medium text-green-400 mb-3">{section.title}</h4>
                      <p className="content-paragraph">{section.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="preview-footer mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm">
                    This preview contains the Introduction and Chapter 1. The complete book includes 5 comprehensive chapters covering all aspects of confident leadership and authentic attraction.
                  </p>
                </div>
              </>
            ) : (
              <div className="preview-section">
                <p className="content-paragraph">Preview content coming soon for {previewBook.title}.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {sectionContent}
      {typeof window !== 'undefined' && modalContent && createPortal(modalContent, document.body)}
    </>
  );
};

export default BooksSection;