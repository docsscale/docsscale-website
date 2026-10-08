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

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: '#5C5A55', marginBottom: 8 }}>
        {filterLabel}{' '}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} style={{ borderWidth: 1, borderStyle: 'solid', borderColor: '#E6E3DC', borderRadius: 6, padding: '6px 8px', fontSize: 14, maxWidth: 260, width: '100%' }} />
      </label>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {head.map((h, i) => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', borderBottom: '1px solid #E6E3DC', whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    onClick={() => setSort((s) => ({ col: i, dir: s?.col === i && s.dir === 1 ? -1 : 1 }))}
                    style={{ background: 'none', border: 0, padding: 0, font: 'inherit', fontWeight: 600, color: '#5C5A55', cursor: 'pointer' }}
                  >
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
                  <td key={j} style={{ padding: '8px 10px', borderBottom: '1px solid #E6E3DC', verticalAlign: 'top' }}>
                    {c == null ? 'Unknown' : typeof c === 'number' ? c.toLocaleString('en-US') : c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: 12, color: '#6C6962' }}>{shown.length} of {rows.length} shown</p>
    </div>
  );
}
