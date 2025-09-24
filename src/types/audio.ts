/**
 * Audio System Types for Next.js
 * 
 * Comprehensive type definitions for the audio player system with
 * HLS streaming, analytics, and performance monitoring.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

export interface AudioTrack {
  id: number;
  title: string;
  year: string;
  genre: string;
  description: string;
  cover: string;
  audioFile: string;
  hlsUrl?: string; // HLS stream URL for better streaming
  color: string;
  duration?: number;
  fileSize?: number;
  bitrate?: number;
  format?: 'mp3' | 'm4a' | 'wav' | 'hls';
}

export interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  playbackRate: number;
  isLooping: boolean;
  isShuffled: boolean;
  bufferedRanges: TimeRanges | null;
  networkState: number;
  readyState: number;
}

export interface AudioPlayerConfig {
  preload: 'none' | 'metadata' | 'auto';
  crossfade: boolean;
  crossfadeDuration: number;
  autoPlay: boolean;
  loop: boolean;
  shuffle: boolean;
  volume: number;
  playbackRate: number;
  analytics: {
    enabled: boolean;
    batchSize: number;
    flushInterval: number;
    endpoint?: string;
  };
  responsive: {
    breakpoints: {
      mobile: number;
      tablet: number;
      desktop: number;
    };
    touchOptimized: boolean;
  };
  streaming: {
    useHLS: boolean;
    adaptiveBitrate: boolean;
    bufferSize: number;
    maxBufferLength: number;
  };
}

export interface AudioAnalyticsEvent {
  trackId: number;
  trackTitle: string;
  eventType: 'play' | 'pause' | 'seek' | 'volume_change' | 'complete' | 'error' | 'load';
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
  networkType?: string;
  bitrate?: number;
  bufferHealth?: number;
}

export interface AudioPerformanceMetrics {
  loadTime: number;
  seekTime: number;
  bufferHealth: number;
  droppedFrames: number;
  networkLatency: number;
  memoryUsage: number;
  cpuUsage: number;
  bitrate: number;
  bandwidth: number;
}

export interface AudioSession {
  id: string;
  startTime: Date;
  tracksPlayed: number[];
  totalPlayTime: number;
  totalSeekTime: number;
  volumeChanges: number;
  errors: AudioError[];
  deviceInfo: {
    userAgent: string;
    viewport: {
      width: number;
      height: number;
    };
    deviceType: 'mobile' | 'tablet' | 'desktop';
    networkType?: string;
  };
}

export interface AudioError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  trackId?: number;
}

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

export interface AudioApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  message?: string;
  timestamp: string;
  request_id?: string;
}

// Callback types
export type AudioEventCallback = (event: AudioAnalyticsEvent) => void;
export type AudioErrorCallback = (error: AudioError) => void;
export type AudioStateCallback = (state: AudioPlayerState) => void;
export type AudioProgressCallback = (currentTime: number, duration: number) => void;

// HLS specific types
export interface HLSConfig {
  enableWorker: boolean;
  lowLatencyMode: boolean;
  backBufferLength: number;
  maxBufferLength: number;
  maxMaxBufferLength: number;
  maxBufferSize: number;
  maxBufferHole: number;
  highBufferWatchdogPeriod: number;
  nudgeOffset: number;
  nudgeMaxRetry: number;
  maxFragLookUpTolerance: number;
  liveSyncDurationCount: number;
  liveMaxLatencyDurationCount: number;
  liveDurationInfinity: boolean;
  liveBackBufferLength: number;
  maxLiveSyncPlaybackRate: number;
  liveSyncDuration: number;
  liveMaxLatencyDuration: number;
  manifestLoadingTimeOut: number;
  manifestLoadingMaxRetry: number;
  manifestLoadingRetryDelay: number;
  levelLoadingTimeOut: number;
  levelLoadingMaxRetry: number;
  levelLoadingRetryDelay: number;
  fragLoadingTimeOut: number;
  fragLoadingMaxRetry: number;
  fragLoadingRetryDelay: number;
  startFragPrefetch: boolean;
  testBandwidth: boolean;
  progressive: boolean;
}

export interface AudioPlayerMode {
  type: 'standard' | 'mini' | 'fullscreen' | 'floating';
  position?: 'bottom' | 'top' | 'center';
  size?: 'small' | 'medium' | 'large';
}

export interface AudioQuality {
  level: 'auto' | 'low' | 'medium' | 'high' | 'lossless';
  bitrate?: number;
  codec?: string;
}
