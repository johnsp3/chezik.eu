/**
 * Email Preferences Page
 * 
 * Beautiful email preferences page matching the site's stunning design aesthetic.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Settings, CheckCircle, AlertCircle, ArrowLeft, Save, Mail, Music, BookOpen, Camera, Calendar, FileText, Star, ShoppingBag, Users, Clock, Globe, Monitor } from 'lucide-react';

interface EmailPreferences {
  frequency: string;
  content_types: {
    albums: boolean;
    books: boolean;
    studio_updates: boolean;
    events: boolean;
    blog_posts: boolean;
    exclusive_content: boolean;
    merchandise: boolean;
    collaborations: boolean;
  };
  timezone: string;
  language: string;
  digest_format: string;
  unsubscribe_all: boolean;
}

function PreferencesPageContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const [preferences, setPreferences] = useState<EmailPreferences>({
    frequency: 'weekly',
    content_types: {
      albums: true,
      books: true,
      studio_updates: true,
      events: true,
      blog_posts: true,
      exclusive_content: true,
      merchandise: false,
      collaborations: true,
    },
    timezone: 'America/New_York',
    language: 'en',
    digest_format: 'html',
    unsubscribe_all: false,
  });

  const loadPreferences = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/email/preferences?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        setPreferences(result.preferences || preferences);
      } else {
        setStatus('error');
        setMessage(result.error?.message || 'Failed to load preferences.');
      }
    } catch (error) {
      console.error('Load preferences error:', error);
      setStatus('error');
      setMessage('Failed to load preferences. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [email, token, preferences]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    const tokenParam = searchParams.get('token');
    
    if (emailParam) setEmail(emailParam);
    if (tokenParam) setToken(tokenParam);
    
    // Load preferences if we have valid params
    if (emailParam && tokenParam) {
      loadPreferences();
    }
  }, [searchParams, loadPreferences]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !token) {
      setStatus('error');
      setMessage('Invalid preferences link. Please contact support.');
      return;
    }

    setIsSaving(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/email/preferences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          token,
          preferences
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setMessage(result.message || 'Preferences saved successfully!');
      } else {
        setStatus('error');
        setMessage(result.error?.message || 'Failed to save preferences. Please try again.');
      }
    } catch (error) {
      console.error('Save preferences error:', error);
      setStatus('error');
      setMessage('Something went wrong. Please try again or contact support.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateContentType = (type: keyof EmailPreferences['content_types'], value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      content_types: {
        ...prev.content_types,
        [type]: value
      }
    }));
  };

  const contentTypes = [
    { key: 'albums', label: 'New Albums', icon: Music, color: 'text-blue-400' },
    { key: 'books', label: 'Book Updates', icon: BookOpen, color: 'text-green-400' },
    { key: 'studio_updates', label: 'Studio Sessions', icon: Camera, color: 'text-purple-400' },
    { key: 'events', label: 'Live Events', icon: Calendar, color: 'text-orange-400' },
    { key: 'blog_posts', label: 'Blog Posts', icon: FileText, color: 'text-indigo-400' },
    { key: 'exclusive_content', label: 'Exclusive Content', icon: Star, color: 'text-yellow-400' },
    { key: 'merchandise', label: 'Merchandise', icon: ShoppingBag, color: 'text-pink-400' },
    { key: 'collaborations', label: 'Collaborations', icon: Users, color: 'text-teal-400' },
  ];

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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-8 relative">
              <Settings className="w-12 h-12 text-white" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            </div>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Email Preferences
            </h1>
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Customize your email experience and stay connected with what matters most to you.
            </p>
          </div>

          {/* Status Messages */}
          {status === 'success' && (
            <div className="mb-8 p-6 bg-green-500/10 border border-green-500/30 rounded-2xl backdrop-blur-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <div>
                  <h3 className="text-green-400 font-semibold mb-1">Preferences Saved</h3>
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

          {/* Preferences Form */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Email Frequency */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Email Frequency
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'daily', label: 'Daily', desc: 'Get updates every day' },
                    { value: 'weekly', label: 'Weekly', desc: 'Weekly digest (recommended)' },
                    { value: 'monthly', label: 'Monthly', desc: 'Monthly summary' },
                    { value: 'major_only', label: 'Major Updates Only', desc: 'Only important announcements' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-4 bg-white/5 border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200">
                      <input
                        type="radio"
                        name="frequency"
                        value={option.value}
                        checked={preferences.frequency === option.value}
                        onChange={(e) => setPreferences(prev => ({ ...prev, frequency: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        preferences.frequency === option.value 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-400'
                      }`}>
                        {preferences.frequency === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-gray-400 text-sm">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Content Types */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  Content Types
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {contentTypes.map(({ key, label, icon: Icon, color }) => (
                    <label key={key} className="flex items-center p-4 bg-white/5 border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={preferences.content_types[key as keyof EmailPreferences['content_types']]}
                        onChange={(e) => updateContentType(key as keyof EmailPreferences['content_types'], e.target.checked)}
                        className="sr-only"
                      />
                      <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${
                        preferences.content_types[key as keyof EmailPreferences['content_types']]
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-400'
                      }`}>
                        {preferences.content_types[key as keyof EmailPreferences['content_types']] && (
                          <CheckCircle className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <Icon className={`w-5 h-5 mr-3 ${color}`} />
                      <span className="text-white font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Email Format */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-purple-400" />
                  Email Format
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'html', label: 'HTML', desc: 'Rich formatting' },
                    { value: 'text', label: 'Text Only', desc: 'Simple text' },
                    { value: 'both', label: 'Both', desc: 'HTML with text fallback' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center p-4 bg-white/5 border border-white/20 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-200">
                      <input
                        type="radio"
                        name="digest_format"
                        value={option.value}
                        checked={preferences.digest_format === option.value}
                        onChange={(e) => setPreferences(prev => ({ ...prev, digest_format: e.target.value }))}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                        preferences.digest_format === option.value 
                          ? 'border-blue-500 bg-blue-500' 
                          : 'border-gray-400'
                      }`}>
                        {preferences.digest_format === option.value && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-gray-400 text-sm">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Timezone */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-orange-400" />
                  Timezone
                </h3>
                <select
                  value={preferences.timezone}
                  onChange={(e) => setPreferences(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-4 py-4 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 backdrop-blur-sm appearance-none cursor-pointer"
                >
                  <option value="America/New_York" className="bg-gray-800">Eastern Time (ET)</option>
                  <option value="America/Chicago" className="bg-gray-800">Central Time (CT)</option>
                  <option value="America/Denver" className="bg-gray-800">Mountain Time (MT)</option>
                  <option value="America/Los_Angeles" className="bg-gray-800">Pacific Time (PT)</option>
                  <option value="Europe/London" className="bg-gray-800">London (GMT)</option>
                  <option value="Europe/Paris" className="bg-gray-800">Paris (CET)</option>
                  <option value="Asia/Tokyo" className="bg-gray-800">Tokyo (JST)</option>
                  <option value="Australia/Sydney" className="bg-gray-800">Sydney (AEST)</option>
                </select>
              </div>

              {/* Save Button */}
              <div className="pt-6 border-t border-white/10">
                <button
                  type="submit"
                  disabled={isSaving || isLoading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving Preferences...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <Save className="w-5 h-5" />
                      Save Preferences
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-12">
            <p className="text-gray-400 text-sm">
              Need help? Contact us at{' '}
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

export default function PreferencesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading preferences...</p>
        </div>
      </div>
    }>
      <PreferencesPageContent />
    </Suspense>
  );
}