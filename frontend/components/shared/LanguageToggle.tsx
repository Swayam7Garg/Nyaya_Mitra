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
    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 24, padding: '3px', gap: '2px', border: '1px solid #e2e8f0' }}>
      <button
        onClick={() => toggle('en')}
        style={{
          padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: lang === 'en' ? '#1a56db' : 'transparent',
          color: lang === 'en' ? 'white' : '#475569',
          transition: 'all 0.2s',
        }}
      >EN</button>
      <button
        onClick={() => toggle('hi')}
        style={{
          padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: lang === 'hi' ? '#1a56db' : 'transparent',
          color: lang === 'hi' ? 'white' : '#475569',
          transition: 'all 0.2s',
          fontFamily: 'Noto Sans Devanagari, sans-serif',
        }}
      >हिंदी</button>
    </div>
  );
}
