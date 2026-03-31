const fs = require('fs');
const path = require('path');

const files = {};

// ─── types/index.ts ────────────────────────────────────────────────────────
files['types/index.ts'] = `
export interface BilingualText {
  en: string;
  hi: string;
}
export interface LawSection {
  section: string;
  act: string;
  summary: BilingualText;
  fullText: string;
}
export interface ChecklistItem {
  id: string;
  item: BilingualText;
  required: boolean;
}
export interface ProcedureStep {
  stepNumber: number;
  title: BilingualText;
  description: BilingualText;
  tip: BilingualText;
}
export interface Right {
  title: BilingualText;
  description: BilingualText;
}
export interface Situation {
  id: string;
  category: string;
  icon: string;
  title: BilingualText;
  description: BilingualText;
  rights: Right[];
  laws: LawSection[];
  checklist: ChecklistItem[];
  steps: ProcedureStep[];
  templateType: 'rti' | 'complaint';
}
export interface Lawyer {
  id: string;
  name: string;
  specializations: string[];
  state: string;
  city: string;
  phone: string;
  email: string;
  organization: string;
  languages: string[];
  proBono: boolean;
  experience: number;
  barCouncilId: string;
  availableFor: string[];
  rating: number;
}
export interface DocumentFormData {
  name: string;
  address: string;
  phone: string;
  date: string;
  incidentDate: string;
  description: string;
  amount?: string;
  respondentName?: string;
  respondentAddress?: string;
  authority?: string;
  infoRequested?: string;
}
export type Language = 'en' | 'hi';
`.trimStart();

// ─── lib/i18n.ts ────────────────────────────────────────────────────────────
files['lib/i18n.ts'] = `
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
`.trimStart();

// ─── lib/api.ts ─────────────────────────────────────────────────────────────
files['lib/api.ts'] = `
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

async function post<T>(url: string, body: object): Promise<T> {
  const res = await fetch(BASE + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json() as Promise<T>;
}

async function get<T>(url: string): Promise<T> {
  const res = await fetch(BASE + url);
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json() as Promise<T>;
}

export const api = {
  getSituations: () => get<import('../types').Situation[]>('/api/situations'),
  getSituation: (id: string) => get<import('../types').Situation>('/api/situations/' + id),
  getLawyers: () => get<import('../types').Lawyer[]>('/api/lawyers'),
  explainRights: (slug: string, language: string) =>
    post<{ plain_language_rights: string[]; original_sections: import('../types').LawSection[] }>(
      '/api/ai/explain',
      { situation_slug: slug, language }
    ),
  generateDocument: (templateType: string, fields: import('../types').DocumentFormData, language: string) =>
    post<{ document_text: string }>('/api/documents/generate', { templateType, fields, language }),
};
`.trimStart();

// Write all files
Object.entries(files).forEach(([filePath, content]) => {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Created:', filePath);
});
console.log('BATCH 1 DONE');
