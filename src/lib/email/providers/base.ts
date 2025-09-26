/**
 * Base Email Provider Interface
 * 
 * Defines the contract for all email providers in the system.
 * This allows for easy switching between different email services
 * and provides a consistent API across all providers.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import type { EmailTemplate, EmailSendResult, EmailProviderConfig } from '../types';

/**
 * Base email provider interface that all email providers must implement
 */
export interface EmailProvider {
  /**
   * Send an email using the provider
   * 
   * @param template - The email template to send
   * @param config - Provider-specific configuration
   * @returns Promise resolving to send result
   */
  send(template: EmailTemplate, config: EmailProviderConfig): Promise<EmailSendResult>;

  /**
   * Validate the provider configuration
   * 
   * @param config - Provider configuration to validate
   * @returns True if configuration is valid
   */
  validateConfig(config: EmailProviderConfig): boolean;

  /**
   * Get provider name for logging and identification
   * 
   * @returns Provider name
   */
  getProviderName(): string;

  /**
   * Check if provider is available/configured
   * 
   * @returns True if provider is available
   */
  isAvailable(): boolean;
}

/**
 * Email provider factory function type
 */
export type EmailProviderFactory = (config: EmailProviderConfig) => EmailProvider;

/**
 * Email provider registry for managing multiple providers
 */
export class EmailProviderRegistry {
  private providers = new Map<string, EmailProvider>();
  private defaultProvider: string | null = null;

  /**
   * Register an email provider
   * 
   * @param name - Provider name
   * @param provider - Provider instance
   * @param isDefault - Whether this should be the default provider
   */
  register(name: string, provider: EmailProvider, isDefault = false): void {
    this.providers.set(name, provider);
    if (isDefault) {
      this.defaultProvider = name;
    }
  }

  /**
   * Get a provider by name
   * 
   * @param name - Provider name
   * @returns Provider instance or null if not found
   */
  get(name: string): EmailProvider | null {
    return this.providers.get(name) || null;
  }

  /**
   * Get the default provider
   * 
   * @returns Default provider instance or null if not set
   */
  getDefault(): EmailProvider | null {
    return this.defaultProvider ? this.providers.get(this.defaultProvider) || null : null;
  }

  /**
   * Get all available providers
   * 
   * @returns Array of provider names
   */
  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys()).filter(name => {
      const provider = this.providers.get(name);
      return provider && provider.isAvailable();
    });
  }

  /**
   * Send email using specified provider or default
   * 
   * @param template - Email template
   * @param config - Provider configuration
   * @param providerName - Optional provider name (uses default if not specified)
   * @returns Promise resolving to send result
   */
  async send(
    template: EmailTemplate, 
    config: EmailProviderConfig, 
    providerName?: string
  ): Promise<EmailSendResult> {
    const provider = providerName ? this.get(providerName) : this.getDefault();
    
    if (!provider) {
      throw new Error(`Email provider not found: ${providerName || 'default'}`);
    }

    if (!provider.isAvailable()) {
      throw new Error(`Email provider not available: ${provider.getProviderName()}`);
    }

    return provider.send(template, config);
  }
}
