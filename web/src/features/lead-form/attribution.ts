// Where a lead came from: the UTM tags in the URL and the first page of the
// visit. Captured when the page loads, kept only in this browser tab
// (sessionStorage; no cookie; gone when the tab closes) and sent to
// GoHighLevel only with a form the visitor submits. This is not analytics, so
// it doesn't depend on the cookie choice (the Privacy Policy says so).
// The first page of the visit wins; a later full page load replaces it only if
// that later page carries UTM tags and the first one had none.
const KEY = 'ds-landing';
type Landing = { utmSource: string; utmMedium: string; utmCampaign: string; landingPage: string };

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

const hasTags = (l: Landing) => Boolean(l.utmSource || l.utmMedium || l.utmCampaign);

function stored(): Landing | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Landing) : null;
  } catch {
    return null;
  }
}

/** Once per page load (LandingCapture). */
export function rememberLanding() {
  const now = fromLocation();
  const before = stored();
  if (before && (hasTags(before) || !hasTags(now))) return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(now));
  } catch {
    // Storage blocked: attributionFields() falls back to the current page.
  }
}

/** Fields to send with a lead. */
export function attributionFields(): Landing {
  return stored() ?? fromLocation();
}
