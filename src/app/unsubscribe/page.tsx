/**
 * Unsubscribe Page Component
 * 
 * Beautiful unsubscribe page matching the site's stunning design aesthetic.
 * Provides comprehensive unsubscribe functionality with real-time validation,
 * beautiful UI components, and seamless API integration.
 * 
 * @fileoverview Unsubscribe page with comprehensive unsubscribe management
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 * @updated 2024
 * 
 * @example
 * ```tsx
 * // Access via URL: /unsubscribe?email=user@example.com&token=abc123
 * <UnsubscribePage />
 * ```
 * 
 * @see {@link https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages}
 */

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Music, BookOpen, Camera, Calendar } from 'lucide-react';

/**
 * Unsubscribe page content component
 * 
 * Renders the unsubscribe form with comprehensive unsubscribe management,
 * beautiful UI components, and real-time validation.
 * 
 * @returns JSX element representing the unsubscribe page content
 * 
 * @example
 * ```tsx
 * <UnsubscribePageContent />
 * ```
 */
function UnsubscribePageContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
  }, [searchParams]);

  /**
   * Handle unsubscribe form submission
   * 
   * @param e - Form submit event
   * @throws {Error} When API request fails
   */
  const handleUnsubscribe = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Please contact support.');
      return;
    }

    setIsLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          reason: reason || 'user_requested'
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.error?.message || 'Failed to unsubscribe. Please try again.');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  // Always render the same structure to avoid hydration mismatch

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#111111_0%,_#000000_70%)]"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-white to-blue-400 bg-clip-text text-transparent hover:scale-105 transition-transform">
            John Chezik
          </Link>
          <Link 
            href="/" 
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 relative">
              <Mail className="w-12 h-12 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Unsubscribe
            </h1>
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              We&apos;re sorry to see you go, but we completely understand. 
              You can always resubscribe anytime.
            </p>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-green-400 font-semibold mb-1">Successfully Unsubscribed</h3>
                  <p className="text-green-200 text-sm">{message}</p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-red-400 font-semibold mb-1">Error</h3>
                  <p className="text-red-200 text-sm">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleUnsubscribe} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm"
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading}
                  />
                  <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Reason Field */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-3">
                  Reason for unsubscribing (optional)
                </label>
                <select
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                  disabled={isLoading}
                >
                  <option value="" className="bg-gray-800">Select a reason...</option>
                  <option value="too_frequent" className="bg-gray-800">Emails too frequent</option>
                  <option value="not_relevant" className="bg-gray-800">Content not relevant</option>
                  <option value="too_many_emails" className="bg-gray-800">Too many emails</option>
                  <option value="never_signed_up" className="bg-gray-800">Never signed up</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
              </div>

              {/* Warning Notice */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-amber-400 font-semibold mb-2">Important Notice</h4>
                    <p className="text-amber-200 text-sm leading-relaxed">
                      Unsubscribing will stop all newsletter emails from John Chezik, including updates about new albums, books, and exclusive content. You can resubscribe anytime on our website.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-red-500/25 hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Unsubscribe from Newsletter'
                )}
              </button>
            </form>
          </div>

          {/* What You'll Miss */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-300 mb-6">What you&apos;ll miss:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <Music className="w-5 h-5 text-blue-400" />
                <span className="text-gray-300 text-sm">New album releases</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <BookOpen className="w-5 h-5 text-green-400" />
                <span className="text-gray-300 text-sm">Book updates</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <Camera className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300 text-sm">Studio sessions</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                <Calendar className="w-5 h-5 text-orange-400" />
                <span className="text-gray-300 text-sm">Live events</span>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              Questions? Contact us at{' '}
              <a 
                href="mailto:media@chezik.eu" 
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
              >
                media@chezik.eu
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Unsubscribe page component with Suspense wrapper
 * 
 * Main unsubscribe page component that wraps the content with Suspense
 * for proper loading state handling and error boundaries.
 * 
 * @returns JSX element representing the unsubscribe page with Suspense
 * 
 * @example
 * ```tsx
 * <UnsubscribePage />
 * ```
 */
export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <UnsubscribePageContent />
    </Suspense>
  );
}