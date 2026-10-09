import { requireUser } from '../../../../lib/seo/auth';
import { store } from '../../../../lib/seo/store';
import { importCsv } from '../../actions';
import { Badge, H1, Section, Source, T, Table, button, fmt, input, link, when } from '../../ui';

export const dynamic = 'force-dynamic';

// Imports (docs/SEO-DASHBOARD-PLAN.md, section 8, tab 16): a CSV from any
// tool, stamped with its source, date and who uploaded it. CSV only, 2 MB at
// most, never served back as a page; the first 5,000 rows are kept.

type ImportRow = { id: number; at: string; by: string; source: string; filename: string; note: string; rows: number; columns: string; data?: string };
const SOURCES = ['Keyword Planner', 'Search Console links', 'Search Console performance', 'Bing AI citations', 'Bing links', 'Rank tracker export', 'Backlink export', 'Other'];

export default async function Imports({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string; view?: string }> }) {
  await requireUser('/seo/imports', 'seo');
  const { saved, error, view } = await searchParams;
  const list = store().prepare('SELECT id, at, by, source, filename, note, rows, columns FROM imports ORDER BY id DESC LIMIT 100').all() as ImportRow[];
  const open = view ? (store().prepare('SELECT * FROM imports WHERE id = ?').get(Number(view)) as ImportRow | undefined) : undefined;

  return (
    <>
      <H1>Imports</H1>
      {saved && <p><Badge tone="good">Uploaded and stamped.</Badge></p>}
      {error === 'csv' && <p><Badge tone="bad">Only a .csv file of 2 MB or less with a header row can be uploaded.</Badge></p>}
      {error === 'nothing' && <p><Badge tone="neutral">No file was chosen.</Badge></p>}
      <Section title="Upload a CSV" note="Keyword Planner, Search Console's links or performance export, Bing's AI citations, or any tool's export. Keyword Planner's own download is tab-separated: open it in a spreadsheet and save as CSV first.">
        <form action={importCsv} style={{ display: 'grid', gap: 10, maxWidth: 560 }}>
          <label style={{ fontSize: 13 }}>File<input type="file" name="file" accept=".csv,text/csv" required style={{ ...input, padding: 8, marginTop: 2 }} /></label>
          <label style={{ fontSize: 13 }}>Source<select name="source" style={{ ...input, marginTop: 2 }}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select></label>
          <label style={{ fontSize: 13 }}>Note (what it is, the period it covers)<input name="note" style={{ ...input, marginTop: 2 }} /></label>
          <div><button type="submit" style={button}>Upload</button></div>
        </form>
      </Section>
      <Section title="Everything uploaded">
        <Table head={['When', 'Source', 'File', 'Rows', 'Note', 'By']} rows={list.map((i) => [when(i.at), i.source, <a key="f" href={`/seo/imports?view=${i.id}`} style={link}>{i.filename}</a>, fmt(i.rows), i.note || '—', i.by])} empty="Nothing uploaded yet." />
        <Source>Stored in the dashboard&rsquo;s private store; each file is stamped with who uploaded it and when</Source>
      </Section>
      {open && open.data && (
        <Section title={`${open.filename} (first 50 of ${open.rows} rows)`} note={`${open.source}, uploaded ${when(open.at)} by ${open.by}${open.note ? `. ${open.note}` : ''}`}>
          <Table head={JSON.parse(open.columns) as string[]} rows={(JSON.parse(open.data) as string[][]).slice(0, 50)} />
        </Section>
      )}
      <p style={{ fontSize: 13, color: T.caption }}>Uploads are read as data only and are never served back as pages.</p>
    </>
  );
}
