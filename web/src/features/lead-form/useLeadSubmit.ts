'use client';

import { useState, type FormEvent } from 'react';
import { LEAD_FORM_MESSAGES } from '@/content/lead-form';
import { trackLead } from '@/features/analytics/track';
import { useValidators } from './PhoneField';

export type LeadStatus = 'idle' | 'submitting' | 'sent' | 'error';

/**
 * Posts a form's fields as JSON to the PHP lead handler and tracks the result.
 * `form` names the form in analytics (generate_lead event).
 */
export function useLeadSubmit(form: 'home' | 'book-a-call', endpoint = '/send-lead.php') {
  const [status, setStatus] = useState<LeadStatus>('idle');
  const [error, setError] = useState('');
  const { register, validate } = useValidators();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError('');
    const checked = await validate();
    if (!checked) return; // the field shows its own error
    setStatus('submitting');
    const fields = { ...Object.fromEntries(new FormData(formElement).entries()), ...checked };
    // The honeypot is only sent when a bot filled it in (see Honeypot.tsx).
    if (!fields.website) delete fields.website;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      const result = await response
        .json()
        .catch(() => ({ ok: false, error: LEAD_FORM_MESSAGES.badResponse }));
      if (response.ok && result.ok) {
        setStatus('sent');
        trackLead(form);
      } else {
        setStatus('error');
        setError(result.error || LEAD_FORM_MESSAGES.genericError);
      }
    } catch {
      setStatus('error');
      setError(LEAD_FORM_MESSAGES.networkError);
    }
  }

  return { status, error, onSubmit, register };
}
