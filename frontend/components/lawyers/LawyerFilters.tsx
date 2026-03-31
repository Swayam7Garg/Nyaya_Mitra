'use client';

interface Props {
  cities: string[];
  areas: string[];
  langs: string[];
  city: string; area: string; lang: string; query: string;
  total: number;
  onChange: (key: string, val: string) => void;
}

export default function LawyerFilters({ cities, areas, city, area, total, onChange }: Props) {
  const selStyle = { border: '1px solid #e2e8f0', borderRadius: 4, padding: '8px 12px', fontSize: 13, background: 'white', outline: 'none', color: '#374151', width: '100%' };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 20, padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div style={{ flex: 1, minWidth: 200 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a56db' }}>Legal Aid Directory</h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flex: 2 }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#475569', marginBottom: 6 }}>State</label>
          <select value="" onChange={() => {}} style={selStyle}>
            <option value="">Delhi</option>
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#475569', marginBottom: 6 }}>District</label>
          <select value={city} onChange={e => onChange('city', e.target.value)} style={selStyle}>
            <option value="">All Districts</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#475569', marginBottom: 6 }}>Specialization</label>
          <select value={area} onChange={e => onChange('area', e.target.value)} style={selStyle}>
            <option value="">All Areas</option>
            {areas.map(a => <option key={a} value={a}>{a.replace(/-/g, ' ')}</option>)}
          </select>
        </div>
      </div>
      
      <div style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap', paddingTop: 20 }}>
        Showing {total} results
      </div>
    </div>
  );
}
