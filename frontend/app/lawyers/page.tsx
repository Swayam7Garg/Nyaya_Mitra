'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Navigation, Info } from 'lucide-react';
import LawyerCard from '../../components/lawyers/LawyerCard';
import LawyerFilters from '../../components/lawyers/LawyerFilters';
import FreeLegalAidModal from '../../components/lawyers/FreeLegalAidModal';
import lawyersData from '../../data/lawyers.json';
import type { Lawyer } from '../../types';

export default function LawyersPage() {
  const { i18n } = useTranslation();
  const [lawyers, setLawyers] = useState<Lawyer[]>(lawyersData as Lawyer[]);
  const [filters, setFilters] = useState({ city: '', area: '', lang: '', query: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch((process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/lawyers')
      .then(r => r.json()).then(d => { if (Array.isArray(d) && d.length) setLawyers(d); }).catch(() => {});
  }, []);

  const cities = [...new Set(lawyers.map(l => l.city))].sort();
  const areas = [...new Set(lawyers.flatMap(l => l.specializations))].sort();
  const langs = [...new Set(lawyers.flatMap(l => l.languages))].sort();

  const filtered = lawyers.filter(l => {
    if (filters.city && l.city !== filters.city) return false;
    if (filters.area && !l.specializations.includes(filters.area)) return false;
    return true;
  });

  const onChange = (key: string, val: string) => setFilters(f => ({ ...f, [key]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 61px)', overflow: 'hidden' }}>
      <LawyerFilters cities={cities} areas={areas} langs={langs} city={filters.city} area={filters.area} lang={filters.lang} query={filters.query} total={filtered.length} onChange={onChange} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Map Section */}
        <div style={{ flex: 1, position: 'relative', background: '#8e9091', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Faked Map Image matching the mockup strictly rendered via CSS details */}
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, opacity: 0.6,
            backgroundImage: 'repeating-radial-gradient(circle at 50% 60%, transparent, transparent 40px, rgba(255,255,255,0.8) 41px, rgba(255,255,255,0.8) 42px), repeating-conic-gradient(from 0deg at 50% 60%, rgba(255,255,255,0.8) 0deg, rgba(255,255,255,0.8) 1deg, transparent 2deg, transparent 15deg)'
          }} />
          
          <div style={{ position: 'absolute', top: '45%', left: '35%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#1a56db', color: 'white', padding: '4px 10px', fontSize: 11, fontWeight: 600, marginBottom: 4 }}>
              Delhi Pro-Bono Clinic
            </div>
            <MapPin size={28} color="#f59e0b" style={{ fill: 'white' }} />
          </div>

          <div style={{ position: 'absolute', top: '48%', left: '15%' }}>
            <MapPin size={24} color="#1a56db" style={{ fill: 'white' }} />
          </div>

          <div style={{ position: 'absolute', top: '60%', left: '50%' }}>
            <MapPin size={24} color="#1a56db" style={{ fill: 'white' }} />
          </div>

          <div style={{ position: 'absolute', bottom: 40, width: '100%', textAlign: 'center', zIndex: 10 }}>
            <h2 style={{ fontSize: 60, fontWeight: 800, color: 'white', margin: 0, lineHeight: 1, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>New Delhi</h2>
            <p style={{ fontSize: 24, color: '#e2e8f0', letterSpacing: 2, margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>SAFTE WORK</p>
          </div>

          {/* Map Controls */}
          <div style={{ position: 'absolute', top: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <button style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 20, fontWeight: 300, borderBottom: '1px solid #e2e8f0' }}>+</button>
              <button style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 28, fontWeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>-</button>
            </div>
            <button style={{ width: 36, height: 36, border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
              <Navigation size={18} />
            </button>
          </div>
        </div>

        {/* List Section */}
        <div style={{ width: 450, background: 'white', display: 'flex', flexDirection: 'column', borderLeft: '1px solid #e2e8f0' }}>
          
          {/* Free Legal Aid Banner */}
          <div style={{ padding: '16px 24px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
             <div>
               <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e3a8a', margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}><Info size={16} /> Eligible for Free Legal Aid?</h3>
               <p style={{ fontSize: 12, color: '#3b82f6', margin: '4px 0 0 0' }}>Learn about NALSA free services under Sec 12.</p>
             </div>
             <button onClick={() => setIsModalOpen(true)} style={{ background: '#1d4ed8', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>Know More</button>
          </div>

          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>Nearest to {filters.city || 'New Delhi'}</span>
            <button style={{ background: 'none', border: 'none', fontSize: 13, color: '#1a56db', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
              <span style={{ fontSize: 16 }}>≡</span> Sort by Distance
            </button>
          </div>
          
          <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1, background: '#fafafa' }}>
            {filtered.map((l, i) => <LawyerCard key={l.id} lawyer={l} selected={i === 0} />)}
          </div>
        </div>
      </div>
      <FreeLegalAidModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
