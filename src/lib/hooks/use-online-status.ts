/**
 * Online Status Hook
 * 
 * Custom React hook for detecting online/offline status and managing
 * connection state with automatic cleanup and retry functionality.
 * 
 * @fileoverview Reusable hook for online/offline detection with event handling
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 * 
 * @example
 * ```tsx
 * import { useOnlineStatus } from '@/lib/hooks/use-online-status';
 * 
 * function MyComponent() {
 *   const { isOnline, retryCount, handleRetry } = useOnlineStatus();
 *   
 *   return (
 *     <div>
 *       Status: {isOnline ? 'Online' : 'Offline'}
 *       <button onClick={handleRetry}>Retry</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Configuration options for the online status hook
 */
export interface OnlineStatusOptions {
  /** Maximum number of retry attempts */
  readonly maxRetries?: number;
  /** Whether to automatically retry when coming back online */
  readonly autoRetryOnReconnect?: boolean;
}

/**
 * Return type for the online status hook
 */
export interface OnlineStatusReturn {
  /** Current online status */
  readonly isOnline: boolean;
  /** Number of retry attempts made */
  readonly retryCount: number;
  /** Function to manually retry connection */
  readonly handleRetry: () => void;
  /** Function to reset retry count */
  readonly resetRetryCount: () => void;
}

/**
 * Default options for online status detection
 */
const DEFAULT_OPTIONS: Required<OnlineStatusOptions> = {
  maxRetries: 3,
  autoRetryOnReconnect: false,
} as const;

/**
 * Custom hook for online/offline status detection
 * 
 * Provides real-time online/offline status detection with retry functionality
 * and automatic cleanup of event listeners.
 * 
 * @param options - Configuration options for the hook
 * @returns Object containing online status and retry functionality
 * 
 * @example
 * ```tsx
 * function OfflinePage() {
 *   const { isOnline, retryCount, handleRetry } = useOnlineStatus({
 *     maxRetries: 5,
 *     autoRetryOnReconnect: true
 *   });
 *   
 *   return (
 *     <div>
 *       {isOnline ? 'Connected' : 'Offline'}
 *       <button onClick={handleRetry} disabled={retryCount >= 5}>
 *         Retry ({retryCount}/5)
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOnlineStatus(
  options: OnlineStatusOptions = {}
): OnlineStatusReturn {
  // Merge options with defaults
  const config = { ...DEFAULT_OPTIONS, ...options };
  
  // State for online status and retry count
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined' && 'navigator' in window) {
      return navigator.onLine ?? false;
    }
    return false;
  });
  
  const [retryCount, setRetryCount] = useState<number>(0);

  // Handle online event
  const handleOnline = useCallback(() => {
    setIsOnline(true);
    if (config.autoRetryOnReconnect) {
      setRetryCount(0);
    }
  }, [config.autoRetryOnReconnect]);

  // Handle offline event
  const handleOffline = useCallback(() => {
    setIsOnline(false);
  }, []);

  // Manual retry function
  const handleRetry = useCallback(() => {
    if (retryCount < config.maxRetries) {
      setRetryCount(prev => prev + 1);
      // Reload the page to attempt reconnection
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    }
  }, [retryCount, config.maxRetries]);

  // Reset retry count
  const resetRetryCount = useCallback(() => {
    setRetryCount(0);
  }, []);

  // Set up event listeners
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') {
      return;
    }

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup function
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOnline, handleOffline]);

  return {
    isOnline,
    retryCount,
    handleRetry,
    resetRetryCount,
  };
}
