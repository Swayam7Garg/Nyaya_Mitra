'use client';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Home, ShoppingCart, Briefcase, FileText, Users, Navigation, Compass, FileSignature, Scale } from 'lucide-react';

export default function HomePage() {
  const { i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  return (
    <div style={{ flex: 1, backgroundColor: '#FCF5EF', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        padding: '80px 20px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        background: 'radial-gradient(circle at center 20%, #FFFDFB 0%, #FCF5EF 60%)'
      }}>
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#E0ECD6', borderRadius: 24, padding: '6px 16px', marginBottom: 24 }}>
          <CheckCircle2 size={16} color="#455B3C" />
          <span style={{ fontSize: 13, color: '#455B3C', fontWeight: 600 }}>Free, Confidential, and Constitutionally Guaranteed</span>
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 800, color: '#1A1A1A', lineHeight: 1.1, marginBottom: 12, maxWidth: 800 }}>
          Understand your legal rights, <span style={{ color: '#923c22', fontStyle: 'italic', fontWeight: 800 }}>simply</span>
        </h1>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 700, color: '#3A3A3A', marginBottom: 32, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
          अपने कानूनी अधिकारों को सरलता से समझें।
        </h2>
        
        <p style={{ fontSize: 16, color: '#5A5A5A', lineHeight: 1.6, marginBottom: 40, maxWidth: 600 }}>
          Navigating the law shouldn't be scary. We provide step-by-step guidance tailored to your specific life situation, in the language you speak.
        </p>

        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/situations" style={{
            background: '#923c22', color: 'white', padding: '14px 28px', borderRadius: 28,
            fontWeight: 600, fontSize: 15, textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: 8,
            transition: 'opacity 0.2s',
          }}>
            Find My Situation <ArrowRight size={18} />
          </Link>
          <Link href="#" style={{
            background: 'white', color: '#923c22', padding: '14px 28px', borderRadius: 28,
            fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid #EAE1DA',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            Explore Guides
          </Link>
        </div>
      </section>

      {/* Situations Grid */}
      <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>How can we help you today?</h2>
            <p style={{ fontSize: 15, color: '#6A564A' }}>Select a category below to receive tailored legal steps and nearby resources</p>
          </div>
          <Link href="/situations" style={{ color: '#923c22', fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
            View all situations <ArrowRight size={14} />
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          {[
            { title: 'Landlord Dispute', desc: 'Know your rights regarding eviction notices, security deposits, and rental agreements.', icon: <Home size={20} color="#923c22" /> },
            { title: 'Consumer Complaint', desc: 'Protect yourself against faulty products, overcharging, and unfair trade practices.', icon: <ShoppingCart size={20} color="#923c22" /> },
            { title: 'Workplace Harassment', desc: 'Safe and confidential steps to report harassment and understand employment laws.', icon: <Briefcase size={20} color="#923c22" /> },
            { title: 'FIR Filing', desc: 'A simple walkthrough of how to file a First Information Report at any police station.', icon: <FileText size={20} color="#923c22" /> },
            { title: 'Domestic Violence', desc: 'Immediate assistance and legal protection orders for those facing domestic abuse.', icon: <Users size={20} color="#923c22" /> },
            { title: 'Traffic Violations', desc: 'Understand your fines, challans, and rights during traffic stops or accidents.', icon: <Navigation size={20} color="#923c22" /> },
          ].map((s, i) => (
            <Link key={i} href={`/situations?prefill=${s.title.toLowerCase().split(' ')[0]}`} style={{ background: 'white', borderRadius: 16, padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', border: '1px solid #FAF4EE', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <div style={{ background: '#FCF5EF', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                {s.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: '#6A564A', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Demystified Section */}
      <section style={{ padding: '60px 20px', maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', background: '#455B3C', color: 'white', padding: '6px 16px', borderRadius: 20, fontSize: 11, fontWeight: 600, letterSpacing: '0.5px', marginBottom: 16 }}>
          AI-POWERED PLAIN ENGLISH & HINDI SUMMARIES
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#1A1A1A', marginBottom: 40 }}>Legal Jargon, Demystified.</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 24, textAlign: 'left', alignItems: 'stretch' }}>
          
          {/* Original */}
          <div style={{ background: '#EAE1DA', borderRadius: 16, padding: '32px', position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Scale size={16} color="#6A564A" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6A564A', letterSpacing: '0.5px' }}>ORIGINAL STATUTE (IPC 405)</span>
            </div>
            <p style={{ fontSize: 16, color: '#3A3A3A', fontStyle: 'italic', lineHeight: 1.6 }}>
              "Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts to his own use that property, or dishonestly uses or disposes of that property in violation of any direction of law..."
            </p>
            <div style={{ marginTop: 24, fontSize: 12, color: '#6A564A' }}>*Source: Indian Penal Code</div>
          </div>

          {/* Simplified */}
          <div style={{ background: 'white', borderRadius: 16, padding: '32px', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <CheckCircle2 size={18} color="#455B3C" />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#455B3C', letterSpacing: '0.5px' }}>NYAYAMITRA PLAIN LANGUAGE</span>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
              <CheckCircle2 size={18} color="#6A564A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>What it means:</div>
                <div style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.5 }}>If someone trusts you with their money or property and you use it for yourself instead of what it was intended for, that is a crime.</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flex: 1 }}>
              <CheckCircle2 size={18} color="#6A564A" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>सरल हिंदी में:</div>
                <div style={{ fontSize: 14, color: '#4A4A4A', lineHeight: 1.5, fontFamily: 'Noto Sans Devanagari, sans-serif' }}>यदि कोई आप पर अपनी संपत्ति के साथ विश्वास करता है और आप उसे अपने फायदे के लिए इस्तेमाल करते हैं, तो यह अपराध है।</div>
              </div>
            </div>

            <button style={{ width: '100%', background: '#455B3C', color: 'white', padding: '12px', borderRadius: 24, border: 'none', fontWeight: 600, fontSize: 14, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
               Translate Any Document
            </button>
          </div>

        </div>
      </section>

      {/* Services Footer area inner */}
      <section style={{ padding: '80px 20px 60px', maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
        {[
          { icon: <Compass size={24} color="#923c22" />, title: 'Step-by-Step Guides', desc: 'Interactive flows that tell you exactly what to do next based on your current situation.' },
          { icon: <Users size={24} color="#923c22" />, title: 'Legal Aid Lawyer Directory', desc: 'Connect with verified pro bono lawyers and legal aid clinics in your city instantly.' },
          { icon: <FileSignature size={24} color="#923c22" />, title: 'Document Generator', desc: 'Fill out simple forms to automatically generate legally sound notices and applications.' },
        ].map((item, i) => (
          <div key={i} style={{ flex: '1 1 250px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#EAE1DA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              {item.icon}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>{item.title}</h3>
            <p style={{ fontSize: 13, color: '#6A564A', lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </section>

      {/* True Footer */}
      <footer style={{ background: '#F5EBE1', padding: '40px 20px', borderTop: '1px solid #EAE1DA' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 40 }}>
          <div style={{ maxWidth: 400 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#923c22', marginBottom: 16 }}>NyayaMitra <span style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}>(न्यायमित्र)</span></div>
            <p style={{ fontSize: 13, color: '#5A5A5A', lineHeight: 1.5, marginBottom: 24 }}>
              Empowering every citizen with the knowledge to stand up for their rights. NyayaMitra is a social impact initiative dedicated to making the Indian legal system accessible to all through technology and simplified language.
            </p>
            <div style={{ background: '#FCF5EF', padding: 12, borderRadius: 8, border: '1px solid #EAE1DA' }}>
               <p style={{ fontSize: 11, color: '#6A564A', margin: 0, lineHeight: 1.4 }}>
                 Disclaimer: This platform provides legal information and guidance, not legal advice. Always consult with a qualified professional for specific legal proceedings.
               </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Platform</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><Link href="/situations" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Legal Rights</Link></li>
                <li><Link href="/lawyers" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Pro Bono Lawyers</Link></li>
                <li><Link href="#" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Document Templates</Link></li>
                <li><Link href="#" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Hindi Resources</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li><Link href="#" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Legal Disclaimer</Link></li>
                <li><Link href="#" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Privacy Policy</Link></li>
                <li><Link href="#" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Terms of Service</Link></li>
                <li><Link href="#" style={{ color: '#5A5A5A', textDecoration: 'none', fontSize: 13 }}>Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div style={{ maxWidth: 1100, margin: '40px auto 0', paddingTop: 20, borderTop: '1px solid #EAE1DA', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: '#6A564A' }}>© 2024 NyayaMitra. Empowering citizens through clarity.</div>
          <div style={{ display: 'flex', gap: 16 }}>
             {/* Simple social icon placeholders */}
             <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D9CBBF' }}></div>
             <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D9CBBF' }}></div>
             <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#D9CBBF' }}></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
