'use client';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Scale, Check, Sparkles, ShieldCheck, Info,
  Search, X, ExternalLink, ChevronDown, ChevronUp,
  Star, ArrowUpRight, BookOpen, Gavel, FileText,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Situation } from '../../types';

// ── Hindi translations for common legal fullText content ──────────────────────
// We translate the English fullText into Hindi on-the-fly by mapping known patterns
function getHindiFullText(law: any): string {
  const s = law.section || '';
  const act = law.act || '';

  // We build a Hindi version from the summary + section context
  const summary = law.summary?.hi || '';
  const hiRef = `${s}, ${act}`;

  // Return a rich Hindi explanation derived from summary + known translations
  const hiContent = law.fullTextHi || null;
  if (hiContent) return hiContent;

  // Fallback: combine section reference + Hindi summary
  return `${hiRef}\n\n${summary}\n\n(विस्तृत हिंदी पाठ के लिए कृपया AI अनुवाद पैनल देखें।)`;
}

// ── Parse a wall-of-text fullText into individual article cards ───────────────
interface ArticleCard {
  badge: string;       // e.g. "Art. 21", "Sec. 154"
  title: string;       // e.g. "Protection of life and personal liberty"
  body: string;        // the actual text
  tags: string[];      // plain-English concept tags
}

function parseIntoCards(fullText: string): ArticleCard[] {
  if (!fullText) return [];

  // Split by double newline first, then try to detect "Article X" / "Section X" headers
  const paragraphs = fullText.split(/\n\n+/).filter(p => p.trim());

  // Regex to detect common legal article/section headers
  const headerRegex = /^(Article\s+\d+[\w()\./]*|Section\s+\d+[\w()\./]*|Rule\s+\d+[\w()\./]*|Clause\s+\d+[\w()\.]*)/i;

  const cards: ArticleCard[] = [];

  for (const para of paragraphs) {
    const match = para.match(headerRegex);
    if (match) {
      const header = match[1];
      const rest = para.slice(header.length).replace(/^[:\s–—-]+/, '').trim();

      // Extract the title (text before a dash or period)
      const titleMatch = rest.match(/^([^.—–\n]+(?:\.(?!\s*\()|[^.—–\n])*?)(?:\s*[-–—]\s*|\.\s+|:\s+)(.+)/s);
      const title = titleMatch ? titleMatch[1].trim() : rest.slice(0, 60).trim();
      const body = titleMatch ? titleMatch[2].trim() : rest;

      // Generate a short badge
      const badgeParts = header.split(/\s+/);
      const badge = badgeParts.length >= 2
        ? `${badgeParts[0].slice(0, 3)}. ${badgeParts.slice(1).join(' ')}`
        : header;

      cards.push({ badge, title, body, tags: inferTags(header + ' ' + title + ' ' + body) });
    } else {
      // No clear header — treat as one card with a generic badge
      const words = para.split(/\s+/);
      const preview = words.slice(0, 8).join(' ');
      cards.push({ badge: '§', title: preview, body: para, tags: inferTags(para) });
    }
  }

  return cards.length > 0 ? cards : [{ badge: '§', title: 'Full Text', body: fullText, tags: inferTags(fullText) }];
}

function inferTags(text: string): string[] {
  const lower = text.toLowerCase();
  const tagMap: [string, string][] = [
    ['evict|tenancy|rent|landlord', 'Eviction'],
    ['deposit|security deposit', 'Deposit'],
    ['shelter|livelihood|housing', 'Shelter'],
    ['equality|equal protection|discrimination', 'Equality'],
    ['liberty|personal liberty|life', 'Liberty'],
    ['arrest|custody|detain', 'Arrest'],
    ['fir|information|cognizable', 'FIR'],
    ['consumer|goods|services|defect', 'Consumer'],
    ['harassment|sexual|workplace', 'Harassment'],
    ['bail|anticipatory', 'Bail'],
    ['property|immovable|transfer', 'Property'],
    ['information|transparency|rti', 'RTI'],
    ['domestic violence|aggrieved|respondent', 'Domestic Violence'],
    ['wages|minimum wage|salary', 'Wages'],
    ['compensation|damages|remedy', 'Compensation'],
    ['appeal|commission|tribunal', 'Appeals'],
  ];
  const result: string[] = [];
  for (const [pattern, tag] of tagMap) {
    if (new RegExp(pattern, 'i').test(lower)) result.push(tag);
    if (result.length >= 4) break;
  }
  return result;
}

// ── Tag chip ─────────────────────────────────────────────────────────────────
function TagChip({ tag }: { tag: string }) {
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: '#FAF4EE', color: '#923c22', border: '1px solid #EAE1DA',
      display: 'inline-block', lineHeight: 1.8,
    }}>{tag}</span>
  );
}

// ── Single article card ───────────────────────────────────────────────────────
function ArticleCardView({ card, index, isHighlight }: { card: ArticleCard; index: number; isHighlight: boolean }) {
  const [expanded, setExpanded] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: isHighlight ? '2px solid #D4963A' : '1.5px solid #EAE1DA',
        background: isHighlight ? '#FFFBF3' : 'white',
        boxShadow: isHighlight ? '0 4px 20px rgba(212,150,58,0.12)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.2s'
      }}
    >
      {/* Card header */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: '100%', textAlign: 'left', padding: '14px 16px',
          display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer',
          background: 'none', border: 'none',
          borderLeft: isHighlight ? '4px solid #D4963A' : '4px solid #EAE1DA',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#FAF4EE')}
        onMouseLeave={e => (e.currentTarget.style.background = 'none')}
      >
        <span style={{
          flexShrink: 0, padding: '3px 10px', borderRadius: 20, fontSize: 11,
          fontWeight: 800, letterSpacing: '0.02em',
          background: isHighlight ? '#FEF3C7' : '#FAF4EE',
          color: isHighlight ? '#B45309' : '#923c22',
          border: `1px solid ${isHighlight ? '#FDE68A' : '#EAE1DA'}`,
          marginTop: 1, whiteSpace: 'nowrap',
        }}>{card.badge}</span>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 14, color: '#1A1A1A', margin: 0, lineHeight: 1.4 }}>
            {card.title.slice(0, 80)}{card.title.length > 80 ? '…' : ''}
          </p>
          {isHighlight && (
            <p style={{ fontSize: 11, color: '#D97706', fontWeight: 600, margin: '3px 0 0 0' }}>
              ★ Most relevant to your situation
            </p>
          )}
        </div>
        <span style={{ color: '#9CA3AF', flexShrink: 0, marginTop: 3 }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{
              padding: '0 16px 16px 44px',
              fontSize: 13.5, color: '#3A3A3A', lineHeight: 1.75,
              fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap',
            }}>
              {card.body}
            </div>
            {card.tags.length > 0 && (
              <div style={{ padding: '0 16px 14px 44px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {card.tags.map(t => <TagChip key={t} tag={t} />)}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Remedy pill ───────────────────────────────────────────────────────────────
function RemedyPill({ text }: { text: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '6px 14px', borderRadius: 24,
      background: '#EFF6FF', color: '#1D4ED8',
      border: '1px solid #BFDBFE', fontSize: 13, fontWeight: 600,
      lineHeight: 1,
    }}>
      <Gavel size={12} /> {text}
    </span>
  );
}

// ── Action button ─────────────────────────────────────────────────────────────
function ActionButton({ label, href, icon }: { label: string; href?: string; icon: React.ReactNode }) {
  const inner = (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '10px 18px', borderRadius: 24, fontWeight: 700, fontSize: 14,
      background: '#923c22', color: 'white', cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(146,60,34,0.3)', transition: 'all 0.2s',
    }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.background = '#7B3B2A';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.background = '#923c22';
        (e.currentTarget as HTMLElement).style.transform = 'none';
      }}
    >
      {icon} {label} <ArrowUpRight size={14} />
    </span>
  );
  if (href) return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>{inner}</a>;
  return <div>{inner}</div>;
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function DualDisplayPanel({ situation }: { situation: Situation }) {
  const { i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch AI explanation
  useEffect(() => {
    setLoading(true);
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: situation.id, lang }),
    })
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { if (!data || data.error) throw new Error(); setAiData(data); setLoading(false); })
      .catch(() => {
        setAiData({
          summary: situation.description[lang],
          rights: situation.rights.map((r: any) => r.title[lang] + ': ' + r.description[lang]),
          what_you_can_do: situation.steps.map((s: any) => s.title[lang]),
          disclaimer: isHi
            ? 'यह कानूनी जानकारी है, कानूनी सलाह नहीं।'
            : 'This is legal information, not legal advice.',
        });
        setLoading(false);
      });
  }, [situation, lang, isHi]);

  // Build article cards from all laws
  const allCards = useMemo(() => {
    const result: { lawIndex: number; cardIndex: number; card: ArticleCard; isHighlight: boolean }[] = [];
    situation.laws.forEach((law: any, li: number) => {
      const rawText = isHi ? getHindiFullText(law) : (law.fullText || '');
      const cards = parseIntoCards(rawText);
      cards.forEach((card, ci) => {
        result.push({ lawIndex: li, cardIndex: ci, card, isHighlight: li === 0 && ci === 0 });
      });
    });
    return result;
  }, [situation, isHi]);

  // Filter cards by search
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return allCards;
    const q = searchQuery.toLowerCase();
    return allCards.filter(({ card }) =>
      card.badge.toLowerCase().includes(q) ||
      card.title.toLowerCase().includes(q) ||
      card.body.toLowerCase().includes(q) ||
      card.tags.some(t => t.toLowerCase().includes(q))
    );
  }, [allCards, searchQuery]);

  // Legal remedies from rights
  const remedies = situation.rights.map((r: any) => r.title[lang]);

  // Action items
  const actionLinks: { label: string; href: string; icon: React.ReactNode }[] = [
    { label: isHi ? 'NALSA — मुफ्त सहायता' : 'NALSA Free Legal Aid', href: 'https://nalsa.gov.in', icon: <Scale size={14} /> },
    { label: isHi ? 'ई-कोर्ट स्थिति' : 'eCourts Status', href: 'https://ecourts.gov.in', icon: <FileText size={14} /> },
  ];

  return (
    <div className="w-full flex flex-col bg-white border-t border-[#EAE1DA] -mx-5">
      <div className="flex flex-wrap">

        {/* ══ LEFT: Original Legal Text ══════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-[320px] bg-[#FAF4EE]/80 border-r border-[#EAE1DA] relative overflow-hidden"
          style={{ padding: '32px 28px' }}
        >
          {/* Panel header */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #EAE1DA', borderRadius: 24, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#6A564A', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <Scale size={13} style={{ color: '#923c22' }} />
                {isHi ? 'मूल कानूनी पाठ' : 'Original Legal Text'}
              </div>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                {allCards.length} {isHi ? 'अनुच्छेद' : 'articles'}
              </span>
            </div>

            {/* Search bar */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'अनुच्छेद खोजें...' : 'Search articles...'}
                style={{
                  width: '100%', padding: '9px 36px 9px 36px',
                  borderRadius: 10, border: '1.5px solid #E5E7EB',
                  fontSize: 13, outline: 'none', background: 'white',
                  fontFamily: hFont, boxSizing: 'border-box', transition: 'border-color 0.2s'
                }}
                onFocus={e => (e.target.style.borderColor = '#923c22')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 0 }}>
                  <X size={15} />
                </button>
              )}
            </div>
          </div>

          {/* Most relevant highlight callout */}
          {!searchQuery && allCards.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                background: '#FFF8E6', border: '1.5px solid #F5C963',
                borderRadius: 12, padding: '10px 14px', marginBottom: 16,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <Star size={14} style={{ color: '#D97706', flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: '#92400E', margin: 0, fontWeight: 600, fontFamily: hFont }}>
                {isHi
                  ? `"${allCards[0].card.badge}" — आपकी स्थिति के लिए सबसे अधिक प्रासंगिक`
                  : `"${allCards[0].card.badge}" is highlighted as most relevant to your situation`}
              </p>
            </motion.div>
          )}

          {/* Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredCards.length === 0 ? (
              <div style={{ padding: '32px 0', textAlign: 'center', color: '#9CA3AF' }}>
                <BookOpen size={32} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                <p style={{ fontSize: 14 }}>{isHi ? 'कोई अनुच्छेद नहीं मिला' : 'No articles match your search'}</p>
              </div>
            ) : filteredCards.map(({ card, cardIndex, lawIndex, isHighlight }, gi) => (
              <ArticleCardView
                key={`${lawIndex}-${cardIndex}`}
                card={card}
                index={gi}
                isHighlight={isHighlight && !searchQuery}
              />
            ))}
          </div>

          {/* Law acts */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #EAE1DA' }}>
            {situation.laws.map((law: any, i: number) => (
              <p key={i} style={{ fontSize: 12, color: '#9CA3AF', margin: '4px 0', fontStyle: 'italic' }}>
                {law.section}, {law.act}
              </p>
            ))}
          </div>
        </motion.div>

        {/* ══ RIGHT: AI Plain Translation ════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 min-w-[320px] bg-white relative overflow-hidden"
          style={{ padding: '32px 28px' }}
        >
          {/* Panel header */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E0ECD6', border: '1px solid #C6D9BA', borderRadius: 24, padding: '5px 14px', fontSize: 12, fontWeight: 700, color: '#455B3C', marginBottom: 20 }}>
            <Sparkles size={13} className="animate-pulse" />
            {isHi ? 'AI द्वारा सरल अनुवाद' : 'AI Plain Translation'}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[100, 85, 92, 78].map((w, i) => (
                    <div key={i} style={{ height: 16, width: `${w}%`, background: '#F1F5F9', borderRadius: 8, animation: 'pulse 2s infinite' }} />
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, color: '#923c22' }}>
                  <div style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontSize: 13, fontStyle: 'italic', fontFamily: hFont, margin: 0 }}>
                    {isHi ? 'NyayaMitra AI विश्लेषण कर रहा है...' : 'NyayaMitra AI is analyzing...'}
                  </p>
                </div>
              </motion.div>
            ) : aiData ? (
              <motion.div key="content" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                {/* Summary callout box */}
                <div style={{ background: '#FAF4EE', borderRadius: 14, padding: 20, borderLeft: '4px solid #923c22', boxShadow: '0 2px 8px rgba(146,60,34,0.06)' }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#923c22', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {isHi ? 'आपकी स्थिति का सारांश' : 'Plain-English Summary'}
                  </p>
                  <p style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.65, margin: 0, fontFamily: hFont, fontWeight: 600 }}>
                    {aiData.summary}
                  </p>
                </div>

                {/* Your rights — checkmarks */}
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#455B3C', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Check size={13} /> {isHi ? 'आपके अधिकार' : 'Your Rights'}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {aiData.rights.map((right: string, i: number) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 + i * 0.07 }}
                        style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}
                      >
                        <div style={{ width: 22, height: 22, borderRadius: 6, background: '#E0ECD6', color: '#455B3C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <Check size={13} strokeWidth={3} />
                        </div>
                        <p style={{ fontSize: 14, color: '#3A3A3A', lineHeight: 1.55, margin: 0, fontFamily: hFont }}>{right}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Key protection */}
                {aiData.key_protection && (
                  <motion.div
                    initial={{ scale: 0.97, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    style={{ background: '#FFF9EC', borderRadius: 12, padding: 16, border: '1px solid #F5E0A0' }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#B45309', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <ShieldCheck size={14} /> {isHi ? 'मुख्य सुरक्षा' : 'Key Protection'}
                    </p>
                    <p style={{ fontSize: 14, color: '#78350F', lineHeight: 1.55, margin: 0, fontFamily: hFont }}>
                      {aiData.key_protection}
                    </p>
                  </motion.div>
                )}

                {/* Legal Remedies — pill chips */}
                {remedies.length > 0 && (
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#1D4ED8', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Gavel size={13} /> {isHi ? 'कानूनी उपाय' : 'Legal Remedies'}
                    </p>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {remedies.map((r: string, i: number) => <RemedyPill key={i} text={r} />)}
                    </div>
                  </div>
                )}

                {/* What you can do next — action buttons */}
                {aiData.what_you_can_do && aiData.what_you_can_do.length > 0 && (
                  <div style={{ background: '#F9FAFB', borderRadius: 14, padding: 18, border: '1px solid #F3F4F6' }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ArrowRight size={13} /> {isHi ? 'आप क्या कर सकते हैं' : 'What you can do next'}
                    </p>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {actionLinks.map((a, i) => (
                        <ActionButton key={i} label={a.label} href={a.href} icon={a.icon} />
                      ))}
                      {aiData.what_you_can_do.slice(0, 2).map((step: string, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          style={{ display: 'flex', gap: 10, alignItems: 'flex-start', width: '100%', marginTop: 6 }}
                        >
                          <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#923c22', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <p style={{ fontSize: 13.5, color: '#4A4A4A', lineHeight: 1.55, margin: 0, fontFamily: hFont }}>{step}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Disclaimer */}
                <p style={{ fontSize: 11, color: '#B0B0B0', fontStyle: 'italic', borderTop: '1px solid #EAE1DA', paddingTop: 14, margin: 0, fontFamily: hFont }}>
                  {aiData.disclaimer}
                </p>

              </motion.div>
            ) : (
              <p style={{ fontSize: 13, color: '#DC2626', marginTop: 20 }}>
                {isHi ? 'AI लोड नहीं हो सका। पृष्ठ रीफ्रेश करें।' : 'Failed to load AI explanation. Please refresh.'}
              </p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
