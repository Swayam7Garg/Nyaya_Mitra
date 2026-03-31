'use client';
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
        `@media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          nav > div > div:last-child > a { display: none; }
        }`
      }</style>
    </nav>
  );
}
