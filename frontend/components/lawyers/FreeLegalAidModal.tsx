'use client';
import { X, Info, CheckCircle2 } from 'lucide-react';

export default function FreeLegalAidModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999, padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 16, width: '100%', maxWidth: 700,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ padding: '24px 32px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#1a56db', padding: 8, borderRadius: 10 }}>
              <Info size={24} color="white" />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Free Legal Aid (NALSA)</h2>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 8, borderRadius: '50%', display: 'flex' }}>
            <X size={24} color="#64748b" />
          </button>
        </div>

        <div style={{ padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          
          <div style={{ background: '#eff6ff', padding: 20, borderRadius: 12, border: '1px solid #bfdbfe' }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1e3a8a', margin: '0 0 10px 0' }}>What are Legal Services?</h3>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.6, margin: 0 }}>Legal Services includes providing Free Legal Aid to those weaker sections of the society who fall within the purview of Section 12 of the Legal Services Authorities Act, 1987. It entails creating legal awareness, organizing Lok Adalats, social action litigation, and facilitating entitlements under government schemes.</p>
          </div>

          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0f172a', margin: '0 0 12px 0' }}>What is included in free legal services?</h3>
            <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6, margin: '0 0 12px 0' }}>Under the Legal Services Authorities Act, 1987, free legal aid includes:</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                "Representation by an Advocate in legal proceedings.",
                "Payment of process fees, expenses of witnesses and all other court charges.",
                "Preparation of pleadings, memo of appeal, paper book including translation.",
                "Drafting of legal documents, special leave petition etc.",
                "Supply of certified copies of judgments, orders, and evidence notes.",
                "Advice to access benefits under welfare statutes and Central/State schemes."
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#334155', lineHeight: 1.5 }}>
                  <CheckCircle2 size={18} color="#0e9f6e" style={{ flexShrink: 0, marginTop: 2 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
             <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Which Courts?</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>Not confined to subordinate Courts. It is provided from the Court Tribunal at first instance all the way to the <strong>Supreme Court of India</strong>.</p>
             </div>
             <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>What kind of Cases?</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>All kinds of cases are included as long as you satisfy eligibility under Section 12 and have a genuine case to prosecute or defend.</p>
             </div>
             <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Lawyer of Choice?</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>Yes. You can express your choice of a lawyer from the panel, and the Secretary can consider and allow it under regulation 7(6).</p>
             </div>
             <div style={{ padding: 16, border: '1px solid #e2e8f0', borderRadius: 12 }}>
                <h4 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Any Stage / Consultation Only?</h4>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: 0 }}>Yes. You can get just a consultation, or apply for aid at any stage (even at the appeal stage if you had a private lawyer before).</p>
             </div>
          </div>

        </div>
        <div style={{ padding: '24px 32px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button onClick={onClose} style={{ padding: '10px 24px', background: 'white', border: '1px solid #cbd5e1', borderRadius: 8, fontWeight: 600, color: '#475569', cursor: 'pointer' }}>Close</button>
            <a href="https://nalsa.gov.in/" target="_blank" rel="noopener noreferrer" style={{ padding: '10px 24px', background: '#1a56db', border: 'none', borderRadius: 8, fontWeight: 600, color: 'white', cursor: 'pointer', textDecoration: 'none' }}>Visit NALSA Website</a>
        </div>
      </div>
    </div>
  );
}
