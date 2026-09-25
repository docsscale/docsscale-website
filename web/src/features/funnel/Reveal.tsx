'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

// Fades its content up when it scrolls into view (the .reveal/.in classes live
// in styles/funnel.css). A 2-second fallback reveals it regardless, so nothing
// can stay hidden if the observer never fires.
export function Reveal({ children, style }: { children?: ReactNode; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    const fallback = setTimeout(() => el.classList.add('in'), 2000);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, []);
  return (
    <div ref={ref} className="reveal" style={style}>
      {children}
    </div>
  );
}
