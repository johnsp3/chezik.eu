/**
 * Albums Section Component - EXACT Recreation of Original Design
 * 
 * Recreated exactly from your original SvelteKit RobustAlbumsSection
 * but using Next.js v15 with advanced audio streaming capabilities.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Music, Play, Pause } from 'lucide-react';
import Image from 'next/image';
import SimpleAudioPlayer from './SimpleAudioPlayer';

interface AlbumsSectionProps {
  className?: string;
  mounted?: boolean;
}

interface AudioTrack {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string;
  cover: string;
  audioFile: string;
  hlsUrl?: string;
  color: string;
  duration?: number;
}

// Your exact original album data - moved outside component to prevent re-creation
const albums: AudioTrack[] = [
    {
      id: 1,
      title: "Don't Say It's Over",
      year: "2025",
      genre: "Hard Rock",
      description: "A heartfelt plea to hold on to love. The song captures the pain of separation, the hope for reconciliation, and the enduring belief that true love is worth one more chance.",
      cover: "/John_Chezik_greatest_hits.png",
      audioFile: "/John Chezik don't say it's over 0m37s.mp3",
      hlsUrl: "/api/audio/stream/1",
      color: "from-blue-600 to-purple-600",
      duration: 37
    },
    {
      id: 2,
      title: "The Visual Man",
      year: "2024",
      genre: "Hard Rock",
      description: "The Visual Man is about seduction, energy, and connection. It explores the hypnotic pull of desire and the promise of being lifted into a world of passion and ecstasy.",
      cover: "/The_visual_Man_Cover.png",
      audioFile: "/visualman.mp3",
      hlsUrl: "/api/audio/stream/2",
      color: "from-green-600 to-teal-600",
      duration: 22
    },
    {
      id: 3,
      title: "The Revealing",
      year: "2023",
      genre: "Hard Rock/Blues/Instrumental",
      description: "About embracing who you truly are and opening yourself to passion and emotion. It's a journey of self-discovery, vulnerability, and the pleasure of letting your inner feelings shine.",
      cover: "/John Chezik_The_Revealing_album_cover.png",
      audioFile: "/John_Chezik_The_Revealing.mp3",
      hlsUrl: "/api/audio/stream/3",
      color: "from-pink-600 to-red-600",
      duration: 30
    },
    {
      id: 4,
      title: "Look At Me",
      year: "2022",
      genre: "Hard Rock",
      description: "A dark and haunting song about fear, power, and pursuit. It tells the story of an unstoppable presence that invades the mind and soul, leaving no escape. A chilling portrayal of a sinister force that consumes everything in its path, leaving nowhere to hide.",
      cover: "/John_Chezik_Look_At_Me-Album_Cover.png",
      audioFile: "/look_at_me.mp3",
      hlsUrl: "/api/audio/stream/4",
      color: "from-indigo-600 to-blue-600",
      duration: 33
    },
    {
      id: 5,
      title: "My Life",
      year: "2021",
      genre: "Soft/Acoustic",
      description: "A reflective anthem about the highs and lows of chasing the rock 'n' roll dream. It blends youthful ambition with the struggles of the road, capturing both the cost and the passion of a life dedicated to music, while celebrating the freedom and purpose found along the journey.",
      cover: "/John_Chezik_the_acoustic_album-_love_songs.png",
      audioFile: "/John_Chezik_My_Life.mp3",
      hlsUrl: "/api/audio/stream/5",
      color: "from-orange-600 to-yellow-600",
      duration: 40
    },
    {
      id: 6,
      title: "Something More",
      year: "2020",
      genre: "Soft/Piano",
      description: "A heartfelt ballad about enduring love and the strength it brings through life's challenges. It reflects on loyalty, gratitude, and the certainty of a bond that has stood the test of time, showing that true love always reveals something deeper and more meaningful.",
      cover: "/John_Chezik_my_favorite_ballads.png",
      audioFile: "/John_Chezik_something_more.mp3",
      hlsUrl: "/api/audio/stream/6",
      color: "from-gray-600 to-slate-600",
      duration: 31
    }
  ];

const AlbumsSection: React.FC<AlbumsSectionProps> = ({ className = '', mounted: propMounted }) => {
  const [mounted, setMounted] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [, setTrackDurations] = useState<Record<number, number>>({});
  
  const playerAnchorRef = useRef<HTMLDivElement>(null);

  // Initialize component
  useEffect(() => {
    setMounted(true);
    
    // Load saved durations from localStorage
    const savedDurations = localStorage.getItem('track_durations');
    if (savedDurations) {
      try {
        const durations = JSON.parse(savedDurations);
        setTrackDurations(durations);
        console.log('[ALBUMS] Loaded saved durations:', durations);
      } catch (error) {
        console.warn('[ALBUMS] Failed to parse saved durations:', error);
      }
    }
  }, []);

  const handlePlayAlbum = useCallback((albumId: number) => {
    const album = albums.find(a => a.id === albumId);
    
    if (!album) {
      console.error(`[ALBUMS] Album ${albumId} not found`);
      return;
    }

    console.log(`[ALBUMS] Playing album: ${album.title}`, {
      albumId,
      audioFile: album.audioFile,
      hlsUrl: album.hlsUrl,
      duration: album.duration
    });

    // If clicking the same album that's playing, just show/hide player
    if (currentlyPlaying === albumId) {
      setShowPlayer(!showPlayer);
      return;
    }

    // Load new track
    setCurrentlyPlaying(albumId);
    setShowPlayer(true);
    
    console.log(`[ALBUMS] Set currently playing to: ${album.title}`);
    
    // Scroll to player after a short delay
    setTimeout(() => {
      if (playerAnchorRef.current) {
        playerAnchorRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 500);
  }, [currentlyPlaying, showPlayer]);

  const shouldShowPause = (albumId: number): boolean => {
    return currentlyPlaying === albumId && showPlayer;
  };

  const getAlbumDuration = (albumId: number): string => {
    const album = albums.find(a => a.id === albumId);
    if (album?.duration) {
      const mins = Math.floor(album.duration / 60);
      const secs = Math.floor(album.duration % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return '0:00';
  };

  const handleClosePlayer = useCallback(() => {
    setShowPlayer(false);
    setCurrentlyPlaying(null);
  }, []);

  return (
    <section id="albums" className={`section albums-section ${className}`}>
      <div className="container">
        {/* Section Header */}
        <div className={`section-header ${(mounted || propMounted) ? 'mounted' : ''}`}>
          <div className="section-badge">
            <Music size={16} />
            <span>Music Portfolio</span>
          </div>
          
          <h2 className="section-title">Latest Albums</h2>
          
          <p className="section-description">
            Explore my musical journey through these carefully crafted albums, 
            each telling a unique story through sound and melody.
          </p>
        </div>
        
        {/* Albums Grid */}
        <div className={`albums-grid ${(mounted || propMounted) ? 'mounted' : ''}`}>
          {albums.map((album, index) => (
            <div 
              key={album.id}
              className="album-card" 
              style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
            >
              {/* Album Cover */}
              <div className="album-cover">
                {album.cover && !album.cover.includes('placeholder') ? (
                  <div className="actual-cover">
                    <Image
                      src={album.cover}
                      alt={`${album.title} cover`}
                      width={300}
                      height={300}
                      className="cover-image"
                      priority={index < 3}
                    />
                    <div className="cover-overlay">
                      <button 
                        className={`play-btn ${shouldShowPause(album.id) ? 'playing' : ''}`}
                        onClick={() => handlePlayAlbum(album.id)}
                        aria-label={`${shouldShowPause(album.id) ? 'Pause' : 'Play'} ${album.title}`}
                      >
                        {shouldShowPause(album.id) ? (
                          <Pause size={24} />
                        ) : (
                          <Play size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className={`cover-placeholder bg-gradient-to-br ${album.color}`}>
                    <div className="cover-content">
                      <Music size={48} className="cover-icon" />
                      <div className="cover-overlay">
                        <button 
                          className={`play-btn ${shouldShowPause(album.id) ? 'playing' : ''}`}
                          onClick={() => handlePlayAlbum(album.id)}
                          aria-label={`${shouldShowPause(album.id) ? 'Pause' : 'Play'} ${album.title}`}
                        >
                          {shouldShowPause(album.id) ? (
                            <Pause size={24} />
                          ) : (
                            <Play size={24} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Album Info */}
              <div className="album-info">
                <div className="album-meta">
                  <span className="album-year">{album.year}</span>
                  <span className="album-genre">{album.genre}</span>
                </div>
                
                <h3 className="album-title">{album.title}</h3>
                
                <p className="album-description">{album.description}</p>
                
                <div className="album-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handlePlayAlbum(album.id)}
                  >
                    {shouldShowPause(album.id) ? (
                      <>
                        <Pause size={16} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={16} />
                        Play
                      </>
                    )}
                    <span className="preview-text">{getAlbumDuration(album.id)}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Audio Player Anchor */}
        <div ref={playerAnchorRef} className="audio-player-anchor"></div>
        
        {/* Audio Player Container */}
        {showPlayer && currentlyPlaying && (
          <div className={`audio-player-container ${(mounted || propMounted) ? 'mounted' : ''}`}>
            <SimpleAudioPlayer 
              track={albums.find(a => a.id === currentlyPlaying) || null}
              autoPlay={true}
              onClose={handleClosePlayer}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AlbumsSection;