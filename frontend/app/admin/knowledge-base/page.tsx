'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Database, Search, ExternalLink, BookOpen, Scale, ShieldAlert,
  Loader2, AlertCircle, FileText, Tag, ArrowUpRight, RefreshCw,
  ChevronRight, Gavel, Landmark, Car, Briefcase, Heart, Wifi,
  Filter, X
} from 'lucide-react';

const PYTHON_URL = process.env.NEXT_PUBLIC_PYTHON_URL || 'http://localhost:8000';

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  constitutional: { label: 'Constitutional', color: '#7C3AED', bg: '#F5F3FF', icon: <Landmark size={13} /> },
  criminal:       { label: 'Criminal Law',  color: '#DC2626', bg: '#FEF2F2', icon: <Gavel size={13} /> },
  civil:          { label: 'Civil Law',     color: '#2563EB', bg: '#EFF6FF', icon: <Scale size={13} /> },
  consumer:       { label: 'Consumer',      color: '#D97706', bg: '#FFFBEB', icon: <ShieldAlert size={13} /> },
  rti:            { label: 'RTI',           color: '#059669', bg: '#ECFDF5', icon: <FileText size={13} /> },
  labour:         { label: 'Labour Law',    color: '#0891B2', bg: '#ECFEFF', icon: <Briefcase size={13} /> },
  family:         { label: 'Family Law',    color: '#DB2777', bg: '#FDF2F8', icon: <Heart size={13} /> },
  cyber:          { label: 'Cyber Law',     color: '#6D28D9', bg: '#F5F3FF', icon: <Wifi size={13} /> },
  general:        { label: 'General',       color: '#6B7280', bg: '#F9FAFB', icon: <BookOpen size={13} /> },
};

interface KBDoc {
  id: string;
  title: string;
  category: string;
  source_url: string;
  filename: string;
  created_at: string;
}

interface KBChunk {
  id: string;
  title: string;
  category: string;
  source_url: string;
  score: number;
  preview: string;
}

export default function AdminKnowledgeBase() {
  const { user } = useAuth();
  const router = useRouter();

  const [docs, setDocs] = useState<KBDoc[]>([]);
  const [totalChunks, setTotalChunks] = useState(0);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [docsError, setDocsError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<KBChunk[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<string>('all');

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user) { router.push('/'); return; }
    if (!user.roles?.includes('ROLE_ADMIN')) { router.push('/'); return; }
    fetchDocs();
  }, [user, router]);

  // ── Fetch all KB documents ──────────────────────────────────────────────────
  const fetchDocs = useCallback(async () => {
    setLoadingDocs(true);
    setDocsError(null);
    try {
      const res = await fetch(`${PYTHON_URL}/search/knowledge-base`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setDocs(data.documents || []);
      setTotalChunks(data.total_chunks || 0);
    } catch (e: any) {
      setDocsError(e.message || 'Failed to load knowledge base');
    } finally {
      setLoadingDocs(false);
    }
  }, []);

  // ── Semantic search ─────────────────────────────────────────────────────────
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setSearching(true);
    setSearchError(null);
    setSearchResults(null);
    try {
      const res = await fetch(`${PYTHON_URL}/search/knowledge-base/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim(), top_k: 8 }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (e: any) {
      setSearchError(e.message || 'Search failed');
    } finally {
      setSearching(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults(null);
    setSearchError(null);
  };

  // ── Derived data ────────────────────────────────────────────────────────────
  const categories = ['all', ...Array.from(new Set(docs.map(d => d.category)))];
  const filteredDocs = activeCategory === 'all' ? docs : docs.filter(d => d.category === activeCategory);

  const getCategoryMeta = (cat: string) =>
    CATEGORY_META[cat] ?? CATEGORY_META['general'];

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    docs.forEach(d => { stats[d.category] = (stats[d.category] || 0) + 1; });
    return stats;
  };

  if (!user || !user.roles?.includes('ROLE_ADMIN')) return null;

  const catStats = getCategoryStats();

  return (
    <div style={{ background: '#FCF5EF', minHeight: '100vh', padding: '32px 20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#923c22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1A1A', margin: 0 }}>
                Knowledge Base Explorer
              </h1>
              <p style={{ fontSize: 14, color: '#6B7280', margin: 0 }}>
                Admin panel — browse and semantically search indexed legal documents
              </p>
            </div>
          </div>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Chunks', value: totalChunks, color: '#923c22' },
            { label: 'Unique Documents', value: docs.length, color: '#2563EB' },
            { label: 'Categories', value: Object.keys(catStats).length, color: '#059669' },
          ].map(stat => (
            <div key={stat.label} style={{ background: 'white', borderRadius: 14, padding: '20px 24px', border: '1px solid #EAE1DA', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Semantic Search ────────────────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #EAE1DA', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', marginBottom: 28 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={20} color="#923c22" /> Semantic Search
            <span style={{ fontSize: 12, fontWeight: 400, color: '#9CA3AF', marginLeft: 8 }}>
              Search by meaning — e.g. "rights when arrested", "file consumer complaint"
            </span>
          </h2>

          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a legal query to search the knowledge base..."
                style={{
                  width: '100%', padding: '13px 44px 13px 16px', borderRadius: 10,
                  border: '1.5px solid #E5E7EB', fontSize: 15, outline: 'none',
                  fontFamily: 'Inter, sans-serif', boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => (e.target.style.borderColor = '#923c22')}
                onBlur={e => (e.target.style.borderColor = '#E5E7EB')}
              />
              {query && (
                <button onClick={clearSearch} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              disabled={searching || !query.trim()}
              style={{
                padding: '13px 24px', background: searching ? '#B5897A' : '#923c22',
                color: 'white', border: 'none', borderRadius: 10, cursor: searching ? 'not-allowed' : 'pointer',
                fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, transition: 'background 0.2s'
              }}
            >
              {searching ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={18} />}
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          {searchError && (
            <div style={{ marginTop: 16, padding: 14, background: '#FFF0F0', border: '1px solid #FFD6D6', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', color: '#DC2626' }}>
              <AlertCircle size={16} /> {searchError}
            </div>
          )}

          {searchResults && (
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 13, color: '#6B7280', marginBottom: 12 }}>
                Found <strong>{searchResults.length}</strong> relevant chunks for "{query}"
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {searchResults.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
                    No relevant chunks found. Try a different query.
                  </div>
                ) : (
                  searchResults.map((chunk, i) => {
                    const cm = getCategoryMeta(chunk.category);
                    const scorePercent = Math.round(chunk.score * 100);
                    return (
                      <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 10, padding: 16, background: '#FAFAFA', transition: 'box-shadow 0.2s' }}
                           onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                           onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: cm.bg, color: cm.color, borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                              {cm.icon} {cm.label}
                            </span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{chunk.title}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <div style={{ width: 60, height: 6, background: '#E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${scorePercent}%`, height: '100%', background: scorePercent > 70 ? '#059669' : scorePercent > 50 ? '#D97706' : '#6B7280', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 12, color: scorePercent > 70 ? '#059669' : '#6B7280', fontWeight: 600 }}>{scorePercent}%</span>
                            </div>
                            {chunk.source_url && (
                              <a href={chunk.source_url} target="_blank" rel="noopener noreferrer"
                                 style={{ color: '#923c22', display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, textDecoration: 'none' }}>
                                Source <ArrowUpRight size={12} />
                              </a>
                            )}
                          </div>
                        </div>
                        <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.6, margin: 0, fontFamily: 'Georgia, serif' }}>
                          {chunk.preview}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Indexed Documents Browser ──────────────────────────────────────── */}
        <div style={{ background: 'white', borderRadius: 16, padding: 28, border: '1px solid #EAE1DA', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', display: 'flex', alignItems: 'center', gap: 8 }}>
              <BookOpen size={20} color="#923c22" /> Indexed Documents
            </h2>
            <button onClick={fetchDocs} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#FCF5EF', border: '1px solid #EAE1DA', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#923c22', fontWeight: 500 }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
            <Filter size={14} style={{ color: '#9CA3AF', marginTop: 7 }} />
            {categories.map(cat => {
              const cm = cat === 'all' ? { label: 'All', color: '#923c22', bg: '#FCF5EF' } : getCategoryMeta(cat);
              const isActive = activeCategory === cat;
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', border: 'none',
                  background: isActive ? (cat === 'all' ? '#923c22' : cm.color) : cm.bg,
                  color: isActive ? 'white' : (cat === 'all' ? '#923c22' : cm.color),
                  transition: 'all 0.15s'
                }}>
                  {cm.label} {cat !== 'all' && catStats[cat] ? `(${catStats[cat]})` : ''}
                </button>
              );
            })}
          </div>

          {/* Docs list */}
          {loadingDocs ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <Loader2 size={28} color="#923c22" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          ) : docsError ? (
            <div style={{ padding: 20, background: '#FFF0F0', border: '1px solid #FFD6D6', borderRadius: 8, display: 'flex', gap: 10, alignItems: 'center', color: '#DC2626' }}>
              <AlertCircle size={16} /> {docsError}
              <span style={{ fontSize: 13 }}>— Is the Python backend running at {PYTHON_URL}?</span>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>
              <Database size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p>No documents found in this category.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredDocs.map((doc, i) => {
                const cm = getCategoryMeta(doc.category);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                    border: '1px solid #F3F4F6', borderRadius: 10, background: '#FAFAFA',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#D1D5DB'; e.currentTarget.style.background = 'white'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#F3F4F6'; e.currentTarget.style.background = '#FAFAFA'; }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: cm.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ color: cm.color }}>{cm.icon}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.title || doc.filename || doc.id}
                      </div>
                      <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                        ID: {doc.id} &nbsp;·&nbsp; {doc.created_at?.split('T')[0] || ''}
                      </div>
                    </div>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', background: cm.bg, color: cm.color, borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                      {cm.icon} {cm.label}
                    </span>
                    {doc.source_url ? (
                      <a href={doc.source_url} target="_blank" rel="noopener noreferrer"
                         style={{ color: '#923c22', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
                         onClick={e => e.stopPropagation()}>
                        <ExternalLink size={14} /> Source
                      </a>
                    ) : (
                      <span style={{ fontSize: 12, color: '#D1D5DB', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ExternalLink size={14} /> No URL
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
