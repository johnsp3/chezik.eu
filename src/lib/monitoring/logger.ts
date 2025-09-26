/**
 * Enterprise Logger with PII Redaction and Structured Logging
 * 
 * Provides consistent logging across the application with automatic PII redaction,
 * structured logging, and OpenTelemetry integration for enterprise-grade observability.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 */

import 'server-only';

import { NextRequest } from 'next/server';

// ============================================================================
// LOG LEVELS
// ============================================================================

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

// ============================================================================
// LOG ENTRY INTERFACE
// ============================================================================

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context: Record<string, unknown> | undefined;
  requestId: string | undefined;
  userId: string | undefined;
  sessionId: string | undefined;
  spanId: string | undefined;
  traceId: string | undefined;
  error: {
    name: string;
    message: string;
    stack: string | undefined;
  } | undefined;
  performance: {
    duration: number;
    operation: string;
  } | undefined;
}

// ============================================================================
// PII REDACTION
// ============================================================================

/**
 * PII patterns to redact from logs
 */
const PII_PATTERNS = [
  // Email addresses
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  // Phone numbers (various formats)
  /\b(?:\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})\b/g,
  // Credit card numbers
  /\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3[0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})\b/g,
  // SSN
  /\b\d{3}-?\d{2}-?\d{4}\b/g,
  // API keys and tokens
  /(?:api[_-]?key|token|secret|password|passwd|pwd)\s*[:=]\s*[^\s,}]+/gi,
  // IP addresses (optional - can be useful for debugging)
  // /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g,
];

/**
 * Redact PII from a string
 */
function redactPII(text: string): string {
  let redacted = text;
  
  PII_PATTERNS.forEach(pattern => {
    redacted = redacted.replace(pattern, '[REDACTED]');
  });
  
  return redacted;
}

/**
 * Redact PII from an object recursively
 */
function redactPIIFromObject(obj: unknown): unknown {
  if (typeof obj === 'string') {
    return redactPII(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(redactPIIFromObject);
  }
  
  if (obj && typeof obj === 'object') {
    const redacted: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Redact common PII field names
      if (['email', 'phone', 'password', 'token', 'secret', 'key', 'ssn'].some(pii => 
        key.toLowerCase().includes(pii)
      )) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactPIIFromObject(value);
      }
    }
    return redacted;
  }
  
  return obj;
}

// ============================================================================
// LOGGER CLASS
// ============================================================================

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;
  private requestId: string | undefined;
  private userId: string | undefined;
  private sessionId: string | undefined;
  private spanId: string | undefined;
  private traceId: string | undefined;

  private constructor(level: LogLevel = LogLevel.INFO) {
    this.logLevel = level;
  }

  /**
   * Get singleton instance
   */
  public static getInstance(level?: LogLevel): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(level);
    }
    return Logger.instance;
  }

  /**
   * Set context for current request
   */
  public setContext(context: {
    requestId: string | undefined;
    userId: string | undefined;
    sessionId: string | undefined;
    spanId: string | undefined;
    traceId: string | undefined;
  }): void {
    this.requestId = context.requestId;
    this.userId = context.userId;
    this.sessionId = context.sessionId;
    this.spanId = context.spanId;
    this.traceId = context.traceId;
  }

  /**
   * Create log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error,
    performance?: { duration: number; operation: string }
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message: redactPII(message),
      context: context ? redactPIIFromObject(context) as Record<string, unknown> : undefined,
      requestId: this.requestId,
      userId: this.userId,
      sessionId: this.sessionId,
      spanId: this.spanId,
      traceId: this.traceId,
      error: error ? {
        name: error.name,
        message: redactPII(error.message),
        stack: error.stack ? redactPII(error.stack) : undefined,
      } : undefined,
      performance,
    };
  }

  /**
   * Write log entry
   */
  private writeLog(entry: LogEntry): void {
    if (entry.level < this.logLevel) {
      return;
    }

    const logMessage = JSON.stringify(entry, null, 2);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.log(logMessage);
        break;
      case LogLevel.INFO:
        console.log(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(logMessage);
        break;
    }
  }

  /**
   * Debug log
   */
  public debug(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context);
    this.writeLog(entry);
  }

  /**
   * Info log
   */
  public info(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.INFO, message, context);
    this.writeLog(entry);
  }

  /**
   * Warning log
   */
  public warn(message: string, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.WARN, message, context);
    this.writeLog(entry);
  }

  /**
   * Error log
   */
  public error(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, error);
    this.writeLog(entry);
  }

  /**
   * Fatal log
   */
  public fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    const entry = this.createLogEntry(LogLevel.FATAL, message, context, error);
    this.writeLog(entry);
  }

  /**
   * Performance log
   */
  public performance(
    operation: string,
    duration: number,
    context?: Record<string, unknown>
  ): void {
    const entry = this.createLogEntry(
      LogLevel.INFO,
      `Performance: ${operation}`,
      context,
      undefined,
      { duration, operation }
    );
    this.writeLog(entry);
  }

  /**
   * Request log
   */
  public request(
    request: NextRequest,
    response?: { status: number; duration: number },
    context?: Record<string, unknown>
  ): void {
    const requestContext = {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      ip: this.getClientIP(request),
      ...context,
    };

    if (response) {
      this.info(
        `${request.method} ${request.url} - ${response.status} - ${response.duration}ms`,
        requestContext
      );
    } else {
      this.info(`${request.method} ${request.url}`, requestContext);
    }
  }

  /**
   * Get client IP from request
   */
  private getClientIP(request: NextRequest): string {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    
    if (cfConnectingIP) return cfConnectingIP;
    if (realIP) return realIP;
    if (forwardedFor) return (forwardedFor.split(',')[0] ?? forwardedFor).trim();
    
    return 'unknown';
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get logger instance
 */
export function getLogger(): Logger {
  return Logger.getInstance();
}

/**
 * Create logger with context
 */
export function createLogger(context: {
  requestId?: string | undefined;
  userId?: string | undefined;
  sessionId?: string | undefined;
  spanId?: string | undefined;
  traceId?: string | undefined;
}): Logger {
  const logger = Logger.getInstance();
  logger.setContext({
    requestId: context.requestId,
    userId: context.userId,
    sessionId: context.sessionId,
    spanId: context.spanId,
    traceId: context.traceId,
  });
  return logger;
}

/**
 * Log with performance timing
 */
export async function withLogging<T>(
  operation: string,
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T> {
  const logger = getLogger();
  const startTime = Date.now();
  
  try {
    logger.info(`Starting ${operation}`, context);
    const result = await fn();
    const duration = Date.now() - startTime;
    logger.performance(operation, duration, { ...context, success: true });
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error(
      `Failed ${operation}`,
      error instanceof Error ? error : new Error(String(error)),
      { ...context, duration, success: false }
    );
    throw error;
  }
}

/**
 * Log request/response cycle
 */
export function logRequest(
  request: NextRequest,
  response: { status: number; duration: number },
  context?: Record<string, unknown>
): void {
  const logger = getLogger();
  logger.request(request, response, context);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Logger;
