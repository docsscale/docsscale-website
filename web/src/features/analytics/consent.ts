import { CONSENT_STORAGE_KEY } from '@/content/analytics';

export type Consent = 'granted' | 'denied';
export const OPEN_CONSENT_EVENT = 'ds-consent-open';

// localStorage can be unavailable (private windows, blocked storage): then the
// banner simply shows again next time and analytics stays in cookieless mode.
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
  window.gtag?.('consent', 'update', { analytics_storage: value });
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
