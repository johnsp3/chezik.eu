/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error | undefined;
  errorInfo?: ErrorInfo | undefined;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Log error to monitoring service in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined as Error | undefined, errorInfo: undefined as ErrorInfo | undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="error-boundary">
          <div className="error-container">
            <div className="error-content">
              {/* Error Icon */}
              <div className="error-icon">
                <AlertTriangle size={64} className="text-red-400" />
              </div>

              {/* Error Message */}
              <div className="error-message">
                <h1 className="error-title">Something went wrong</h1>
                <p className="error-description">
                  We&apos;re sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
                </p>
                
                {typeof window !== 'undefined' && window.location.hostname === 'localhost' && this.state.error && (
                  <details className="error-details">
                    <summary className="error-summary">Error Details (Development Only)</summary>
                    <pre className="error-stack">
                      {this.state.error.message}
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>

              {/* Action Buttons */}
              <div className="error-actions">
                <button 
                  className="btn btn-primary"
                  onClick={this.handleRetry}
                >
                  <RefreshCw size={20} />
                  Try Again
                </button>
                
                <button 
                  className="btn btn-secondary"
                  onClick={this.handleGoHome}
                >
                  <Home size={20} />
                  Go Home
                </button>
              </div>

              {/* Contact Information */}
              <div className="error-contact">
                <p className="contact-text">
                  If this problem persists, please{' '}
                  <a href="#contact" className="contact-link">
                    contact us
                  </a>
                  {' '}and we&apos;ll help you out.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
