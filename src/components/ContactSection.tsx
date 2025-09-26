/**
 * Contact Section Component
 * 
 * Displays comprehensive contact information, form, and social features.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 */

'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Mail, 
  MessageCircle, 
  Send, 
  Globe,
  CheckCircle,
  AlertCircle,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Copy
} from 'lucide-react';

interface ContactSectionProps {
  className?: string;
}

const ContactSection: React.FC<ContactSectionProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Only run on client side to avoid hydration mismatches
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'media@chezik.eu',
      href: '#',
      color: 'text-blue-400'
    },
    {
      icon: Globe,
      title: 'Website',
      value: 'www.chezik.eu',
      href: '#',
      color: 'text-orange-400'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('Please fill in all required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSubmitStatus(result.message);
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('Sorry, there was an error sending your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newsletterEmail || isNewsletterSubmitting) return;
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }
    
    setIsNewsletterSubmitting(true);
    setNewsletterStatus('idle');
    
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newsletterEmail })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setNewsletterStatus('success');
        setNewsletterMessage(result.message);
        setNewsletterEmail('');
      } else {
        setNewsletterStatus('error');
        setNewsletterMessage(result.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      setNewsletterStatus('error');
      setNewsletterMessage('Something went wrong. Please try again.');
    } finally {
      setIsNewsletterSubmitting(false);
      
      // Clear status after 5 seconds
      setTimeout(() => {
        setNewsletterStatus('idle');
        setNewsletterMessage('');
      }, 5000);
    }
  };

  const shareToTwitter = () => {
    if (!currentUrl) return;
    const text = `John Chezik - Platinum-Selling Artist - Explore 6 albums and 2 books from a platinum-selling songwriter-singer and author`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(currentUrl)}&hashtags=${encodeURIComponent('JohnChezik,Music,Rock,Books,Artist')}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setShowShareMenu(false);
  };

  const shareToFacebook = () => {
    if (!currentUrl) return;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent('John Chezik - Platinum-Selling Artist')}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
    setShowShareMenu(false);
  };

  const shareToLinkedIn = () => {
    if (!currentUrl) return;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent('John Chezik - Platinum-Selling Artist')}&summary=${encodeURIComponent('Explore 6 albums and 2 books from a platinum-selling songwriter-singer and author')}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=420');
    setShowShareMenu(false);
  };

  const copyToClipboard = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
    setShowShareMenu(false);
  };

  const handleNativeShare = () => {
    if (!currentUrl) return;
    if (navigator.share) {
      navigator.share({
        title: 'John Chezik - Platinum-Selling Artist',
        text: 'Explore 6 albums and 2 books from a platinum-selling songwriter-singer and author',
        url: currentUrl
      }).catch((error) => {
        // Only log errors that aren't user cancellations
        if (error.name !== 'AbortError') {
          console.error('Share error:', error);
        }
        // Silently handle user cancellation - this is expected behavior
      });
    } else {
      setShowShareMenu(!showShareMenu);
    }
  };

  return (
    <section id="contact" className="section contact-section">
      <div id="section-contact" className="anchor-marker"></div>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <MessageCircle size={16} />
            <span>Get In Touch</span>
          </div>
          
          <h2 className="section-title">Professional Contact</h2>
          
          <p className="section-description">
            For professional inquiries, media requests, or business-related matters.
          </p>
        </div>
        
        <div className="contact-content">
          {/* Main Contact Section */}
          <div className="main-contact-section">
            {/* Professional Photo & Bio */}
            <div className="photo-bio-section">
              <div className="photo-wrapper">
                <Image 
                  src="/John_Studio_1300x1040.png" 
                  alt="John Chezik in his professional studio"
                  width={300}
                  height={240}
                  className="contact-photo"
                />
                <div className="photo-glow"></div>
              </div>
              <div className="bio-content">
                <h3 className="bio-title">John Chezik</h3>
                <p className="bio-subtitle">Platinum-selling songwriter, singer, guitar player, studio musician</p>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="contact-form-section">
              <div className="form-header">
                <h3 className="form-title">Send a Message</h3>
                <p className="form-description">
                  For professional inquiries
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">Subject</label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    className="form-input"
                    placeholder="What's this about?"
                    value={formData.subject}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    className="form-textarea"
                    placeholder="Tell me about your project, question, or collaboration idea..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                {submitStatus && (
                  <div className={`submit-status ${submitStatus.includes('Thank you') ? 'success' : 'error'}`} suppressHydrationWarning>
                    {submitStatus}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Stay Connected Section */}
          <div className="stay-connected-section">
            {/* Newsletter Signup */}
            <div className="newsletter-signup">
              <div className="newsletter-header">
                <div className="newsletter-icon">
                  <Mail size={24} />
                </div>
                <h3 className="newsletter-title">Stay Updated</h3>
                <p className="newsletter-description">
                  Get notified about new albums, book releases, and exclusive content.
                </p>
              </div>
              
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="newsletter-input"
                    disabled={isNewsletterSubmitting}
                    required
                  />
                  <button
                    type="submit"
                    className="newsletter-button"
                    disabled={isNewsletterSubmitting || !newsletterEmail}
                    aria-label="Subscribe to newsletter"
                  >
                    {isNewsletterSubmitting ? (
                      <div className="spinner"></div>
                    ) : (
                      <Send size={18} />
                    )}
                  </button>
                </div>
                
                {newsletterStatus !== 'idle' && newsletterMessage && (
                  <div className={`status-message ${newsletterStatus === 'success' ? 'success' : 'error'}`} suppressHydrationWarning>
                    <div className="status-icon">
                      {newsletterStatus === 'success' ? (
                        <CheckCircle size={16} />
                      ) : (
                        <AlertCircle size={16} />
                      )}
                    </div>
                    <span className="status-text">{newsletterMessage}</span>
                  </div>
                )}
              </form>
              
              <div className="newsletter-features">
                <div className="feature">
                  <span className="feature-bullet">🎵</span>
                  <span>New album releases</span>
                </div>
                <div className="feature">
                  <span className="feature-bullet">📚</span>
                  <span>Book updates & previews</span>
                </div>
                <div className="feature">
                  <span className="feature-bullet">🎸</span>
                  <span>Behind-the-scenes content</span>
                </div>
              </div>
              
              <p className="newsletter-privacy">
                No spam, unsubscribe at any time. Your email is safe with us.
              </p>
            </div>
            
            {/* Social Sharing */}
            <div className="social-sharing">
              <h4 className="social-title">Share This Page</h4>
              <p className="social-description">
                Help others discover John&apos;s music and books.
              </p>
              <div className="social-actions">
                <div className="social-share">
                  <button 
                    className="share-button"
                    onClick={handleNativeShare}
                    aria-label="Share this page"
                  >
                    <Share2 size={18} />
                    <span className="share-text">Share</span>
                  </button>
                  
                  {showShareMenu && (
                    <div className="share-menu">
                      <button className="share-option twitter" onClick={shareToTwitter}>
                        <Twitter size={16} />
                        <span>Twitter</span>
                      </button>
                      
                      <button className="share-option facebook" onClick={shareToFacebook}>
                        <Facebook size={16} />
                        <span>Facebook</span>
                      </button>
                      
                      <button className="share-option linkedin" onClick={shareToLinkedIn}>
                        <Linkedin size={16} />
                        <span>LinkedIn</span>
                      </button>
                      
                      <button className="share-option copy" onClick={copyToClipboard}>
                        {copied ? (
                          <>
                            <CheckCircle size={16} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={16} />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Methods */}
            <div className="contact-methods-section">
              <h4 className="contact-section-title">Direct Contact</h4>
              <p className="contact-section-description">
                For professional inquiries
              </p>
              
              <div className="contact-methods">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon;
                  return (
                    <div 
                      key={index}
                      className="contact-method"
                      style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
                    >
                      <div className={`method-icon ${info.color}`}>
                        <IconComponent size={20} />
                      </div>
                      <div className="method-content">
                        <div className="method-title">{info.title}</div>
                        <div className="method-value">{info.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;