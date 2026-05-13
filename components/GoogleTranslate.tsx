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
      <div className="fixed left-4 bottom-4 z-50 w-10 h-10 cursor-pointer">
        <div className="w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-xl">
          🌐
        </div>
        <div id="google_translate_element" className="absolute inset-0 opacity-0 overflow-hidden" />
      </div>
    );
  };
