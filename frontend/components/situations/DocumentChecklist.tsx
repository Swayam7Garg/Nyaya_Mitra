'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckSquare, Square, Download, AlertCircle } from 'lucide-react';
import { generateChecklistPDF } from '../../lib/pdfGenerator';
import type { Situation } from '../../types';

export default function DocumentChecklist({ situation }: { situation: Situation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const hFont = lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';
  const key = `checklist_${situation.id}`;
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
          <div style={{ height: '100%', width: `${(done / total) * 100}%`, background: '#0369a1', borderRadius: 4, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {situation.checklist.map(item => (
          <div key={item.id} onClick={() => toggle(item.id)} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px',
            background: checked[item.id] ? '#f0fdf4' : 'white',
            border: `1.5px solid ${checked[item.id] ? '#86efac' : '#e2e8f0'}`,
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
