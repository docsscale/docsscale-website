// Where a lead came from (UTM source/medium/campaign and the landing page), sent
// to GoHighLevel with the form. Same consent rule as analytics: kept for the
// session (sessionStorage) and sent only after "Accept"; "Decline" clears it.
// The first page of the visit is remembered in memory, so accepting on a later
// page still records the page the visitor landed on.
import { readConsent } from './consent';

const KEY = 'ds-landing';
type Landing = { utmSource: string; utmMedium: string; utmCampaign: string; landingPage: string };
let firstPage: Landing | null = null;

function fromLocation(): Landing {
  const q = new URLSearchParams(window.location.search);
  const get = (k: string) => (q.get(k) ?? '').slice(0, 150);
  return {
    utmSource: get('utm_source'),
    utmMedium: get('utm_medium'),
    utmCampaign: get('utm_campaign'),
    landingPage: (window.location.origin + window.location.pathname).slice(0, 500),
  };
}

/** Called once per page load (TrackEvents): remembers the first page. */
export function rememberLanding() {
  firstPage ??= fromLocation();
  if (readConsent() === 'granted') persistLanding();
}

/** After "Accept": keep the first page for the rest of the session. */
export function persistLanding() {
  try {
    if (!sessionStorage.getItem(KEY))
      sessionStorage.setItem(KEY, JSON.stringify(firstPage ?? fromLocation()));
  } catch {}
}

/** After "Decline". */
export function forgetLanding() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {}
}

/** Fields to send with a lead: empty without consent. */
export function attributionFields(): Partial<Landing> {
  if (readConsent() !== 'granted') return {};
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) return JSON.parse(stored) as Landing;
  } catch {}
  return firstPage ?? fromLocation();
}
