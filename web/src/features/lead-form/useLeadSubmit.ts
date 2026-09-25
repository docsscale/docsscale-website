'use client';

import { useState, type FormEvent } from 'react';
import { LEAD_FORM_MESSAGES } from '@/content/lead-form';

export type LeadStatus = 'idle' | 'submitting' | 'sent' | 'error';

/**
 * Posts a form's fields as JSON to the PHP lead handler and tracks the result.
 * `endpoint` is /send-lead.php for the main site, /free-system/send-lead.php for the funnel.
 */
export function useLeadSubmit(endpoint = '/send-lead.php') {
  const [status, setStatus] = useState<LeadStatus>('idle');
  const [error, setError] = useState('');

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setError('');
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries());
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
      } else {
        setStatus('error');
        setError(result.error || LEAD_FORM_MESSAGES.genericError);
      }
    } catch {
      setStatus('error');
      setError(LEAD_FORM_MESSAGES.networkError);
    }
  }

  return { status, error, onSubmit };
}
