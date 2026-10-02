import { CONSENT_STORAGE_KEY } from '@/content/analytics';
import { forgetLanding, persistLanding } from './attribution';

export type Consent = 'granted' | 'denied';
export const OPEN_CONSENT_EVENT = 'ds-consent-open';

// localStorage can be unavailable (private windows, blocked storage): then the
// banner simply shows again next time and nothing is loaded until "Accept".
export function readConsent(): Consent | null {
  try {
    const value = localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(value: Consent) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {}
  if (value === 'granted') {
    window.dsLoadAnalytics?.();
    persistLanding();
  } else {
    forgetLanding();
    // Withdrawn after accepting earlier: stop storage and remove GA's cookies.
    window.gtag?.('consent', 'update', { analytics_storage: 'denied' });
    for (const name of document.cookie.split(';').map((c) => c.split('=')[0]!.trim())) {
      if (name === '_ga' || name.startsWith('_ga_'))
        for (const domain of ['', `; domain=.${location.hostname.replace(/^www\./, '')}`])
          document.cookie = `${name}=; max-age=0; path=/${domain}`;
    }
  }
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    /** Defined by the GoogleAnalytics bootstrap: loads GA after consent. */
    dsLoadAnalytics?: () => void;
  }
}
