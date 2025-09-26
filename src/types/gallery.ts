/**
 * Gallery System Types
 * 
 * Comprehensive type definitions for the photo gallery system.
 * Provides type safety and clear contracts for all gallery-related functionality.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

export interface Photo {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: PhotoCategory;
  tags: string[];
  date: string;
  location?: string;
  photographer?: string;
  color: string; // For gradient backgrounds
  aspectRatio: PhotoAspectRatio;
  fileSize?: number;
  dimensions?: {
    width: number;
    height: number;
  };
  metadata?: {
    camera?: string;
    lens?: string;
    settings?: string;
    edited?: boolean;
  };
}

export type PhotoCategory = 
  | 'studio' 
  | 'live' 
  | 'behind-scenes' 
  | 'personal' 
  | 'events' 
  | 'merchandise' 
  | 'collaborations';

export type PhotoAspectRatio = 
  | 'square' 
  | 'portrait' 
  | 'landscape' 
  | 'wide';

export interface GalleryFilter {
  category?: PhotoCategory;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface GalleryState {
  photos: Photo[];
  filteredPhotos: Photo[];
  selectedPhoto: Photo | null;
  isModalOpen: boolean;
  currentFilter: GalleryFilter;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
  page: number;
  hasMore: boolean;
}

export interface GalleryAnalyticsEvent {
  photoId: number;
  photoTitle: string;
  eventType: 'view' | 'download' | 'share' | 'filter' | 'search';
  timestamp: Date;
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  deviceType: 'mobile' | 'tablet' | 'desktop';
  sessionId: string;
  category?: PhotoCategory;
  tags?: string[];
}

export interface GalleryApiResponse<T = unknown> {
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
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface GalleryConfig {
  itemsPerPage: number;
  enableInfiniteScroll: boolean;
  enableLazyLoading: boolean;
  enableAnalytics: boolean;
  enableSharing: boolean;
  enableDownload: boolean;
  maxImageSize: number;
  thumbnailQuality: number;
  cacheStrategy: 'aggressive' | 'moderate' | 'minimal';
}

export interface PhotoModalProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PhotoCardProps {
  photo: Photo;
  onClick: (photo: Photo) => void;
  priority?: boolean;
}

export interface GalleryFiltersProps {
  currentFilter: GalleryFilter;
  onFilterChange: (filter: GalleryFilter) => void;
  availableCategories: PhotoCategory[];
  availableTags: string[];
}

export interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  onPageChange: (page: number) => void;
  onLoadMore: () => void;
  isLoading: boolean;
}

// Gallery performance metrics
export interface GalleryPerformanceMetrics {
  loadTime: number;
  imageLoadTime: number;
  thumbnailLoadTime: number;
  modalOpenTime: number;
  filterTime: number;
  searchTime: number;
  memoryUsage: number;
  cacheHitRate: number;
}

// Gallery error types
export interface GalleryError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
  photoId?: number;
  operation?: string;
}

// Gallery storage interface
export interface GalleryStorage {
  viewedPhotos: number[];
  favoritePhotos: number[];
  lastViewedCategory: PhotoCategory | null;
  lastSearchQuery: string;
  settings: {
    itemsPerPage: number;
    enableInfiniteScroll: boolean;
    enableLazyLoading: boolean;
    enableAnalytics: boolean;
  };
}

// Gallery callback types
export type GalleryEventCallback = (event: GalleryAnalyticsEvent) => void;
export type GalleryErrorCallback = (error: GalleryError) => void;
export type GalleryStateCallback = (state: GalleryState) => void;
export type GalleryFilterCallback = (filter: GalleryFilter) => void;

