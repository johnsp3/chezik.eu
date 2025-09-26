/**
 * Typed Resend API Client
 * 
 * Provides a fully typed client for the Resend email API with
 * comprehensive validation using Zod schemas and error handling.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { z } from 'zod';
import { Resend } from 'resend';

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

/**
 * Email address validation schema
 */
export const EmailAddressSchema = z.string().email('Invalid email address');

/**
 * Email recipient schema
 */
export const EmailRecipientSchema = z.object({
  email: EmailAddressSchema,
  name: z.string().optional(),
});

/**
 * Email attachment schema
 */
export const EmailAttachmentSchema = z.object({
  filename: z.string(),
  content: z.string(), // Base64 encoded
  path: z.string().optional(),
});

/**
 * Email headers schema
 */
export const EmailHeadersSchema = z.record(z.string(), z.string()).optional();

/**
 * Send email request schema
 */
export const SendEmailRequestSchema = z.object({
  from: EmailAddressSchema,
  to: z.union([
    EmailAddressSchema,
    z.array(EmailAddressSchema),
    z.array(EmailRecipientSchema),
  ]),
  cc: z.union([
    EmailAddressSchema,
    z.array(EmailAddressSchema),
    z.array(EmailRecipientSchema),
  ]).optional(),
  bcc: z.union([
    EmailAddressSchema,
    z.array(EmailAddressSchema),
    z.array(EmailRecipientSchema),
  ]).optional(),
  reply_to: EmailAddressSchema.optional(),
  subject: z.string().min(1, 'Subject is required').max(998, 'Subject too long'),
  html: z.string().optional(),
  text: z.string().optional(),
  attachments: z.array(EmailAttachmentSchema).optional(),
  tags: z.array(z.object({
    name: z.string(),
    value: z.string(),
  })).optional(),
  headers: EmailHeadersSchema,
});

/**
 * Send email response schema
 */
export const SendEmailResponseSchema = z.object({
  id: z.string(),
  from: EmailAddressSchema,
  to: z.array(EmailAddressSchema),
  created_at: z.string(),
});

/**
 * Resend error schema
 */
export const ResendErrorSchema = z.object({
  name: z.string(),
  message: z.string(),
});

/**
 * Resend API response schema
 */
export const ResendApiResponseSchema = z.object({
  data: SendEmailResponseSchema.optional(),
  error: ResendErrorSchema.optional(),
});

// ============================================================================
// TYPES
// ============================================================================

export type EmailAddress = z.infer<typeof EmailAddressSchema>;
export type EmailRecipient = z.infer<typeof EmailRecipientSchema>;
export type EmailAttachment = z.infer<typeof EmailAttachmentSchema>;
export type EmailHeaders = z.infer<typeof EmailHeadersSchema>;
export type SendEmailRequest = z.infer<typeof SendEmailRequestSchema>;
export type SendEmailResponse = z.infer<typeof SendEmailResponseSchema>;
export type ResendError = z.infer<typeof ResendErrorSchema>;
export type ResendApiResponse = z.infer<typeof ResendApiResponseSchema>;

// ============================================================================
// CLIENT CONFIGURATION
// ============================================================================

export interface ResendClientConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
  retries?: number;
}

// ============================================================================
// TYPED RESEND CLIENT
// ============================================================================

export class TypedResendClient {
  private resend: Resend;
  private config: ResendClientConfig;

  constructor(config: ResendClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      ...config,
    };

    this.resend = new Resend(this.config.apiKey);
  }

  /**
   * Send an email with full type safety and validation
   * 
   * @param request - Email request data
   * @returns Promise resolving to validated response
   * @throws ValidationError if request is invalid
   * @throws ResendError if API call fails
   */
  async sendEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    // Validate request data
    const validatedRequest = SendEmailRequestSchema.parse(request);

    try {
      // Make API call - Resend expects specific format
      const resendRequest: Record<string, unknown> = {
        from: validatedRequest.from,
        to: Array.isArray(validatedRequest.to) ? validatedRequest.to : [validatedRequest.to],
        subject: validatedRequest.subject,
      };
      
      if (validatedRequest.html) {
        resendRequest.html = validatedRequest.html;
      }
      if (validatedRequest.text) {
        resendRequest.text = validatedRequest.text;
      }
      if (validatedRequest.cc) {
        resendRequest.cc = validatedRequest.cc;
      }
      if (validatedRequest.bcc) {
        resendRequest.bcc = validatedRequest.bcc;
      }
      if (validatedRequest.reply_to) {
        resendRequest.reply_to = validatedRequest.reply_to;
      }
      if (validatedRequest.headers) {
        resendRequest.headers = validatedRequest.headers;
      }
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await this.resend.emails.send(resendRequest as any);

      // Validate response
      const validatedResponse = ResendApiResponseSchema.parse(response);

      if (validatedResponse.error) {
        throw new Error(`Resend API error: ${validatedResponse.error.message}`);
      }

      if (!validatedResponse.data) {
        throw new Error('No data returned from Resend API');
      }

      return validatedResponse.data;
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Validation error: ${error.issues.map(e => e.message).join(', ')}`);
      }
      throw error;
    }
  }

  /**
   * Validate email request without sending
   * 
   * @param request - Email request data to validate
   * @returns Validation result
   */
  validateEmailRequest(request: unknown): {
    valid: boolean;
    data?: SendEmailRequest;
    errors?: string[];
  } {
    try {
      const validatedData = SendEmailRequestSchema.parse(request);
      return {
        valid: true,
        data: validatedData,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return {
          valid: false,
          errors: error.issues.map(e => `${e.path.join('.')}: ${e.message}`),
        };
      }
      return {
        valid: false,
        errors: ['Unknown validation error'],
      };
    }
  }

  /**
   * Get client configuration
   * 
   * @returns Client configuration
   */
  getConfig(): ResendClientConfig {
    return { ...this.config };
  }

  /**
   * Check if client is properly configured
   * 
   * @returns True if client is configured
   */
  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiKey.length > 0);
  }
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a typed Resend client with environment configuration
 * 
 * @param overrides - Optional configuration overrides
 * @returns Typed Resend client instance
 */
export function createResendClient(overrides: Partial<ResendClientConfig> = {}): TypedResendClient {
  const config: ResendClientConfig = {
    apiKey: process.env.RESEND_API_KEY || '',
    baseUrl: 'https://api.resend.com',
    timeout: 30000,
    retries: 3,
    ...overrides,
  };

  return new TypedResendClient(config);
}

/**
 * Create a typed Resend client for testing
 * 
 * @param config - Test configuration
 * @returns Typed Resend client instance
 */
export function createTestResendClient(config: ResendClientConfig): TypedResendClient {
  return new TypedResendClient(config);
}
