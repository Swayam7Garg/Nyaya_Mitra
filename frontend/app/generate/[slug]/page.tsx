'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Download, Copy, Check, FileText } from 'lucide-react';
import DocumentForm from '../../../components/generate/DocumentForm';
import DocumentPreview, { makeComplaintText, makeRTIText } from '../../../components/generate/DocumentPreview';
import { generateComplaintPDF, generateRTIPDF, generateFIRDraftPDF } from '../../../lib/pdfGenerator';
import situationsData from '../../../data/situations';
import type { DocumentFormData } from '../../../types';

const lawCitations: Record<string, string> = {
  'landlord-dispute': 'Transfer of Property Act 1882 (Section 106)',
  'consumer-complaint': 'Consumer Protection Act 2019 (Section 35)',
  'workplace-harassment': 'POSH Act 2013 (Section 4)',
  'fir-filing': 'Code of Criminal Procedure 1973 (Section 154)',
  'rti-application': 'Right to Information Act 2005 (Section 6)',
  'domestic-violence': 'Protection of Women from Domestic Violence Act 2005 (Section 12)',
  'property-dispute': 'Code of Criminal Procedure 1973 (Section 145)',
  'labor-rights': 'Minimum Wages Act 1948 (Section 3), Payment of Wages Act 1936 (Section 5)',
};

const docTitles: Record<string, string> = {
  'landlord-dispute': 'Complaint Letter to Local Authority',
  'consumer-complaint': 'Consumer Complaint Letter',
  'workplace-harassment': 'Workplace Harassment Complaint',
  'fir-filing': 'FIR Draft / Police Complaint',
  'rti-application': 'RTI Application',
  'domestic-violence': 'Complaint to Protection Officer',
  'property-dispute': 'Property Encroachment Complaint',
  'labor-rights': 'Wage / Labour Rights Complaint',
};

const EMPTY: DocumentFormData = { name: '', address: '', phone: '', date: '', incidentDate: '', description: '', amount: '', respondentName: '', respondentAddress: '', authority: '', infoRequested: '' };

export default function GeneratePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const situation = situationsData.find(s => s.id === slug);
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<DocumentFormData>(EMPTY);
  const [copied, setCopied] = useState(false);
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const templateType = situation?.templateType || 'complaint';
  const docTitle = docTitles[slug] || 'Legal Complaint Letter';
  const lawCite = lawCitations[slug] || 'applicable law';

  const docText = templateType === 'rti'
    ? makeRTIText(fields)
    : makeComplaintText(fields, docTitle, lawCite);

  const handleChange = (key: keyof DocumentFormData, val: string) => setFields(prev => ({ ...prev, [key]: val }));

  const handleDownload = () => {
    if (templateType === 'rti') {
      generateRTIPDF(fields);
    } else if (templateType === 'fir') {
      generateFIRDraftPDF({
        policeStationName: fields.respondentName || 'Local Police Station',
        policeStationAddress: fields.respondentAddress || '',
        complainantName: fields.name,
        complainantAddress: fields.address,
        complainantPhone: fields.phone,
        incidentDate: fields.incidentDate,
        incidentTime: '',
        incidentLocation: '',
        incidentDescription: fields.description,
        date: fields.date,
      });
    } else {
      generateComplaintPDF(fields, docTitle, lawCite);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!situation) return (
    <div className="page-container" style={{ padding: '48px 20px', textAlign: 'center' }}>
      <p>Situation not found. <Link href="/situations">Go back</Link></p>
    </div>
  );

  const stepLabels = [t('generate.step1'), t('generate.step2'), t('generate.step3')];

  return (
    <div style={{ padding: '32px 0 64px' }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <Link href={`/situations/${slug}/explain`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#475569', textDecoration: 'none', fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
            <ArrowLeft size={14} /> Back to Rights
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="#1a56db" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', fontFamily: hFont }}>{t('generate.page_title')}</h1>
              <p style={{ fontSize: 13, color: '#64748b', fontFamily: hFont }}>{docTitle}</p>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {stepLabels.map((sl, i) => (
            <div key={i} style={{
              flex: 1, padding: '12px 16px', textAlign: 'center', fontSize: 13, fontWeight: 600,
              background: step === i + 1 ? '#1a56db' : step > i + 1 ? '#f0fdf4' : 'white',
              color: step === i + 1 ? 'white' : step > i + 1 ? '#0e9f6e' : '#94a3b8',
              borderRight: i < 2 ? '1px solid #e2e8f0' : 'none',
              transition: 'all 0.2s', fontFamily: hFont,
            }}>{i + 1}. {sl}</div>
          ))}
        </div>

        {/* Content */}
        <div style={{ display: 'grid', gridTemplateColumns: step === 3 ? '1fr' : '1fr 1fr', gap: 24 }}>
          {step < 3 ? (
            <>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', marginBottom: 20, fontFamily: hFont }}>{stepLabels[step - 1]}</h2>
                <DocumentForm fields={fields} step={step} templateType={templateType} onChange={handleChange} />
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  {step > 1 && <button className="btn-secondary" onClick={() => setStep(s => s - 1)}><ArrowLeft size={14} /> {t('generate.back')}</button>}
                  <button className="btn-primary" onClick={() => setStep(s => Math.min(3, s + 1))}>{t('generate.next')} <ArrowRight size={14} /></button>
                </div>
              </div>
              <div style={{ display: 'none' }}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, height: '100%' }}>
                  <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
                </div>
              </div>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
              </div>
            </>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
              <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24 }}>
                <DocumentPreview fields={fields} templateType={templateType} situationTitle={docTitle} lawCitation={lawCite} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 12, padding: 20 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, fontFamily: hFont }}>Download & Share</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="btn-primary" onClick={handleDownload} style={{ width: '100%', justifyContent: 'center' }}>
                      <Download size={15} /> {t('generate.download_pdf')}
                    </button>
                    <button className="btn-secondary" onClick={handleCopy} style={{ width: '100%', justifyContent: 'center' }}>
                      {copied ? <><Check size={15} /> {t('generate.copied')}</> : <><Copy size={15} /> {t('generate.copy')}</>}
                    </button>
                    <button className="btn-secondary" onClick={() => setStep(1)} style={{ width: '100%', justifyContent: 'center', fontSize: 12 }}>
                      <ArrowLeft size={14} /> Edit Details
                    </button>
                  </div>
                </div>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: 14 }}>
                  <p style={{ fontSize: 11, color: '#78350f', lineHeight: 1.6, fontFamily: hFont }}>{t('generate.disclaimer')}</p>
                </div>
                <Link href="/lawyers" className="btn-accent" style={{ textDecoration: 'none', textAlign: 'center', justifyContent: 'center' }}>
                  Find a Pro Bono Lawyer
                </Link>
              </div>
            </div>
          )}
        </div>

        {step < 3 && (
          <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 16, textAlign: 'center', fontFamily: hFont }}>{t('generate.disclaimer')}</p>
        )}
      </div>
    </div>
  );
}
