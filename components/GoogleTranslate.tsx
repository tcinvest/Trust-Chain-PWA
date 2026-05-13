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
  <div className="fixed left-4 bottom-4 z-50 flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 bg-white shadow-sm">
    <span>🌐</span>
    <div id="google_translate_element" />
  </div>
);
}
