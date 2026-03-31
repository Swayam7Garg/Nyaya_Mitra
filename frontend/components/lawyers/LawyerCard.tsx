'use client';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import type { Lawyer } from '../../types';

export default function LawyerCard({ lawyer, selected }: { lawyer: Lawyer, selected?: boolean }) {
  const { t } = useTranslation();

  return (
    <div style={{ 
      background: 'white', 
      border: selected ? '3px solid #f59e0b' : '1px solid #e2e8f0', 
      padding: '20px 24px',
      marginBottom: 16,
      transition: 'box-shadow 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a56db', margin: 0 }}>{lawyer.name}</h3>
        <span style={{ fontSize: 11, fontWeight: 600, color: '#d97706', background: '#fef3c7', padding: '4px 8px', borderRadius: 4 }}>
          {selected ? '2.4 km away' : '4.1 km away'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {lawyer.specializations.map(s => (
          <span key={s} style={{ fontSize: 11, color: '#475569', background: '#f1f5f9', padding: '4px 8px', borderRadius: 4, border: '1px solid #e2e8f0' }}>
            {s.replace(/-/g, ' ')}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#334155' }}>
          <MapPin size={16} color="#64748b" style={{ marginTop: 2 }} />
          <span>{lawyer.organization || '14, Safdarjung Enclave'}, {lawyer.city}, 110029</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#334155' }}>
          <Clock size={16} color="#64748b" />
          <span>Mon - Fri, 10:00 AM - 5:00 PM</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button style={{ 
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: 'white', border: '1px solid #1a56db', color: '#1a56db',
          padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>
          <Phone size={16} /> Call Clinic
        </button>
        <button style={{ 
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          background: '#1a56db', border: '1px solid #1a56db', color: 'white',
          padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer'
        }}>
          <Navigation size={16} /> Directions
        </button>
      </div>
    </div>
  );
}
