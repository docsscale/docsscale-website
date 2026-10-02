'use client';

// Site-wide click and validation tracking (events listed in docs/TRACKING.md):
// - cta_click on links to /book-a-call/ and /free-system/ (and the funnel's
//   "Claim" buttons), with the page section as `location`: an explicit
//   data-cta-location, else the nearest data-screen-label ("Final CTA" →
//   final_cta; the nav is "header");
// - email_link_click / phone_link_click on mailto: / tel: links;
// - form_error when the browser's required-field check stops a form.
// Everything goes through gtag, so nothing is sent before "Accept".
// Also remembers the landing page and UTM tags for the lead (attribution.ts).
import { useEffect } from 'react';
import { rememberLanding } from './attribution';
import { formForPath, trackContactClick, trackCtaClick, trackFormError } from './track';

function locationOf(el: Element): string {
  const explicit = el.closest('[data-cta-location]')?.getAttribute('data-cta-location');
  if (explicit) return explicit;
  const label = el.closest('[data-screen-label]')?.getAttribute('data-screen-label') ?? 'page';
  if (label === 'Nav') return 'header';
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '_');
}

function ctaOf(a: HTMLAnchorElement): string | null {
  const url = new URL(a.href, window.location.href);
  if (url.origin !== window.location.origin) return null;
  const path = url.pathname.replace(/\/?$/, '/');
  if (path === '/book-a-call/') return 'book_a_call';
  if (path === '/free-system/book-a-call/') return 'free_system_book_call';
  if (path === '/free-system/')
    return url.hash === '#form' || window.location.pathname !== '/free-system/' ? 'free_system' : null;
  return null;
}

export function TrackEvents() {
  useEffect(() => {
    rememberLanding();
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute('href') ?? '';
      if (href.startsWith('mailto:')) return trackContactClick('email', locationOf(a));
      if (href.startsWith('tel:')) return trackContactClick('phone', locationOf(a));
      const cta = ctaOf(a);
      if (cta) trackCtaClick(cta, locationOf(a));
    };
    const onInvalid = (e: Event) => {
      const field = e.target as HTMLInputElement;
      if (!field.form) return;
      trackFormError(
        formForPath(window.location.pathname),
        field.name || field.dataset.field || field.getAttribute('aria-label') || 'field',
      );
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('invalid', onInvalid, true);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('invalid', onInvalid, true);
    };
  }, []);
  return null;
}
