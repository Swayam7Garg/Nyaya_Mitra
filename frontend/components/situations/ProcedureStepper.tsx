'use client';
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
            border: `1.5px solid ${expanded === i ? '#1a56db' : '#e2e8f0'}`,
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
