'use client';

import { useEffect, useRef, useState } from 'react';

// Shows `value`; when it changes, counts from the old value to the new one
// (ease-out cubic). The first render is always the plain value, so server HTML
// and reduced-motion visitors see the final number.
export function AnimatedNumber({ value, duration = 900 }: { value: number; duration?: number }) {
  const [shown, setShown] = useState(value);
  const previous = useRef(value);

  useEffect(() => {
    const from = previous.current;
    previous.current = value;
    if (from === value) return;
    let frame = 0;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      frame = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setShown(Math.round(from + (value - from) * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <>{shown}</>;
}
