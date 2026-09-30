'use client';

// Screen-reader support for the lead forms (WCAG 4.1.3 Status Messages).
// Nothing here changes what sighted visitors see.
import { useEffect, useRef } from 'react';

// Inline, not a class: the funnel pages don't load globals.css.
const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

/** Visually hidden live region: announces "Sending…" and similar progress text. */
export function StatusAnnouncer({ message }: { message: string }) {
  return (
    <span role="status" aria-live="polite" style={visuallyHidden}>
      {message}
    </span>
  );
}

/**
 * Moves keyboard and screen-reader focus to an element when it first appears
 * (the success message that replaces a submitted form). Give the element
 * tabIndex={-1}; it isn't a control, so it shows no focus ring.
 */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}
