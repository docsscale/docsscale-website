import type { CSSProperties, ReactNode } from 'react';

// Shared pieces of the dashboard screens. Colours are the site's own tokens
// (web/src/styles/tokens.ts), so the admin looks like DocsScale. Hover, focus
// and narrow-screen rules live in seo.css under the "sx-" classes.
export const T = {
  bg: '#FAF9F6', band: '#F3F1EC', surface: '#FFFFFF', ink: '#1A1A1A', body: '#5C5A55', caption: '#6C6962',
  hairline: '#E6E3DC', teal: '#0F5F63', tealTint: '#DDEEEE', peachBg: '#FBE7D6', peachFg: '#8A4B1E', sageBg: '#DAEDE2', sageFg: '#1F5A40',
  amberBg: '#FFF3D6', amberFg: '#7A5200',
} as const;

export const fmt = (n: number | null | undefined, digits = 0) =>
  n == null || Number.isNaN(n) ? 'Unknown' : n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });

export const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }) + ' Houston' : 'Never';

export const day = (iso: string | null | undefined) =>
  iso ? new Date(iso.length === 10 ? iso + 'T12:00:00Z' : iso).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Unknown';

/** Page title, with an optional one-line explanation under it and actions beside it. */
export function H1({ children, lede, actions }: { children: ReactNode; lede?: ReactNode; actions?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', margin: '0 0 20px' }}>
      <div style={{ minWidth: 0, flex: '1 1 480px' }}>
        <h1 style={{ fontSize: 24, margin: 0, color: T.ink, fontWeight: 650, lineHeight: 1.2 }}>{children}</h1>
        {lede && <p style={{ margin: '6px 0 0', color: T.body, fontSize: 14, maxWidth: 760 }}>{lede}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

export function Section({ title, note, aside, children, style }: { title: string; note?: ReactNode; aside?: ReactNode; children: ReactNode; style?: CSSProperties }) {
  return (
    <section className="sx-card" style={{ margin: '16px 0', ...style }}>
      <div className="sx-card-head">
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: 15.5, margin: 0, color: T.ink, fontWeight: 600 }}>{title}</h2>
          {note && <p style={{ margin: '3px 0 0', color: T.caption, fontSize: 13 }}>{note}</p>}
        </div>
        {aside && <div style={{ flex: '0 0 auto' }}>{aside}</div>}
      </div>
      <div className="sx-card-body">{children}</div>
    </section>
  );
}

/** Two cards side by side on a wide screen, stacked on a phone. */
export function Grid2({ children }: { children: ReactNode }) {
  return <div className="sx-grid-2" style={{ margin: '16px 0' }}>{children}</div>;
}

/** "Source · period · fetched": under every figure, so nothing is shown without its origin. */
export function Source({ children }: { children: ReactNode }) {
  return (
    <p style={{ margin: '10px 0 0', color: T.caption, fontSize: 12, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
      <svg viewBox="0 0 24 24" width={13} height={13} aria-hidden="true" style={{ flex: '0 0 13px', marginTop: 2, stroke: 'currentColor', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
      <span>{children}</span>
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <div style={{ margin: 0, color: T.body, fontSize: 13.5, border: `1px dashed ${T.hairline}`, background: T.bg, borderRadius: 10, padding: '18px 16px', textAlign: 'center' }}>
      {children}
    </div>
  );
}

export function Change({ now, before, lowerIsBetter = false, min = 0 }: { now: number; before: number; lowerIsBetter?: boolean; min?: number }) {
  // SEO-OS section 6: a trend needs enough volume in both periods (100 impressions); below it, say so.
  const pill = (bg: string, fg: string, text: ReactNode, title?: string) => (
    <span title={title} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: bg, color: fg, borderRadius: 999, padding: '2px 8px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>
  );
  if (min && (now < min || before < min)) return pill(T.band, T.caption, 'Not enough data for a trend', `Needs ${min} in both periods; previous: ${fmt(before)}`);
  if (!before && !now) return pill(T.band, T.caption, 'No change');
  if (!before) return pill(T.band, T.caption, 'New', 'None in the previous period');
  const pct = ((now - before) / before) * 100;
  const good = lowerIsBetter ? pct < 0 : pct > 0;
  const flat = Math.abs(pct) < 0.5;
  return pill(flat ? T.band : good ? T.sageBg : T.peachBg, flat ? T.caption : good ? T.sageFg : T.peachFg, <>{flat ? '' : pct > 0 ? '▲ ' : '▼ '}{pct > 0 ? '+' : ''}{fmt(pct)}%</>, 'Against the previous 28 days');
}

export function Tile({ label, value, sub, source }: { label: string; value: string; sub?: ReactNode; source: string }) {
  return (
    <div className="sx-card sx-tile">
      <div style={{ fontSize: 12.5, color: T.body, fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
        <span className="sx-num" style={{ fontSize: 30, fontWeight: 650, color: T.ink, lineHeight: 1.1, letterSpacing: '-0.02em' }}>{value}</span>
        {sub && <span style={{ fontSize: 12, color: T.body }}>{sub}</span>}
      </div>
      <div className="sx-tile-source sx-clamp" title={source}>{source}</div>
    </div>
  );
}

export const tiles: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 };

const NUMERIC = /^[+\-−▲▼ ]?[\d,.]+(\s?%|\s?\/\s?\d+)?$/;
const isNum = (c: ReactNode) => typeof c === 'number' || (typeof c === 'string' && NUMERIC.test(c.trim()));

export function Table({ head, rows, empty = 'Nothing to show yet.' }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  // A column is right-aligned when every filled cell in it is a number.
  const numeric = head.map((_, j) => rows.every((r) => r[j] == null || r[j] === '—' || r[j] === 'Unknown' || isNum(r[j])) && rows.some((r) => isNum(r[j])));
  return (
    <div className="sx-table-wrap">
      <table className="sx-table">
        <thead>
          <tr>{head.map((h, j) => <th key={h} className={numeric[j] ? 'sx-num' : undefined}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} className={numeric[j] ? 'sx-num' : undefined}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const th: CSSProperties = { textAlign: 'left', padding: '9px 12px', borderBottom: `1px solid ${T.hairline}`, color: T.caption, fontWeight: 600, whiteSpace: 'nowrap', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', background: T.band };
export const td: CSSProperties = { padding: '10px 12px', borderBottom: `1px solid ${T.hairline}`, color: T.ink, verticalAlign: 'top' };

export function Badge({ tone, children }: { tone: 'good' | 'bad' | 'neutral' | 'warn' | 'info'; children: ReactNode }) {
  const c = tone === 'good' ? [T.sageBg, T.sageFg] : tone === 'bad' ? [T.peachBg, T.peachFg] : tone === 'warn' ? [T.amberBg, T.amberFg] : tone === 'info' ? [T.tealTint, T.teal] : [T.band, T.body];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: c[0], color: c[1], borderRadius: 999, padding: '2px 9px', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', lineHeight: 1.5 }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', opacity: 0.8 }} />
      {children}
    </span>
  );
}

/** Daily line chart in plain SVG: one or two series, no chart library. */
export function DailyChart({ points, series }: { points: Record<string, number | string>[]; series: { key: string; label: string; color: string }[] }) {
  if (points.length < 2) return <Empty>Not enough days of data for a chart yet.</Empty>;
  const W = 1000, H = 220, P = 16, PB = 26;
  const x = (i: number) => P + (i * (W - 2 * P)) / (points.length - 1);
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label={series.map((s) => s.label).join(' and ') + ' per day'}>
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`sx-g-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={s.color} stopOpacity={0.18} />
              <stop offset="1" stopColor={s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={P} x2={W - P} y1={H - PB - f * (H - P - PB)} y2={H - PB - f * (H - P - PB)} stroke={T.hairline} strokeDasharray="3 4" />)}
        <line x1={P} y1={H - PB} x2={W - P} y2={H - PB} stroke={T.hairline} />
        {series.map((s) => {
          const vals = points.map((p) => Number(p[s.key]) || 0);
          const max = Math.max(1, ...vals);
          const y = (v: number) => H - PB - (v / max) * (H - P - PB);
          const d = vals.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
          const last = vals.length - 1;
          return (
            <g key={s.key}>
              <path d={`${d} L${x(last)},${H - PB} L${x(0)},${H - PB} Z`} fill={`url(#sx-g-${s.key})`} />
              <path d={d} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={x(last)} cy={y(vals[last])} r={3.5} fill="#fff" stroke={s.color} strokeWidth={2} />
            </g>
          );
        })}
        <text x={P} y={H - 8} fontSize={12} fill={T.caption}>{String(points[0].date)}</text>
        <text x={W - P} y={H - 8} fontSize={12} fill={T.caption} textAnchor="end">{String(points[points.length - 1].date)}</text>
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: T.body, flexWrap: 'wrap', marginTop: 6 }}>
        {series.map((s) => (
          <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ display: 'inline-block', width: 10, height: 10, background: s.color, borderRadius: 3 }} />{s.label} <span style={{ color: T.caption }}>(own scale; peak {fmt(Math.max(...points.map((p) => Number(p[s.key]) || 0)))})</span></span>
        ))}
      </div>
    </div>
  );
}

export const link: CSSProperties = { color: T.teal };
export const button: CSSProperties = { background: T.teal, color: '#fff', border: 0, borderRadius: 9, padding: '9px 15px', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', boxShadow: '0 1px 2px rgba(15, 95, 99, 0.25)' };
export const quietButton: CSSProperties = { ...button, background: T.surface, color: T.body, borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline, boxShadow: 'none', fontWeight: 500 };
export const input: CSSProperties = { borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline, borderRadius: 9, padding: '9px 12px', fontSize: 14, width: '100%', boxSizing: 'border-box', background: T.surface };
