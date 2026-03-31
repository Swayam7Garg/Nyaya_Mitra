'use client';
import { useEffect } from 'react';
import i18n from '../../lib/i18n';
import { I18nextProvider } from 'react-i18next';

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem('nyayasaathi_lang') as 'en' | 'hi' | null;
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, []);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
