'use client'
import { useEffect } from 'react';

  export default function GoogleTranslate() {
    useEffect(() => {
      if (document.getElementById('google-translate-script')) return;   

      window.googleTranslateInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en', autoDisplay: false },
          'google_translate_element'
          );
      };

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateInit';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        const existingScript = document.getElementById('google-translate-script');
        if (existingScript) document.body.removeChild(existingScript);
      };
    }, []);

       return (
        <div className="fixed left-4 bottom-4 z-50 flex items-center gap-1 bg-white rounded-full shadow-lg px-2 py-1 border border-gray-200">
          <span>🌐</span>
          <div id="google_translate_element" />
        </div>
      );
  };
