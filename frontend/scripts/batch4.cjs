const fs = require('fs');
const path = require('path');
function w(p, c) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, c, 'utf8'); console.log('Created:', p); }

w('app/globals.css',
`@import "tailwindcss";

@theme {
  --color-primary: #1a56db;
  --color-primary-dark: #1141a8;
  --color-accent: #ff6b35;
  --color-success: #0e9f6e;
  --color-warning: #f59e0b;
  --color-surface: #f8fafc;
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-border: #e2e8f0;
  --radius-card: 12px;
  --radius-btn: 8px;
  --radius-pill: 24px;
  --font-sans: 'Inter', 'Noto Sans Devanagari', sans-serif;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { scroll-behavior: smooth; }

body {
  font-family: var(--font-sans);
  background-color: #f8fafc;
  color: #0f172a;
  line-height: 1.6;
}

.hi-text {
  font-family: 'Noto Sans Devanagari', sans-serif;
}

.card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s, transform 0.2s, border-color 0.2s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(26,86,219,0.1);
  border-color: #1a56db;
  transform: translateY(-2px);
}

.btn-primary {
  background: #1a56db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}
.btn-primary:hover { background: #1141a8; transform: translateY(-1px); }
.btn-primary:disabled { background: #94a3b8; cursor: not-allowed; transform: none; }

.btn-secondary {
  background: white;
  color: #1a56db;
  border: 1.5px solid #1a56db;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
}
.btn-secondary:hover { background: #eff6ff; }

.btn-accent {
  background: #ff6b35;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-accent:hover { background: #e85a25; }

.pill {
  border-radius: 24px;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pill-blue { background: #dbeafe; color: #1a56db; }
.pill-green { background: #d1fae5; color: #0e9f6e; }
.pill-orange { background: #ffedd5; color: #ea580c; }
.pill-amber { background: #fef3c7; color: #92400e; }
.pill-pink { background: #fce7f3; color: #9d174d; }
.pill-purple { background: #ede9fe; color: #6d28d9; }

.tab-btn {
  padding: 10px 20px;
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn.active {
  color: #1a56db;
  border-bottom-color: #1a56db;
  font-weight: 700;
}
.tab-btn:hover:not(.active) { color: #1a56db; background: #f0f4ff; }

.law-card {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.7;
}

.input-field {
  width: 100%;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: var(--font-sans);
  transition: border-color 0.2s;
  background: white;
  outline: none;
}
.input-field:focus { border-color: #1a56db; box-shadow: 0 0 0 3px rgba(26,86,219,0.1); }

textarea.input-field { resize: vertical; min-height: 80px; }

.label { font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 4px; display: block; }

.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  border-radius: 6px;
}
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.page-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

@media (max-width: 768px) {
  .page-container { padding: 0 16px; }
}
`);

w('components/shared/I18nProvider.tsx',
`'use client';
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
`);

w('components/shared/LanguageToggle.tsx',
`'use client';
import { useTranslation } from 'react-i18next';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const toggle = (l: 'en' | 'hi') => {
    i18n.changeLanguage(l);
    localStorage.setItem('nyayasaathi_lang', l);
  };

  return (
    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: 24, padding: '3px', gap: '2px', border: '1px solid #e2e8f0' }}>
      <button
        onClick={() => toggle('en')}
        style={{
          padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: lang === 'en' ? '#1a56db' : 'transparent',
          color: lang === 'en' ? 'white' : '#475569',
          transition: 'all 0.2s',
        }}
      >EN</button>
      <button
        onClick={() => toggle('hi')}
        style={{
          padding: '5px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
          background: lang === 'hi' ? '#1a56db' : 'transparent',
          color: lang === 'hi' ? 'white' : '#475569',
          transition: 'all 0.2s',
          fontFamily: 'Noto Sans Devanagari, sans-serif',
        }}
      >हिंदी</button>
    </div>
  );
}
`);

w('components/shared/ResponsibleAIBadge.tsx',
`'use client';
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
`);

w('components/shared/ProgressStepper.tsx',
`'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface Step { label: string; href?: string; done: boolean; active: boolean; }

export default function ProgressStepper({ steps }: { steps: Step[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '12px 20px', background: 'white', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step.done ? '#0e9f6e' : step.active ? '#1a56db' : '#e2e8f0',
              color: step.done || step.active ? 'white' : '#94a3b8',
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {step.done ? <Check size={13} /> : i + 1}
            </div>
            {step.href && !step.active ? (
              <Link href={step.href} style={{ fontSize: 13, color: step.done ? '#0e9f6e' : '#475569', textDecoration: 'none', fontWeight: step.active ? 700 : 400 }}>{step.label}</Link>
            ) : (
              <span style={{ fontSize: 13, color: step.active ? '#1a56db' : step.done ? '#0e9f6e' : '#94a3b8', fontWeight: step.active ? 700 : 400 }}>{step.label}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 32, height: 2, background: steps[i+1].done || steps[i+1].active ? '#1a56db' : '#e2e8f0', margin: '0 8px', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}
`);

w('components/layout/DisclaimerBanner.tsx',
`'use client';
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
`);

w('components/layout/Navbar.tsx',
`'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Scale, Menu, X } from 'lucide-react';
import LanguageToggle from '../shared/LanguageToggle';

export default function Navbar() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { href: '/situations', label: t('nav.situations') },
    { href: '/lawyers', label: t('nav.lawyers') },
    { href: '/about', label: t('nav.about') },
  ];

  return (
    <nav style={{
      background: 'white', borderBottom: '1px solid #e2e8f0',
      position: 'sticky', top: 0, zIndex: 50,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ background: '#1a56db', borderRadius: 8, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Scale size={18} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.3px' }}>
            Nyaya<span style={{ color: '#1a56db' }}>Saathi</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {links.map(l => (
              <Link key={l.href} href={l.href} style={{
                padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
                color: '#475569', textDecoration: 'none', transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#f0f4ff'; (e.target as HTMLElement).style.color = '#1a56db'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = 'transparent'; (e.target as HTMLElement).style.color = '#475569'; }}
              >{l.label}</Link>
            ))}
          </div>
          <LanguageToggle />
          <button onClick={() => setOpen(v => !v)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer' }} className="mobile-menu-btn" aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div style={{ background: 'white', borderTop: '1px solid #e2e8f0', padding: 16 }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: 'block', padding: '12px 8px', fontSize: 15, fontWeight: 500,
              color: '#0f172a', textDecoration: 'none', borderBottom: '1px solid #f1f5f9',
            }}>{l.label}</Link>
          ))}
          <div style={{ marginTop: 14 }}><LanguageToggle /></div>
        </div>
      )}

      <style>{
        \`@media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          nav > div > div:last-child > a { display: none; }
        }\`
      }</style>
    </nav>
  );
}
`);

w('app/layout.tsx',
`import type { Metadata } from 'next';
import './globals.css';
import I18nProvider from '../components/shared/I18nProvider';
import Navbar from '../components/layout/Navbar';
import DisclaimerBanner from '../components/layout/DisclaimerBanner';

export const metadata: Metadata = {
  title: 'NyayaSaathi — Free Legal Aid Platform',
  description: 'AI-powered bilingual legal aid platform for India. Know your rights, generate documents, and find pro bono lawyers.',
  keywords: 'legal aid India, free lawyer, RTI application, consumer complaint, FIR filing, bilingual',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <I18nProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 61px)', display: 'flex', flexDirection: 'column' }}>
            {children}
          </main>
          <DisclaimerBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
`);

console.log('BATCH 4 DONE');
