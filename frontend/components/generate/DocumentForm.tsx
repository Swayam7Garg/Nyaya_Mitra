'use client';
import { useTranslation } from 'react-i18next';
import type { DocumentFormData } from '../../types';

interface Props {
  fields: DocumentFormData;
  step: number;
  templateType: string;
  onChange: (key: keyof DocumentFormData, val: string) => void;
}

export default function DocumentForm({ fields, step, templateType, onChange }: Props) {
  const { t, i18n } = useTranslation();
  const isHi = i18n.language === 'hi';
  const hFont = isHi ? 'Noto Sans Devanagari, sans-serif' : 'Inter, sans-serif';

  const isRTI = templateType === 'rti';
  const isFIR = templateType === 'fir';

  const inp = (key: keyof DocumentFormData, label: string, type = 'text', multi = false, placeholder = '') => (
    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="label" style={{ fontFamily: hFont }}>{label}</label>
      {multi
        ? <textarea
            className="input-field"
            value={fields[key] || ''}
            onChange={e => onChange(key, e.target.value)}
            rows={3}
            placeholder={placeholder}
            style={{ fontFamily: hFont }}
          />
        : <input
            className="input-field"
            type={type}
            value={fields[key] || ''}
            onChange={e => onChange(key, e.target.value)}
            placeholder={placeholder}
            style={{ fontFamily: hFont }}
          />
      }
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Step 1: Personal details — same for all */}
      {step === 1 && (<>
        {inp('name',    isHi ? 'आपका पूरा नाम' : t('generate.name'))}
        {inp('address', isHi ? 'पूरा पता' : t('generate.address'), 'text', true)}
        {inp('phone',   isHi ? 'मोबाइल नंबर' : t('generate.phone'), 'tel', false, '+91-')}
        {inp('date',    isHi ? 'आज की तारीख' : t('generate.date'), 'date')}
      </>)}

      {/* Step 2: Situation-specific details */}
      {step === 2 && (<>
        {isRTI ? (<>
          {inp('authority',    isHi ? 'सरकारी विभाग का नाम (PIO)' : t('generate.authority'), 'text', false, 'e.g. District Collector Office, New Delhi')}
          {inp('infoRequested', isHi ? 'मांगी गई जानकारी' : t('generate.info_requested'), 'text', true, 'Describe precisely what info you want...')}
        </>) : isFIR ? (<>
          {inp('respondentName',    isHi ? 'पुलिस स्टेशन का नाम' : 'Police Station Name', 'text', false, 'e.g. Sadar Police Station')}
          {inp('respondentAddress', isHi ? 'पुलिस स्टेशन का पता' : 'Police Station Address', 'text', true)}
          {inp('incidentDate',      isHi ? 'घटना की तारीख' : t('generate.incident_date'), 'date')}
          {inp('description',       isHi ? 'घटना का विवरण' : 'Description of Incident', 'text', true, 'Describe what happened in detail — who, what, when, where...')}
        </>) : (<>
          {inp('incidentDate',      isHi ? 'घटना की तारीख' : t('generate.incident_date'), 'date')}
          {inp('respondentName',    isHi ? 'शिकायत किसके विरुद्ध (नाम)' : t('generate.respondent_name'), 'text', false, 'Name of person/company')}
          {inp('respondentAddress', isHi ? 'उनका पता' : t('generate.respondent_address'), 'text', true)}
          {inp('description',       isHi ? 'समस्या का विवरण' : t('generate.description'), 'text', true, 'Describe the issue in detail...')}
          {inp('amount',            isHi ? 'राशि (यदि लागू हो)' : t('generate.amount'), 'text', false, 'e.g. 15000')}
        </>)}
      </>)}

    </div>
  );
}
