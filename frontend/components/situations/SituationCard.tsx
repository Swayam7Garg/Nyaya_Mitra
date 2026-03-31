'use client';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Home, ShoppingBag, Briefcase, Shield, FileText, HeartHandshake, Landmark, ChevronRight } from 'lucide-react';
import type { Situation } from '../../types';

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Home, ShoppingBag, Briefcase, Shield, FileText, HeartHandshake, Landmark,
};

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
  Housing: { bg: '#eff6ff', text: '#1a56db', border: '#bfdbfe' },
  'Consumer Rights': { bg: '#f0fdf4', text: '#0e9f6e', border: '#bbf7d0' },
  Employment: { bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  Criminal: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  Government: { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' },
  Family: { bg: '#fdf2f8', text: '#9d174d', border: '#fbcfe8' },
  Property: { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' },
};

export default function SituationCard({ situation }: { situation: Situation }) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const Icon = iconMap[situation.icon] || Home;
  const colors = colorMap[situation.category] || colorMap.Housing;

  return (
    <Link href={`/situations/${situation.id}/explain`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 24, cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={22} color={colors.text} />
          </div>
          <div style={{ flex: 1 }}>
            <span className="pill" style={{ fontSize: 10, background: colors.bg, color: colors.text, marginBottom: 6 }}>{situation.category}</span>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginTop: 4, lineHeight: 1.3, fontFamily: lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif' }}>
              {situation.title[lang]}
            </h3>
          </div>
        </div>
        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, flex: 1, fontFamily: lang === 'hi' ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif' }}>
          {situation.description[lang]}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{situation.checklist.length} documents needed</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: colors.text, fontSize: 13, fontWeight: 600 }}>
            View Rights <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
}
