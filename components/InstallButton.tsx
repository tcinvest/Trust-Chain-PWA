'use client';
import { useState, useEffect } from 'react';

// Define the TypeScript interfaces for PWA events
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

// Extend the Window interface to include PWA events
declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    const checkIfInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
      }
    };
  
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
  
    const handleAppInstalled = () => {
      console.log('App was installed');
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
  
    checkIfInstalled();
    
    // Only add event listeners for non-iOS devices
    if (!iOS) {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }
  
    return () => {
      if (!iOS) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, []);  

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log(`User response: ${outcome}`);
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        // Don't clear the prompt - let it be available again
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
    // Remove the finally block that was clearing the deferred prompt
  };

  const handleIOSInstallClick = () => {
    setShowIOSInstructions(!showIOSInstructions);
  };

  // Don't show button if app is already installed
  if (isInstalled) {
    return null; // Don't show anything when installed
  }

  // iOS Install Instructions - always show for iOS when not installed
  if (isIOS) {
    return (
      <div className="space-y-3">
        <button
          onClick={handleIOSInstallClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Install App
        </button>
        
        {showIOSInstructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-blue-900">Install Instructions</h3>
            </div>
            <p className="text-sm text-blue-800 mb-3">
              To install this app on your iPhone/iPad:
            </p>
            <ol className="text-sm text-blue-800 space-y-2">
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[16px]">1.</span>
                <span>Tap the Share button 
                  <svg className="inline w-4 h-4 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z"/>
                  </svg>
                  at the bottom of your screen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[16px]">2.</span>
                <span>Scroll down and tap &quot;Add to Home Screen&quot;</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold min-w-[16px]">3.</span>
                <span>Tap &quot;Add&quot; to confirm</span>
              </li>
            </ol>
            <p className="text-xs text-blue-700 mt-3 italic">
              Note: This only works in Safari browser
            </p>
          </div>
        )}
      </div>
    );
  }

  // Android/Desktop Install Button - show if installable OR if we have a deferred prompt
  if (isInstallable || deferredPrompt) {
    return (
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Install App
      </button>
    );
  }

  // Don't show anything if not installable (instead of showing "Install option not available")
  return null;
};

export default InstallButton;