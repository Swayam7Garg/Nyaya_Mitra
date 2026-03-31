'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Info } from 'lucide-react';

export default function ResponsibleAIBadge() {
  const { t } = useTranslation();
  const [tip, setTip] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <div
        className="pill pill-blue"
        style={{ gap: 6, cursor: 'default', fontSize: 11, padding: '5px 12px' }}
      >
        <Shield size={12} />
        <span>{t('explain.ai_badge')}</span>
        <button
          onMouseEnter={() => setTip(true)}
          onMouseLeave={() => setTip(false)}
          onClick={() => setTip(v => !v)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          aria-label="More information"
        >
          <Info size={12} />
        </button>
      </div>
      {tip && (
        <div style={{
          position: 'absolute', top: '120%', left: 0, zIndex: 100,
          background: '#0f172a', color: 'white', fontSize: 12, lineHeight: 1.5,
          padding: '10px 14px', borderRadius: 8, width: 260,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          Every explanation is shown alongside the original verified law text from IndiaCode, so you can always compare the AI summary with the source.
        </div>
      )}
    </div>
  );
}
