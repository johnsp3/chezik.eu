/**
 * Offline Page Component
 * 
 * Displays when the user is offline and cached content is not available.
 * Provides offline detection, retry functionality, and cached content preview
 * with connection tips and status indicators.
 * 
 * @fileoverview Offline page with real-time connection status and retry functionality
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // This page is automatically shown when offline
 * export default function OfflinePage() {
 *   return <div>Offline content</div>;
 * }
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages}
 */

'use client';

import React from 'react';
import { Wifi, WifiOff, RefreshCw, Home, Music, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useOnlineStatus } from '@/lib/hooks/use-online-status';

/**
 * Offline page component with connection status detection
 * 
 * Renders offline page with real-time connection status, retry functionality,
 * cached content preview, and connection tips.
 * 
 * @returns JSX element representing the offline page
 * 
 * @example
 * ```tsx
 * <OfflinePage />
 * ```
 */
export default function OfflinePage() {
  // Use custom hook for online status detection
  const { isOnline, retryCount, handleRetry } = useOnlineStatus({
    maxRetries: 3,
    autoRetryOnReconnect: false,
  });

  /**
   * Navigate to homepage
   */
  const handleGoHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return (
    <div className="offline-page">
      <div className="offline-container">
        <div className="offline-content">
          {/* Status Icon */}
          <div className="offline-icon">
            {isOnline ? (
              <Wifi size={64} className="online-icon" />
            ) : (
              <WifiOff size={64} className="offline-icon" />
            )}
          </div>

          {/* Main Message */}
          <div className="offline-message">
            <h1>
              {isOnline ? 'Connection Restored!' : 'You\'re Offline'}
            </h1>
            <p>
              {isOnline 
                ? 'Great! Your connection is back. You can now browse the full site.'
                : 'It looks like you\'re not connected to the internet. Don\'t worry - you can still explore some of John\'s work!'
              }
            </p>
          </div>

          {/* Quick Actions */}
          <div className="offline-actions">
            {isOnline ? (
              <button 
                className="btn btn-primary"
                onClick={handleGoHome}
              >
                <Home size={20} />
                Go to Homepage
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-primary"
                  onClick={handleRetry}
                  disabled={retryCount >= 3}
                >
                  <RefreshCw size={20} />
                  Try Again {retryCount > 0 && `(${retryCount}/3)`}
                </button>
                
                <Link href="/" className="btn btn-secondary">
                  <Home size={20} />
                  Go to Homepage
                </Link>
              </>
            )}
          </div>

          {/* Cached Content Preview */}
          {!isOnline && (
            <div className="cached-content">
              <h3>Available Offline</h3>
              <div className="cached-items">
                <div className="cached-item">
                  <Music size={24} />
                  <div>
                    <h4>Music Albums</h4>
                    <p>Listen to John&apos;s latest tracks</p>
                  </div>
                </div>
                
                <div className="cached-item">
                  <BookOpen size={24} />
                  <div>
                    <h4>Books</h4>
                    <p>Explore John&apos;s published works</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Connection Tips */}
          {!isOnline && (
            <div className="connection-tips">
              <h4>Connection Tips</h4>
              <ul>
                <li>Check your Wi-Fi or mobile data connection</li>
                <li>Try moving to a different location</li>
                <li>Restart your router or mobile data</li>
                <li>Some content is available offline - try browsing!</li>
              </ul>
            </div>
          )}

          {/* Status Indicator */}
          <div className="connection-status">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`} suppressHydrationWarning>
              <div className="status-dot"></div>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
