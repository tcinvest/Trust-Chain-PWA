// hooks/usePWADetection.ts
import { useEffect, useState } from 'react';

export const usePWADetection = (): boolean => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    const checkPWAStatus = () => {
      // Check for standalone display mode (most reliable)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      
      // Check for iOS standalone mode
      const isIOSStandalone = (window.navigator as any).standalone === true;
      
      setIsPWA(isStandalone || isIOSStandalone);
    };

    checkPWAStatus();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = () => checkPWAStatus();
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isPWA;
};