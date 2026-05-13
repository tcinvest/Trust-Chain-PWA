'use client';
import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateInit';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById('google-translate-script');
      if (el) document.body.removeChild(el);
    };
  }, []);

  return (
    <div className="fixed left-4 bottom-4 z-50">
      <style>{`
        #google_translate_element { display: inline-block; }
        .goog-te-gadget { font-size: 0 !important; }
        .goog-te-gadget-simple {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          border-radius: 9999px !important;
          padding: 8px 12px !important;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1) !important;
          cursor: pointer !important;
          display: flex !important;
          align-items: center !important;
          gap: 6px !important;
        }
        .goog-te-gadget-icon { display: none !important; }
        .goog-te-menu-value { font-size: 13px !important; color: #111 !important; }
        .goog-te-menu-value span:last-child { display: none !important; }
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
      `}</style>
      <div id="google_translate_element" />
    </div>
  );
}
