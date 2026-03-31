'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Scale, ArrowRight, Shield, Users, BookOpen } from 'lucide-react';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const trusts = [
    { icon: <Scale size={22} color="#1a56db" />, num: t('home.trust1_num'), label: t('home.trust1_label') },
    { icon: <Shield size={22} color="#0e9f6e" />, num: t('home.trust2_num'), label: t('home.trust2_label') },
    { icon: <BookOpen size={22} color="#ff6b35" />, num: t('home.trust3_num'), label: t('home.trust3_label') },
  ];

  return (
    <div style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1a56db 100%)', minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Watermark SVG */}
        <div style={{ position: 'absolute', right: '-80px', top: '50%', transform: 'translateY(-50%)', opacity: 0.04 }}>
          <Scale size={500} color="white" />
        </div>
        <div className="page-container" style={{ padding: '80px 20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 680 }}>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24, padding: '6px 16px', marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0e9f6e', display: 'inline-block' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>Free • Bilingual • AI-Powered</span>
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 16, color: 'white', fontFamily: hFont }}>
              {isHi ? (
                <><span style={{ color: '#ff6b35' }}>अपना हक</span> जानिए</>
              ) : (
                <><span style={{ color: '#ff6b35' }}>Know</span> Your Rights</>
              )}
            </h1>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, marginBottom: 36, maxWidth: 520, fontFamily: hFont }}>
              {t('home.hero_sub')}
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/situations" style={{
                background: '#ff6b35', color: 'white', padding: '14px 28px', borderRadius: 10,
                fontWeight: 700, fontSize: 16, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 8px 20px rgba(255,107,53,0.35)',
                transition: 'transform 0.2s',
              }}>
                {t('home.cta')} <ArrowRight size={18} />
              </Link>
              <Link href="/lawyers" style={{
                background: 'rgba(255,255,255,0.12)', color: 'white', padding: '14px 28px', borderRadius: 10,
                fontWeight: 600, fontSize: 16, textDecoration: 'none', border: '1.5px solid rgba(255,255,255,0.25)',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}>
                <Users size={18} /> Find a Lawyer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section style={{ background: 'white', borderBottom: '1px solid #e2e8f0' }}>
        <div className="page-container" style={{ padding: '32px 20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
            {trusts.map((tr, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 24px', borderRight: i < trusts.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {tr.icon}
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{tr.num}</p>
                  <p style={{ fontSize: 12, color: '#64748b', fontFamily: hFont }}>{tr.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '64px 0', background: '#f8fafc' }}>
        <div className="page-container">
          <h2 style={{ fontSize: 28, fontWeight: 800, textAlign: 'center', color: '#0f172a', marginBottom: 8, fontFamily: hFont }}>How It Works</h2>
          <p style={{ textAlign: 'center', color: '#475569', marginBottom: 48, fontSize: 15 }}>Get legal help in 4 simple steps</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { step: '01', title: 'Select Situation', desc: 'Choose the legal issue you are facing from 7 categories', color: '#1a56db' },
              { step: '02', title: 'Know Your Rights', desc: 'Get plain-language rights explanation with verified law text', color: '#0e9f6e' },
              { step: '03', title: 'Prepare Documents', desc: 'Interactive checklist tells you exactly what to gather', color: '#ff6b35' },
              { step: '04', title: 'Take Action', desc: 'Generate documents and connect with pro bono lawyers', color: '#6d28d9' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 14, padding: 24, border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: 48, fontWeight: 900, color: s.color, opacity: 0.08, position: 'absolute', top: -4, right: 12, lineHeight: 1 }}>{s.step}</div>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, marginBottom: 14 }}>{s.step}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(135deg, #1a56db, #0e9f6e)', padding: '48px 20px' }}>
        <div className="page-container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 12, fontFamily: hFont }}>Ready to know your rights?</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 28, fontSize: 15 }}>No registration required. Free for everyone.</p>
          <Link href="/situations" style={{ background: 'white', color: '#1a56db', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: 16, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            {t('home.cta')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
