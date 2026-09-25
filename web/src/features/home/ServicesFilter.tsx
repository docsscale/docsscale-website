'use client';

// Stage filter for the homepage services grid. Renders the header row (the
// server-rendered heading passed as `heading`, plus the filter buttons) and the
// card grid, since the buttons and the cards sit in different rows.
import { useState, type ReactNode } from 'react';
import { SERVICES, SERVICES_SECTION } from '@/content/home';
import { STAGE_COLORS, T, type Stage } from '@/styles/tokens';

type FilterKey = (typeof SERVICES_SECTION.filters)[number]['key'];

export function ServicesFilter({ heading }: { heading: ReactNode }) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const visible = SERVICES.filter((s) => filter === 'all' || s.stage === filter);

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'end',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        {heading}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SERVICES_SECTION.filters.map((option) => {
            const selected = option.key === filter;
            const color =
              option.key === 'all' ? { bg: T.ink, fg: '#FFFFFF' } : STAGE_COLORS[option.key as Stage];
            return (
              <button
                key={option.key}
                onClick={() => setFilter(option.key)}
                className="filter-btn"
                style={{
                  height: 40,
                  padding: '0 16px',
                  borderRadius: 999,
                  border: `1px solid ${selected ? color.fg : T.hairline}`,
                  background: selected ? color.bg : T.surface,
                  color: selected ? color.fg : T.body,
                  fontWeight: 700,
                  fontSize: 14,
                  whiteSpace: 'nowrap',
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,270px),1fr))',
          gap: 14,
        }}
      >
        {visible.map((service) => {
          const color = STAGE_COLORS[service.stage];
          return (
            <div
              key={service.n}
              data-lift="1"
              style={{
                background: color.bg,
                color: color.fg,
                borderRadius: 28,
                padding: 26,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 20,
                minHeight: 230,
                animation: 'fadein .45s ease both',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                <span style={{ textTransform: 'capitalize' }}>{service.stage}</span>
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    background: T.surface,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {service.n}
                </span>
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', lineHeight: 1.1 }}>
                  {service.title}
                </div>
                <p style={{ margin: '8px 0 0', fontSize: 14, lineHeight: 1.55 }}>{service.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
