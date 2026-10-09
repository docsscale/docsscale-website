'use client';

import { useMemo, useState } from 'react';

// A table the reader can sort (click a heading) and filter (type in the box).
// Values stay plain strings and numbers so the server can hand them over as is.
export type Cell = string | number | null;

export function SortableTable({ head, rows, filterLabel }: { head: string[]; rows: Cell[][]; filterLabel: string }) {
  const [sort, setSort] = useState<{ col: number; dir: 1 | -1 } | null>(null);
  const [filter, setFilter] = useState('');
  const shown = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const list = f ? rows.filter((r) => r.some((c) => String(c ?? '').toLowerCase().includes(f))) : rows;
    if (!sort) return list;
    return [...list].sort((a, b) => {
      const x = a[sort.col], y = b[sort.col];
      if (x == null || x === 'Unknown') return 1;
      if (y == null || y === 'Unknown') return -1;
      return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * sort.dir;
    });
  }, [rows, sort, filter]);
  const numeric = head.map((_, j) => rows.some((r) => typeof r[j] === 'number') && rows.every((r) => r[j] == null || typeof r[j] === 'number' || r[j] === 'Unknown'));

  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#5C5A55', marginBottom: 10, flexWrap: 'wrap' }}>
        {filterLabel}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Type to filter" style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#E6E3DC', borderRadius: 9, padding: '7px 10px', fontSize: 13.5, maxWidth: 280, width: '100%' }} />
        <span style={{ fontSize: 12, color: '#6C6962' }}>{shown.length} of {rows.length} shown</span>
      </label>
      <div className="sx-table-wrap">
        <table className="sx-table">
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={h} className={numeric[i] ? 'sx-num' : undefined}>
                  <button type="button" className="sx-sort" onClick={() => setSort((s) => ({ col: i, dir: s?.col === i && s.dir === 1 ? -1 : 1 }))} aria-sort={sort?.col === i ? (sort.dir === 1 ? 'ascending' : 'descending') : undefined}>
                    {h}{sort?.col === i ? (sort.dir === 1 ? ' ▲' : ' ▼') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shown.map((r, i) => (
              <tr key={i}>
                {r.map((c, j) => (
                  <td key={j} className={numeric[j] ? 'sx-num' : undefined}>
                    {c == null ? 'Unknown' : typeof c === 'number' ? c.toLocaleString('en-US') : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
