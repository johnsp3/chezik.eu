/**
 * Simple Audio Player Component
 * 
 * A working audio player that actually plays your music files
 * without complex service dependencies.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';

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

interface SimpleAudioPlayerProps {
  track: AudioTrack | null;
  autoPlay?: boolean;
  onClose?: () => void;
}

const SimpleAudioPlayer: React.FC<SimpleAudioPlayerProps> = ({ track, autoPlay = false, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!track || !audioRef.current) return;

    const audio = audioRef.current;
    
    // Set up event listeners
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = (event: Event) => {
      const audioElement = event.target as HTMLAudioElement;
      const errorMessage = audioElement.error 
        ? `Audio error: ${audioElement.error.message || 'Unknown error'}`
        : 'Failed to load audio file';
      
      console.error('[SIMPLE_AUDIO_PLAYER] Error details:', {
        trackTitle: track?.title,
        audioFile: track?.audioFile,
        error: audioElement.error,
        readyState: audioElement.readyState,
        networkState: audioElement.networkState
      });
      
      setError(errorMessage);
      setIsLoading(false);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (autoPlay) {
        audio.play().then(() => setIsPlaying(true)).catch(handleError);
      }
    };

    // Add event listeners
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    // Load the track
    setIsLoading(true);
    setError(null);
    
    console.log('[SIMPLE_AUDIO_PLAYER] Loading track:', {
      title: track.title,
      audioFile: track.audioFile,
      fullPath: window.location.origin + track.audioFile
    });
    
    audio.src = track.audioFile;
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [track, autoPlay]);

  const togglePlayPause = async () => {
    if (!audioRef.current) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      setError('Failed to play audio');
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return null;
  }

  return (
    <div 
      className="simple-audio-player"
      role="region"
      aria-label="Audio player"
      aria-live="polite"
    >
      <audio ref={audioRef} preload="metadata" />
      
      {/* Close Button */}
      {onClose && (
        <button
          className="player-close-btn"
          onClick={onClose}
          aria-label="Close audio player"
          title="Close player"
        >
          <X size={20} aria-hidden="true" />
        </button>
      )}
      
      <div className="player-info">
        <h4 id="now-playing">Now Playing: {track.title}</h4>
        <p>{track.genre} • {track.year}</p>
      </div>
      
      <div className="player-controls">
        <button
          className="btn btn-primary play-pause-btn"
          onClick={togglePlayPause}
          disabled={isLoading}
          aria-label={isLoading ? 'Loading audio' : isPlaying ? 'Pause audio' : 'Play audio'}
          aria-describedby="now-playing"
        >
          {isLoading ? (
            <div className="loading-spinner" aria-hidden="true" />
          ) : isPlaying ? (
            <Pause size={20} aria-hidden="true" />
          ) : (
            <Play size={20} aria-hidden="true" />
          )}
        </button>
        
        <div className="progress-container">
          <span className="time-display" aria-label={`Current time: ${formatTime(currentTime)}`}>
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
            disabled={isLoading}
            aria-label="Audio progress"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          />
          <span className="time-display" aria-label={`Total duration: ${formatTime(duration)}`}>
            {formatTime(duration)}
          </span>
        </div>
        
        <div className="volume-controls">
          <button
            className="volume-btn"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          >
            {isMuted ? <VolumeX size={20} aria-hidden="true" /> : <Volume2 size={20} aria-hidden="true" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-bar"
            aria-label="Volume control"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={isMuted ? 0 : volume}
            aria-valuetext={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
          />
        </div>
      </div>
      
      {error && (
        <div className="player-error" role="alert" aria-live="assertive">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default SimpleAudioPlayer;
