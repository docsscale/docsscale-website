'use client';

// Footer link that reopens the consent banner. Rendered only when analytics is on.
import type { CSSProperties } from 'react';
import { CONSENT_BANNER, GA_MEASUREMENT_ID } from '@/content/analytics';
import { OPEN_CONSENT_EVENT } from './consent';

export function CookieSettingsLink({ style }: { style: CSSProperties }) {
  if (!GA_MEASUREMENT_ID) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      style={{
        ...style,
        background: 'none',
        border: 0,
        padding: 0,
        font: 'inherit',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {CONSENT_BANNER.settingsLink}
    </button>
  );
}
