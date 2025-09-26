/**
 * Footer Component
 * 
 * Displays comprehensive footer with brand info, links, and legal modals.
 * 
 * @author John Chezik
 * @version 2.0.0
 * @created 2024
 */

'use client';

import React, { useState, useEffect } from 'react';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);


  const quickLinks = [
    { href: '#home', label: 'Home' },
    { href: '#albums', label: 'Albums' },
    { href: '#books', label: 'Books' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPrivacyPolicy = () => setShowPrivacyPolicy(true);
  const closePrivacyPolicy = () => setShowPrivacyPolicy(false);
  const openTermsOfService = () => setShowTermsOfService(true);
  const closeTermsOfService = () => setShowTermsOfService(false);

  const handleOverlayClick = (e: React.MouseEvent, closeFunction: () => void) => {
    if (e.target === e.currentTarget) {
      closeFunction();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, closeFunction: () => void) => {
    if (e.key === 'Escape') {
      closeFunction();
    }
  };

  return (
    <>
      <footer className="footer">
        <div className="container">
          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <div className="copyright">
                <p>© {currentYear} John Chezik. All rights reserved.</p>
              </div>
              
              {/* Quick Links */}
              <div className="footer-quick-links">
                {quickLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href} 
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="footer-link-small"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              
              <div className="footer-links">
                <button className="footer-link-small" onClick={openPrivacyPolicy}>Privacy</button>
                <button className="footer-link-small" onClick={openTermsOfService}>Terms</button>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {showPrivacyPolicy && (
        <div 
          className="privacy-overlay" 
          onClick={(e) => handleOverlayClick(e, closePrivacyPolicy)} 
          role="button" 
          tabIndex={0} 
          onKeyDown={(e) => handleKeyDown(e, closePrivacyPolicy)} 
          aria-label="Close privacy policy"
        >
          <div className="privacy-content" role="document">
            <button className="privacy-close" onClick={closePrivacyPolicy}>&times;</button>
            
            <div className="privacy-header">
              <h2 className="privacy-title">Privacy Policy</h2>
              <p className="privacy-subtitle">How we protect your information</p>
            </div>
            
            <div className="privacy-body">
              <div className="privacy-section">
                <h3 className="privacy-section-title">Information We Collect</h3>
                <p className="privacy-text">
                  When you contact us through our website, we may collect your name, email address, and any message you choose to send. This information is used solely to respond to your inquiry and is not shared with third parties.
                </p>
              </div>
              
              <div className="privacy-section">
                <h3 className="privacy-section-title">How We Use Your Information</h3>
                <p className="privacy-text">
                  Your contact information is used exclusively to respond to your professional inquiries, media requests, or business-related matters. We do not use your information for marketing purposes or share it with external parties.
                </p>
              </div>
              
              <div className="privacy-section">
                <h3 className="privacy-section-title">Data Security</h3>
                <p className="privacy-text">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is handled with the utmost care and professionalism.
                </p>
              </div>
              
              <div className="privacy-section">
                <h3 className="privacy-section-title">Audio Content</h3>
                <p className="privacy-text">
                  Music samples on this website are provided for preview purposes only. They are protected against downloading and are intended solely for your listening experience while visiting our site.
                </p>
              </div>
              
              <div className="privacy-section">
                <h3 className="privacy-section-title">Contact</h3>
                <p className="privacy-text">
                  If you have any questions about this Privacy Policy or how your information is handled, please contact us at media@chezik.eu.
                </p>
              </div>
              
              <div className="privacy-footer">
                <p className="privacy-note">Last updated: {currentYear} • This policy applies to www.chezik.eu</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {showTermsOfService && (
        <div 
          className="terms-overlay" 
          onClick={(e) => handleOverlayClick(e, closeTermsOfService)} 
          role="button" 
          tabIndex={0} 
          onKeyDown={(e) => handleKeyDown(e, closeTermsOfService)} 
          aria-label="Close terms of service"
        >
          <div className="terms-content" role="document">
            <button className="terms-close" onClick={closeTermsOfService}>&times;</button>
            
            <div className="terms-header">
              <h2 className="terms-title">Terms of Service</h2>
              <p className="terms-subtitle">Website usage and content policies</p>
            </div>
            
            <div className="terms-body">
              <div className="terms-section">
                <h3 className="terms-section-title">Acceptance of Terms</h3>
                <p className="terms-text">
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </div>
              
              <div className="terms-section">
                <h3 className="terms-section-title">Intellectual Property Rights</h3>
                <p className="terms-text">
                  All content on this website, including but not limited to music, audio recordings, book excerpts, images, text, and design elements, is the exclusive property of John Chezik and is protected by copyright and intellectual property laws. Unauthorized reproduction, distribution, or use is strictly prohibited.
                </p>
              </div>
              
              <div className="terms-section">
                <h3 className="terms-section-title">Audio Content Usage</h3>
                <p className="terms-text">
                  Music samples and audio content provided on this website are for personal listening and preview purposes only. You may not download, reproduce, distribute, or use any audio content for commercial purposes without explicit written permission.
                </p>
              </div>
              
              <div className="terms-section">
                <h3 className="terms-section-title">Book Preview Content</h3>
                <p className="terms-text">
                  Book previews and excerpts are provided for informational purposes only. The content remains the intellectual property of John Chezik and may not be reproduced, shared, or used without permission. Full books are available through authorized retailers only.
                </p>
              </div>
              
              <div className="terms-section">
                <h3 className="terms-section-title">Professional Contact</h3>
                <p className="terms-text">
                  Contact forms and email communications are intended for legitimate professional inquiries, media requests, and business matters only. Spam, harassment, or inappropriate communications are not tolerated and may result in legal action.
                </p>
              </div>
              
              <div className="terms-section">
                <h3 className="terms-section-title">Limitation of Liability</h3>
                <p className="terms-text">
                  John Chezik and this website shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website or its content. Use of this website is at your own risk.
                </p>
              </div>
              
              <div className="terms-section">
                <h3 className="terms-section-title">Changes to Terms</h3>
                <p className="terms-text">
                  These terms may be updated at any time without prior notice. Continued use of the website constitutes acceptance of any changes. It is your responsibility to review these terms periodically.
                </p>
              </div>
              
              <div className="terms-footer">
                <p className="terms-note">Last updated: {currentYear} • These terms apply to www.chezik.eu and all associated content</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;