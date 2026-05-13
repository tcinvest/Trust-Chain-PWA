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

  const handleClick = () => {
    const select = document.querySelector('#google_translate_element select') as HTMLSelectElement;
    if (select) select.click();
  };

  return (
    <div className="fixed left-4 bottom-4 z-50">
      <style>{`
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
      `}</style>
      <button
        onClick={handleClick}
        className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform"
      >
        🌐
      </button>
      <div id="google_translate_element" className="hidden" />
    </div>
  );
}
