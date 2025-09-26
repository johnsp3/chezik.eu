/**
 * Email Preferences Manager
 * 
 * Provides utilities for managing email preferences including loading, saving,
 * and validating user email preferences with proper error handling.
 * 
 * @fileoverview Email preferences management with API integration and validation
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 * 
 * @example
 * ```tsx
 * import { useEmailPreferences } from '@/lib/email/preferences-manager';
 * 
 * function PreferencesForm() {
 *   const { preferences, savePreferences, isLoading } = useEmailPreferences();
 *   
 *   return (
 *     <form onSubmit={savePreferences}>
 *       form content
 *     </form>
 *   );
 * }
 * ```
 */

import { useState, useCallback } from 'react';

/**
 * Email preferences configuration
 */
export interface EmailPreferences {
  /** Email frequency setting */
  readonly frequency: 'daily' | 'weekly' | 'monthly' | 'major_only';
  /** Content type preferences */
  readonly content_types: {
    readonly albums: boolean;
    readonly books: boolean;
    readonly studio_updates: boolean;
    readonly events: boolean;
    readonly blog_posts: boolean;
    readonly exclusive_content: boolean;
    readonly merchandise: boolean;
    readonly collaborations: boolean;
  };
  /** User's timezone */
  readonly timezone: string;
  /** Preferred language */
  readonly language: string;
  /** Email format preference */
  readonly digest_format: 'html' | 'text' | 'both';
  /** Whether to unsubscribe from all emails */
  readonly unsubscribe_all: boolean;
}

/**
 * API response for preferences operations
 */
export interface PreferencesApiResponse {
  /** Whether the operation was successful */
  readonly success: boolean;
  /** Response message */
  readonly message?: string;
  /** User preferences data */
  readonly preferences?: EmailPreferences;
  /** Error information */
  readonly error?: {
    readonly message: string;
    readonly code?: string;
  };
}

/**
 * Hook state for email preferences
 */
export interface EmailPreferencesState {
  /** Current preferences */
  readonly preferences: EmailPreferences;
  /** Loading state for API operations */
  readonly isLoading: boolean;
  /** Saving state for form submission */
  readonly isSaving: boolean;
  /** Current status of operations */
  readonly status: 'idle' | 'success' | 'error';
  /** Status message */
  readonly message: string;
}

/**
 * Hook return type for email preferences
 */
export interface EmailPreferencesReturn extends EmailPreferencesState {
  /** Load preferences from API */
  readonly loadPreferences: (email: string, token: string) => Promise<void>;
  /** Save preferences to API */
  readonly savePreferences: (email: string, token: string, preferences: EmailPreferences) => Promise<void>;
  /** Update a specific preference */
  readonly updatePreference: <K extends keyof EmailPreferences>(
    key: K,
    value: EmailPreferences[K]
  ) => void;
  /** Update content type preference */
  readonly updateContentType: (
    type: keyof EmailPreferences['content_types'],
    value: boolean
  ) => void;
  /** Reset status to idle */
  readonly resetStatus: () => void;
}

/**
 * Default email preferences
 */
export const DEFAULT_EMAIL_PREFERENCES: EmailPreferences = {
  frequency: 'weekly',
  content_types: {
    albums: true,
    books: true,
    studio_updates: true,
    events: true,
    blog_posts: true,
    exclusive_content: true,
    merchandise: false,
    collaborations: true,
  },
  timezone: 'America/New_York',
  language: 'en',
  digest_format: 'html',
  unsubscribe_all: false,
} as const;

/**
 * Content type configuration for preferences form
 */
export interface ContentTypeConfig {
  /** Unique key for the content type */
  readonly key: keyof EmailPreferences['content_types'];
  /** Display label */
  readonly label: string;
  /** Icon component name */
  readonly icon: string;
  /** CSS color class */
  readonly color: string;
}

/**
 * Available content types for email preferences
 */
export const CONTENT_TYPES: readonly ContentTypeConfig[] = [
  { key: 'albums', label: 'New Albums', icon: 'Music', color: 'text-blue-400' },
  { key: 'books', label: 'Book Updates', icon: 'BookOpen', color: 'text-green-400' },
  { key: 'studio_updates', label: 'Studio Sessions', icon: 'Camera', color: 'text-purple-400' },
  { key: 'events', label: 'Live Events', icon: 'Calendar', color: 'text-orange-400' },
  { key: 'blog_posts', label: 'Blog Posts', icon: 'FileText', color: 'text-indigo-400' },
  { key: 'exclusive_content', label: 'Exclusive Content', icon: 'Star', color: 'text-yellow-400' },
  { key: 'merchandise', label: 'Merchandise', icon: 'ShoppingBag', color: 'text-pink-400' },
  { key: 'collaborations', label: 'Collaborations', icon: 'Users', color: 'text-teal-400' },
] as const;

/**
 * Email frequency options
 */
export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily', desc: 'Get updates every day' },
  { value: 'weekly', label: 'Weekly', desc: 'Weekly digest (recommended)' },
  { value: 'monthly', label: 'Monthly', desc: 'Monthly summary' },
  { value: 'major_only', label: 'Major Updates Only', desc: 'Only important announcements' },
] as const;

/**
 * Email format options
 */
export const FORMAT_OPTIONS = [
  { value: 'html', label: 'HTML', desc: 'Rich formatting' },
  { value: 'text', label: 'Text Only', desc: 'Simple text' },
  { value: 'both', label: 'Both', desc: 'HTML with text fallback' },
] as const;

/**
 * Timezone options
 */
export const TIMEZONE_OPTIONS = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST)' },
] as const;

/**
 * Custom hook for managing email preferences
 * 
 * Provides state management and API integration for email preferences
 * with proper error handling and loading states.
 * 
 * @returns Object containing preferences state and management functions
 * 
 * @example
 * ```tsx
 * function PreferencesPage() {
 *   const { 
 *     preferences, 
 *     loadPreferences, 
 *     savePreferences, 
 *     updateContentType,
 *     isLoading,
 *     status 
 *   } = useEmailPreferences();
 *   
 *   return (
 *     <div>
 *       {isLoading ? 'Loading...' : 'Preferences loaded'}
 *       {status === 'success' && 'Saved successfully!'}
 *     </div>
 *   );
 * }
 * ```
 */
export function useEmailPreferences(): EmailPreferencesReturn {
  const [preferences, setPreferences] = useState<EmailPreferences>(DEFAULT_EMAIL_PREFERENCES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  /**
   * Load preferences from the API
   * 
   * @param email - User's email address
   * @param token - Authentication token
   * @throws {Error} When API request fails
   */
  const loadPreferences = useCallback(async (email: string, token: string): Promise<void> => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid email or token provided');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch(
        `/api/email/preferences?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
      );
      
      const result: PreferencesApiResponse = await response.json();
      
      if (response.ok && result.success) {
        setPreferences(result.preferences || DEFAULT_EMAIL_PREFERENCES);
        setStatus('success');
        setMessage('Preferences loaded successfully');
      } else {
        setStatus('error');
        setMessage(result.error?.message || 'Failed to load preferences');
      }
    } catch (error) {
      console.error('Load preferences error:', error);
      setStatus('error');
      setMessage('Failed to load preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Save preferences to the API
   * 
   * @param email - User's email address
   * @param token - Authentication token
   * @param preferences - Preferences to save
   * @throws {Error} When API request fails
   */
  const savePreferences = useCallback(async (
    email: string, 
    token: string, 
    preferences: EmailPreferences
  ): Promise<void> => {
    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid email or token provided');
      return;
    }

    setIsSaving(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/email/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          preferences
        })
      });

      const result: PreferencesApiResponse = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setMessage(result.message || 'Preferences saved successfully!');
      } else {
        setStatus('error');
        setMessage(result.error?.message || 'Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Save preferences error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again or contact support.');
    } finally {
      setIsSaving(false);
    }
  }, []);

  /**
   * Update a specific preference
   * 
   * @param key - Preference key to update
   * @param value - New value for the preference
   */
  const updatePreference = useCallback(<K extends keyof EmailPreferences>(
    key: K,
    value: EmailPreferences[K]
  ): void => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Update a content type preference
   * 
   * @param type - Content type to update
   * @param value - New boolean value
   */
  const updateContentType = useCallback((
    type: keyof EmailPreferences['content_types'],
    value: boolean
  ): void => {
    setPreferences(prev => ({
      ...prev,
      content_types: {
        ...prev.content_types,
        [type]: value
      }
    }));
  }, []);

  /**
   * Reset status to idle
   */
  const resetStatus = useCallback((): void => {
    setStatus('idle');
    setMessage('');
  }, []);

  return {
    preferences,
    isLoading,
    isSaving,
    status,
    message,
    loadPreferences,
    savePreferences,
    updatePreference,
    updateContentType,
    resetStatus,
  };
}
