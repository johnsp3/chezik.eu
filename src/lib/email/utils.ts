/**
 * Email Utility Functions
 * 
 * Provides retry logic, timeout handling, idempotency, and telemetry
 * for email operations.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

/**
 * Default retry configuration
 */
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
};

/**
 * Execute a function with retry logic
 * 
 * @param fn - Function to execute
 * @param config - Retry configuration
 * @returns Promise resolving to function result
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: Error;

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on the last attempt
      if (attempt === retryConfig.maxRetries) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, attempt),
        retryConfig.maxDelay
      );

      // Log retry attempt
      console.warn(`[EMAIL_RETRY] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, lastError.message);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}

/**
 * Execute a function with timeout
 * 
 * @param fn - Function to execute
 * @param timeoutMs - Timeout in milliseconds
 * @returns Promise resolving to function result
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    fn()
      .then(result => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

/**
 * Idempotency key generator
 * 
 * @param operation - Operation type
 * @param data - Operation data
 * @returns Unique idempotency key
 */
export function generateIdempotencyKey(operation: string, data: Record<string, unknown>): string {
  const dataString = JSON.stringify(data, Object.keys(data).sort());
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(dataString).digest('hex');
  return `${operation}_${hash.substring(0, 16)}`;
}

/**
 * Idempotency store interface
 */
export interface IdempotencyStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlMs: number): Promise<void>;
}

/**
 * In-memory idempotency store (for development)
 */
export class MemoryIdempotencyStore implements IdempotencyStore {
  private store = new Map<string, { value: string; expires: number }>();

  async get(key: string): Promise<string | null> {
    const entry = this.store.get(key);
    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expires) {
      this.store.delete(key);
      return null;
    }

    return entry.value;
  }

  async set(key: string, value: string, ttlMs: number): Promise<void> {
    this.store.set(key, {
      value,
      expires: Date.now() + ttlMs,
    });
  }
}

/**
 * Execute a function with idempotency
 * 
 * @param fn - Function to execute
 * @param key - Idempotency key
 * @param store - Idempotency store
 * @param ttlMs - Time-to-live in milliseconds
 * @returns Promise resolving to function result
 */
export async function withIdempotency<T>(
  fn: () => Promise<T>,
  key: string,
  store: IdempotencyStore,
  ttlMs: number = 3600000 // 1 hour
): Promise<T> {
  // Check if we've already processed this request
  const existingResult = await store.get(key);
  if (existingResult) {
    console.log(`[EMAIL_IDEMPOTENCY] Returning cached result for key: ${key}`);
    return JSON.parse(existingResult);
  }

  // Execute the function
  const result = await fn();

  // Store the result for future idempotent requests
  await store.set(key, JSON.stringify(result), ttlMs);

  return result;
}

/**
 * Telemetry data interface
 */
export interface TelemetryData {
  operation: string;
  provider: string;
  duration: number;
  success: boolean;
  error?: string | undefined;
  retries?: number | undefined;
  timestamp: number;
}

/**
 * Telemetry collector interface
 */
export interface TelemetryCollector {
  collect(data: TelemetryData): Promise<void>;
}

/**
 * Console telemetry collector (for development)
 */
export class ConsoleTelemetryCollector implements TelemetryCollector {
  async collect(data: TelemetryData): Promise<void> {
    const message = `[EMAIL_TELEMETRY] ${data.operation} via ${data.provider} - ${data.duration}ms - ${data.success ? 'SUCCESS' : 'FAILED'}`;
    
    if (data.success) {
      console.log(message);
    } else {
      console.error(message, { error: data.error, retries: data.retries });
    }
  }
}

/**
 * Execute a function with telemetry collection
 * 
 * @param fn - Function to execute
 * @param operation - Operation name
 * @param provider - Provider name
 * @param collector - Telemetry collector
 * @returns Promise resolving to function result
 */
export async function withTelemetry<T>(
  fn: () => Promise<T>,
  operation: string,
  provider: string,
  collector: TelemetryCollector
): Promise<T> {
  const startTime = Date.now();
  let success = false;
  let error: string | undefined;
  let retries: number | undefined;

  try {
    const result = await fn();
    success = true;
    return result;
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
    throw err;
  } finally {
    const duration = Date.now() - startTime;
    
    await collector.collect({
      operation,
      provider,
      duration,
      success,
      error,
      retries,
      timestamp: Date.now(),
    });
  }
}
