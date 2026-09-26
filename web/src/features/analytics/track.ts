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
