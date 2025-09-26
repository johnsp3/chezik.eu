/**
 * Enterprise Email Service v2
 * 
 * Modern email service with provider abstraction, retry logic, idempotency,
 * and comprehensive telemetry. Supports multiple email providers with
 * automatic failover and detailed monitoring.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 */

import { EmailProviderRegistry } from './providers/base';
import { createResendProvider } from './providers/resend';
import { 
  withRetry, 
  withIdempotency, 
  withTelemetry, 
  generateIdempotencyKey,
  MemoryIdempotencyStore,
  ConsoleTelemetryCollector,
  type IdempotencyStore,
  type TelemetryCollector
} from './utils';
import { 
  generateContactConfirmationEmail,
  generateContactNotificationEmail,
  generateNewsletterWelcomeEmail
} from './templates';
import type { 
  EmailTemplate, 
  EmailProviderConfig, 
  EmailSendResult,
  ContactFormData,
  NewsletterSignupData
} from './types';

/**
 * Email service configuration
 */
export interface EmailServiceConfig {
  providers: {
    resend: {
      apiKey: string;
      fromEmail: string;
      replyTo?: string | undefined;
    };
  };
  retry: {
    maxRetries: number;
    timeout: number;
  };
  idempotency: {
    enabled: boolean;
    ttlMs: number;
  };
  telemetry: {
    enabled: boolean;
  };
}

/**
 * Enterprise Email Service v2
 */
export class EmailServiceV2 {
  private providerRegistry: EmailProviderRegistry;
  private idempotencyStore: IdempotencyStore;
  private telemetryCollector: TelemetryCollector;
  private config: EmailServiceConfig;

  constructor(config: EmailServiceConfig) {
    this.config = config;
    this.providerRegistry = new EmailProviderRegistry();
    this.idempotencyStore = new MemoryIdempotencyStore();
    this.telemetryCollector = new ConsoleTelemetryCollector();
    
    this.initializeProviders();
  }

  /**
   * Initialize email providers
   * 
   * @private
   */
  private initializeProviders(): void {
    // Register Resend provider
    const resendProvider = createResendProvider({
      apiKey: this.config.providers.resend.apiKey,
      fromEmail: this.config.providers.resend.fromEmail,
      replyTo: this.config.providers.resend.replyTo || undefined,
      retries: this.config.retry.maxRetries,
      timeout: this.config.retry.timeout,
    });

    this.providerRegistry.register('resend', resendProvider, true);
  }

  /**
   * Send contact confirmation email
   * 
   * @param data - Contact form data
   * @returns Promise resolving to send result
   */
  async sendContactConfirmation(data: ContactFormData): Promise<EmailSendResult> {
    const template = generateContactConfirmationEmail(data);
    const config: EmailProviderConfig = {
      to: [data.email],
      metadata: {
        type: 'contact_confirmation',
        contactId: data.email,
      },
    };

    return this.sendEmail(template, config, 'contact_confirmation');
  }

  /**
   * Send contact notification email
   * 
   * @param data - Contact form data
   * @returns Promise resolving to send result
   */
  async sendContactNotification(data: ContactFormData): Promise<EmailSendResult> {
    const template = generateContactNotificationEmail(data);
    const contactEmail = process.env.CONTACT_EMAIL || 'jchezik@gmail.com';
    
    const config: EmailProviderConfig = {
      to: [contactEmail],
      replyTo: data.email,
      metadata: {
        type: 'contact_notification',
        contactId: data.email,
      },
    };

    return this.sendEmail(template, config, 'contact_notification');
  }

  /**
   * Send newsletter welcome email
   * 
   * @param data - Newsletter signup data
   * @returns Promise resolving to send result
   */
  async sendNewsletterWelcome(data: NewsletterSignupData): Promise<EmailSendResult> {
    const template = generateNewsletterWelcomeEmail(data);
    const config: EmailProviderConfig = {
      to: [data.email],
      metadata: {
        type: 'newsletter_welcome',
        subscriberId: data.email,
        source: data.source,
      },
    };

    return this.sendEmail(template, config, 'newsletter_welcome');
  }

  /**
   * Send newsletter notification email
   * 
   * @param data - Newsletter signup data
   * @returns Promise resolving to send result
   */
  async sendNewsletterNotification(data: NewsletterSignupData): Promise<EmailSendResult> {
    const template: EmailTemplate = {
      subject: `New Newsletter Subscription: ${data.email}`,
      html: `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Name:</strong> ${data.name || 'Not provided'}</p>
        <p><strong>Source:</strong> ${data.source || 'Website'}</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      `,
      text: `
        New Newsletter Subscription
        Email: ${data.email}
        Name: ${data.name || 'Not provided'}
        Source: ${data.source || 'Website'}
        Timestamp: ${new Date().toLocaleString()}
      `,
    };

    const contactEmail = process.env.CONTACT_EMAIL || 'jchezik@gmail.com';
    const config: EmailProviderConfig = {
      to: [contactEmail],
      metadata: {
        type: 'newsletter_notification',
        subscriberId: data.email,
        source: data.source,
      },
    };

    return this.sendEmail(template, config, 'newsletter_notification');
  }

  /**
   * Send email with comprehensive error handling and monitoring
   * 
   * @param template - Email template
   * @param config - Provider configuration
   * @param operation - Operation name for telemetry
   * @returns Promise resolving to send result
   */
  private async sendEmail(
    template: EmailTemplate,
    config: EmailProviderConfig,
    operation: string
  ): Promise<EmailSendResult> {
    const idempotencyKey = generateIdempotencyKey(operation, {
      to: config.to,
      subject: template.subject,
      ...config.metadata,
    });

    const sendWithRetry = () => withRetry(
      () => this.providerRegistry.send(template, config),
      {
        maxRetries: this.config.retry.maxRetries,
        baseDelay: 1000,
        maxDelay: 10000,
        backoffMultiplier: 2,
      }
    );

    const sendWithTelemetry = () => withTelemetry(
      sendWithRetry,
      operation,
      'resend', // Default provider
      this.telemetryCollector
    );

    if (this.config.idempotency.enabled) {
      return withIdempotency(
        sendWithTelemetry,
        idempotencyKey,
        this.idempotencyStore,
        this.config.idempotency.ttlMs
      );
    }

    return sendWithTelemetry();
  }

  /**
   * Get available providers
   * 
   * @returns Array of available provider names
   */
  getAvailableProviders(): string[] {
    return this.providerRegistry.getAvailableProviders();
  }

  /**
   * Get service health status
   * 
   * @returns Health status object
   */
  getHealthStatus(): {
    status: 'healthy' | 'degraded' | 'unhealthy';
    providers: Record<string, boolean>;
    timestamp: string;
  } {
    const providers = this.getAvailableProviders();
    const providerStatus: Record<string, boolean> = {};
    
    for (const providerName of providers) {
      const provider = this.providerRegistry.get(providerName);
      providerStatus[providerName] = provider?.isAvailable() || false;
    }

    const healthyProviders = Object.values(providerStatus).filter(Boolean).length;
    const totalProviders = Object.keys(providerStatus).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyProviders === totalProviders) {
      status = 'healthy';
    } else if (healthyProviders > 0) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      providers: providerStatus,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Create email service instance with default configuration
 * 
 * @returns Email service instance
 */
export function createEmailService(): EmailServiceV2 {
  const config: EmailServiceConfig = {
      providers: {
        resend: {
          apiKey: process.env.RESEND_API_KEY || '',
          fromEmail: process.env.FROM_EMAIL || 'noreply@chezik.eu',
          replyTo: process.env.CONTACT_EMAIL || undefined,
        },
      },
    retry: {
      maxRetries: 3,
      timeout: 30000,
    },
    idempotency: {
      enabled: true,
      ttlMs: 3600000, // 1 hour
    },
    telemetry: {
      enabled: true,
    },
  };

  return new EmailServiceV2(config);
}
