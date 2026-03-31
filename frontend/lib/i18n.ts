import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from '../locales/en/common.json';
import hiCommon from '../locales/hi/common.json';

const LANG_KEY = 'nyayasaathi_lang';

function getInitialLang() {
  if (typeof window === 'undefined') return 'en';
  return (localStorage.getItem(LANG_KEY) as 'en' | 'hi') || 'en';
}

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon },
    hi: { common: hiCommon },
  },
  lng: getInitialLang(),
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
});

export default i18n;
