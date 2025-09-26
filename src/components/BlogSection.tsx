/**
 * Blog Section Component - Studio and Beyond
 * 
 * Recreated from the original SvelteKit site with the exact content
 * but using Next.js v15 with beautiful design and functionality.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, ChevronDown } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  category: string;
  categoryIcon: string;
  date: string;
  description: string;
  fullContent: string;
  color: string;
}

interface BlogSectionProps {
  className?: string;
}

const BlogSection: React.FC<BlogSectionProps> = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Exact content from the old site's "Latest News & Updates" section
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Recording Album #7",
      category: "🎵 In the Studio",
      categoryIcon: "music",
      date: "Current",
      description: "Currently in pre-production for my 7th studio album, working with incredible session musicians to explore new sonic territories. The creative energy is electric, and I'm pushing boundaries I've never touched before.",
      fullContent: `Currently in pre-production for my 7th studio album, working with incredible session musicians to explore new sonic territories. The creative energy is electric, and I'm pushing boundaries I've never touched before.

This new album represents a significant evolution in my sound, incorporating elements I've been experimenting with over the past year. I'm working with some of the most talented musicians in the industry, and their input is helping shape something truly special.

The recording process has been intense but incredibly rewarding. We're capturing live performances in ways that bring out the raw emotion and energy of each track. The studio sessions have been running late into the night, fueled by creative passion and the excitement of creating something new.

I can't wait to share more details about this project as we move forward. The music is taking shape in ways that even surprise me, and I believe this will be one of my most powerful releases yet.`,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "What Women Really Want",
      category: "📚 New Book",
      categoryIcon: "book",
      date: "Spring 2026",
      description: "Putting the finishing touches on my upcoming book exploring authentic masculinity and genuine connection. A deep dive into understanding relationships from a psychological perspective.",
      fullContent: `Putting the finishing touches on my upcoming book exploring authentic masculinity and genuine connection. A deep dive into understanding relationships from a psychological perspective.

This book has been years in the making, drawing from my experiences both in music and life. It's not just about relationships, but about understanding the deeper psychological dynamics that drive human connection and attraction.

The research phase alone took over two years, involving interviews with relationship experts, psychologists, and real people sharing their experiences. I wanted to create something that goes beyond surface-level advice and gets to the heart of what truly matters in relationships.

The writing process has been incredibly personal and challenging. I'm sharing insights that I've learned through decades of observation and experience, both in my personal life and through the stories people have shared with me.

This book represents a different side of my creative work - one that's more introspective and focused on helping others understand the complexities of human relationships. I believe it will resonate with anyone looking to build deeper, more meaningful connections.`,
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "Home Studio Renovation",
      category: "🏗️ Studio Expansion",
      categoryIcon: "studio",
      date: "2025",
      description: "Breaking ground on a major renovation of my home studio complex. Adding a full performance room with vintage acoustics and expanding the mixing suite for a creative sanctuary unlike anything I've built before.",
      fullContent: `Breaking ground on a major renovation of my home studio complex. Adding a full performance room with vintage acoustics and expanding the mixing suite for a creative sanctuary unlike anything I've built before.

This renovation has been a dream project for years. I'm creating a space that combines the best of vintage recording techniques with cutting-edge technology. The new performance room will feature carefully selected acoustic treatments and vintage equipment that will give recordings that classic, warm sound.

The mixing suite expansion is particularly exciting. I'm installing a custom console and monitoring system that will allow for more precise control over the final sound. The room acoustics are being designed by some of the best acoustic engineers in the business.

The renovation also includes a dedicated space for writing and creative work, separate from the technical aspects of recording. I believe that having the right environment is crucial for creativity, and this new space will be designed to inspire and facilitate the creative process.

The project timeline is ambitious, but I'm working with the best contractors and designers to ensure everything is done right. This studio will be a place where I can create music for years to come, and I'm excited to share the journey with you.`,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 4,
      title: "Vintage Gibson Les Paul",
      category: "🎸 New Acquisition",
      categoryIcon: "gear",
      date: "Recent",
      description: "Just acquired a rare 1970s Gibson Les Paul that's become my new go-to guitar. The tone is absolutely haunting - perfect for the darker material I'm developing.",
      fullContent: `Just acquired a rare 1970s Gibson Les Paul that's become my new go-to guitar. The tone is absolutely haunting - perfect for the darker material I'm developing.

This guitar has a story that goes beyond just its sound. It's a 1970s Gibson Les Paul that has been played by several musicians over the decades, each leaving their mark on its character. The wear patterns on the neck and body tell a story of countless hours of playing and performance.

The tone is absolutely incredible - rich, warm, and with a sustain that seems to go on forever. It's perfect for the darker, more introspective material I've been working on. There's something about the way this guitar responds that brings out emotions I didn't even know were there.

The acquisition process was quite an adventure. I had been searching for the right vintage Les Paul for years, and when this one became available, I knew it was the one. The previous owner was a collector who had kept it in excellent condition, and I'm honored to be its next caretaker.

I've already used it on several new recordings, and the difference in sound is remarkable. It's become an integral part of my creative process, inspiring new musical directions and helping me explore sounds I hadn't considered before.`,
      color: "from-purple-500 to-purple-600"
    }
  ];

  useEffect(() => {
    // Component mounted
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPost) {
        closeModal();
      }
    };

    if (selectedPost) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedPost]);

  const openModal = (post: BlogPost) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "🎵 In the Studio":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "📚 New Book":
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case "🏗️ Studio Expansion":
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
      case "🎸 New Acquisition":
        return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const sectionContent = (
    <section id="blog" className="section blog-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Calendar size={16} />
            <span>Latest Updates</span>
          </div>
          
          <h2 className="section-title">From the Studio & Beyond</h2>
          
          <p className="section-description">
            Stay updated with my latest projects, insights from the creative process, 
            and behind-the-scenes stories from my musical and literary journey.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="blog-grid">
          {blogPosts.map((post, index) => (
            <div 
              key={post.id}
              id={`blog-${post.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
              className="blog-post" 
              style={{ '--delay': `${index * 150}ms` } as React.CSSProperties}
            >
              <div className="post-header">
                <div className={`post-category ${getCategoryColor(post.category)}`}>
                  {post.category}
                </div>
                <div className="post-date">{post.date}</div>
              </div>
              
              <h3 className="post-title">{post.title}</h3>
              
              <p className="post-description">{post.description}</p>
              
              <div className="post-actions">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openModal(post)}
                >
                  <ChevronDown size={16} />
                  Read More
                </button>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  // Render modal as portal to document body to avoid layout issues
  const modalContent = selectedPost && (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
    <div 
      className="modal-overlay" 
      onClick={closeModal}
      onKeyDown={(e) => e.key === 'Escape' && closeModal()}
      role="dialog"
      aria-modal="true"
      aria-label="Blog post modal"
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
        <button className="modal-close" onClick={closeModal}>
          ×
        </button>
        
        <div className="modal-header">
          <div className={`modal-category ${getCategoryColor(selectedPost.category)}`}>
            {selectedPost.category}
          </div>
          <h2 className="modal-title">{selectedPost.title}</h2>
          <div className="modal-meta">
            <span className="post-date">{selectedPost.date}</span>
          </div>
        </div>
        
        <div className="modal-body">
          <div className="post-content">
            {selectedPost.fullContent.split('\n\n').map((paragraph, pIndex) => (
              <p key={pIndex} className="content-paragraph">
                {paragraph}
              </p>
            ))}
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

export default BlogSection;