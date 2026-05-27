'use client';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Navigation } from 'lucide-react';
import type { Lawyer } from '../../types';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../shared/AuthModal';

export default function LawyerCard({ lawyer, selected }: { lawyer: Lawyer; selected?: boolean }) {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const { user } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [booked, setBooked] = useState(false);

  const handleCall = () => { if (lawyer.phone) window.location.href = `tel:${lawyer.phone}`; };
  const handleDir = () => {
    if (lawyer.lat && lawyer.lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lawyer.lat},${lawyer.lng}`, '_blank');
    }
  };
  const handleBook = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    setBooked(true);
  };

  return (
    <div style={{
      background: 'white',
      border: selected ? '2px solid #923c22' : '1px solid #EAE1DA',
      borderRadius: 14,
      padding: '18px 20px',
      marginBottom: 12,
      transition: 'box-shadow 0.2s, border 0.2s',
      boxShadow: selected ? '0 4px 16px rgba(146,60,34,0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: '#923c22', margin: 0, fontFamily: hFont }}>{lawyer.name}</h3>
          <p style={{ fontSize: 11, color: '#6A564A', margin: '3px 0 0 0', fontFamily: hFont }}>{lawyer.organization}</p>
        </div>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#455B3C', background: '#E0ECD6', padding: '4px 10px', borderRadius: 20, flexShrink: 0 }}>
          {isHi ? 'निःशुल्क सेवा' : 'Pro Bono'}
        </span>
      </div>

      {/* Specialization tags */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
        {lawyer.specializations.map(s => (
          <span key={s} style={{ fontSize: 11, color: '#6A564A', background: '#FAF4EE', padding: '3px 8px', borderRadius: 20, border: '1px solid #EAE1DA' }}>
            {s.replace(/-/g, ' ')}
          </span>
        ))}
      </div>

      {/* Info rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: '#4A4A4A' }}>
          <MapPin size={14} color="#923c22" style={{ marginTop: 2, flexShrink: 0 }} />
          <span style={{ fontFamily: hFont }}>{lawyer.city}{lawyer.state ? `, ${lawyer.state}` : ''}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4A4A4A' }}>
          <Clock size={14} color="#923c22" />
          <span style={{ fontFamily: hFont }}>{isHi ? 'सोम–शुक्र, सुबह 10 – शाम 5' : 'Mon – Fri, 10:00 AM – 5:00 PM'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#4A4A4A' }}>
          {['★', '★', '★', '★', '★'].map((s, i) => (
            <span key={i} style={{ color: i < lawyer.rating ? '#f59e0b' : '#D9CBBF', fontSize: 13, lineHeight: 1 }}>{s}</span>
          ))}
          <span style={{ color: '#A0A0A0', fontSize: 11 }}>({lawyer.experience} {isHi ? 'वर्ष' : 'yrs'})</span>
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={handleCall} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'white', border: '1.5px solid #EAE1DA', color: '#923c22',
          padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          borderRadius: 24, fontFamily: hFont,
        }}>
          <Phone size={13} /> {isHi ? 'कॉल करें' : 'Call Clinic'}
        </button>
        <button onClick={handleDir} style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: '#923c22', border: 'none', color: 'white',
          padding: '9px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          borderRadius: 24, fontFamily: hFont,
        }}>
          <Navigation size={13} /> {isHi ? 'दिशा-निर्देश' : 'Directions'}
        </button>
      </div>

      {booked ? (
        <div style={{
          background: '#E0ECD6', color: '#455B3C', padding: '10px',
          borderRadius: 24, fontSize: 12, fontWeight: 700, textAlign: 'center',
          marginTop: 10, fontFamily: hFont, border: '1px solid #c3e6cb'
        }}>
          ✓ {isHi ? 'अपॉइंटमेंट अनुरोध भेजा गया!' : 'Appointment Request Sent!'}
        </div>
      ) : (
        <button onClick={handleBook} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: '#455B3C', border: 'none', color: 'white',
          padding: '10px 0', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          borderRadius: 24, fontFamily: hFont, marginTop: 10
        }}>
          {isHi ? 'मुफ़्त अपॉइंटमेंट बुक करें' : 'Book Free Appointment'}
        </button>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} triggerReason="lawyer" onSuccess={() => setBooked(true)} />
    </div>
  );
}
