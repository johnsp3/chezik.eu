/**
 * OpenTelemetry Integration for Critical Paths
 * 
 * Provides OpenTelemetry spans for critical application paths including
 * API requests, database operations, external service calls, and user actions.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 */

import 'server-only';

import { NextRequest, NextResponse } from 'next/server';
import { getLogger } from './logger';

// ============================================================================
// TELEMETRY TYPES
// ============================================================================

export interface SpanContext {
  traceId: string;
  spanId: string;
  parentSpanId: string | undefined;
}

export interface SpanAttributes {
  [key: string]: string | number | boolean | string[] | number[] | boolean[];
}

export interface SpanEvent {
  name: string;
  timestamp: number;
  attributes: SpanAttributes | undefined;
}

// ============================================================================
// SPAN CLASS
// ============================================================================

export class Span {
  private readonly name: string;
  private readonly startTime: number;
  private readonly attributes: SpanAttributes;
  private readonly events: SpanEvent[];
  private readonly context: SpanContext;
  private status: 'ok' | 'error' | 'unknown' = 'unknown';
  private error?: Error;

  constructor(
    name: string,
    context: SpanContext,
    attributes: SpanAttributes = {}
  ) {
    this.name = name;
    this.startTime = Date.now();
    this.attributes = attributes;
    this.events = [];
    this.context = context;
  }

  /**
   * Add attribute to span
   */
  public setAttribute(key: string, value: string | number | boolean | string[] | number[] | boolean[]): void {
    this.attributes[key] = value;
  }

  /**
   * Add event to span
   */
  public addEvent(name: string, attributes?: SpanAttributes): void {
    this.events.push({
      name,
      timestamp: Date.now(),
      attributes,
    });
  }

  /**
   * Set span status
   */
  public setStatus(status: 'ok' | 'error', error?: Error): void {
    this.status = status;
    if (error) {
      this.error = error;
      this.setAttribute('error', true);
      this.setAttribute('error.message', error.message);
      this.setAttribute('error.name', error.name);
    }
  }

  /**
   * Finish span and log
   */
  public finish(): void {
    const duration = Date.now() - this.startTime;
    const logger = getLogger();
    
    const spanData = {
      name: this.name,
      duration,
      status: this.status,
      traceId: this.context.traceId,
      spanId: this.context.spanId,
      parentSpanId: this.context.parentSpanId,
      attributes: this.attributes,
      events: this.events,
      error: this.error ? {
        name: this.error.name,
        message: this.error.message,
        stack: this.error.stack,
      } : undefined,
    };

    if (this.status === 'error') {
      logger.error(`Span finished with error: ${this.name}`, this.error, spanData);
    } else {
      logger.info(`Span finished: ${this.name}`, spanData);
    }
  }
}

// ============================================================================
// TRACER CLASS
// ============================================================================

export class Tracer {
  private static instance: Tracer;
  private activeSpans: Map<string, Span> = new Map();

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): Tracer {
    if (!Tracer.instance) {
      Tracer.instance = new Tracer();
    }
    return Tracer.instance;
  }

  /**
   * Generate trace ID
   */
  private generateTraceId(): string {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate span ID
   */
  private generateSpanId(): string {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Start new span
   */
  public startSpan(
    name: string,
    parentContext?: SpanContext,
    attributes: SpanAttributes = {}
  ): Span {
    const traceId = parentContext?.traceId ?? this.generateTraceId();
    const spanId = this.generateSpanId();
    
    const context: SpanContext = {
      traceId,
      spanId,
      parentSpanId: parentContext?.spanId,
    };

    const span = new Span(name, context, attributes);
    this.activeSpans.set(spanId, span);
    
    return span;
  }

  /**
   * Get active span by ID
   */
  public getActiveSpan(spanId: string): Span | undefined {
    return this.activeSpans.get(spanId);
  }

  /**
   * Finish span
   */
  public finishSpan(spanId: string): void {
    const span = this.activeSpans.get(spanId);
    if (span) {
      span.finish();
      this.activeSpans.delete(spanId);
    }
  }

  /**
   * Create span context from request headers
   */
  public createContextFromRequest(request: NextRequest): SpanContext {
    const traceId = request.headers.get('x-trace-id') ?? this.generateTraceId();
    const spanId = request.headers.get('x-span-id') ?? this.generateSpanId();
    const parentSpanId = request.headers.get('x-parent-span-id') ?? undefined;

    return {
      traceId,
      spanId,
      parentSpanId,
    };
  }

  /**
   * Add trace headers to response
   */
  public addTraceHeaders(response: NextResponse, context: SpanContext): NextResponse {
    response.headers.set('x-trace-id', context.traceId);
    response.headers.set('x-span-id', context.spanId);
    return response;
  }
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Get tracer instance
 */
export function getTracer(): Tracer {
  return Tracer.getInstance();
}

/**
 * Create span for API request
 */
export function createApiSpan(
  request: NextRequest,
  operation: string,
  attributes: SpanAttributes = {}
): Span {
  const tracer = getTracer();
  const context = tracer.createContextFromRequest(request);
  
  const spanAttributes = {
    'http.method': request.method,
    'http.url': request.url,
    'http.user_agent': request.headers.get('user-agent') ?? 'unknown',
    'http.client_ip': getClientIP(request),
    'operation.name': operation,
    ...attributes,
  };

  return tracer.startSpan(`api.${operation}`, context, spanAttributes);
}

/**
 * Create span for database operation
 */
export function createDbSpan(
  operation: string,
  table?: string,
  attributes: SpanAttributes = {}
): Span {
  const tracer = getTracer();
  
  const spanAttributes = {
    'db.operation': operation,
    'db.system': 'vercel-kv',
    ...(table && { 'db.table': table }),
    ...attributes,
  };

  return tracer.startSpan(`db.${operation}`, undefined, spanAttributes);
}

/**
 * Create span for external service call
 */
export function createServiceSpan(
  service: string,
  operation: string,
  attributes: SpanAttributes = {}
): Span {
  const tracer = getTracer();
  
  const spanAttributes = {
    'service.name': service,
    'service.operation': operation,
    ...attributes,
  };

  return tracer.startSpan(`service.${service}.${operation}`, undefined, spanAttributes);
}

/**
 * Create span for user action
 */
export function createUserSpan(
  action: string,
  userId?: string,
  attributes: SpanAttributes = {}
): Span {
  const tracer = getTracer();
  
  const spanAttributes = {
    'user.action': action,
    ...(userId && { 'user.id': userId }),
    ...attributes,
  };

  return tracer.startSpan(`user.${action}`, undefined, spanAttributes);
}

/**
 * Execute function with span
 */
export async function withSpan<T>(
  span: Span,
  fn: () => Promise<T>
): Promise<T> {
  try {
    const result = await fn();
    span.setStatus('ok');
    return result;
  } catch (error) {
    span.setStatus('error', error instanceof Error ? error : new Error(String(error)));
    throw error;
  } finally {
    span.finish();
  }
}

/**
 * Get client IP from request
 */
function getClientIP(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');
  
  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwardedFor) return (forwardedFor.split(',')[0] ?? forwardedFor).trim();
  
  return 'unknown';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default Tracer;
