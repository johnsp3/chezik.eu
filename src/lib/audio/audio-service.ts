/**
 * Next.js Audio Service with HLS Streaming
 * 
 * Enterprise-grade audio player service with HLS streaming support,
 * analytics, performance monitoring, and responsive design.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import Hls from 'hls.js';
import type {
  AudioTrack,
  AudioPlayerState,
  AudioPlayerConfig,
  AudioAnalyticsEvent,
  AudioPerformanceMetrics,
  AudioSession,
  AudioError,
  AudioStorage,
  AudioEventCallback,
  AudioErrorCallback,
  AudioStateCallback,
  AudioProgressCallback,
  HLSConfig
} from '@/types/audio';
import { storeAudioAnalytics } from '@/lib/storage/vercel-blob';

export class AudioService {
  private audioElement: HTMLAudioElement | null = null;
  private hls: Hls | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private gainNode: GainNode | null = null;
  
  private state: AudioPlayerState;
  private config: AudioPlayerConfig;
  private session: AudioSession;
  private performanceMetrics: AudioPerformanceMetrics;
  
  private eventCallbacks: AudioEventCallback[] = [];
  private errorCallbacks: AudioErrorCallback[] = [];
  private stateCallbacks: AudioStateCallback[] = [];
  private progressCallbacks: AudioProgressCallback[] = [];
  
  private analyticsQueue: AudioAnalyticsEvent[] = [];
  private analyticsTimer: number | null = null;
  private storageKey = 'audio-player-storage';
  
  private isInitialized = false;
  private isDestroyed = false;
  
  constructor(config?: Partial<AudioPlayerConfig>) {
    this.config = this.mergeConfig(config);
    this.state = this.createInitialState();
    this.session = this.createInitialSession();
    this.performanceMetrics = this.createInitialMetrics();
    
    this.initializeService();
  }
  
  /**
   * Initialize the audio service
   */
  private async initializeService(): Promise<void> {
    try {
      await this.loadStoredSettings();
      this.setupEventListeners();
      this.startAnalyticsFlush();
      this.isInitialized = true;
      
      console.log('[AUDIO_SERVICE] Initialized successfully');
    } catch (error) {
      this.handleError({
        code: 'INITIALIZATION_ERROR',
        message: 'Failed to initialize audio service',
        details: error,
        timestamp: new Date()
      });
    }
  }
  
  /**
   * Create initial player state
   */
  private createInitialState(): AudioPlayerState {
    return {
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: this.config.volume,
      isMuted: false,
      isLoading: false,
      hasError: false,
      playbackRate: this.config.playbackRate,
      isLooping: this.config.loop,
      isShuffled: this.config.shuffle,
      bufferedRanges: null,
      networkState: 0,
      readyState: 0
    };
  }
  
  /**
   * Create initial session
   */
  private createInitialSession(): AudioSession {
    return {
      id: this.generateSessionId(),
      startTime: new Date(),
      tracksPlayed: [],
      totalPlayTime: 0,
      totalSeekTime: 0,
      volumeChanges: 0,
      errors: [],
      deviceInfo: this.getDeviceInfo()
    };
  }
  
  /**
   * Create initial performance metrics
   */
  private createInitialMetrics(): AudioPerformanceMetrics {
    return {
      loadTime: 0,
      seekTime: 0,
      bufferHealth: 100,
      droppedFrames: 0,
      networkLatency: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      bitrate: 0,
      bandwidth: 0
    };
  }
  
  /**
   * Merge configuration with defaults
   */
  private mergeConfig(config?: Partial<AudioPlayerConfig>): AudioPlayerConfig {
    const defaults: AudioPlayerConfig = {
      preload: 'metadata',
      crossfade: false,
      crossfadeDuration: 2,
      autoPlay: false,
      loop: false,
      shuffle: false,
      volume: 0.8,
      playbackRate: 1,
      analytics: {
        enabled: true,
        batchSize: 10,
        flushInterval: 5000
      },
      responsive: {
        breakpoints: {
          mobile: 768,
          tablet: 1024,
          desktop: 1200
        },
        touchOptimized: true
      },
      streaming: {
        useHLS: true,
        adaptiveBitrate: true,
        bufferSize: 30,
        maxBufferLength: 60
      }
    };
    
    return { ...defaults, ...config };
  }
  
  /**
   * Load and play a track with HLS support
   */
  public async loadTrack(track: AudioTrack): Promise<void> {
    if (this.isDestroyed) return;
    
    try {
      this.state.isLoading = true;
      this.state.hasError = false;
      delete this.state.errorMessage;
      this.notifyStateChange();
      
      const startTime = performance.now();
      
      // Stop current audio
      if (this.audioElement) {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
        this.audioElement = null;
      }
      
      // Clean up existing HLS instance
      if (this.hls) {
        this.hls.destroy();
        this.hls = null;
      }
      
      // Create new audio element
      this.audioElement = new Audio();
      this.setupAudioElement();
      
      // Setup HLS if supported and configured (only for actual HLS streams)
      if (this.config.streaming.useHLS && track.hlsUrl && Hls.isSupported() && track.hlsUrl.includes('.m3u8')) {
        await this.setupHLS(track.hlsUrl);
      } else if (track.audioFile) {
        // Use direct audio file for MP3 and other formats
        this.audioElement.src = track.audioFile;
        console.log('[AUDIO_SERVICE] Loading direct audio file:', track.audioFile);
      }
      
      // Setup audio context for visualization
      await this.setupAudioContext();
      
      this.state.currentTrack = track;
      
      // Track analytics
      this.trackAnalytics({
        trackId: track.id,
        trackTitle: track.title,
        eventType: 'load',
        timestamp: new Date(),
        currentTime: 0,
        duration: this.state.duration,
        volume: this.state.volume,
        userAgent: navigator.userAgent,
        viewport: this.session.deviceInfo.viewport,
        deviceType: this.session.deviceInfo.deviceType,
        sessionId: this.session.id
      });
      
      // Update session
      if (!this.session.tracksPlayed.includes(track.id)) {
        this.session.tracksPlayed.push(track.id);
      }
      
      // Update performance metrics
      this.performanceMetrics.loadTime = performance.now() - startTime;
      
      this.state.isLoading = false;
      this.notifyStateChange();
      
      console.log(`[AUDIO_SERVICE] Loaded track: ${track.title}`);
      
    } catch (error) {
      this.state.isLoading = false;
      console.error('[AUDIO_SERVICE] Load track error details:', {
        trackTitle: track.title,
        trackId: track.id,
        audioFile: track.audioFile,
        hlsUrl: track.hlsUrl,
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      
      this.handleError({
        code: 'LOAD_ERROR',
        message: `Failed to load track: ${track.title}`,
        details: error instanceof Error ? error.message : String(error),
        timestamp: new Date(),
        trackId: track.id
      });
    }
  }
  
  /**
   * Setup HLS streaming
   */
  private async setupHLS(hlsUrl: string): Promise<void> {
    if (!this.audioElement) return;
    
    const hlsConfig: Partial<HLSConfig> = {
      enableWorker: true,
      lowLatencyMode: this.config.streaming.adaptiveBitrate,
      backBufferLength: this.config.streaming.bufferSize,
      maxBufferLength: this.config.streaming.maxBufferLength,
      maxMaxBufferLength: this.config.streaming.maxBufferLength * 2,
      maxBufferSize: 60 * 1000 * 1000, // 60MB
      maxBufferHole: 0.1,
      highBufferWatchdogPeriod: 2,
      nudgeOffset: 0.1,
      nudgeMaxRetry: 3,
      maxFragLookUpTolerance: 0.25,
      liveSyncDurationCount: 3,
      liveMaxLatencyDurationCount: 5,
      liveDurationInfinity: false,
      liveBackBufferLength: 30,
      maxLiveSyncPlaybackRate: 1.2,
      liveSyncDuration: 2,
      liveMaxLatencyDuration: 5,
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 3,
      manifestLoadingRetryDelay: 1000,
      levelLoadingTimeOut: 10000,
      levelLoadingMaxRetry: 3,
      levelLoadingRetryDelay: 1000,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 3,
      fragLoadingRetryDelay: 1000,
      startFragPrefetch: true,
      testBandwidth: true,
      progressive: false
    };
    
    this.hls = new Hls(hlsConfig);
    
    // HLS event listeners
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('[AUDIO_SERVICE] HLS manifest parsed');
      this.state.isLoading = false;
      this.notifyStateChange();
    });
    
    this.hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('[AUDIO_SERVICE] HLS error:', data);
      this.handleError({
        code: 'HLS_ERROR',
        message: `HLS streaming error: ${data.details}`,
        details: data,
        timestamp: new Date(),
        ...(this.state.currentTrack?.id && { trackId: this.state.currentTrack.id })
      });
    });
    
    this.hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      console.log('[AUDIO_SERVICE] HLS level switched:', data);
      // Note: data.level is the level index, not the level object
      // We'll get bitrate from the level details separately
    });
    
    this.hls.on(Hls.Events.BUFFER_APPENDED, () => {
      this.updateBufferHealth();
    });
    
    // Attach HLS to audio element
    this.hls.attachMedia(this.audioElement);
    this.hls.loadSource(hlsUrl);
  }
  
  /**
   * Setup audio element with event listeners
   */
  private setupAudioElement(): void {
    if (!this.audioElement) return;
    
    this.audioElement.preload = this.config.preload;
    this.audioElement.volume = this.state.volume;
    this.audioElement.playbackRate = this.state.playbackRate;
    this.audioElement.loop = this.state.isLooping;
    
    // Event listeners
    this.audioElement.addEventListener('loadstart', this.handleLoadStart.bind(this));
    this.audioElement.addEventListener('loadedmetadata', this.handleLoadedMetadata.bind(this));
    this.audioElement.addEventListener('loadeddata', this.handleLoadedData.bind(this));
    this.audioElement.addEventListener('canplay', this.handleCanPlay.bind(this));
    this.audioElement.addEventListener('play', this.handlePlay.bind(this));
    this.audioElement.addEventListener('pause', this.handlePause.bind(this));
    this.audioElement.addEventListener('ended', this.handleEnded.bind(this));
    this.audioElement.addEventListener('timeupdate', this.handleTimeUpdate.bind(this));
    this.audioElement.addEventListener('volumechange', this.handleVolumeChange.bind(this));
    this.audioElement.addEventListener('error', this.handleAudioError.bind(this));
    this.audioElement.addEventListener('waiting', this.handleWaiting.bind(this));
    this.audioElement.addEventListener('stalled', this.handleStalled.bind(this));
    this.audioElement.addEventListener('progress', this.handleProgress.bind(this));
    this.audioElement.addEventListener('canplaythrough', this.handleCanPlayThrough.bind(this));
  }
  
  /**
   * Setup audio context for visualization
   */
  private async setupAudioContext(): Promise<void> {
    try {
      if (!this.audioElement) return;
      
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.gainNode = this.audioContext.createGain();
      this.source = this.audioContext.createMediaElementSource(this.audioElement);
      
      // Configure analyser
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Connect nodes
      this.source.connect(this.analyser);
      this.analyser.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);
      
      // Resume context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
    } catch (error) {
      console.warn('[AUDIO_SERVICE] Failed to setup audio context:', error);
    }
  }
  
  /**
   * Update buffer health metrics
   */
  private updateBufferHealth(): void {
    if (!this.audioElement || !this.audioElement.buffered.length) return;
    
    const buffered = this.audioElement.buffered;
    const currentTime = this.audioElement.currentTime;
    const duration = this.audioElement.duration;
    
    if (duration > 0) {
      let bufferedEnd = 0;
      for (let i = 0; i < buffered.length; i++) {
        if (buffered.start(i) <= currentTime && buffered.end(i) > currentTime) {
          bufferedEnd = buffered.end(i);
          break;
        }
      }
      
      const bufferAhead = bufferedEnd - currentTime;
      this.performanceMetrics.bufferHealth = Math.min(100, (bufferAhead / 10) * 100);
    }
  }
  
  /**
   * Play the current track
   */
  public async play(): Promise<void> {
    if (!this.audioElement || this.isDestroyed) return;
    
    try {
      // Ensure audio is loaded
      if (this.audioElement.readyState < 2) {
        console.log('[AUDIO_SERVICE] Audio not ready, waiting...');
        this.state.isLoading = true;
        this.notifyStateChange();
        await this.waitForAudioReady();
      }
      
      await this.audioElement.play();
      this.state.isPlaying = true;
      this.state.isLoading = false;
      this.notifyStateChange();
      
      if (this.state.currentTrack) {
        this.trackAnalytics({
          trackId: this.state.currentTrack.id,
          trackTitle: this.state.currentTrack.title,
          eventType: 'play',
          timestamp: new Date(),
          currentTime: this.state.currentTime,
          duration: this.state.duration,
          volume: this.state.volume,
          userAgent: navigator.userAgent,
          viewport: this.session.deviceInfo.viewport,
          deviceType: this.session.deviceInfo.deviceType,
          sessionId: this.session.id
        });
      }
      
    } catch (error) {
      console.error('[AUDIO_SERVICE] Play error details:', {
        trackTitle: this.state.currentTrack?.title,
        trackId: this.state.currentTrack?.id,
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        audioElementReadyState: this.audioElement?.readyState,
        audioElementNetworkState: this.audioElement?.networkState
      });
      
      // Handle autoplay restrictions
      if (error instanceof Error && error.name === 'NotAllowedError') {
        console.log('[AUDIO_SERVICE] Autoplay blocked by browser, user interaction required');
        this.state.hasError = true;
        this.state.errorMessage = 'Click play to start audio';
        this.state.isLoading = false;
        this.notifyStateChange();
      } else {
        this.state.isLoading = false;
        this.handleError({
          code: 'PLAY_ERROR',
          message: 'Failed to play audio',
          details: error instanceof Error ? error.message : String(error),
          timestamp: new Date(),
          ...(this.state.currentTrack?.id && { trackId: this.state.currentTrack.id })
        });
      }
    }
  }
  
  /**
   * Wait for audio to be ready
   */
  private async waitForAudioReady(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.audioElement) {
        reject(new Error('No audio element'));
        return;
      }
      
      const checkReady = () => {
        if (this.audioElement!.readyState >= 2) {
          cleanup();
          resolve();
        }
      };
      
      const cleanup = () => {
        if (timeoutId) clearTimeout(timeoutId);
        if (checkInterval) clearInterval(checkInterval);
      };
      
      const timeoutId: NodeJS.Timeout = setTimeout(() => {
        cleanup();
        const error = new Error('Audio ready timeout');
        console.error('[AUDIO_SERVICE] Audio ready timeout:', {
          readyState: this.audioElement?.readyState,
          networkState: this.audioElement?.networkState,
          src: this.audioElement?.src
        });
        reject(error);
      }, 10000);
      
      const checkInterval: NodeJS.Timeout = setInterval(checkReady, 100);
      
    });
  }
  
  /**
   * Pause the current track
   */
  public pause(): void {
    if (!this.audioElement || this.isDestroyed) return;
    
    this.audioElement.pause();
    this.state.isPlaying = false;
    this.state.isLoading = false;
    this.notifyStateChange();
    
    if (this.state.currentTrack) {
      this.trackAnalytics({
        trackId: this.state.currentTrack.id,
        trackTitle: this.state.currentTrack.title,
        eventType: 'pause',
        timestamp: new Date(),
        currentTime: this.state.currentTime,
        duration: this.state.duration,
        volume: this.state.volume,
        userAgent: navigator.userAgent,
        viewport: this.session.deviceInfo.viewport,
        deviceType: this.session.deviceInfo.deviceType,
        sessionId: this.session.id
      });
    }
  }
  
  /**
   * Toggle play/pause
   */
  public togglePlayPause(): void {
    if (this.state.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  
  /**
   * Seek to a specific time
   */
  public seek(time: number): void {
    if (!this.audioElement || this.isDestroyed) return;
    
    const startTime = performance.now();
    const clampedTime = Math.max(0, Math.min(time, this.state.duration));
    
    this.audioElement.currentTime = clampedTime;
    this.state.currentTime = clampedTime;
    
    // Update performance metrics
    this.performanceMetrics.seekTime = performance.now() - startTime;
    
    this.notifyStateChange();
    this.notifyProgressChange();
    
    if (this.state.currentTrack) {
      this.trackAnalytics({
        trackId: this.state.currentTrack.id,
        trackTitle: this.state.currentTrack.title,
        eventType: 'seek',
        timestamp: new Date(),
        currentTime: this.state.currentTime,
        duration: this.state.duration,
        volume: this.state.volume,
        userAgent: navigator.userAgent,
        viewport: this.session.deviceInfo.viewport,
        deviceType: this.session.deviceInfo.deviceType,
        sessionId: this.session.id
      });
    }
  }
  
  /**
   * Set volume
   */
  public setVolume(volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    this.state.volume = clampedVolume;
    this.state.isMuted = clampedVolume === 0;
    
    if (this.audioElement) {
      this.audioElement.volume = clampedVolume;
    }
    
    if (this.gainNode) {
      this.gainNode.gain.value = clampedVolume;
    }
    
    this.session.volumeChanges++;
    this.saveSettings();
    this.notifyStateChange();
    
    if (this.state.currentTrack) {
      this.trackAnalytics({
        trackId: this.state.currentTrack.id,
        trackTitle: this.state.currentTrack.title,
        eventType: 'volume_change',
        timestamp: new Date(),
        currentTime: this.state.currentTime,
        duration: this.state.duration,
        volume: this.state.volume,
        userAgent: navigator.userAgent,
        viewport: this.session.deviceInfo.viewport,
        deviceType: this.session.deviceInfo.deviceType,
        sessionId: this.session.id
      });
    }
  }
  
  /**
   * Toggle mute
   */
  public toggleMute(): void {
    if (this.state.isMuted) {
      this.setVolume(0.8); // Restore to default volume
    } else {
      this.setVolume(0);
    }
  }
  
  /**
   * Set playback rate
   */
  public setPlaybackRate(rate: number): void {
    const validRates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const clampedRate = validRates.includes(rate) ? rate : 1;
    
    this.state.playbackRate = clampedRate;
    
    if (this.audioElement) {
      this.audioElement.playbackRate = clampedRate;
    }
    
    this.saveSettings();
    this.notifyStateChange();
  }
  
  /**
   * Toggle loop
   */
  public toggleLoop(): void {
    this.state.isLooping = !this.state.isLooping;
    
    if (this.audioElement) {
      this.audioElement.loop = this.state.isLooping;
    }
    
    this.saveSettings();
    this.notifyStateChange();
  }
  
  /**
   * Get current state
   */
  public getState(): AudioPlayerState {
    return { ...this.state };
  }
  
  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): AudioPerformanceMetrics {
    return { ...this.performanceMetrics };
  }
  
  /**
   * Get session data
   */
  public getSession(): AudioSession {
    return { ...this.session };
  }
  
  /**
   * Get analyser for visualization
   */
  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }
  
  /**
   * Get audio element
   */
  public getAudioElement(): HTMLAudioElement | null {
    return this.audioElement;
  }
  
  /**
   * Add event callback
   */
  public onEvent(callback: AudioEventCallback): void {
    this.eventCallbacks.push(callback);
  }
  
  /**
   * Add error callback
   */
  public onError(callback: AudioErrorCallback): void {
    this.errorCallbacks.push(callback);
  }
  
  /**
   * Add state change callback
   */
  public onStateChange(callback: AudioStateCallback): void {
    this.stateCallbacks.push(callback);
  }
  
  /**
   * Add progress callback
   */
  public onProgress(callback: AudioProgressCallback): void {
    this.progressCallbacks.push(callback);
  }
  
  /**
   * Track analytics event
   */
  private trackAnalytics(event: AudioAnalyticsEvent): void {
    if (!this.config.analytics.enabled) return;
    
    this.analyticsQueue.push(event);
    this.eventCallbacks.forEach(callback => callback(event));
    
    // Flush if queue is full
    if (this.analyticsQueue.length >= this.config.analytics.batchSize) {
      this.flushAnalytics();
    }
  }
  
  /**
   * Flush analytics queue
   */
  private flushAnalytics(): void {
    if (this.analyticsQueue.length === 0) return;
    
    const events = [...this.analyticsQueue];
    this.analyticsQueue = [];
    
    // Send to analytics endpoint if configured
    if (this.config.analytics.endpoint) {
      this.sendAnalytics(events);
    }
    
    console.log(`[AUDIO_SERVICE] Flushed ${events.length} analytics events`);
  }
  
  /**
   * Send analytics to endpoint
   */
  private async sendAnalytics(events: AudioAnalyticsEvent[]): Promise<void> {
    try {
      // Store analytics in Vercel Blob
      const storeResult = await storeAudioAnalytics(events);
      if (!storeResult.success) {
        console.warn('[AUDIO_SERVICE] Failed to store analytics in blob:', storeResult.error);
      }

      // Also send to endpoint if configured
      if (this.config.analytics.endpoint) {
        await fetch(this.config.analytics.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            events,
            sessionId: this.session.id,
            timestamp: new Date().toISOString()
          })
        });
      }
    } catch (error) {
      console.warn('[AUDIO_SERVICE] Failed to send analytics:', error);
    }
  }
  
  /**
   * Start analytics flush timer
   */
  private startAnalyticsFlush(): void {
    if (this.analyticsTimer) {
      clearInterval(this.analyticsTimer);
    }
    
    this.analyticsTimer = window.setInterval(() => {
      this.flushAnalytics();
    }, this.config.analytics.flushInterval);
  }
  
  /**
   * Load stored settings from localStorage
   */
  private async loadStoredSettings(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const storage: AudioStorage = JSON.parse(stored);
        this.state.volume = storage.volume ?? this.state.volume;
        this.state.playbackRate = storage.playbackRate ?? this.state.playbackRate;
        this.state.isMuted = storage.isMuted ?? this.state.isMuted;
        this.state.isLooping = storage.isLooping ?? this.state.isLooping;
        this.state.isShuffled = storage.isShuffled ?? this.state.isShuffled;
      }
    } catch (error) {
      console.warn('[AUDIO_SERVICE] Failed to load stored settings:', error);
    }
  }
  
  /**
   * Save settings to localStorage
   */
  private async saveSettings(): Promise<void> {
    try {
      const storage: AudioStorage = {
        volume: this.state.volume,
        playbackRate: this.state.playbackRate,
        isMuted: this.state.isMuted,
        isLooping: this.state.isLooping,
        isShuffled: this.state.isShuffled,
        lastPlayedTrack: this.state.currentTrack?.id ?? 0,
        playHistory: this.session.tracksPlayed,
        favorites: [], // TODO: Implement favorites
        settings: {
          crossfade: this.config.crossfade,
          crossfadeDuration: this.config.crossfadeDuration,
          autoPlay: this.config.autoPlay,
          analytics: this.config.analytics.enabled
        }
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(storage));
    } catch (error) {
      console.warn('[AUDIO_SERVICE] Failed to save settings:', error);
    }
  }
  
  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Window events for responsive design
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    // Visibility change for performance optimization
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Keyboard shortcuts
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }
  
  /**
   * Handle window resize for responsive design
   */
  private handleResize(): void {
    this.session.deviceInfo.viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    this.session.deviceInfo.deviceType = this.getDeviceType();
  }
  
  /**
   * Handle before unload
   */
  private handleBeforeUnload(): void {
    this.flushAnalytics();
    this.saveSettings();
  }
  
  /**
   * Handle visibility change
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Pause audio when tab is hidden to save resources
      if (this.state.isPlaying) {
        this.pause();
      }
    }
  }
  
  /**
   * Handle keyboard shortcuts
   */
  private handleKeyboard(event: KeyboardEvent): void {
    // Only handle shortcuts when audio is focused or no input is focused
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    
    switch (event.code) {
      case 'Space':
        event.preventDefault();
        this.togglePlayPause();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.seek(this.state.currentTime - 5);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.seek(this.state.currentTime + 5);
        break;
      case 'KeyM':
        event.preventDefault();
        this.toggleMute();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setVolume(Math.min(1, this.state.volume + 0.1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.setVolume(Math.max(0, this.state.volume - 0.1));
        break;
    }
  }
  
  /**
   * Handle error
   */
  private handleError(error: AudioError): void {
    this.state.hasError = true;
    this.state.errorMessage = error.message;
    this.state.isLoading = false;
    
    this.session.errors.push(error);
    this.errorCallbacks.forEach(callback => callback(error));
    this.notifyStateChange();
    
    // Log error with better formatting
    console.error('[AUDIO_SERVICE] Error:', {
      code: error.code,
      message: error.message,
      details: error.details,
      timestamp: error.timestamp,
      trackId: error.trackId
    });
  }
  
  /**
   * Notify state change
   */
  private notifyStateChange(): void {
    this.stateCallbacks.forEach(callback => callback(this.state));
  }
  
  /**
   * Notify progress change
   */
  private notifyProgressChange(): void {
    this.progressCallbacks.forEach(callback => callback(this.state.currentTime, this.state.duration));
  }
  
  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  /**
   * Get device info
   */
  private getDeviceInfo() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return {
        userAgent: 'server',
        viewport: {
          width: 1920,
          height: 1080
        },
        deviceType: 'desktop' as const
      };
    }
    
    return {
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      deviceType: this.getDeviceType()
    };
  }
  
  /**
   * Get device type based on viewport
   */
  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      return 'desktop';
    }
    
    const width = window.innerWidth;
    
    if (width < this.config.responsive.breakpoints.mobile) {
      return 'mobile';
    } else if (width < this.config.responsive.breakpoints.tablet) {
      return 'tablet';
    } else {
      return 'desktop';
    }
  }
  
  /**
   * Audio event handlers
   */
  private handleLoadStart = (): void => {
    this.state.isLoading = true;
    this.notifyStateChange();
  };
  
  private handleLoadedMetadata = (): void => {
    if (this.audioElement) {
      this.state.duration = this.audioElement.duration || 0;
      this.state.bufferedRanges = this.audioElement.buffered;
      this.state.networkState = this.audioElement.networkState;
      this.state.readyState = this.audioElement.readyState;
      console.log('[AUDIO_SERVICE] Metadata loaded, duration:', this.state.duration);
    }
    this.notifyStateChange();
  };
  
  private handleLoadedData = (): void => {
    this.state.isLoading = false;
    this.notifyStateChange();
  };
  
  private handleCanPlay = (): void => {
    this.state.isLoading = false;
    this.notifyStateChange();
  };
  
  private handleCanPlayThrough = (): void => {
    this.state.isLoading = false;
    this.notifyStateChange();
  };
  
  private handlePlay = (): void => {
    this.state.isPlaying = true;
    this.notifyStateChange();
  };
  
  private handlePause = (): void => {
    this.state.isPlaying = false;
    this.notifyStateChange();
  };
  
  private handleEnded = (): void => {
    this.state.isPlaying = false;
    this.state.currentTime = 0;
    
    if (this.state.currentTrack) {
      this.trackAnalytics({
        trackId: this.state.currentTrack.id,
        trackTitle: this.state.currentTrack.title,
        eventType: 'complete',
        timestamp: new Date(),
        currentTime: this.state.duration,
        duration: this.state.duration,
        volume: this.state.volume,
        userAgent: navigator.userAgent,
        viewport: this.session.deviceInfo.viewport,
        deviceType: this.session.deviceInfo.deviceType,
        sessionId: this.session.id
      });
    }
    
    this.notifyStateChange();
  };
  
  private handleTimeUpdate = (): void => {
    if (this.audioElement) {
      this.state.currentTime = this.audioElement.currentTime;
      this.state.bufferedRanges = this.audioElement.buffered;
      this.updateBufferHealth();
      this.notifyProgressChange();
    }
  };
  
  private handleVolumeChange = (): void => {
    if (this.audioElement) {
      this.state.volume = this.audioElement.volume;
      this.state.isMuted = this.audioElement.muted;
    }
    this.notifyStateChange();
  };
  
  private handleAudioError = (event: Event): void => {
    const error = event.target as HTMLAudioElement;
    this.handleError({
      code: 'AUDIO_ERROR',
      message: `Audio error: ${error.error?.message || 'Unknown error'}`,
      details: error.error,
      timestamp: new Date(),
      ...(this.state.currentTrack?.id && { trackId: this.state.currentTrack.id })
    });
  };
  
  private handleWaiting = (): void => {
    this.state.isLoading = true;
    this.notifyStateChange();
  };
  
  private handleStalled = (): void => {
    this.state.isLoading = true;
    this.notifyStateChange();
  };
  
  private handleProgress = (): void => {
    if (this.audioElement) {
      this.state.bufferedRanges = this.audioElement.buffered;
      this.updateBufferHealth();
    }
    this.notifyStateChange();
  };
  
  /**
   * Destroy the service
   */
  public destroy(): void {
    if (this.isDestroyed) return;
    
    this.isDestroyed = true;
    
    // Flush analytics
    this.flushAnalytics();
    
    // Save settings
    this.saveSettings();
    
    // Clean up HLS
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }
    
    // Clean up audio
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    
    // Clean up audio context
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    // Clean up timers
    if (this.analyticsTimer) {
      clearInterval(this.analyticsTimer);
      this.analyticsTimer = null;
    }
    
    // Clear callbacks
    this.eventCallbacks = [];
    this.errorCallbacks = [];
    this.stateCallbacks = [];
    this.progressCallbacks = [];
    
    console.log('[AUDIO_SERVICE] Destroyed');
  }
}

// Export singleton instance - only create on client side
let audioServiceInstance: AudioService | null = null;

// Mock service for SSR
const createMockAudioService = (): AudioService => {
  return {
    loadTrack: () => Promise.resolve(),
    play: () => Promise.resolve(),
    pause: () => {},
    togglePlayPause: () => {},
    seek: () => {},
    setVolume: () => {},
    toggleMute: () => {},
    setPlaybackRate: () => {},
    toggleLoop: () => {},
    getState: () => ({
      currentTrack: null,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      isLoading: false,
      hasError: false,
      playbackRate: 1,
      isLooping: false,
      isShuffled: false,
      bufferedRanges: null,
      networkState: 0,
      readyState: 0
    }),
    getPerformanceMetrics: () => ({
      loadTime: 0,
      seekTime: 0,
      bufferHealth: 100,
      droppedFrames: 0,
      networkLatency: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      bitrate: 0,
      bandwidth: 0
    }),
    getSession: () => ({
      id: 'ssr-session',
      startTime: new Date(),
      tracksPlayed: [],
      totalPlayTime: 0,
      totalSeekTime: 0,
      volumeChanges: 0,
      errors: [],
      deviceInfo: {
        userAgent: 'ssr',
        viewport: { width: 1920, height: 1080 },
        deviceType: 'desktop' as const
      }
    }),
    getAnalyser: () => null,
    getAudioElement: () => null,
    onEvent: () => {},
    onError: () => {},
    onStateChange: () => {},
    onProgress: () => {},
    destroy: () => {}
  } as unknown as AudioService;
};

export const getAudioService = (): AudioService => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return createMockAudioService();
  }
  
  if (!audioServiceInstance) {
    try {
      audioServiceInstance = new AudioService();
    } catch (error) {
      console.warn('[AUDIO_SERVICE] Failed to create audio service, using mock:', error);
      return createMockAudioService();
    }
  }
  
  return audioServiceInstance;
};

// Export a function to get the audio service instead of creating it immediately
export const getAudioServiceInstance = () => getAudioService();
