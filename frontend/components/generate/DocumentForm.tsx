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
  const { t } = useTranslation();
  const isRTI = templateType === 'rti';
  const inp = (key: keyof DocumentFormData, label: string, type = 'text', multi = false) => (
    <div key={key}>
      <label className="label">{label}</label>
      {multi
        ? <textarea className="input-field" value={fields[key] || ''} onChange={e => onChange(key, e.target.value)} rows={3} />
        : <input className="input-field" type={type} value={fields[key] || ''} onChange={e => onChange(key, e.target.value)} />
      }
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {step === 1 && (<>
        {inp('name', t('generate.name'))}
        {inp('address', t('generate.address'), 'text', true)}
        {inp('phone', t('generate.phone'), 'tel')}
        {inp('date', t('generate.date'), 'date')}
      </>)}
      {step === 2 && (<>
        {isRTI ? (<>
          {inp('authority', t('generate.authority'))}
          {inp('infoRequested', t('generate.info_requested'), 'text', true)}
        </>) : (<>
          {inp('incidentDate', t('generate.incident_date'), 'date')}
          {inp('respondentName', t('generate.respondent_name'))}
          {inp('respondentAddress', t('generate.respondent_address'), 'text', true)}
          {inp('description', t('generate.description'), 'text', true)}
          {inp('amount', t('generate.amount'))}
        </>)}
      </>)}
    </div>
  );
}
