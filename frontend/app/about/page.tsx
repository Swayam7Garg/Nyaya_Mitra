'use client';
import { useTranslation } from 'react-i18next';
import { Scale, Shield, BookOpen, Code } from 'lucide-react';

const techStack = ['Next.js 14 (App Router)', 'TypeScript', 'Tailwind CSS', 'i18next (Hindi + English)', 'jsPDF (document generation)', 'Node.js + Express (backend)', 'MongoDB Atlas', 'Google Gemini Flash (AI)'];
const sources = ['IndiaCode (indiacode.nic.in)', 'NALSA (nalsa.gov.in)', 'Consumer Helpline (consumerhelpline.gov.in)', 'RTI Online (rtionline.gov.in)', 'Ministry of Law and Justice'];

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="page-container" style={{ maxWidth: 800 }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', marginBottom: 8, fontFamily: hFont }}>{t('about.title')}</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 48 }}>Building accessible legal aid for India</p>

        {[
          { icon: <Scale size={20} color="#1a56db" />, color: '#eff6ff', title: t('about.mission_title'), content: t('about.mission') },
          { icon: <Shield size={20} color="#0e9f6e" />, color: '#f0fdf4', title: t('about.ai_title'), content: t('about.ai_text') },
        ].map((sec, i) => (
          <div key={i} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 28, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: sec.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{sec.icon}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', fontFamily: hFont }}>{sec.title}</h2>
            </div>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.8, fontFamily: hFont }}>{sec.content}</p>
          </div>
        ))}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Code size={18} color="#6d28d9" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{t('about.tech_title')}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {techStack.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6d28d9', flexShrink: 0 }} /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <BookOpen size={18} color="#ff6b35" />
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>{t('about.sources_title')}</h2>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sources.map(s => (
                <li key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#475569' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ff6b35', flexShrink: 0 }} /> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #1a56db, #6d28d9)', borderRadius: 14, padding: 28, color: 'white', textAlign: 'center' }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: hFont }}>{t('about.team_title')}</h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.7, fontFamily: hFont }}>{t('about.team_text')}</p>
        </div>
      </div>
    </div>
  );
}
