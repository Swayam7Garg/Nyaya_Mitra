const fs = require('fs');
const path = require('path');
function w(p, c) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, 'utf8'); console.log('Created:', p); }

w('components/situations/SituationCard.tsx',
`'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag, Briefcase, Shield, FileText, HeartHandshake, Landmark, ChevronRight } from 'lucide-react';
import type { Situation } from '../../types';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Home, ShoppingBag, Briefcase, Shield, FileText, HeartHandshake, Landmark,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  Housing: { bg: '#eff6ff', text: '#1a56db', border: '#bfdbfe' },
  'Consumer Rights': { bg: '#f0fdf4', text: '#0e9f6e', border: '#bbf7d0' },
  Employment: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  Criminal: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  Government: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  Family: { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
  Property: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
};

export default function SituationCard({ situation }: { situation: Situation }) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const Icon = iconMap[situation.icon] || Home;
  const colors = colorMap[situation.category] || colorMap.Housing;

  return (
    <Link href={\`/situations/\${situation.id}/explain\`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 24, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ background: colors.bg, border: \`1px solid \${colors.border}\`, borderRadius: 10, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color={colors.text} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="pill" style={{ fontSize: 10, background: colors.bg, color: colors.text, marginBottom: 6 }}>{situation.category}</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4, lineHeight: 1.3, fontFamily: lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif' }}>
              {situation.title[lang]}
            </h3>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, flex: 1, fontFamily: lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif' }}>
          {situation.description[lang]}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{situation.checklist.length} documents needed</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.text, fontSize: 13, fontWeight: 600 }}>
            View Rights <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
`);

w('components/situations/DualDisplayPanel.tsx',
`'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';
import ResponsibleAIBadge from '../shared/ResponsibleAIBadge';
import type { Situation } from '../../types';

export default function DualDisplayPanel({ situation }: { situation: Situation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const [expanded, setExpanded] = useState<number | null>(null);
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: hFont }}>{t('explain.tabs.rights')}</h2>
        <ResponsibleAIBadge />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }}>
        {/* Plain language rights */}
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BookOpen size={18} color="#0369a1" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0369a1', fontFamily: hFont }}>{t('explain.plain_title')}</h3>
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {situation.rights.map((r, i) => (
              <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#0369a1', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 3, fontFamily: hFont }}>{r.title[lang]}</p>
                  <p style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6, fontFamily: hFont }}>{r.description[lang]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Law sections */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Scale size={16} color="#92400e" />
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#92400e', fontFamily: hFont }}>{t('explain.law_title')}</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {situation.laws.map((law, i) => (
              <div key={i} className="law-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                  <div>
                    <span className="pill pill-amber" style={{ fontSize: 10, marginBottom: 4 }}>{law.section}</span>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#78350f', marginTop: 4, fontFamily: hFont }}>{law.act}</p>
                  </div>
                  <button onClick={() => setExpanded(expanded === i ? null : i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e' }}>
                    {expanded === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
                <p style={{ fontSize: 13, color: '#451a03', lineHeight: 1.6, fontFamily: hFont }}>{law.summary[lang]}</p>
                {expanded === i && (
                  <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid #fde68a' }}>
                    <p style={{ fontSize: 11, color: '#78350f', lineHeight: 1.7, fontStyle: 'italic' }}>{law.fullText}</p>
                    <a href="https://indiacode.nic.in" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, color: '#92400e', textDecoration: 'none', marginTop: 8 }}>
                      <ExternalLink size={10} /> {t('explain.source')}
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`);

w('components/situations/DocumentChecklist.tsx',
`'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, Download, AlertCircle } from 'lucide-react';
import { generateChecklistPDF } from '../../lib/pdfGenerator';
import type { Situation } from '../../types';

export default function DocumentChecklist({ situation }: { situation: Situation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const hFont = lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const key = \`checklist_\${situation.id}\`;
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) setChecked(JSON.parse(saved));
  }, [key]);

  const toggle = (id: string) => {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const done = situation.checklist.filter(i => checked[i.id]).length;
  const total = situation.checklist.length;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: hFont }}>{t('explain.checklist_title')}</h2>
        <button className="btn-secondary" onClick={() => generateChecklistPDF(situation.checklist.map(i => ({ ...i, checked: !!checked[i.id] })), situation.title.en)} style={{ fontSize: 13, padding: '8px 16px' }}>
          <Download size={14} /> {t('explain.download_checklist')}
        </button>
      </div>

      {/* Progress */}
      <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: '12px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0369a1', fontFamily: hFont }}>{t('explain.progress', { done, total })}</span>
          <span style={{ fontSize: 13, color: '#64748b' }}>{Math.round((done / total) * 100)}%</span>
        </div>
        <div style={{ height: 8, background: '#e0f2fe', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: \`\${(done / total) * 100}%\`, background: '#0369a1', borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {situation.checklist.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
            background: checked[item.id] ? '#f0fdf4' : 'white',
            border: \`1.5px solid \${checked[item.id] ? '#86efac' : '#e2e8f0'}\`,
            borderRadius: 10, cursor: 'pointer', transition: 'all 0.2s',
          }}>
            <div style={{ marginTop: 1, color: checked[item.id] ? '#0e9f6e' : '#94a3b8', flexShrink: 0 }}>
              {checked[item.id] ? <CheckSquare size={20} /> : <Square size={20} />}
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#0f172a', fontFamily: hFont, lineHeight: 1.4 }}>{item.item[lang]}</p>
              {item.required && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, color: '#dc2626', marginTop: 4 }}>
                  <AlertCircle size={10} /> {t('common.required')}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
`);

w('components/situations/ProcedureStepper.tsx',
`'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Lightbulb, ArrowRight } from 'lucide-react';
import type { Situation } from '../../types';

export default function ProcedureStepper({ situation }: { situation: Situation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const hFont = lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const [expanded, setExpanded] = useState<number>(0);

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 24, fontFamily: hFont }}>{t('explain.tabs.procedure')}</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {situation.steps.map((step, i) => (
          <div key={i} style={{
            border: \`1.5px solid \${expanded === i ? '#1a56db' : '#e2e8f0'}\`,
            borderRadius: 12, overflow: 'hidden',
            transition: 'border-color 0.2s',
            background: expanded === i ? '#f8faff' : 'white',
          }}>
            <button onClick={() => setExpanded(expanded === i ? -1 : i)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: expanded === i ? '#1a56db' : '#f1f5f9',
                color: expanded === i ? 'white' : '#64748b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
              }}>{step.stepNumber}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: expanded === i ? '#1a56db' : '#0f172a', fontFamily: hFont }}>{step.title[lang]}</span>
              {expanded === i ? <ChevronUp size={16} color="#1a56db" /> : <ChevronDown size={16} color="#94a3b8" />}
            </button>

            {expanded === i && (
              <div style={{ padding: '0 18px 18px 64px' }}>
                <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.7, fontFamily: hFont, marginBottom: 12 }}>{step.description[lang]}</p>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 8, padding: '10px 12px' }}>
                  <Lightbulb size={14} color="#92400e" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: '#78350f', lineHeight: 1.5, fontFamily: hFont }}>{step.tip[lang]}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 24, padding: 20, background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
        <p style={{ fontSize: 14, color: '#0369a1', fontWeight: 600, fontFamily: hFont }}>{t('explain.get_help_title')}</p>
        <Link href="/lawyers" className="btn-primary" style={{ textDecoration: 'none', fontSize: 13, padding: '8px 16px' }}>
          {t('explain.find_lawyer')} <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
`);

w('components/lawyers/LawyerCard.tsx',
`'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, BadgeCheck, Languages, Phone, Mail, X, Star } from 'lucide-react';
import type { Lawyer } from '../../types';

const areaColors: Record<string, string> = {
  'consumer-complaint': 'pill-blue',
  'domestic-violence': 'pill-pink',
  'workplace-harassment': 'pill-amber',
  'fir-filing': 'pill-orange',
  'rti-application': 'pill-purple',
  'landlord-dispute': 'pill-green',
  'property-dispute': 'pill-orange',
};

export default function LawyerCard({ lawyer }: { lawyer: Lawyer }) {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);

  return (
    <>
      <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#1a56db', flexShrink: 0 }}>
            {lawyer.name.split(' ')[1]?.[0] ?? lawyer.name[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{lawyer.name}</h3>
              <span className="pill pill-green" style={{ fontSize: 10, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                <BadgeCheck size={10} /> {t('lawyers.verified')}
              </span>
            </div>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{lawyer.organization}</p>
          </div>
        </div>

        {/* Practice areas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {lawyer.specializations.map(s => (
            <span key={s} className={\`pill \${areaColors[s] || 'pill-blue'}\`} style={{ fontSize: 10, padding: '3px 8px', textTransform: 'capitalize' }}>
              {s.replace(/-/g, ' ')}
            </span>
          ))}
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#475569' }}>
            <MapPin size={13} color="#94a3b8" /> {lawyer.city}, {lawyer.state}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: '#475569' }}>
            <Languages size={13} color="#94a3b8" /> {lawyer.languages.join(', ')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: '#64748b' }}>
            <Star size={12} color="#f59e0b" style={{ fill: '#f59e0b' }} />
            {lawyer.experience} {t('lawyers.experience')} &nbsp;|&nbsp; {t('lawyers.nalsa_id')}: {lawyer.barCouncilId}
          </div>
        </div>

        {/* Availability + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#0e9f6e' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0e9f6e', display: 'inline-block' }} />
            {t('lawyers.pro_bono')}
          </span>
          <button className="btn-primary" onClick={() => setModal(true)} style={{ fontSize: 12, padding: '7px 14px' }}>
            {t('lawyers.contact')}
          </button>
        </div>
      </div>

      {/* Contact modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 20 }} onClick={() => setModal(false)}>
          <div style={{ background: 'white', borderRadius: 16, padding: 28, maxWidth: 400, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontSize: 17, fontWeight: 700 }}>{lawyer.name}</h3>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 20 }}>{lawyer.organization}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href={\`tel:\${lawyer.phone}\`} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 10, padding: '12px 16px', textDecoration: 'none', color: '#0e9f6e', fontSize: 14, fontWeight: 600 }}>
                <Phone size={16} /> {lawyer.phone}
              </a>
              <a href={\`mailto:\${lawyer.email}\`} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', textDecoration: 'none', color: '#1a56db', fontSize: 14, fontWeight: 600 }}>
                <Mail size={16} /> {lawyer.email}
              </a>
            </div>
            <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 16, textAlign: 'center' }}>{t('lawyers.disclaimer')}</p>
          </div>
        </div>
      )}
    </>
  );
}
`);

w('components/lawyers/LawyerFilters.tsx',
`'use client';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';

interface Props {
  cities: string[];
  areas: string[];
  langs: string[];
  city: string; area: string; lang: string; query: string;
  onChange: (key: string, val: string) => void;
}

export default function LawyerFilters({ cities, areas, langs, city, area, lang, query, onChange }: Props) {
  const { t } = useTranslation();
  const selStyle = { border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '9px 12px', fontSize: 13, background: 'white', outline: 'none', color: '#374151', cursor: 'pointer', minWidth: 140 };

  return (
    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 180, border: '1.5px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', background: 'white' }}>
        <Search size={15} color="#94a3b8" />
        <input value={query} onChange={e => onChange('query', e.target.value)} placeholder="Search lawyers..." style={{ border: 'none', outline: 'none', fontSize: 13, width: '100%', background: 'transparent', color: '#0f172a' }} />
      </div>
      <select value={city} onChange={e => onChange('city', e.target.value)} style={selStyle}>
        <option value="">{t('lawyers.all_cities')}</option>
        {cities.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={area} onChange={e => onChange('area', e.target.value)} style={selStyle}>
        <option value="">{t('lawyers.all_areas')}</option>
        {areas.map(a => <option key={a} value={a}>{a.replace(/-/g, ' ')}</option>)}
      </select>
      <select value={lang} onChange={e => onChange('lang', e.target.value)} style={selStyle}>
        <option value="">{t('lawyers.all_langs')}</option>
        {langs.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
    </div>
  );
}
`);

console.log('BATCH 5 DONE');
