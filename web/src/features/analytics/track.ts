// GA4 events. No-ops when analytics is off (no Measurement ID) or blocked.
// Events (and their parameters) are listed in docs/TRACKING.md.
import './consent';

type LeadForm = 'home' | 'book-a-call' | 'free-system';

export function trackLead(form: LeadForm) {
  window.gtag?.('event', 'generate_lead', {
    form,
    lead_magnet: form === 'free-system' ? 'free-system' : undefined,
    page: window.location.pathname,
  });
}

export function trackLeadMagnetView(leadMagnet: string) {
  window.gtag?.('event', 'view_lead_magnet', { lead_magnet: leadMagnet });
}

export function trackCallBooked(source: 'free-system') {
  window.gtag?.('event', 'book_call', { source });
}

export type FormName = LeadForm;

/** "Book a call" / "Claim the free system" buttons; `location` = page section. */
export function trackCtaClick(cta: string, location: string) {
  window.gtag?.('event', 'cta_click', { cta, location, page: window.location.pathname });
}

/** A form field that stopped a submission (or "server" for a server-side refusal). */
export function trackFormError(form: FormName, field: string) {
  window.gtag?.('event', 'form_error', { form, field, page: window.location.pathname });
}

/** mailto:/tel: links. The address itself is never sent. */
export function trackContactClick(kind: 'email' | 'phone', location: string) {
  window.gtag?.('event', kind === 'email' ? 'email_link_click' : 'phone_link_click', {
    location,
    page: window.location.pathname,
  });
}

/** Which form a page's lead form is, from the path. */
export function formForPath(path: string): FormName {
  if (path.startsWith('/free-system')) return 'free-system';
  if (path.startsWith('/book-a-call')) return 'book-a-call';
  return 'home';
}
