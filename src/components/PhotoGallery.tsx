/**
 * Photo Gallery Component - EXACT Recreation of Album Design
 * 
 * A bulletproof photo gallery that matches the album section design exactly.
 * Features advanced Next.js optimization, TypeScript safety, and mobile responsiveness.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Eye, Calendar, MapPin, User, X } from 'lucide-react';
import Image from 'next/image';

interface PhotoGalleryProps {
  className?: string;
}

interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: string;
  date: string;
  location: string;
  photographer: string;
  color: string;
  tags: string[];
}

// Professional photo data - using actual photos from John's collection
const photos: Photo[] = [
  {
    id: 1,
    title: "Powerhouse Vocals",
    description: "John in the studio singing, capturing the raw emotion and passion of musical creation. This intimate moment shows the artist in his element, bringing songs to life through pure vocal expression.",
    imageUrl: "/gallery/john singing studio 2025.png",
    thumbnailUrl: "/gallery/thumbnails/john singing studio 2025.png",
    category: "Studio",
    date: "2025-01-15",
    location: "John Chezik Studio",
    photographer: "Studio Team",
    color: "from-blue-600 to-purple-600",
    tags: ["studio", "singing", "music", "2025"]
  },
  {
    id: 2,
    title: "Trying To Look Serious",
    description: "A striking professional portrait of John standing confidently in the studio. This image captures the essence of a seasoned musician with decades of experience and passion for his craft.",
    imageUrl: "/gallery/john standing professional studio.png",
    thumbnailUrl: "/gallery/thumbnails/john standing professional studio.png",
    category: "Studio",
    date: "2024-12-20",
    location: "John Chezik Studio",
    photographer: "Professional Photographer",
    color: "from-indigo-600 to-blue-600",
    tags: ["portrait", "professional", "studio", "musician"]
  },
  {
    id: 3,
    title: "My Favorite Acoustic",
    description: "John with his full acoustic guitar in the studio, showcasing the intimate connection between artist and instrument. This moment captures the soulful essence of acoustic music creation.",
    imageUrl: "/gallery/poor man's acoustic.png",
    thumbnailUrl: "/gallery/thumbnails/poor man's acoustic.png",
    category: "Studio",
    date: "2023-11-15",
    location: "John Chezik Studio",
    photographer: "Studio Team",
    color: "from-green-600 to-teal-600",
    tags: ["acoustic", "guitar", "studio", "performance"]
  },
  {
    id: 4,
    title: "In The Studio Somewhere",
    description: "John in the studio with a natural, youthful smile that reflects the joy and passion he brings to music. This candid moment shows the artist's genuine love for his craft.",
    imageUrl: "/gallery/John Studio Young Normal Smiling.png",
    thumbnailUrl: "/gallery/thumbnails/John Studio Young Normal Smiling.png",
    category: "Studio",
    date: "1992-10-30",
    location: "Blue Line Records Studio",
    photographer: "Studio Team",
    color: "from-yellow-600 to-orange-600",
    tags: ["smile", "studio", "joy", "passion"]
  },
  {
    id: 5,
    title: "I Hope This Wire Goes Here",
    description: "John working on a guitar, demonstrating his deep understanding of instruments and their role in musical creation. This image shows the technical side of musical artistry.",
    imageUrl: "/gallery/John working on a guitar.png",
    thumbnailUrl: "/gallery/thumbnails/John working on a guitar.png",
    category: "Studio",
    date: "2008-09-25",
    location: "John Chezik Studio",
    photographer: "Studio Team",
    color: "from-red-600 to-pink-600",
    tags: ["guitar", "craftsmanship", "technical", "studio"]
  },
  {
    id: 6,
    title: "Kitchen Rockstar",
    description: "A nostalgic moment from 1980 showing John standing in a kitchen with his guitar. This early career photo captures the humble beginnings of a musical journey that would span decades.",
    imageUrl: "/gallery/John 1990 standing in kitchen with guitar.png",
    thumbnailUrl: "/gallery/thumbnails/John 1990 standing in kitchen with guitar.png",
    category: "Vintage",
    date: "1980-06-15",
    location: "Early Studio",
    photographer: "Vintage Photographer",
    color: "from-amber-600 to-yellow-600",
    tags: ["1980", "vintage", "kitchen", "early-career"]
  },
  {
    id: 7,
    title: "My First Grammy",
    description: "John and Studios celebrating the 1996 Best Film Grammy achievement. This historic moment represents a significant milestone in John's illustrious career in the music industry.",
    imageUrl: "/gallery/John and Studios 1990 Best Film Grammy.png",
    thumbnailUrl: "/gallery/thumbnails/John and Studios 1990 Best Film Grammy.png",
    category: "Achievement",
    date: "1996-02-21",
    location: "Grammy Awards",
    photographer: "Awards Photographer",
    color: "from-purple-600 to-indigo-600",
    tags: ["grammy", "achievement", "1996", "awards"]
  },
  {
    id: 8,
    title: "Trying To Look Cool",
    description: "John in Monaco with his new Pagani Zonda, showcasing the lifestyle that comes with musical success. This image represents the rewards of dedication to artistic excellence.",
    imageUrl: "/gallery/John in Monaco new Pagani Zonda.png",
    thumbnailUrl: "/gallery/thumbnails/John in Monaco new Pagani Zonda.png",
    category: "Lifestyle",
    date: "2003-08-10",
    location: "Monaco",
    photographer: "Lifestyle Photographer",
    color: "from-cyan-600 to-blue-600",
    tags: ["monaco", "pagani", "lifestyle", "success"]
  },
  {
    id: 9,
    title: "My Ferrari F50 - Just Got It",
    description: "John with his stunning Ferrari F50 in Monaco, representing the pinnacle of automotive excellence and the luxurious lifestyle that accompanies musical achievement. This iconic supercar symbolizes the rewards of artistic dedication.",
    imageUrl: "/gallery/John, new F50 Ferrari Monaco.png",
    thumbnailUrl: "/gallery/thumbnails/John, new F50 Ferrari Monaco.png",
    category: "Lifestyle",
    date: "1996-09-15",
    location: "Monaco",
    photographer: "Lifestyle Photographer",
    color: "from-red-600 to-orange-600",
    tags: ["ferrari", "f50", "monaco", "supercar", "lifestyle"]
  },
  {
    id: 10,
    title: "V Studios 1998",
    description: "John in the studio during the 1980s, leaning against the mixer board. This candid moment captures the artist in his creative environment, showcasing the technical side of music production and the intimate relationship between artist and studio equipment.",
    imageUrl: "/gallery/John, in studio, 1980s, leaning against mixer board.png",
    thumbnailUrl: "/gallery/thumbnails/John, in studio, 1980s, leaning against mixer board.png",
    category: "Studio",
    date: "1998-06-15",
    location: "V Studios",
    photographer: "Studio Team",
    color: "from-purple-600 to-indigo-600",
    tags: ["studio", "mixer", "1980s", "production", "v-studios"]
  },
  {
    id: 11,
    title: "John, 17 Years Old",
    description: "A youthful portrait of John at 17 years old, capturing the early passion and determination that would define his musical journey. This early photo shows the raw talent and ambition that would eventually lead to a successful career in music.",
    imageUrl: "/gallery/John, 17 years old.png",
    thumbnailUrl: "/gallery/thumbnails/John, 17 years old.png",
    category: "Vintage",
    date: "1981-06-15",
    location: "Early Years",
    photographer: "Family Photographer",
    color: "from-amber-600 to-orange-600",
    tags: ["17", "young", "vintage", "early-career", "1981"]
  },
  {
    id: 12,
    title: "John, 16 Years Old",
    description: "A youthful portrait of John at 16 years old, capturing the early passion and determination that would define his musical journey. This early photo shows the raw talent and ambition that would eventually lead to a successful career in music.",
    imageUrl: "/gallery/John, 16 years old.png",
    thumbnailUrl: "/gallery/thumbnails/John, 16 years old.png",
    category: "Vintage",
    date: "1980-06-15",
    location: "Early Years",
    photographer: "Family Photographer",
    color: "from-yellow-600 to-amber-600",
    tags: ["16", "young", "vintage", "early-career", "1980"]
  }
];

const PhotoGallery: React.FC<PhotoGalleryProps> = React.memo(({ className = '' }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handlePhotoClick = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setSelectedPhoto(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && showModal) {
      handleCloseModal();
    }
  }, [showModal, handleCloseModal]);

  useEffect(() => {
    if (showModal) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showModal, handleKeyDown]);

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <section id="gallery" className={`section photo-gallery-section ${className || ''}`}>
        <div className="container">
          {/* Section Header */}
          <div className="section-header">
            <div className="section-badge">
              <Camera size={16} />
              <span>Photo Gallery</span>
            </div>
            
            <h2 className="section-title">Behind the Music</h2>
            
            <p className="section-description">
              Explore the moments that shape my musical journey through professional photography 
              capturing studio sessions, live performances, and personal insights.
            </p>
          </div>
          
          {/* Photos Grid */}
          <div className="photos-grid">
            {photos.map((photo, index) => (
              <div 
                key={photo.id}
                id={`photo-${photo.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}
                className="photo-card" 
                style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
                onClick={() => handlePhotoClick(photo)}
                role="button"
                tabIndex={0}
                aria-label={`View ${photo.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePhotoClick(photo);
                  }
                }}
              >
                {/* Photo Cover */}
                <div className="photo-cover">
                  <div className="actual-photo">
                    <Image
                      src={photo.thumbnailUrl}
                      alt={photo.title}
                      width={400}
                      height={300}
                      className="photo-image"
                      priority={index < 4}
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <div className="photo-overlay">
                      <div className="view-btn">
                        <Eye size={24} />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Photo Info */}
                <div className="photo-info">
                  <div className="photo-meta">
                    <span className="photo-category">{photo.category}</span>
                    <span className="photo-date">{new Date(photo.date).getFullYear()}</span>
                  </div>
                  
                  <h3 className="photo-title">{photo.title}</h3>
                  
                  <p className="photo-description">{photo.description}</p>
                  
                  <div className="photo-details">
                    <div className="photo-detail">
                      <Calendar size={14} />
                      <span>{formatDate(photo.date)}</span>
                    </div>
                    <div className="photo-detail">
                      <MapPin size={14} />
                      <span>{photo.location}</span>
                    </div>
                    <div className="photo-detail">
                      <User size={14} />
                      <span>{photo.photographer}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Modal */}
      {showModal && selectedPhoto && (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-noninteractive-tabindex
        <div
          ref={modalRef}
          className="photo-modal photo-modal-overlay"
          onClick={handleModalClick}
          onKeyDown={(e) => e.key === 'Escape' && handleCloseModal()}
          role="dialog"
          aria-modal="true"
          aria-label="Photo gallery modal"
// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
          tabIndex={0}
        >
          <div className="photo-modal-content">
            <button 
              className="modal-close-btn"
              onClick={handleCloseModal}
              aria-label="Close photo modal"
            >
              <X size={24} />
            </button>
            
            <div className="modal-photo-container">
              <Image
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.title}
                width={1200}
                height={800}
                className="modal-photo"
                style={{
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain'
                }}
                priority
              />
            </div>
            
            <div className="modal-photo-info">
              <div className="modal-photo-meta">
                <span className="photo-category-badge" style={{ color: '#000000', backgroundColor: '#ffffff', padding: '4px 12px', borderRadius: '12px', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', border: '2px solid #1e40af' }}>{selectedPhoto.category}</span>
                <span className="modal-date">{formatDate(selectedPhoto.date)}</span>
              </div>
              
              <h3 className="modal-photo-title">{selectedPhoto.title}</h3>
              
              <p className="modal-photo-description">{selectedPhoto.description}</p>
              
              <div className="modal-photo-details">
                <div className="modal-detail">
                  <MapPin size={16} />
                  <span>{selectedPhoto.location}</span>
                </div>
                <div className="modal-detail">
                  <User size={16} />
                  <span>{selectedPhoto.photographer}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

PhotoGallery.displayName = 'PhotoGallery';
export default PhotoGallery;
