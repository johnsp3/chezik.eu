/**
 * Error Fallback Component
 * 
 * A reusable fallback UI component for error boundaries.
 * Can be customized for different error scenarios.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
  variant?: 'default' | 'minimal' | 'detailed';
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Something went wrong",
  description = "We're sorry, but something unexpected happened. Please try again or contact us if the problem persists.",
  showDetails = false,
  variant = 'default'
}) => {
  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  if (variant === 'minimal') {
    return (
      <div className="error-fallback-minimal">
        <div className="minimal-content">
          <AlertTriangle size={24} className="text-red-400" />
          <span className="minimal-text">{title}</span>
          <button 
            className="minimal-retry-btn"
            onClick={handleRetry}
            title="Retry"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="error-fallback-detailed">
        <div className="detailed-container">
          <div className="detailed-header">
            <Bug size={32} className="text-red-400" />
            <h2 className="detailed-title">{title}</h2>
          </div>
          
          <div className="detailed-content">
            <p className="detailed-description">{description}</p>
            
            {showDetails && error && (
              <div className="detailed-error-info">
                <h3 className="error-info-title">Error Information</h3>
                <div className="error-info-content">
                  <p><strong>Message:</strong> {error.message}</p>
                  {error.stack && (
                    <details className="error-stack-details">
                      <summary>Stack Trace</summary>
                      <pre className="error-stack">{error.stack}</pre>
                    </details>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="detailed-actions">
            <button 
              className="btn btn-primary"
              onClick={handleRetry}
            >
              <RefreshCw size={20} />
              Retry
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={handleGoHome}
            >
              <Home size={20} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="error-fallback">
      <div className="fallback-container">
        <div className="fallback-content">
          <div className="fallback-icon">
            <AlertTriangle size={48} className="text-red-400" />
          </div>
          
          <div className="fallback-message">
            <h2 className="fallback-title">{title}</h2>
            <p className="fallback-description">{description}</p>
          </div>
          
          <div className="fallback-actions">
            <button 
              className="btn btn-primary"
              onClick={handleRetry}
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            
            <button 
              className="btn btn-secondary"
              onClick={handleGoHome}
            >
              <Home size={20} />
              Go Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
