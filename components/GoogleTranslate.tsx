'use client';
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
  }, []);

return (
  <div className="fixed left-4 bottom-4 z-50 flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 bg-white shadow-sm text-xs">
    <style>{`
      .goog-te-gadget { font-size: 11px !important; }
      .goog-te-gadget-simple { padding: 2px 4px !important; font-size: 11px !important; }
      .goog-logo-link { display: none !important; }
      .goog-te-gadget span { display: none !important; }
    `}</style>
    <span>🌐</span>
    <div id="google_translate_element" />
  </div>
);
}
