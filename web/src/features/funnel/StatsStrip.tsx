'use client';

// Five stat cards under the funnel hero; numeric ones count up (1 s, ease-out)
// the first time they scroll into view.
// The real numbers are in the page's HTML, so they are there without JavaScript
// (search engines, link previews, a script that fails to load). The count-up is
// added on top: once the script runs, a card that is still off-screen is set
// back to 0 and counts up when it scrolls in. Visitors who prefer reduced
// motion keep the real numbers and get no count-up.
import { useEffect, useRef, useState } from 'react';
import { FUNNEL_STATS, type FunnelStat } from '@/content/funnel';

function StatCard({ card }: { card: FunnelStat }) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(card.staticText ?? `${card.value}${card.suffix ?? ''}`);

  useEffect(() => {
    if (card.staticText || card.value === undefined) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const target = card.value;
    const suffix = card.suffix ?? '';
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            setText(`0${suffix}`); // off-screen: ready to count up
            return;
          }
          let start: number | null = null;
          const tick = (now: number) => {
            if (start === null) start = now;
            const progress = Math.min((now - start) / 1000, 1);
            setText(Math.round((1 - Math.pow(1 - progress, 3)) * target) + suffix);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [card]);

  return (
    <div
      ref={ref}
      style={{
        background: card.bg,
        borderRadius: 18,
        padding: 'clamp(20px,2.5vw,32px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <span
        style={{
          fontWeight: 800,
          fontSize: 'clamp(40px,5.5vw,88px)',
          lineHeight: 0.9,
          letterSpacing: '-.05em',
          color: card.numColor,
        }}
      >
        {text}
      </span>
      <span
        style={{
          fontSize: 'clamp(10px,1vw,13px)',
          fontWeight: 800,
          color: card.labelColor,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
        }}
      >
        {card.label}
      </span>
    </div>
  );
}

export function StatsStrip() {
  return (
    <div style={{ padding: 'clamp(32px,4vw,56px) clamp(16px,4vw,40px)', background: '#FAF9F6' }}>
      <div
        className="stats-grid"
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(5,1fr)',
          gap: 12,
          alignItems: 'stretch',
        }}
      >
        {FUNNEL_STATS.map((card) => (
          <StatCard key={card.label} card={card} />
        ))}
      </div>
    </div>
  );
}
