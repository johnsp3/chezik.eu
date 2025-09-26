/**
 * Resend Client Integration Tests
 * 
 * Comprehensive integration tests for the typed Resend API client.
 * Tests validation, error handling, and API interactions.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  TypedResendClient, 
  createResendClient, 
  createTestResendClient,
  SendEmailRequestSchema,
  ResendApiResponseSchema,
  type SendEmailRequest,
  type ResendClientConfig
} from '@/lib/api/resend-client';

// Mock Resend
const mockSend = vi.fn();
vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: {
      send: mockSend,
    },
  })),
}));

describe('TypedResendClient', () => {
  let client: TypedResendClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new TypedResendClient({
      apiKey: 'test-api-key',
      timeout: 5000,
      retries: 2,
    });
  });

  describe('Configuration', () => {
    it('should create client with valid configuration', () => {
      expect(client.isConfigured()).toBe(true);
      expect(client.getConfig().apiKey).toBe('test-api-key');
      expect(client.getConfig().timeout).toBe(5000);
      expect(client.getConfig().retries).toBe(2);
    });

    it('should detect unconfigured client', () => {
      const unconfiguredClient = new TypedResendClient({
        apiKey: '',
      });
      expect(unconfiguredClient.isConfigured()).toBe(false);
    });
  });

  describe('Request Validation', () => {
    it('should validate valid email request', () => {
      const validRequest: SendEmailRequest = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      };

      const result = client.validateEmailRequest(validRequest);
      expect(result.valid).toBe(true);
      expect(result.data).toEqual(validRequest);
      expect(result.errors).toBeUndefined();
    });

    it('should reject invalid email request with missing required fields', () => {
      const invalidRequest = {
        from: 'test@example.com',
        // Missing to, subject
      };

      const result = client.validateEmailRequest(invalidRequest);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors?.length).toBeGreaterThan(0);
    });

    it('should reject invalid email addresses', () => {
      const invalidRequest = {
        from: 'invalid-email',
        to: 'recipient@example.com',
        subject: 'Test Subject',
      };

      const result = client.validateEmailRequest(invalidRequest);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('from: Invalid email address');
    });

    it('should reject empty subject', () => {
      const invalidRequest = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: '',
      };

      const result = client.validateEmailRequest(invalidRequest);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('subject: Subject is required');
    });

    it('should reject subject that is too long', () => {
      const invalidRequest = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'a'.repeat(999), // Too long
      };

      const result = client.validateEmailRequest(invalidRequest);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('subject: Subject too long');
    });

    it('should accept array of recipients', () => {
      const validRequest: SendEmailRequest = {
        from: 'test@example.com',
        to: ['recipient1@example.com', 'recipient2@example.com'],
        subject: 'Test Subject',
      };

      const result = client.validateEmailRequest(validRequest);
      expect(result.valid).toBe(true);
    });

    it('should accept recipient objects with names', () => {
      const validRequest: SendEmailRequest = {
        from: 'test@example.com',
        to: [
          { email: 'recipient1@example.com', name: 'Recipient 1' },
          { email: 'recipient2@example.com', name: 'Recipient 2' },
        ],
        subject: 'Test Subject',
      };

      const result = client.validateEmailRequest(validRequest);
      expect(result.valid).toBe(true);
    });
  });

  describe('Email Sending', () => {
    it('should send email successfully', async () => {
      const mockResponse = {
        data: {
          id: 'test-message-id',
          from: 'test@example.com',
          to: ['recipient@example.com'],
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      mockSend.mockResolvedValue(mockResponse);

      const request: SendEmailRequest = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test HTML</p>',
        text: 'Test Text',
      };

      const result = await client.sendEmail(request);

      expect(result).toEqual(mockResponse.data);
      expect(mockSend).toHaveBeenCalledWith({
        ...request,
        to: [request.to], // Client transforms string to array
      });
    });

    it('should handle API errors', async () => {
      const mockError = {
        error: {
          name: 'validation_error',
          message: 'Invalid email address',
        },
      };

      mockSend.mockResolvedValue(mockError);

      const request: SendEmailRequest = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
      };

      await expect(client.sendEmail(request)).rejects.toThrow('Resend API error: Invalid email address');
    });

    it('should handle network errors', async () => {
      mockSend.mockRejectedValue(new Error('Network error'));

      const request: SendEmailRequest = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
      };

      await expect(client.sendEmail(request)).rejects.toThrow('Network error');
    });

    it('should validate request before sending', async () => {
      const invalidRequest = {
        from: 'invalid-email',
        to: 'recipient@example.com',
        subject: 'Test Subject',
      };

      await expect(client.sendEmail(invalidRequest as SendEmailRequest)).rejects.toThrow('Invalid email address');
      expect(mockSend).not.toHaveBeenCalled();
    });
  });

  describe('Schema Validation', () => {
    it('should validate SendEmailRequestSchema correctly', () => {
      const validData = {
        from: 'test@example.com',
        to: 'recipient@example.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        text: 'Test',
      };

      expect(() => SendEmailRequestSchema.parse(validData)).not.toThrow();
    });

    it('should reject invalid data in SendEmailRequestSchema', () => {
      const invalidData = {
        from: 'invalid-email',
        to: 'recipient@example.com',
        subject: '',
      };

      expect(() => SendEmailRequestSchema.parse(invalidData)).toThrow();
    });

    it('should validate ResendApiResponseSchema correctly', () => {
      const validResponse = {
        data: {
          id: 'test-id',
          from: 'test@example.com',
          to: ['recipient@example.com'],
          created_at: '2024-01-01T00:00:00Z',
        },
      };

      expect(() => ResendApiResponseSchema.parse(validResponse)).not.toThrow();
    });

    it('should validate error response in ResendApiResponseSchema', () => {
      const errorResponse = {
        error: {
          name: 'validation_error',
          message: 'Invalid email address',
        },
      };

      expect(() => ResendApiResponseSchema.parse(errorResponse)).not.toThrow();
    });
  });

  describe('Factory Functions', () => {
    it('should create client with environment variables', () => {
      const originalEnv = process.env.RESEND_API_KEY;
      process.env.RESEND_API_KEY = 'env-api-key';

      const client = createResendClient();
      expect(client.getConfig().apiKey).toBe('env-api-key');

      process.env.RESEND_API_KEY = originalEnv;
    });

    it('should create client with overrides', () => {
      const client = createResendClient({
        apiKey: 'override-api-key',
        timeout: 10000,
      });

      expect(client.getConfig().apiKey).toBe('override-api-key');
      expect(client.getConfig().timeout).toBe(10000);
    });

    it('should create test client', () => {
      const config: ResendClientConfig = {
        apiKey: 'test-api-key',
        timeout: 5000,
        retries: 1,
      };

      const client = createTestResendClient(config);
      expect(client.getConfig()).toEqual(config);
    });
  });
});
