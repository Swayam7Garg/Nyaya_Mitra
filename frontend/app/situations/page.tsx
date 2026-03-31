'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SituationCard from '../../components/situations/SituationCard';
import situationsData from '../../data/situations';
import type { Situation } from '../../types';

export default function SituationsPage() {
  const { t, i18n } = useTranslation();
  const [situations, setSituations] = useState<Situation[]>(situationsData);
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/situations')
      .then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setSituations(d); })
      .catch(() => {});
  }, []);

  return (
    <div style={{ padding: '48px 0 64px' }}>
      <div className="page-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#0f172a', marginBottom: 10, fontFamily: hFont }}>{t('situations.page_title')}</h1>
          <p style={{ fontSize: 16, color: '#475569', fontFamily: hFont }}>{t('situations.page_sub')}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {situations.map(s => <SituationCard key={s.id} situation={s} />)}
        </div>
      </div>
    </div>
  );
}
