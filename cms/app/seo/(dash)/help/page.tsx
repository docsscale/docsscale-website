import { requireUser } from '../../../../lib/seo/auth';
import { H1, Section, T, link } from '../../ui';

export const dynamic = 'force-dynamic';

// How to use the dashboard (owner, 9 Oct 2026: "later I want you to guide
// me how to properly use dashboard to scale SEO"). A plain walkthrough: what
// runs by itself, what the owner does each week, and what each tab is for.
// Kept here, beside the tabs it describes, so it cannot drift from them.

const Step = ({ when, children }: { when: string; children: React.ReactNode }) => (
  <li style={{ display: 'grid', gridTemplateColumns: 'minmax(96px, 140px) 1fr', gap: 12, alignItems: 'start' }}>
    <strong style={{ color: T.ink }}>{when}</strong>
    <span>{children}</span>
  </li>
);
const list = { margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10, fontSize: 14, color: T.body } as const;
const A = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} style={link}>{children}</a>;

export default async function Help() {
  await requireUser('/seo/help');
  return (
    <>
      <H1 lede="What the dashboard does on its own, what to do each week, and what each tab is for. About fifteen minutes a week keeps it moving; the rest is writing.">How to use this dashboard</H1>

      <Section title="What runs by itself" note="Nothing here needs a click.">
        <ul style={list}>
          <Step when="Every day, 5am">The data comes in: Google Search Console, Bing, analytics, the live site check, the content files, the CRM. The rules then run and new findings land in the <A href="/seo/queue">fix queue</A> as Detected.</Step>
          <Step when="Every 2 hours">The sitemap is read; new or changed pages are sent to Bing and Google by themselves (<A href="/seo/technical">Technical health</A>, Indexing).</Step>
          <Step when="Weekly">Keyword ideas for all nine specialties are looked up again, so <A href="/seo/content">What to write next</A> keeps moving. Pages still not indexed after two weeks get a reminder email.</Step>
          <Step when="Mon and Thu">The written summary on the <A href="/seo">Overview</A> is refreshed and the 30/60/90 plan kept current; approved invisible fixes are carried out and reported; approved wording fixes become pull requests for your go-ahead.</Step>
          <Step when="Monthly">A plain-language report lands on <A href="/seo/history">History and outcomes</A> and in your inbox on the first Monday.</Step>
        </ul>
      </Section>

      <Section title="Your week" note="The order to open things. Each step is a few minutes.">
        <ul style={list}>
          <Step when="Monday">Read the summary on <A href="/seo">Overview</A>, then open <A href="/seo/today">Today</A>. Work from the top: approve what you want done (Approve), park what can wait (Save for later), reject what is wrong. Approved items are picked up by the next run or turned into editor tasks.</Step>
          <Step when="Tuesday">Open <A href="/seo/content">Content inventory</A> and pick one line from What to write next; press Add to plan. Write it in the editor during the week; "Before you publish" on the same tab tells you what to fix before pressing Publish. Two or three strong pieces a week is the pace, not more.</Step>
          <Step when="Thursday">Open <A href="/seo/links">Links</A>. Take one row of Link building forward: create the listing or send the email, then move it to Contacted or Live. Add any site you came across to the list.</Step>
          <Step when="Monthly">Export the backlink list and the keyword positions from whichever tool you use (Ahrefs, Semrush, Ubersuggest, Search Console) and upload them on <A href="/seo/imports">Imports</A>. The dashboard spots links that disappeared, phrases just off page one and rankings that dropped, and puts each in the queue.</Step>
          <Step when="Any time">Type a topic into Keyword ideas on <A href="/seo/keywords">Keywords and rankings</A> to see what people search around it and where we stand. <A href="/seo/questions">Questions and gaps</A> lists what people ask that no page answers.</Step>
        </ul>
      </Section>

      <Section title="What each tab is for">
        <ul style={list}>
          <Step when="Overview">The 28-day figures, the written summary, what matters most, risks and quick wins.</Step>
          <Step when="Today">Every open item in the order to do it, with filters by kind, who, status and page.</Step>
          <Step when="Google, Bing">What each engine shows us for: phrases, pages, clicks, crawl issues.</Step>
          <Step when="Keywords and rankings">Keyword ideas by topic, the keyword map, and positions from your uploads.</Step>
          <Step when="Questions and gaps">Question-shaped searches and whether a heading answers them; keyword-map pages not written yet.</Step>
          <Step when="AI visibility">Whether assistants cite us, from Bing's report, your uploads and the manual check log.</Step>
          <Step when="Analytics, Leads">Visitors who accepted cookies, and leads in the CRM by source and landing page.</Step>
          <Step when="Content inventory">What to write next, the pre-publish checks on drafts, and every page and post with its score.</Step>
          <Step when="Technical health">Site-wide checks, page speed, and the Indexing panel with per-page Google and Bing status.</Step>
          <Step when="Links">Link building list, links that disappeared, competitor gaps, the internal link map.</Step>
          <Step when="Fix queue">Every finding with its evidence; the decisions live here.</Step>
          <Step when="30/60/90 plan">Approved work by horizon, plus lines you add by hand.</Step>
          <Step when="History">What was done, what it changed, the monthly reports.</Step>
          <Step when="Imports">Uploads from any tool; recognised by their columns.</Step>
        </ul>
      </Section>

      <Section title="Three rules that keep it honest">
        <ul style={list}>
          <Step when="Nothing invented">Every number names its source and date. "Unknown" or "Insufficient data" is the honest answer on a young site, not a fault.</Step>
          <Step when="Nothing publishes here">Approving an item makes a task, a draft or a pull request. Pages change only through the editor or a release you said yes to.</Step>
          <Step when="Free first">The dashboard works from free sources and your uploads. A paid tool is your call; when you add one, upload its exports and the same rules use them.</Step>
        </ul>
      </Section>
    </>
  );
}
