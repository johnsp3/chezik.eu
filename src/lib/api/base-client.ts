/**
 * Base API Client
 * 
 * Provides a foundation for typed API clients with common functionality
 * including retry logic, timeout handling, and error management.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import { z } from 'zod';

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base API client configuration
 */
export interface BaseClientConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

/**
 * API request options
 */
export interface ApiRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string>;
  requestId: string;
}

/**
 * API error
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
    public requestId?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ============================================================================
// BASE API CLIENT
// ============================================================================

export abstract class BaseApiClient {
  protected config: BaseClientConfig;

  constructor(config: BaseClientConfig) {
    this.config = {
      timeout: 30000,
      retries: 3,
      headers: {},
      ...config,
    };
  }

  /**
   * Make an API request with retry logic and timeout
   * 
   * @param options - Request options
   * @returns Promise resolving to API response
   */
  protected async request<T>(options: ApiRequestOptions): Promise<ApiResponse<T>> {
    const requestId = this.generateRequestId();
    const url = `${this.config.baseUrl}${options.path}`;
    
    const requestHeaders = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...this.config.headers,
      ...options.headers,
    };

    const requestOptions: RequestInit = {
      method: options.method,
      headers: requestHeaders,
      signal: AbortSignal.timeout(options.timeout || this.config.timeout!),
    };

    if (options.body && options.method !== 'GET') {
      requestOptions.body = JSON.stringify(options.body);
    }

    let lastError: Error;

    for (let attempt = 0; attempt <= this.config.retries!; attempt++) {
      try {
        const response = await fetch(url, requestOptions);
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new ApiError(
            `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            errorText,
            requestId
          );
        }

        const data = await response.json();
        
        return {
          data,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          requestId,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on the last attempt
        if (attempt === this.config.retries!) {
          break;
        }

        // Don't retry on client errors (4xx)
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          break;
        }

        // Wait before retrying
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw lastError!;
  }

  /**
   * Validate data against a Zod schema
   * 
   * @param schema - Zod schema to validate against
   * @param data - Data to validate
   * @returns Validated data
   * @throws Error if validation fails
   */
  protected validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new Error(`Validation error: ${errorMessage}`);
      }
      throw error;
    }
  }

  /**
   * Generate a unique request ID
   * 
   * @returns Unique request ID
   */
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Delay execution for a specified number of milliseconds
   * 
   * @param ms - Milliseconds to delay
   * @returns Promise that resolves after the delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get client configuration
   * 
   * @returns Client configuration
   */
  getConfig(): BaseClientConfig {
    return { ...this.config };
  }

  /**
   * Check if client is properly configured
   * 
   * @returns True if client is configured
   */
  isConfigured(): boolean {
    return !!(this.config.baseUrl && this.config.baseUrl.length > 0);
  }
}
