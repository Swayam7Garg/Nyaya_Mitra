'use client';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const toggle = (l: 'en' | 'hi') => {
    i18n.changeLanguage(l);
    localStorage.setItem('nyayasaathi_lang', l);
  };

  return (
    <div style={{ display: 'flex', background: '#EAE1DA', borderRadius: 24, padding: '3px', gap: '2px', border: '1px solid #D9CBBF' }}>
      <button
        onClick={() => toggle('en')}
        style={{
          padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          background: lang === 'en' ? '#923c22' : 'transparent',
          color: lang === 'en' ? 'white' : '#6A564A',
          transition: 'all 0.2s',
        }}
      >English</button>
      <button
        onClick={() => toggle('hi')}
        style={{
          padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          background: lang === 'hi' ? '#923c22' : 'transparent',
          color: lang === 'hi' ? 'white' : '#6A564A',
          transition: 'all 0.2s',
          fontFamily: 'Noto Sans Devanagari, sans-serif',
        }}
      >हिंदी</button>
    </div>
  );
}
