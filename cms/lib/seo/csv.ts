// A small CSV reader for the Imports tab: quoted fields, commas or
// semicolons or tabs, a UTF-8 byte-order mark and Windows line ends. Keyword
// Planner exports are tab-separated UTF-16, which is converted before this.
export function parseCsv(text: string): { columns: string[]; rows: string[][] } {
  const src = text.replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  const firstLine = src.split('\n').find((l) => l.trim()) ?? '';
  const sep = firstLine.includes('\t') ? '\t' : firstLine.split(';').length > firstLine.split(',').length ? ';' : ',';
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === sep) { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  const kept = rows.filter((r) => r.some((f) => f.trim()));
  // Keyword Planner puts two title lines above the header; skip to the first line with several columns.
  const start = kept.findIndex((r) => r.filter((f) => f.trim()).length > 1);
  if (start < 0) return { columns: [], rows: [] };
  return { columns: kept[start].map((c) => c.trim()), rows: kept.slice(start + 1).map((r) => r.map((f) => f.trim())) };
}
