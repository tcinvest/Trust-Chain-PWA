'use client'
import { useEffect } from 'react';

declare global {
interface Window {
  googleTranslateInit: () => void;
  google: {
    translate: {
      translateElement: new (
        options: { pageLanguage: string; autoDisplay: boolean },
        element: string
        ) => void;
    };
  };
};
};

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
        if (existingScript) document.body.removeChild(exisingScript);
      };
    }, []);

    return <div id="google_translate_element" />
  };
