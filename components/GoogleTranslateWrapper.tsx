'use client'
import dynamic from 'next/dynamic';

const GoogleTranslate = dynamic(() => import('./GoogleTranslate'), {
  ssr: false,
});

export default function GoogleTranslateWrapper() {
  return <GoogleTranslate />;
}
