'use client';

// "Claim the free system" form. Posts to /free-system/send-lead.php, then sends
// the visitor to /free-system/thank-you/.
import { useRouter } from 'next/navigation';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { FUNNEL_FORM } from '@/content/funnel';
import { attributionFields } from '@/features/lead-form/attribution';
import { trackFormError, trackLead } from '@/features/analytics/track';
import { serverErrorField } from '@/features/lead-form/useLeadSubmit';
import { Honeypot, honeypotValue } from '@/features/lead-form/Honeypot';
import { StatusAnnouncer } from '@/features/lead-form/a11y';
import { PhoneField, useValidators } from '@/features/lead-form/PhoneField';

type Fields = { name: string; email: string; clinic: string; type: string };

const FUNNEL_PHONE = { input: {}, className: 'field', height: 54, radius: 14 };

export function FunnelForm() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
  const [error, setError] = useState('');
  const [fields, setFields] = useState<Fields>({ name: '', email: '', clinic: '', type: '' });
  const { register, validate } = useValidators();
  const bind = (key: keyof Fields) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!fields.name || !fields.email) return;
    const website = honeypotValue(event.currentTarget as HTMLFormElement);
    setError('');
    const checked = await validate();
    if (!checked) return; // the phone field shows its own error
    setStatus('submitting');
    try {
      const response = await fetch('/free-system/send-lead.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          phone: checked.phone,
          clinicName: fields.clinic,
          clinicType: fields.type,
          source: 'Funnel - Free System',
          ...attributionFields(),
          ...(website && { website }),
        }),
      });
      const result = await response.json();
      if (!result.ok) throw new Error(result.error || FUNNEL_FORM.genericError);
      trackLead('free-system');
      router.push('/free-system/thank-you/');
    } catch (e) {
      setStatus('error');
      setError(e instanceof Error ? e.message : FUNNEL_FORM.genericError);
      trackFormError('free-system', serverErrorField(e instanceof Error ? e.message : undefined));
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Honeypot />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <input
          type="text"
          placeholder="Full name"
          aria-label="Full name"
          required
          className="field"
          value={fields.name}
          onChange={bind('name')}
        />
        <input
          type="email"
          placeholder="Work email"
          aria-label="Work email"
          required
          className="field"
          value={fields.email}
          onChange={bind('email')}
        />
      </div>
      <PhoneField register={register} variant={FUNNEL_PHONE} placeholder="Mobile number" />
      <input
        type="text"
        placeholder="Clinic name"
        aria-label="Clinic name"
        className="field"
        value={fields.clinic}
        onChange={bind('clinic')}
      />
      <select className="field" aria-label="Clinic type" value={fields.type} onChange={bind('type')}>
        <option value="">Clinic type</option>
        {FUNNEL_FORM.clinicTypes.map((type) => (
          <option key={type}>{type}</option>
        ))}
      </select>
      <button
        type="submit"
        className="cta-btn"
        disabled={status === 'submitting'}
        style={{ marginTop: 4, width: '100%' }}
      >
        {status === 'submitting' ? 'Sending…' : FUNNEL_FORM.submit}
      </button>
      {status === 'error' && (
        <span role="alert" style={{ fontSize: 13, color: '#B4432F', fontWeight: 700 }}>
          {error}
        </span>
      )}
      <StatusAnnouncer message={status === 'submitting' ? 'Sending…' : ''} />
      <span style={{ fontSize: 13, color: '#6C6962', fontWeight: 600 }}>{FUNNEL_FORM.footnote}</span>
    </form>
  );
}
