/**
 * Audio Player Types
 * 
 * Enterprise-grade type definitions for the audio player system.
 * Provides comprehensive type safety and documentation for all audio-related functionality.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

/**
 * Audio track metadata interface
 */
export interface AudioTrack {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string;
  cover: string;
  audioFile: string;
  color: string;
  duration?: number; // in seconds
  fileSize?: number; // in bytes
  bitrate?: number; // in kbps
  sampleRate?: number; // in Hz
}

/**
 * Audio player state interface
 */
export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0-1
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string | undefined;
  playbackRate: number; // 0.5, 0.75, 1, 1.25, 1.5, 2
  isLooping: boolean;
  isShuffled: boolean;
}

/**
 * Audio analytics event interface
 */
export interface AudioAnalyticsEvent {
  trackId: number;
  trackTitle: string;
  eventType: 'play' | 'pause' | 'seek' | 'volume_change' | 'complete' | 'error';
  timestamp: Date;
  currentTime: number;
  duration: number;
  volume: number;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  deviceType: 'mobile' | 'tablet' | 'desktop';
  sessionId: string;
}

/**
 * Audio player configuration interface
 */
export interface AudioPlayerConfig {
  preload: 'none' | 'metadata' | 'auto';
  crossfade: boolean;
  crossfadeDuration: number; // in seconds
  autoPlay: boolean;
  loop: boolean;
  shuffle: boolean;
  volume: number;
  playbackRate: number;
  analytics: {
    enabled: boolean;
    endpoint?: string;
    batchSize: number;
    flushInterval: number; // in milliseconds
  };
  responsive: {
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    touchOptimized: boolean;
  };
}

/**
 * Audio control button interface
 */
export interface AudioControlButton {
  id: string;
  icon: string;
  label: string;
  action: () => void;
  disabled?: boolean;
  active?: boolean;
  tooltip?: string;
}

/**
 * Audio visualization data interface
 */
export interface AudioVisualizationData {
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
  rms: number; // Root Mean Square for volume
  peak: number; // Peak amplitude
  bass: number; // Bass frequency range
  mid: number; // Mid frequency range
  treble: number; // Treble frequency range
}

/**
 * Audio error interface
 */
export interface AudioError {
  code: string;
  message: string;
  details?: unknown | undefined;
  timestamp: Date;
  trackId?: number | undefined;
}

/**
 * Audio performance metrics interface
 */
export interface AudioPerformanceMetrics {
  loadTime: number; // Time to load audio file
  seekTime: number; // Time to seek to position
  bufferHealth: number; // Buffer health percentage
  droppedFrames: number;
  networkLatency: number;
  memoryUsage: number;
  cpuUsage: number;
}

/**
 * Audio session interface
 */
export interface AudioSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  tracksPlayed: number[];
  totalPlayTime: number; // in seconds
  totalSeekTime: number; // in seconds
  volumeChanges: number;
  errors: AudioError[];
  deviceInfo: {
    userAgent: string;
    viewport: { width: number; height: number };
    deviceType: 'mobile' | 'tablet' | 'desktop';
    connectionType?: string;
  };
}

/**
 * Audio storage interface for persistence
 */
export interface AudioStorage {
  volume: number;
  playbackRate: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffled: boolean;
  lastPlayedTrack: number;
  playHistory: number[];
  favorites: number[];
  settings: {
    crossfade: boolean;
    crossfadeDuration: number;
    autoPlay: boolean;
    analytics: boolean;
  };
}

/**
 * Audio API response interface
 */
export interface AudioApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: Date;
  requestId: string;
}

/**
 * Audio analytics summary interface
 */
export interface AudioAnalyticsSummary {
  totalPlays: number;
  uniqueListeners: number;
  averagePlayTime: number;
  completionRate: number;
  mostPlayedTracks: Array<{
    trackId: number;
    trackTitle: string;
    playCount: number;
    averagePlayTime: number;
  }>;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  timeBreakdown: {
    hour: number;
    plays: number;
  }[];
  errorRate: number;
  performanceMetrics: {
    averageLoadTime: number;
    averageSeekTime: number;
    bufferHealth: number;
  };
}

/**
 * Audio event callback types
 */
export type AudioEventCallback = (event: AudioAnalyticsEvent) => void;
export type AudioErrorCallback = (error: AudioError) => void;
export type AudioStateCallback = (state: AudioPlayerState) => void;
export type AudioProgressCallback = (currentTime: number, duration: number) => void;

/**
 * Audio player mode enum
 */
export enum AudioPlayerMode {
  PREVIEW = 'preview',
  FULL_TRACK = 'full_track',
  PLAYLIST = 'playlist',
  RADIO = 'radio'
}

/**
 * Audio quality enum
 */
export enum AudioQuality {
  LOW = 'low', // 128kbps
  MEDIUM = 'medium', // 192kbps
  HIGH = 'high', // 320kbps
  LOSSLESS = 'lossless' // FLAC/WAV
}

/**
 * Audio format enum
 */
export enum AudioFormat {
  MP3 = 'mp3',
  AAC = 'aac',
  OGG = 'ogg',
  WAV = 'wav',
  FLAC = 'flac',
  M4A = 'm4a'
}
