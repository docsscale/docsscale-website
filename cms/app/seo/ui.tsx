import type { CSSProperties, ReactNode } from 'react';

// Shared pieces of the dashboard screens. Colours are the site's own tokens
// (web/src/styles/tokens.ts), so the admin looks like DocsScale.
export const T = {
  bg: '#FAF9F6', band: '#F3F1EC', surface: '#FFFFFF', ink: '#1A1A1A', body: '#5C5A55', caption: '#6C6962',
  hairline: '#E6E3DC', teal: '#0F5F63', tealTint: '#DDEEEE', peachBg: '#FBE7D6', peachFg: '#8A4B1E', sageBg: '#DAEDE2', sageFg: '#1F5A40',
} as const;

export const fmt = (n: number | null | undefined, digits = 0) =>
  n == null || Number.isNaN(n) ? 'Unknown' : n.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits });

export const when = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }) + ' Houston' : 'Never';

export const day = (iso: string | null | undefined) =>
  iso ? new Date(iso.length === 10 ? iso + 'T12:00:00Z' : iso).toLocaleDateString('en-US', { dateStyle: 'medium' }) : 'Unknown';

export function H1({ children }: { children: ReactNode }) {
  return <h1 style={{ fontSize: 26, margin: '8px 0 4px', color: T.ink, fontWeight: 600 }}>{children}</h1>;
}

export function Section({ title, note, children }: { title: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: 18, margin: '16px 0' }}>
      <h2 style={{ fontSize: 17, margin: '0 0 4px', color: T.ink, fontWeight: 600 }}>{title}</h2>
      {note && <p style={{ margin: '0 0 12px', color: T.caption, fontSize: 13 }}>{note}</p>}
      {children}
    </section>
  );
}

/** "Source · period · fetched": under every figure, so nothing is shown without its origin. */
export function Source({ children }: { children: ReactNode }) {
  return <p style={{ margin: '8px 0 0', color: T.caption, fontSize: 12 }}>{children}</p>;
}

export function Empty({ children }: { children: ReactNode }) {
  return <p style={{ margin: 0, color: T.body, fontSize: 14, background: T.band, borderRadius: 8, padding: 12 }}>{children}</p>;
}

export function Change({ now, before, lowerIsBetter = false, min = 0 }: { now: number; before: number; lowerIsBetter?: boolean; min?: number }) {
  // SEO-OS section 6: a trend needs enough volume in both periods (100 impressions); below it, say so.
  if (min && (now < min || before < min)) return <span style={{ color: T.caption }}>Insufficient data for a trend (needs {min} in both periods; previous: {fmt(before)})</span>;
  if (!before && !now) return <span style={{ color: T.caption }}>No change</span>;
  if (!before) return <span style={{ color: T.caption }}>New (none in the previous period)</span>;
  const pct = ((now - before) / before) * 100;
  const good = lowerIsBetter ? pct < 0 : pct > 0;
  const color = Math.abs(pct) < 0.5 ? T.caption : good ? T.sageFg : T.peachFg;
  return <span style={{ color }}>{pct > 0 ? '+' : ''}{fmt(pct)}% vs previous 28 days</span>;
}

export function Tile({ label, value, sub, source }: { label: string; value: string; sub?: ReactNode; source: string }) {
  return (
    <div style={{ background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: 16 }}>
      <div style={{ fontSize: 13, color: T.body }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 600, color: T.ink, margin: '4px 0' }}>{value}</div>
      {sub && <div style={{ fontSize: 12 }}>{sub}</div>}
      <div style={{ fontSize: 11, color: T.caption, marginTop: 6 }}>{source}</div>
    </div>
  );
}

export const tiles: CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 };

export function Table({ head, rows, empty = 'Nothing to show yet.' }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  if (!rows.length) return <Empty>{empty}</Empty>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>{head.map((h) => <th key={h} style={th}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j} style={td}>{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const th: CSSProperties = { textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${T.hairline}`, color: T.body, fontWeight: 600, whiteSpace: 'nowrap' };
export const td: CSSProperties = { padding: '8px 10px', borderBottom: `1px solid ${T.hairline}`, color: T.ink, verticalAlign: 'top' };

export function Badge({ tone, children }: { tone: 'good' | 'bad' | 'neutral'; children: ReactNode }) {
  const c = tone === 'good' ? [T.sageBg, T.sageFg] : tone === 'bad' ? [T.peachBg, T.peachFg] : [T.band, T.body];
  return <span style={{ background: c[0], color: c[1], borderRadius: 999, padding: '2px 8px', fontSize: 12, whiteSpace: 'nowrap' }}>{children}</span>;
}

/** Daily line chart in plain SVG: one or two series, no chart library. */
export function DailyChart({ points, series }: { points: Record<string, number | string>[]; series: { key: string; label: string; color: string }[] }) {
  if (points.length < 2) return <Empty>Not enough days of data for a chart yet.</Empty>;
  const W = 640, H = 160, P = 24;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }} role="img" aria-label={series.map((s) => s.label).join(' and ') + ' per day'}>
        <line x1={P} y1={H - P} x2={W - P} y2={H - P} stroke={T.hairline} />
        {series.map((s) => {
          const vals = points.map((p) => Number(p[s.key]) || 0);
          const max = Math.max(1, ...vals);
          const d = vals.map((v, i) => `${i ? 'L' : 'M'}${P + (i * (W - 2 * P)) / (vals.length - 1)},${H - P - (v / max) * (H - 2 * P)}`).join(' ');
          return <path key={s.key} d={d} fill="none" stroke={s.color} strokeWidth={2} />;
        })}
        <text x={P} y={H - 6} fontSize={11} fill={T.caption}>{String(points[0].date)}</text>
        <text x={W - P} y={H - 6} fontSize={11} fill={T.caption} textAnchor="end">{String(points[points.length - 1].date)}</text>
      </svg>
      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: T.body }}>
        {series.map((s) => (
          <span key={s.key}><span style={{ display: 'inline-block', width: 10, height: 10, background: s.color, borderRadius: 2, marginRight: 6 }} />{s.label} (each line on its own scale; peak {fmt(Math.max(...points.map((p) => Number(p[s.key]) || 0)))})</span>
        ))}
      </div>
    </div>
  );
}

export const link: CSSProperties = { color: T.teal };
export const button: CSSProperties = { background: T.teal, color: '#fff', border: 0, borderRadius: 8, padding: '10px 16px', fontSize: 14, cursor: 'pointer' };
export const input: CSSProperties = { borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline, borderRadius: 8, padding: '10px 12px', fontSize: 15, width: '100%', boxSizing: 'border-box' };
