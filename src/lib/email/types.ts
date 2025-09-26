/**
 * Enterprise Email Subscription System - Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the email subscription system.
 * It provides type safety and clear contracts for all email-related functionality.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

// ============================================================================
// CORE EMAIL TYPES
// ============================================================================

/**
 * Email subscription status enumeration
 * Tracks the current state of a user's email subscription
 */
export enum EmailSubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNSUBSCRIBED = 'unsubscribed',
  BOUNCED = 'bounced',
  COMPLAINED = 'complained',
  PENDING_VERIFICATION = 'pending_verification'
}

/**
 * Email frequency options for newsletter delivery
 * Allows users to control how often they receive emails
 */
export enum EmailFrequency {
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  MAJOR_UPDATES_ONLY = 'major_updates_only',
  DAILY = 'daily',
  NEVER = 'never'
}

/**
 * Content type preferences for email subscriptions
 * Users can choose which types of content they want to receive
 */
export interface ContentTypePreferences {
  albums: boolean;
  books: boolean;
  studio_updates: boolean;
  events: boolean;
  blog_posts: boolean;
  exclusive_content: boolean;
  merchandise: boolean;
  collaborations: boolean;
}

/**
 * Complete email preferences configuration
 * Comprehensive settings for email subscription management
 */
export interface EmailPreferences {
  frequency: EmailFrequency;
  content_types: ContentTypePreferences;
  timezone: string;
  language: string;
  digest_format: 'html' | 'text' | 'both';
  unsubscribe_all: boolean;
}

/**
 * User email subscription record
 * Complete profile of a user's email subscription
 */
export interface EmailSubscription {
  id: string;
  email: string;
  status: EmailSubscriptionStatus;
  preferences: EmailPreferences;
  created_at: Date;
  updated_at: Date;
  last_email_sent: Date | null;
  unsubscribe_token: string;
  verification_token: string;
  verification_expires: Date | null;
  ip_address: string;
  user_agent: string;
  source: string; // Where they subscribed from
  tags: string[]; // For segmentation
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Base API response structure
 * Standardized response format for all API endpoints
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
  request_id: string;
}

/**
 * Standardized API error structure
 * Consistent error reporting across all endpoints
 */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown> | undefined;
  field?: string | undefined;
}

/**
 * Subscription request payload
 * Data required to create a new email subscription
 */
export interface SubscriptionRequest {
  email: string;
  preferences?: Partial<EmailPreferences>;
  source?: string;
  tags?: string[];
  ip_address?: string;
  user_agent?: string;
}

/**
 * Unsubscription request payload
 * Data required to unsubscribe from emails
 */
export interface UnsubscriptionRequest {
  email: string;
  token: string;
  reason?: string | undefined;
  ip_address?: string | undefined;
  user_agent?: string | undefined;
}

/**
 * Preferences update request payload
 * Data required to update email preferences
 */
export interface PreferencesUpdateRequest {
  email: string;
  token: string;
  preferences: Partial<EmailPreferences>;
  ip_address?: string;
  user_agent?: string;
}

/**
 * Token validation request payload
 * Data required to validate security tokens
 */
export interface TokenValidationRequest {
  email: string;
  token: string;
  token_type: 'unsubscribe' | 'preferences' | 'verification';
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

/**
 * Email validation result
 * Result of email address validation
 */
export interface EmailValidationResult {
  is_valid: boolean;
  normalized_email: string;
  domain: string;
  suggestions?: string[];
  errors: string[];
}

/**
 * Token validation result
 * Result of security token validation
 */
export interface TokenValidationResult {
  is_valid: boolean;
  is_expired: boolean;
  token_type: string;
  expires_at: Date | null;
  errors: string[];
}

// ============================================================================
// EMAIL TEMPLATE TYPES
// ============================================================================

/**
 * Email template data structure
 * Data passed to email templates for rendering
 */
export interface EmailTemplateData {
  user: {
    email: string;
    name?: string;
    preferences: EmailPreferences;
  };
  unsubscribe_url: string;
  preferences_url: string;
  website_url: string;
  support_email: string;
  company_name: string;
  [key: string]: unknown; // Allow additional template-specific data
}

/**
 * Email template configuration
 * Configuration for email template rendering
 */
export interface EmailTemplateConfig {
  template_id: string;
  subject: string;
  data: EmailTemplateData;
  to: string;
  from: string;
  reply_to?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// ============================================================================
// AUDIT AND LOGGING TYPES
// ============================================================================

/**
 * Email action audit log entry
 * Records all email-related actions for compliance and debugging
 */
export interface EmailAuditLog {
  id: string;
  action: string;
  email: string;
  user_id?: string;
  ip_address: string;
  user_agent: string;
  timestamp: Date;
  details: Record<string, unknown>;
  success: boolean;
  error_message?: string;
}

/**
 * Email delivery status
 * Tracks the delivery status of sent emails
 */
export interface EmailDeliveryStatus {
  message_id: string;
  email: string;
  status: 'sent' | 'delivered' | 'bounced' | 'complained' | 'failed';
  timestamp: Date;
  provider_response?: string;
  error_message?: string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

/**
 * Email service configuration
 * Configuration for the email service
 */
export interface EmailServiceConfig {
  provider: 'resend' | 'sendgrid' | 'mailgun' | 'ses';
  api_key: string;
  from_email: string;
  from_name: string;
  reply_to_email: string;
  webhook_secret: string;
  rate_limits: {
    per_minute: number;
    per_hour: number;
    per_day: number;
  };
  retry_config: {
    max_retries: number;
    retry_delay_ms: number;
    backoff_multiplier: number;
  };
}

/**
 * Security configuration
 * Security settings for the email system
 */
export interface SecurityConfig {
  token_secret: string;
  token_expiry_hours: number;
  max_login_attempts: number;
  lockout_duration_minutes: number;
  require_verification: boolean;
  allowed_domains?: string[];
  blocked_domains?: string[];
}

// ============================================================================
// EMAIL PROVIDER TYPES
// ============================================================================

/**
 * Contact form data interface
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
}

/**
 * Newsletter signup data interface
 */
export interface NewsletterSignupData {
  email: string;
  name?: string;
  preferences?: string[];
  source?: string;
}

/**
 * Email template structure
 * Standard email template format
 */
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Email send result
 * Result of email sending operation
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string | undefined;
  error?: string | undefined;
  provider: string;
  duration: number;
  retries: number;
}

/**
 * Email provider configuration
 * Configuration for email providers
 */
export interface EmailProviderConfig {
  to: string[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
  headers?: Record<string, string>;
  metadata?: Record<string, unknown>;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Pagination parameters
 * Standard pagination for list endpoints
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

/**
 * Paginated response
 * Standard paginated response format
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

/**
 * Health check response
 * System health status
 */
export interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  version: string;
  services: {
    database: 'up' | 'down';
    email_provider: 'up' | 'down';
    redis: 'up' | 'down';
  };
  metrics: {
    total_subscribers: number;
    emails_sent_today: number;
    error_rate: number;
  };
}