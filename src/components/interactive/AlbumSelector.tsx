import React, { useState, useEffect } from 'react';
import { albums } from '@/data/audio';

interface AlbumSelectorProps {
  className?: string;
}

const AlbumSelector: React.FC<AlbumSelectorProps> = ({ className = '' }) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('fractured');
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update featured album display when selection changes
  useEffect(() => {
    const album = albums.find(a => a.id === selectedAlbumId);
    if (album) {
      const coverElement = document.getElementById('featured-album-cover');
      const titleElement = document.getElementById('featured-album-title');
      const yearElement = document.getElementById('featured-album-year');
      const descriptionElement = document.getElementById('featured-album-description');
      const creditElement = document.getElementById('featured-album-artwork-credit');
      
      if (coverElement && coverElement instanceof HTMLImageElement) {
        coverElement.src = album.coverImage || '';
      }
      if (titleElement) titleElement.textContent = album.title;
      if (yearElement) yearElement.textContent = `${album.certification} • ${album.year}`;
      if (descriptionElement) descriptionElement.textContent = album.description;
      if (creditElement) creditElement.textContent = album.artworkCredit || 'Artwork by John Chezik';
      
      // Set data attribute for FeaturedAlbum to read
      document.body.setAttribute('data-selected-album', selectedAlbumId);
      
      // Don't auto-scroll on album selection - let user scroll manually
      // Scroll will only happen when MP3 player is opened
    }
  }, [selectedAlbumId, isMobile]);

  const handleAlbumSelect = (albumId: string) => {
    setSelectedAlbumId(albumId);
  };

  const handleOpenPlayer = () => {
    if (window.openAudioPlayer) {
      // On mobile, scroll to featured album when opening MP3 player
      if (isMobile) {
        setTimeout(() => {
          const featuredAlbumElement = document.getElementById('featured-album-cover');
          if (featuredAlbumElement) {
            featuredAlbumElement.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
      
      window.openAudioPlayer(selectedAlbumId);
    } else {
      console.warn('Audio player not available. Make sure WorkingAudioHandler is loaded.');
    }
  };

  return (
    <div className={className}>
      {/* Album List */}
      <div className="space-y-8 lg:space-y-12">
        {albums.map((album) => (
          <div 
            key={album.id}
            className="group cursor-pointer border-b border-gray-100 pb-6 lg:pb-8 hover:border-gray-200 transition-colors duration-500" 
            onClick={() => handleAlbumSelect(album.id)}
            role="button"
            tabIndex={0}
            aria-label={`Select ${album.title} album`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAlbumSelect(album.id);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="text-xl lg:text-2xl font-extralight tracking-wide text-black mb-2 group-hover:text-gray-700 transition-colors duration-500">
                  {album.title}
                </h4>
                <p className="text-gray-600 font-light text-sm lg:text-base">
                  {album.year} • {album.certification} • {album.genre}
                </p>
                <p className="text-gray-500 font-light text-xs lg:text-sm mt-2 leading-relaxed">
                  {album.description}
                </p>
              </div>
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-gray-100 transition-all duration-500 border border-gray-200/50 ml-4">
                <svg className="w-4 h-4 lg:w-6 lg:h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumSelector;
