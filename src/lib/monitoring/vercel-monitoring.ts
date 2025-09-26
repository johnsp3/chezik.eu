/**
 * Vercel Monitoring & Analytics
 * 
 * Comprehensive monitoring system for Vercel deployment.
 * Tracks performance, errors, and user behavior with detailed analytics.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

import 'server-only';
import { NextRequest, NextResponse } from 'next/server';
import { createLogger } from './logger';
import { getTracer, createApiSpan, withSpan } from './telemetry';

// ============================================================================
// MONITORING TYPES
// ============================================================================

export interface PerformanceMetrics {
  timestamp: number;
  url: string;
  method: string;
  statusCode: number;
  responseTime: number;
  userAgent: string;
  ip: string;
  region?: string | undefined;
  cacheStatus?: string | undefined;
}

export interface ErrorMetrics {
  timestamp: number;
  url: string;
  method: string;
  error: string;
  stack?: string | undefined;
  userAgent: string;
  ip: string;
  region?: string | undefined;
}

export interface UserBehaviorMetrics {
  timestamp: number;
  sessionId: string;
  userId?: string | undefined;
  action: string;
  data?: Record<string, unknown> | undefined;
  url: string;
  userAgent: string;
  ip: string;
}

export interface SystemMetrics {
  timestamp: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  requestCount: number;
  errorCount: number;
}

// ============================================================================
// MONITORING STORAGE
// ============================================================================

// In-memory storage for metrics
// In production, use Vercel KV or external service
const metricsStore = {
  performance: [] as PerformanceMetrics[],
  errors: [] as ErrorMetrics[],
  userBehavior: [] as UserBehaviorMetrics[],
  system: [] as SystemMetrics[],
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Track performance metrics with enhanced logging
 */
export function trackPerformance(
  request: NextRequest,
  response: NextResponse,
  startTime: number
): void {
  const endTime = Date.now();
  const responseTime = endTime - startTime;
  
  const metrics: PerformanceMetrics = {
    timestamp: Date.now(),
    url: request.url,
    method: request.method,
    statusCode: response.status,
    responseTime,
    userAgent: request.headers.get('user-agent') || 'unknown',
    ip: getClientIP(request),
    region: request.headers.get('x-vercel-ip-country') || undefined,
    cacheStatus: response.headers.get('x-cache') || undefined,
  };
  
  metricsStore.performance.push(metrics);
  
  // Keep only last 1000 entries
  if (metricsStore.performance.length > 1000) {
    metricsStore.performance = metricsStore.performance.slice(-1000);
  }
  
  // Use structured logger
  const logger = createLogger({
    requestId: request.headers.get('x-request-id') ?? undefined,
    traceId: request.headers.get('x-trace-id') ?? undefined,
    spanId: request.headers.get('x-span-id') ?? undefined,
  });
  
  logger.performance('api_request', responseTime, {
    method: request.method,
    url: request.url,
    statusCode: response.status,
    cacheStatus: response.headers.get('x-cache'),
    region: request.headers.get('x-vercel-ip-country'),
  });
}

/**
 * Performance monitoring middleware with OpenTelemetry spans
 */
export function withPerformanceMonitoring<T extends unknown[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const tracer = getTracer();
    const span = createApiSpan(request, 'api_handler');
    
    try {
      const response = await withSpan(span, async () => {
        const result = await handler(request, ...args);
        trackPerformance(request, result, startTime);
        return result;
      });
      
      return tracer.addTraceHeaders(response, {
        traceId: span['context'].traceId,
        spanId: span['context'].spanId,
        parentSpanId: span['context'].parentSpanId,
      });
    } catch (error) {
      // Create error response for tracking
      const errorResponse = new NextResponse('Internal Server Error', { status: 500 });
      trackPerformance(request, errorResponse, startTime);
      throw error;
    }
  };
}

// ============================================================================
// ERROR MONITORING
// ============================================================================

/**
 * Track error metrics with enhanced logging
 */
export function trackError(
  request: NextRequest,
  error: Error,
  additionalData?: Record<string, unknown>
): void {
  const metrics: ErrorMetrics = {
    timestamp: Date.now(),
    url: request.url,
    method: request.method,
    error: error.message,
    stack: error.stack,
    userAgent: request.headers.get('user-agent') || 'unknown',
    ip: getClientIP(request),
    region: request.headers.get('x-vercel-ip-country') || undefined,
  };
  
  metricsStore.errors.push(metrics);
  
  // Keep only last 500 entries
  if (metricsStore.errors.length > 500) {
    metricsStore.errors = metricsStore.errors.slice(-500);
  }
  
  // Use structured logger
  const logger = createLogger({
    requestId: request.headers.get('x-request-id') ?? undefined,
    traceId: request.headers.get('x-trace-id') ?? undefined,
    spanId: request.headers.get('x-span-id') ?? undefined,
  });
  
  logger.error(
    `API Error: ${request.method} ${request.url}`,
    error,
    {
      method: request.method,
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      region: request.headers.get('x-vercel-ip-country'),
      ...additionalData,
    }
  );
}

/**
 * Error monitoring middleware
 */
export function withErrorMonitoring(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(request);
    } catch (error) {
      trackError(request, error as Error);
      throw error;
    }
  };
}

// ============================================================================
// USER BEHAVIOR MONITORING
// ============================================================================

/**
 * Track user behavior with enhanced logging
 */
export function trackUserBehavior(
  request: NextRequest,
  action: string,
  data?: Record<string, unknown>
): void {
  const sessionId = getSessionId(request);
  
  const metrics: UserBehaviorMetrics = {
    timestamp: Date.now(),
    sessionId,
    action,
    data,
    url: request.url,
    userAgent: request.headers.get('user-agent') || 'unknown',
    ip: getClientIP(request),
  };
  
  metricsStore.userBehavior.push(metrics);
  
  // Keep only last 2000 entries
  if (metricsStore.userBehavior.length > 2000) {
    metricsStore.userBehavior = metricsStore.userBehavior.slice(-2000);
  }
  
  // Use structured logger
  const logger = createLogger({
    requestId: request.headers.get('x-request-id') ?? undefined,
    traceId: request.headers.get('x-trace-id') ?? undefined,
    spanId: request.headers.get('x-span-id') ?? undefined,
    sessionId,
  });
  
  logger.info(`User Behavior: ${action}`, {
    action,
    sessionId,
    url: request.url,
    userAgent: request.headers.get('user-agent'),
    ...data,
  });
}

/**
 * Get session ID from request
 */
function getSessionId(request: NextRequest): string {
  // Try to get session ID from cookie
  const sessionCookie = request.cookies.get('session-id');
  if (sessionCookie) {
    return sessionCookie.value;
  }
  
  // Generate new session ID
  const sessionId = generateSessionId();
  return sessionId;
}

/**
 * Generate session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// ============================================================================
// SYSTEM MONITORING
// ============================================================================

/**
 * Track system metrics
 */
export function trackSystemMetrics(): void {
  const metrics: SystemMetrics = {
    timestamp: Date.now(),
    memoryUsage: process.memoryUsage().heapUsed,
    cpuUsage: process.cpuUsage().user,
    activeConnections: 0, // Would need to track this separately
    requestCount: metricsStore.performance.length,
    errorCount: metricsStore.errors.length,
  };
  
  metricsStore.system.push(metrics);
  
  // Keep only last 100 entries
  if (metricsStore.system.length > 100) {
    metricsStore.system = metricsStore.system.slice(-100);
  }
}

// ============================================================================
// ANALYTICS FUNCTIONS
// ============================================================================

/**
 * Get performance analytics
 */
export function getPerformanceAnalytics(timeRange: number = 3600000): {
  averageResponseTime: number;
  totalRequests: number;
  errorRate: number;
  topEndpoints: Array<{ endpoint: string; count: number; avgTime: number }>;
} {
  const cutoff = Date.now() - timeRange;
  const recentMetrics = metricsStore.performance.filter(m => m.timestamp > cutoff);
  
  if (recentMetrics.length === 0) {
    return {
      averageResponseTime: 0,
      totalRequests: 0,
      errorRate: 0,
      topEndpoints: [],
    };
  }
  
  const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / recentMetrics.length;
  const totalRequests = recentMetrics.length;
  const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
  const errorRate = (errorCount / totalRequests) * 100;
  
  // Group by endpoint
  const endpointStats = new Map<string, { count: number; totalTime: number }>();
  recentMetrics.forEach(m => {
    const endpoint = m.url.split('?')[0] ?? m.url; // Remove query params
    const existing = endpointStats.get(endpoint) || { count: 0, totalTime: 0 };
    existing.count++;
    existing.totalTime += m.responseTime;
    endpointStats.set(endpoint, existing);
  });
  
  const topEndpoints = Array.from(endpointStats.entries())
    .map(([endpoint, stats]) => ({
      endpoint,
      count: stats.count,
      avgTime: stats.totalTime / stats.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    averageResponseTime,
    totalRequests,
    errorRate,
    topEndpoints,
  };
}

/**
 * Get error analytics
 */
export function getErrorAnalytics(timeRange: number = 3600000): {
  totalErrors: number;
  errorTypes: Array<{ error: string; count: number }>;
  errorEndpoints: Array<{ endpoint: string; count: number }>;
} {
  const cutoff = Date.now() - timeRange;
  const recentErrors = metricsStore.errors.filter(e => e.timestamp > cutoff);
  
  if (recentErrors.length === 0) {
    return {
      totalErrors: 0,
      errorTypes: [],
      errorEndpoints: [],
    };
  }
  
  // Group by error type
  const errorTypeStats = new Map<string, number>();
  recentErrors.forEach(e => {
    const errorType = e.error.split(':')[0] ?? e.error; // Get error type
    errorTypeStats.set(errorType, (errorTypeStats.get(errorType) || 0) + 1);
  });
  
  const errorTypes = Array.from(errorTypeStats.entries())
    .map(([error, count]) => ({ error, count }))
    .sort((a, b) => b.count - a.count);
  
  // Group by endpoint
  const endpointStats = new Map<string, number>();
  recentErrors.forEach(e => {
    const endpoint = e.url.split('?')[0] ?? e.url;
    endpointStats.set(endpoint, (endpointStats.get(endpoint) || 0) + 1);
  });
  
  const errorEndpoints = Array.from(endpointStats.entries())
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    totalErrors: recentErrors.length,
    errorTypes,
    errorEndpoints,
  };
}

/**
 * Get user behavior analytics
 */
export function getUserBehaviorAnalytics(timeRange: number = 3600000): {
  totalActions: number;
  uniqueSessions: number;
  topActions: Array<{ action: string; count: number }>;
} {
  const cutoff = Date.now() - timeRange;
  const recentBehavior = metricsStore.userBehavior.filter(b => b.timestamp > cutoff);
  
  if (recentBehavior.length === 0) {
    return {
      totalActions: 0,
      uniqueSessions: 0,
      topActions: [],
    };
  }
  
  const uniqueSessions = new Set(recentBehavior.map(b => b.sessionId)).size;
  
  // Group by action
  const actionStats = new Map<string, number>();
  recentBehavior.forEach(b => {
    actionStats.set(b.action, (actionStats.get(b.action) || 0) + 1);
  });
  
  const topActions = Array.from(actionStats.entries())
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  return {
    totalActions: recentBehavior.length,
    uniqueSessions,
    topActions,
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get client IP address
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

/**
 * Get all metrics
 */
export function getAllMetrics(): typeof metricsStore {
  return metricsStore;
}

/**
 * Clear old metrics
 */
export function clearOldMetrics(maxAge: number = 86400000): void { // 24 hours
  const cutoff = Date.now() - maxAge;
  
  metricsStore.performance = metricsStore.performance.filter(m => m.timestamp > cutoff);
  metricsStore.errors = metricsStore.errors.filter(e => e.timestamp > cutoff);
  metricsStore.userBehavior = metricsStore.userBehavior.filter(b => b.timestamp > cutoff);
  metricsStore.system = metricsStore.system.filter(s => s.timestamp > cutoff);
}

// ============================================================================
// MONITORING SETUP
// ============================================================================

/**
 * Initialize monitoring
 */
export function initializeMonitoring(): void {
  // Track system metrics every minute
  setInterval(trackSystemMetrics, 60000);
  
  // Clear old metrics every hour
  setInterval(clearOldMetrics, 3600000);
  
  console.log('[MONITORING] Initialized Vercel monitoring system');
}

// Initialize monitoring on module load
initializeMonitoring();
