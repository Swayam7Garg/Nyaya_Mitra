'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Info, X } from 'lucide-react';

export default function DisclaimerBanner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem('disclaimer_dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    sessionStorage.setItem('disclaimer_dismissed', '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      background: '#fffbeb', borderTop: '1px solid #fde68a', padding: '10px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 10, position: 'sticky', bottom: 0, zIndex: 40,
    }}>
      <Info size={16} style={{ flexShrink: 0, color: '#92400e', marginTop: 2 }} />
      <p style={{ fontSize: 12, color: '#78350f', flex: 1, lineHeight: 1.5 }}>
        {t('disclaimer.text')}
      </p>
      <button onClick={dismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#92400e', flexShrink: 0 }} aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
