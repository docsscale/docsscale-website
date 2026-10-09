import { requireUser } from '../../../../lib/seo/auth';
import type { AnalyticsData } from '../../../../lib/seo/sources/analytics';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import { addAiCheck } from '../../actions';
import { Badge, Empty, H1, Section, Source, T, Table, Tile, button, fmt, input, link, tiles, when } from '../../ui';

export const dynamic = 'force-dynamic';

// AI visibility (docs/SEO-DASHBOARD-PLAN.md, section 8, tab 11): visits and
// leads from AI assistants (GA4 groups them from the referring address, so it
// undercounts), Bing's AI citations from an uploaded export, and a log of
// checks made by hand. Automated tracking needs a paid connector, which is off.

type Check = { id: number; at: string; by: string; assistant: string; question: string; cited: number; detail: string };

export default async function Ai() {
  await requireUser('/seo/ai', 'seo');
  const ga = latestSnapshot<AnalyticsData>('analytics');
  const ai = ga?.data.channels.find((c) => c.channel === 'AI assistants');
  const checks = store().prepare('SELECT * FROM ai_checks ORDER BY id DESC LIMIT 200').all() as Check[];
  const citations = store().prepare("SELECT id, at, by, source, filename, rows FROM imports WHERE source LIKE '%AI%' OR source LIKE '%citation%' ORDER BY id DESC LIMIT 10").all() as { id: number; at: string; by: string; source: string; filename: string; rows: number }[];
  const cited = checks.filter((c) => c.cited).length;

  return (
    <>
      <H1>AI visibility</H1>
      <div style={tiles}>
        <Tile label="Visits from AI assistants" value={ga ? fmt(ai?.sessions ?? 0) : 'Unknown'} sub={ga && <span>Previous 28 days: {fmt(ai?.previous ?? 0)}</span>} source={ga ? `GA4, ${ga.data.current[0]} to ${ga.data.current[1]}; referrals from ChatGPT, Perplexity, Gemini, Copilot, Claude and others. Visits from the assistants' apps often carry no referrer, so this undercounts.` : 'GA4 · not collected yet'} />
        <Tile label="Leads from AI assistants" value={ga ? fmt(ai?.keyEvents ?? 0) : 'Unknown'} source="GA4 key events on those visits. The CRM is the count of record." />
        <Tile label="Manual checks: cited" value={checks.length ? `${cited} of ${checks.length}` : 'None yet'} source="Typed in by hand below; labelled as manual" />
      </div>

      <Section title="Checks made by hand" note="Ask an assistant a question a prospect would ask, and note whether DocsScale was cited. The one place on the dashboard where a result is typed in.">
        <form action={addAiCheck} style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', alignItems: 'end', marginBottom: 12 }}>
          <label style={{ fontSize: 12 }}>Assistant<input name="assistant" required placeholder="ChatGPT, Perplexity…" style={{ ...input, marginTop: 2 }} /></label>
          <label style={{ fontSize: 12, gridColumn: 'span 2' }}>Question asked<input name="question" required style={{ ...input, marginTop: 2 }} /></label>
          <label style={{ fontSize: 12 }}>DocsScale cited?<select name="cited" style={{ ...input, marginTop: 2 }}><option value="no">No</option><option value="yes">Yes</option></select></label>
          <label style={{ fontSize: 12, gridColumn: 'span 2' }}>What it said (optional)<input name="detail" style={{ ...input, marginTop: 2 }} /></label>
          <div><button type="submit" style={button}>Log the check</button></div>
        </form>
        <Table head={['When', 'Assistant', 'Question', 'Cited', 'What it said', 'By']} rows={checks.map((c) => [when(c.at), c.assistant, c.question, <Badge key="c" tone={c.cited ? 'good' : 'bad'}>{c.cited ? 'Yes' : 'No'}</Badge>, c.detail || '—', c.by])} empty="No checks logged yet." />
        <Source>Manual log; nothing here is measured by a tool</Source>
      </Section>

      <Section title="Bing's AI citations" note="Bing Webmaster Tools has an AI performance report with no API yet. Export it as CSV and upload it on the Imports tab with the source “Bing AI citations”.">
        <Table head={['When', 'Source', 'File', 'Rows', 'By']} rows={citations.map((i) => [when(i.at), i.source, <a key="f" href={`/seo/imports?view=${i.id}`} style={link}>{i.filename}</a>, fmt(i.rows), i.by])} empty="No export uploaded yet." />
      </Section>
      {!ga && <Empty>GA4 has not been read yet. See the Data sources tab.</Empty>}
      <p style={{ fontSize: 13, color: T.caption }}>Automated tracking of mentions in assistants&rsquo; answers comes with a paid connector (phase 3), off until the owner decides to buy one.</p>
    </>
  );
}
