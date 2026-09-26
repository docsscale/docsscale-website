'use client';

// Minimal consent banner in the site's style: a small card, bottom left on
// desktop, full width on phones. Shown until the visitor chooses; "Cookie
// settings" (footer) opens it again. Uses inline styles only, so it looks the
// same on the main site and in the funnel.
import { useEffect, useState } from 'react';
import { CONSENT_BANNER } from '@/content/analytics';
import { T } from '@/styles/tokens';
import { OPEN_CONSENT_EVENT, readConsent, saveConsent, type Consent } from './consent';

const button = {
  height: 40,
  padding: '0 18px',
  borderRadius: 999,
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  fontFamily: 'inherit',
} as const;

export function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const gpc = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of an external value (storage)
    if (!readConsent() && !gpc) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  if (!open) return null;
  const choose = (value: Consent) => {
    saveConsent(value);
    setOpen(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 60,
        maxWidth: 420,
        background: T.surface,
        color: T.ink,
        border: `1px solid ${T.hairline}`,
        borderRadius: 20,
        boxShadow: '0 12px 40px rgba(26,26,26,.12)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: T.body }}>
        {CONSENT_BANNER.text}{' '}
        <a
          href={CONSENT_BANNER.policyHref}
          style={{ color: T.teal, fontWeight: 600, textDecoration: 'underline' }}
        >
          {CONSENT_BANNER.policyLabel}
        </a>
      </p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => choose('denied')}
          style={{
            ...button,
            background: 'transparent',
            color: T.ink,
            border: `1px solid ${T.hairlineHover}`,
          }}
        >
          {CONSENT_BANNER.decline}
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          style={{ ...button, background: T.teal, color: '#FFFFFF', border: `1px solid ${T.teal}` }}
        >
          {CONSENT_BANNER.accept}
        </button>
      </div>
    </div>
  );
}
