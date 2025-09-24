/**
 * PWA Installation Prompt Component
 * 
 * Handles PWA installation prompts and provides installation instructions.
 * 
 * @author John Chezik
 * @version 1.0.0
 * @created 2024
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor, Tablet } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as any).standalone === true) {
        setIsInstalled(true);
      }
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after a delay
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3000);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setShowInstructions(true);
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
      
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    } catch (error) {
      console.error('PWA installation failed:', error);
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for this session
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    }
  };

  const handleCloseInstructions = () => {
    setShowInstructions(false);
  };

  // Don't show if already installed or dismissed
  if (isInstalled || (typeof window !== 'undefined' && sessionStorage.getItem('pwa-prompt-dismissed'))) {
    return null;
  }

  return (
    <>
      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="pwa-install-prompt">
          <div className="pwa-prompt-content">
            <div className="pwa-prompt-header">
              <Download size={24} />
              <h3>Install John Chezik App</h3>
              <button 
                className="pwa-prompt-close"
                onClick={handleDismiss}
                aria-label="Close install prompt"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="pwa-prompt-body">
              <p>Install this app on your device for quick access and offline listening!</p>
              <div className="pwa-prompt-features">
                <div className="feature">
                  <Smartphone size={16} />
                  <span>Quick access from home screen</span>
                </div>
                <div className="feature">
                  <Monitor size={16} />
                  <span>Works offline</span>
                </div>
                <div className="feature">
                  <Tablet size={16} />
                  <span>Native app experience</span>
                </div>
              </div>
            </div>
            
            <div className="pwa-prompt-actions">
              <button 
                className="btn btn-secondary"
                onClick={handleDismiss}
              >
                Not Now
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleInstallClick}
              >
                Install App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installation Instructions Modal */}
      {showInstructions && (
        <div className="pwa-instructions-modal">
          <div className="pwa-instructions-content">
            <div className="pwa-instructions-header">
              <h3>Install John Chezik App</h3>
              <button 
                className="pwa-instructions-close"
                onClick={handleCloseInstructions}
                aria-label="Close instructions"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="pwa-instructions-body">
              <div className="instruction-section">
                <h4>📱 Mobile (iOS Safari)</h4>
                <ol>
                  <li>Tap the Share button at the bottom</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                  <li>Tap "Add" to confirm</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>📱 Mobile (Android Chrome)</h4>
                <ol>
                  <li>Tap the menu button (three dots)</li>
                  <li>Select "Add to Home screen" or "Install app"</li>
                  <li>Tap "Add" or "Install" to confirm</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>💻 Desktop (Chrome/Edge)</h4>
                <ol>
                  <li>Look for the install icon in the address bar</li>
                  <li>Click the install icon</li>
                  <li>Click "Install" in the popup</li>
                </ol>
              </div>
              
              <div className="instruction-section">
                <h4>💻 Desktop (Firefox)</h4>
                <ol>
                  <li>Click the menu button (three lines)</li>
                  <li>Select "Install"</li>
                  <li>Click "Allow" to confirm</li>
                </ol>
              </div>
            </div>
            
            <div className="pwa-instructions-footer">
              <button 
                className="btn btn-primary"
                onClick={handleCloseInstructions}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
