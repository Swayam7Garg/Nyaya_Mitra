'use client';
import Link from 'next/link';
import { Check } from 'lucide-react';

interface Step { label: string; href?: string; done: boolean; active: boolean; }

export default function ProgressStepper({ steps }: { steps: Step[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '12px 20px', background: 'white', borderBottom: '1px solid #e2e8f0', overflowX: 'auto' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step.done ? '#0e9f6e' : step.active ? '#1a56db' : '#e2e8f0',
              color: step.done || step.active ? 'white' : '#94a3b8',
              fontSize: 11, fontWeight: 700, flexShrink: 0,
            }}>
              {step.done ? <Check size={13} /> : i + 1}
            </div>
            {step.href && !step.active ? (
              <Link href={step.href} style={{ fontSize: 13, color: step.done ? '#0e9f6e' : '#475569', textDecoration: 'none', fontWeight: step.active ? 700 : 400 }}>{step.label}</Link>
            ) : (
              <span style={{ fontSize: 13, color: step.active ? '#1a56db' : step.done ? '#0e9f6e' : '#94a3b8', fontWeight: step.active ? 700 : 400 }}>{step.label}</span>
            )}
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 32, height: 2, background: steps[i+1].done || steps[i+1].active ? '#1a56db' : '#e2e8f0', margin: '0 8px', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}
