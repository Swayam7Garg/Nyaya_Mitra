'use client';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, BookOpen, Check, AlertCircle, Clock, FileText, Sparkles, Target, ArrowRight } from 'lucide-react';
import type { Situation } from '../../types';

export default function DualDisplayPanel({ situation }: { situation: Situation }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as 'en' | 'hi';
  const isHi = lang === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const [aiData, setAiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: situation.id, lang })
    })
    .then(r => {
      if (!r.ok) throw new Error('API Error');
      return r.json();
    })
    .then(data => {
      if (!data || data.error) throw new Error('API Error');
      setAiData(data);
      setLoading(false);
    })
    .catch(() => {
      // Fallback to static data if LLM backend fails or API key is missing
      setAiData({
        summary: situation.description[lang],
        rights: situation.rights.map((r: any) => r.title[lang] + ': ' + r.description[lang]),
        what_you_can_do: situation.steps.map((s: any) => s.title[lang]),
        disclaimer: isHi ? 'यह कानूनी जानकारी है, कानूनी सलाह नहीं (स्थिर बैकअप)।' : 'This is legal information, not legal advice (Static Backup).'
      });
      setLoading(false);
    });
  }, [situation, lang, isHi]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'white', borderTop: '1px solid #e2e8f0', margin: '0 -20px' }}>
      
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        
        {/* Left Side: Original Legal Text */}
        <div style={{ 
          flex: 1, minWidth: 320, background: '#faf8f5', 
          padding: '40px 32px', borderRight: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 28 }}>
            <Scale size={14} /> {isHi ? 'मूल कानूनी पाठ' : 'Original Legal Text'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {situation.laws.map((law, i) => (
              <div key={i}>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', marginBottom: 4, fontFamily: 'Georgia, serif' }}>
                  {law.section}, {law.act}
                </h3>
                <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>{law.summary[lang]}</p>
                <div style={{ 
                  fontSize: 13, color: '#334155', lineHeight: 1.8, 
                  fontFamily: 'Georgia, serif', whiteSpace: 'pre-wrap'
                }}>
                  {law.fullText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Plain English/Hindi Translation via LLM */}
        <div style={{ 
          flex: 1, minWidth: 320, background: 'white', 
          padding: '40px 32px', position: 'relative'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyItems: 'center', gap: 6, background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: '#166534', marginBottom: 28 }}>
            <Sparkles size={14} color="#166534" /> 
            {isHi ? 'AI द्वारा सरल अनुवाद' : 'AI Plain Translation'} 
          </div>
          
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginBottom: 8, fontFamily: hFont }}>
            {isHi ? 'आपके लिए इसका क्या अर्थ है' : 'What this means for you'}
          </h2>
          
          {loading ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 40 }}>
                <div className="skeleton" style={{ width: '100%', height: 20 }} />
                <div className="skeleton" style={{ width: '85%', height: 20 }} />
                <div className="skeleton" style={{ width: '90%', height: 20 }} />
                <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginTop: 10, fontFamily: hFont }}>
                  {isHi ? 'NYAYASAATHI AI आपके अधिकारों को समझा रहा है...' : 'NyayaSaathi AI is generating your rights...'}
                </p>
             </div>
          ) : aiData ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32, marginTop: 16 }}>
              {/* Summary */}
              <div style={{ background: '#f8fafc', padding: 16, borderRadius: 8, borderLeft: '4px solid #1a56db' }}>
                <p style={{ fontSize: 15, color: '#0f172a', lineHeight: 1.6, fontFamily: hFont, fontWeight: 600 }}>{aiData.summary}</p>
              </div>

              {/* Rights List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {aiData.rights.map((right: string, i: number) => (
                  <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={14} />
                    </div>
                    <p style={{ fontSize: 15, color: '#334155', lineHeight: 1.6, fontFamily: hFont, marginTop: 2 }}>{right}</p>
                  </div>
                ))}
              </div>

              {/* Key Protection */}
              {aiData.key_protection && (
                <div style={{ background: '#fffbeb', padding: 16, borderRadius: 8, border: '1px solid #fde68a' }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#b45309', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Target size={14} /> {isHi ? 'मुख्य कानूनी सुरक्षा' : 'Key Protection'}
                  </p>
                  <p style={{ fontSize: 14, color: '#78350f', fontFamily: hFont, lineHeight: 1.5 }}>
                    {aiData.key_protection}
                  </p>
                </div>
              )}

              {/* Actionable items */}
              {aiData.what_you_can_do && aiData.what_you_can_do.length > 0 && (
                 <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 12, fontFamily: hFont }}>
                      {isHi ? 'आप क्या कर सकते हैं' : 'What you can do next'}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {aiData.what_you_can_do.map((action: string, idx: number) => (
                        <div key={idx} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, color: '#475569', fontFamily: hFont }}>
                          <ArrowRight size={16} color="#1a56db" style={{ flexShrink: 0, marginTop: 2 }} />
                          {action}
                        </div>
                      ))}
                    </div>
                 </div>
              )}

              {/* AI Disclaimer */}
              <p style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 12, fontFamily: hFont, borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
                {aiData.disclaimer}
              </p>
            </div>
          ) : (
             <p style={{ fontSize: 14, color: '#dc2626' }}>{isHi ? 'एआई को लोड करने में विफल। कृपया पृष्ठ को रीफ्रेश करें।' : 'Failed to load AI explanation. Please check your connection or try again later.'}</p>
          )}

        </div>

      </div>

    </div>
  );
}
