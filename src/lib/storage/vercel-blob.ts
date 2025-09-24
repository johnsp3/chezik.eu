/**
 * Vercel Blob Storage Service
 * 
 * Enterprise-grade storage service using Vercel Blob for persistent data storage.
 * Provides secure, scalable storage for email subscriptions, analytics, and user data.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { put, del, list, head } from '@vercel/blob';
import type { EmailSubscription } from '@/lib/email/types';
import type { AudioAnalyticsEvent } from '@/types/audio';

// ============================================================================
// STORAGE CONFIGURATION
// ============================================================================

const BLOB_STORE_URL = process.env.BLOB_READ_WRITE_TOKEN ? 'https://api.vercel.com' : undefined;

// Storage paths
const STORAGE_PATHS = {
  EMAIL_SUBSCRIPTIONS: 'email/subscriptions',
  EMAIL_ANALYTICS: 'email/analytics',
  AUDIO_ANALYTICS: 'audio/analytics',
  USER_PREFERENCES: 'user/preferences',
  SYSTEM_LOGS: 'system/logs'
} as const;

// ============================================================================
// EMAIL SUBSCRIPTION STORAGE
// ============================================================================

/**
 * Store email subscription data
 */
export async function storeEmailSubscription(
  email: string, 
  subscription: EmailSubscription
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: true };
    }

    const path = `${STORAGE_PATHS.EMAIL_SUBSCRIPTIONS}/${email}.json`;
    const data = JSON.stringify(subscription, null, 2);
    
    await put(path, data, {
      access: 'public',
      addRandomSuffix: false
    });

    console.log(`[BLOB_STORAGE] Stored subscription for ${email}`);
    return { success: true };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to store subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Retrieve email subscription data
 */
export async function getEmailSubscription(
  email: string
): Promise<{ success: boolean; data?: EmailSubscription; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: false, error: 'No storage available' };
    }

    const path = `${STORAGE_PATHS.EMAIL_SUBSCRIPTIONS}/${email}.json`;
    
    // Check if file exists
    const headResult = await head(path);
    if (!headResult) {
      return { success: false, error: 'Subscription not found' };
    }

    // Fetch the data
    const response = await fetch(`https://blob.vercel-storage.com/${path}`);
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch subscription' };
    }

    const data = await response.json() as EmailSubscription;
    return { success: true, data };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to get subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete email subscription data
 */
export async function deleteEmailSubscription(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: true };
    }

    const path = `${STORAGE_PATHS.EMAIL_SUBSCRIPTIONS}/${email}.json`;
    await del(path);

    console.log(`[BLOB_STORAGE] Deleted subscription for ${email}`);
    return { success: true };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to delete subscription:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * List all email subscriptions
 */
export async function listEmailSubscriptions(): Promise<{
  success: boolean;
  data?: EmailSubscription[];
  error?: string;
}> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: false, error: 'No storage available' };
    }

    const { blobs } = await list({
      prefix: STORAGE_PATHS.EMAIL_SUBSCRIPTIONS,
      limit: 1000
    });

    const subscriptions: EmailSubscription[] = [];
    
    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url);
        if (response.ok) {
          const data = await response.json() as EmailSubscription;
          subscriptions.push(data);
        }
      } catch (error) {
        console.warn(`[BLOB_STORAGE] Failed to fetch subscription ${blob.pathname}:`, error);
      }
    }

    return { success: true, data: subscriptions };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to list subscriptions:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================================================
// ANALYTICS STORAGE
// ============================================================================

/**
 * Store audio analytics events
 */
export async function storeAudioAnalytics(
  events: AudioAnalyticsEvent[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: true };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${STORAGE_PATHS.AUDIO_ANALYTICS}/${timestamp}.json`;
    const data = JSON.stringify({
      events,
      timestamp: new Date(),
      count: events.length
    }, null, 2);
    
    await put(path, data, {
      access: 'public',
      addRandomSuffix: false
    });

    console.log(`[BLOB_STORAGE] Stored ${events.length} audio analytics events`);
    return { success: true };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to store audio analytics:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Store email analytics events
 */
export async function storeEmailAnalytics(
  events: Record<string, unknown>[]
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: true };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${STORAGE_PATHS.EMAIL_ANALYTICS}/${timestamp}.json`;
    const data = JSON.stringify({
      events,
      timestamp: new Date(),
      count: events.length
    }, null, 2);
    
    await put(path, data, {
      access: 'public',
      addRandomSuffix: false
    });

    console.log(`[BLOB_STORAGE] Stored ${events.length} email analytics events`);
    return { success: true };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to store email analytics:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================================================
// SYSTEM LOGS STORAGE
// ============================================================================

/**
 * Store system logs
 */
export async function storeSystemLog(
  level: 'info' | 'warn' | 'error',
  message: string,
  data?: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      console.warn('[BLOB_STORAGE] No blob token available, using fallback');
      return { success: true };
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${STORAGE_PATHS.SYSTEM_LOGS}/${level}/${timestamp}.json`;
    const logData = JSON.stringify({
      level,
      message,
      data,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development'
    }, null, 2);
    
    await put(path, logData, {
      access: 'public',
      addRandomSuffix: false
    });

    console.log(`[BLOB_STORAGE] Stored ${level} log: ${message}`);
    return { success: true };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to store system log:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if blob storage is available
 */
export function isBlobStorageAvailable(): boolean {
  return !!BLOB_STORE_URL;
}

/**
 * Get storage statistics
 */
export async function getStorageStats(): Promise<{
  success: boolean;
  data?: {
    emailSubscriptions: number;
    audioAnalytics: number;
    emailAnalytics: number;
    systemLogs: number;
  };
  error?: string;
}> {
  try {
    if (!BLOB_STORE_URL) {
      return { success: false, error: 'No storage available' };
    }

    const [emailSubs, audioAnalytics, emailAnalytics, systemLogs] = await Promise.all([
      list({ prefix: STORAGE_PATHS.EMAIL_SUBSCRIPTIONS, limit: 1 }),
      list({ prefix: STORAGE_PATHS.AUDIO_ANALYTICS, limit: 1 }),
      list({ prefix: STORAGE_PATHS.EMAIL_ANALYTICS, limit: 1 }),
      list({ prefix: STORAGE_PATHS.SYSTEM_LOGS, limit: 1 })
    ]);

    return {
      success: true,
      data: {
        emailSubscriptions: emailSubs.blobs.length,
        audioAnalytics: audioAnalytics.blobs.length,
        emailAnalytics: emailAnalytics.blobs.length,
        systemLogs: systemLogs.blobs.length
      }
    };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to get storage stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Clean up old data (keep last 30 days)
 */
export async function cleanupOldData(): Promise<{ success: boolean; error?: string }> {
  try {
    if (!BLOB_STORE_URL) {
      return { success: true };
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Clean up old analytics and logs
    const paths = [
      STORAGE_PATHS.AUDIO_ANALYTICS,
      STORAGE_PATHS.EMAIL_ANALYTICS,
      STORAGE_PATHS.SYSTEM_LOGS
    ];

    for (const path of paths) {
      const { blobs } = await list({ prefix: path, limit: 1000 });
      
      for (const blob of blobs) {
        if (blob.uploadedAt && new Date(blob.uploadedAt) < thirtyDaysAgo) {
          await del(blob.url);
          console.log(`[BLOB_STORAGE] Cleaned up old file: ${blob.pathname}`);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error('[BLOB_STORAGE] Failed to cleanup old data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
