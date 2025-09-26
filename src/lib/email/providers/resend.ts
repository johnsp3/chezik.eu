/**
 * Resend Email Provider Implementation
 * 
 * Implements the EmailProvider interface for Resend email service.
 * Includes retry logic, timeout handling, and comprehensive error handling.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { Resend } from 'resend';
import type { EmailTemplate, EmailSendResult, EmailProviderConfig } from '../types';
import type { EmailProvider } from './base';
import { withRetry, withTimeout } from '../utils';

/**
 * Resend-specific configuration
 */
export interface ResendConfig {
  apiKey: string;
  fromEmail: string;
  replyTo?: string | undefined;
  retries?: number;
  timeout?: number;
}

/**
 * Resend email provider implementation
 */
export class ResendProvider implements EmailProvider {
  private resend: Resend;
  private config: ResendConfig;

  constructor(config: ResendConfig) {
    this.config = {
      retries: 3,
      timeout: 30000, // 30 seconds
      ...config,
    };
    
    this.resend = new Resend(this.config.apiKey);
  }

  /**
   * Send an email using Resend
   * 
   * @param template - The email template to send
   * @param config - Provider-specific configuration
   * @returns Promise resolving to send result
   */
  async send(template: EmailTemplate, config: EmailProviderConfig): Promise<EmailSendResult> {
    const startTime = Date.now();
    
    try {
      // Validate configuration
      if (!this.validateConfig(config)) {
        throw new Error('Invalid Resend configuration');
      }

      // Prepare email data
      const emailData = {
        from: this.config.fromEmail,
        to: config.to,
        subject: template.subject,
        html: template.html,
        text: template.text,
        replyTo: this.config.replyTo,
        headers: {
          'X-Mailer': 'John Chezik Website',
          'X-Priority': '3',
          'X-MSMail-Priority': 'Normal',
          'Importance': 'Normal',
          'X-Provider': 'Resend',
          'X-Request-ID': this.generateRequestId(),
        },
      };

      // Send with retry and timeout
      const result = await withRetry(
        () => withTimeout(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          () => this.resend.emails.send(emailData as any),
          this.config.timeout!
        ),
        { maxRetries: this.config.retries! }
      );

      const duration = Date.now() - startTime;

      if (result.error) {
        return {
          success: false,
          messageId: undefined,
          error: result.error.message,
          provider: 'resend',
          duration,
          retries: 0, // Will be tracked by withRetry
        };
      }

      return {
        success: true,
        messageId: result.data?.id,
        error: undefined,
        provider: 'resend',
        duration,
        retries: 0, // Will be tracked by withRetry
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        success: false,
        messageId: undefined,
        error: error instanceof Error ? error.message : 'Unknown error',
        provider: 'resend',
        duration,
        retries: 0, // Will be tracked by withRetry
      };
    }
  }

  /**
   * Validate the Resend configuration
   * 
   * @param config - Provider configuration to validate
   * @returns True if configuration is valid
   */
  validateConfig(config: EmailProviderConfig): boolean {
    if (!this.config.apiKey || typeof this.config.apiKey !== 'string') {
      return false;
    }

    if (!this.config.fromEmail || typeof this.config.fromEmail !== 'string') {
      return false;
    }

    if (!config.to || !Array.isArray(config.to) || config.to.length === 0) {
      return false;
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of config.to) {
      if (!emailRegex.test(email)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get provider name for logging and identification
   * 
   * @returns Provider name
   */
  getProviderName(): string {
    return 'resend';
  }

  /**
   * Check if Resend provider is available/configured
   * 
   * @returns True if provider is available
   */
  isAvailable(): boolean {
    return !!(this.config.apiKey && this.config.fromEmail);
  }

  /**
   * Generate a unique request ID for tracking
   * 
   * @returns Unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Create a Resend provider instance
 * 
 * @param config - Resend configuration
 * @returns Resend provider instance
 */
export function createResendProvider(config: ResendConfig): ResendProvider {
  return new ResendProvider(config);
}
