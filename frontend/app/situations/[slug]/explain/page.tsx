'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, FileText, ArrowRight, Bot } from 'lucide-react';
import DualDisplayPanel from '../../../../components/situations/DualDisplayPanel';
import DocumentChecklist from '../../../../components/situations/DocumentChecklist';
import ProcedureStepper from '../../../../components/situations/ProcedureStepper';
import ProgressStepper from '../../../../components/shared/ProgressStepper';
import GeminiChat from '../../../../components/situations/GeminiChat';
import situationsData from '../../../../data/situations';
import type { Situation } from '../../../../types';

export default function ExplainPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const [situation, setSituation] = useState<Situation | null>(situationsData.find(s => s.id === slug) || null);
  const [tab, setTab] = useState<'rights' | 'ai' | 'checklist' | 'procedure' | 'help'>('rights');
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/situations/' + slug)
      .then(r => r.json()).then(d => { if (d && d.id) setSituation(d); }).catch(() => {});
  }, [slug]);

  if (!situation) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
      <div className="skeleton" style={{ width: 200, height: 20 }} />
    </div>
  );

  const [checklistDone, setChecklistDone] = useState(false);
  const lang = i18n.language as 'en' | 'hi';
  
  const steps = [
    { label: t('nav.situations'), href: '/situations', done: true, active: false },
    { label: situation.title[lang], href: '#', done: tab !== 'rights' && tab !== 'ai', active: tab === 'rights' || tab === 'ai' },
    { label: t('explain.tabs.checklist'), href: '#', done: checklistDone, active: tab === 'checklist' || tab === 'procedure' },
    { label: t('explain.generate_docs'), href: `/generate/${situation.id}`, done: false, active: tab === 'help' },
  ];

  const tabs: { key: typeof tab; label: string | React.ReactNode }[] = [
    { key: 'rights', label: t('explain.tabs.rights') },
    { key: 'ai', label: <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Bot size={14} /> {isHi ? 'AI से पूछें' : 'Ask AI'}</span> },
    { key: 'checklist', label: t('explain.tabs.checklist') },
    { key: 'procedure', label: t('explain.tabs.procedure') },
    { key: 'help', label: t('explain.tabs.help') },
  ];

  return (
    <div>
      <ProgressStepper steps={steps} />
      <div style={{ padding: '32px 0 64px' }}>
        <div className="page-container">
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
            <Link href="/situations" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#475569', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
              <ArrowLeft size={14} /> {t('nav.situations')}
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 600, fontFamily: hFont }}>{situation.title[lang]}</span>
          </div>

          {/* Page title */}
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 800, color: '#0f172a', marginBottom: 6, fontFamily: hFont }}>{situation.title[lang]}</h1>
          <p style={{ fontSize: 14, color: '#475569', marginBottom: 28, fontFamily: hFont }}>{situation.description[lang]}</p>

          {/* Tabs */}
          <div style={{ borderBottom: '2px solid #e2e8f0', display: 'flex', gap: 4, overflowX: 'auto', marginBottom: 32 }}>
            {tabs.map(tb => (
              <button key={tb.key} onClick={() => setTab(tb.key as any)} className={`tab-btn ${tab === tb.key ? 'active' : ''}`} style={{ fontFamily: hFont }}>{tb.label}</button>
            ))}
          </div>

          {/* Tab content */}
          {tab === 'rights' && <DualDisplayPanel situation={situation} />}
          {tab === 'ai' && <GeminiChat situation={situation} />}
          {tab === 'checklist' && <DocumentChecklist situation={situation} onCompleteChange={setChecklistDone} />}
          {tab === 'procedure' && <ProcedureStepper situation={situation} />}
          {tab === 'help' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '40px 20px', textAlign: 'center' }}>
               <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <FileText size={28} color="#1a56db" />
               </div>
               <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', fontFamily: hFont }}>{t('explain.get_help_title')}</h2>
               <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
                 <Link href="/lawyers" className="btn-primary">
                   <ArrowRight size={16} /> {t('explain.find_lawyer')}
                 </Link>
                 <Link href={`/generate/${situation.id}`} className="btn-secondary">
                   <FileText size={16} /> {t('explain.generate_docs')}
                 </Link>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
