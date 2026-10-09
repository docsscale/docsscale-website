import { cookies } from 'next/headers';
import { requireUser } from '../../../../lib/seo/auth';
import { bingKey, githubToken, googleKey, googleKeyAccount, hasReadKey, pagespeedKey, seoConfig, settingsPresence } from '../../../../lib/seo/config';
import { cronCommand, ensureServerFiles } from '../../../../lib/seo/server-files';
import { thresholds } from '../../../../lib/seo/findings';
import { setting, store } from '../../../../lib/seo/store';
import { clearKey, makeReadKey, saveEmailSettings, saveKeys, saveQueueSettings } from '../../actions';
import { Badge, H1, Section, Source, T, Table, button, input } from '../../ui';

export const dynamic = 'force-dynamic';

// Where the admin gives the app its keys, so nothing has to be typed into
// hPanel (owner, 8 Oct 2026). Keys go to the private folder and are never
// shown again: the screen only says whether each one is set.

const label = { display: 'block', fontSize: 13, color: T.body, marginBottom: 4 } as const;

export default async function Settings({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireUser('/seo/settings', 'admin');
  ensureServerFiles();
  const { saved, error } = await searchParams;
  const newKey = (await cookies()).get('ds_seo_newkey')?.value;
  const keys: { name: 'bingKey' | 'pagespeedKey' | 'githubToken'; label: string; note: string; set: boolean }[] = [
    { name: 'bingKey', label: 'Bing Webmaster API key', note: 'Bing Webmaster Tools → Settings → API access.', set: Boolean(bingKey()) },
    { name: 'pagespeedKey', label: 'PageSpeed API key (optional)', note: 'Without one, PageSpeed uses a shared quota and may answer "try later" on busy days.', set: Boolean(pagespeedKey()) },
    { name: 'githubToken', label: 'GitHub read token', note: 'Only needed once the repository is private again (read-only, contents scope).', set: Boolean(githubToken()) },
  ];

  return (
    <>
      <H1>Settings</H1>
      {saved && <p><Badge tone="good">Saved. The next run will use it.</Badge></p>}
      {error === 'google' && <p><Badge tone="bad">That file is not a Google service account key (it should be the JSON file downloaded from Google Cloud).</Badge></p>}
      {error === 'nothing' && <p><Badge tone="neutral">Nothing was filled in.</Badge></p>}

      <Section title="Google key (Search Console and Analytics)" note="The JSON key file of the read-only service account. It is kept in the private folder on the server and never shown again.">
        <p style={{ margin: '0 0 12px' }}>
          State: <Badge tone={googleKey() ? 'good' : 'neutral'}>{googleKey() ? `Set (${googleKeyAccount() || 'account unknown'})` : 'Not set'}</Badge>
        </p>
        <form action={saveKeys} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <label style={label}>
            Key file
            <input type="file" name="googleKeyFile" accept=".json,application/json" style={{ ...input, padding: 8 }} />
          </label>
          <div><button type="submit" style={button}>Save the Google key</button></div>
        </form>
      </Section>

      <Section title="Other keys" note="Paste a key and save. Leave a box empty to keep what is there.">
        <form action={saveKeys} style={{ display: 'grid', gap: 14, maxWidth: 520 }}>
          {keys.map((k) => (
            <label key={k.name} style={label}>
              {k.label} <Badge tone={k.set ? 'good' : 'neutral'}>{k.set ? 'Set' : 'Not set'}</Badge>
              <input type="password" name={k.name} autoComplete="off" placeholder={k.set ? 'Set; paste a new one to replace it' : ''} style={{ ...input, marginTop: 4 }} />
              <span style={{ fontSize: 12, color: T.caption }}>{k.note}</span>
            </label>
          ))}
          <div><button type="submit" style={button}>Save keys</button></div>
        </form>
        <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
          {([{ name: 'googleKey', label: 'Google key' }, ...keys] as { name: string; label: string }[]).map((k) => (
            <form key={k.name} action={clearKey}>
              <input type="hidden" name="name" value={k.name} />
              <button type="submit" style={{ ...button, background: T.surface, color: T.body, borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline }}>Remove the {k.label}</button>
            </form>
          ))}
        </div>
      </Section>

      <Section title="Claude's key" note="Lets Claude read every tab and, like the SEO role, write the weekly summary, note progress on queue items, add plan lines, the ignore list and AI checks (owner, 9 Oct 2026). It may approve invisible fixes only (site checks, pages not answering, Bing crawl errors, structured data, canonical and noindex); anything with words on it still waits for your Approve. It cannot reject items, nor change keys, people or settings. Make one, copy it into the cloud environment's secrets, and it is never shown again. Every use appears in the Access log.">
        {newKey && (
          <p style={{ margin: '0 0 12px', padding: 12, background: '#fff8e6', borderRadius: 8, fontSize: 14 }}>
            Copy this now; it is shown only once:<br />
            <code style={{ fontSize: 14, userSelect: 'all' }}>{newKey}</code>
          </p>
        )}
        <p style={{ margin: '0 0 12px' }}>State: <Badge tone={hasReadKey() ? 'good' : 'neutral'}>{hasReadKey() ? 'A key exists' : 'No key'}</Badge></p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <form action={makeReadKey}><button type="submit" style={button}>{hasReadKey() ? 'Make a new key (replaces the old one)' : 'Make a read-only key'}</button></form>
          {hasReadKey() && (
            <form action={clearKey}>
              <input type="hidden" name="name" value="readKeyHash" />
              <button type="submit" style={{ ...button, background: T.surface, color: T.body, borderWidth: 1, borderStyle: 'solid', borderColor: T.hairline }}>Remove the key</button>
            </form>
          )}
        </div>
      </Section>

      <Section title="Scheduled runs" note="The app keeps its own schedule: the daily sources once a day from 10:00 UTC, PageSpeed once a week. Any call to its run address, such as Hostinger's cron, also starts a run that is due. If you prefer a cron job of your own, these commands work (the script and its token are made by the app in its private folder).">
        <Table head={['Job', 'Command']} rows={[['Daily', <code key="d" style={{ fontSize: 12 }}>{cronCommand('daily')}</code>], ['Weekly', <code key="w" style={{ fontSize: 12 }}>{cronCommand('weekly')}</code>]]} />
        <p style={{ fontSize: 13, color: T.body }}>Private folder: <code>{seoConfig.dataDir}</code></p>
      </Section>

      <Section title="Emails" note={`Sent from ${seoConfig.mailFrom} to every admin (${seoConfig.adminEmails.join(', ') || 'none set'}). Only what is new goes out: the weekly summary when it is written, and an alert when a data source stops answering or a high-impact finding appears.`}>
        <form action={saveEmailSettings} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          <label style={{ ...label, display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" name="email.summary" defaultChecked={setting('email.summary', 'on') === 'on'} /> The weekly summary, when the run writes it (Mondays)</label>
          <label style={{ ...label, display: 'flex', gap: 10, alignItems: 'center' }}><input type="checkbox" name="email.alert" defaultChecked={setting('email.alert', 'on') === 'on'} /> Alerts: a source stopped answering, or a new high-impact finding</label>
          <div><button type="submit" style={button}>Save</button></div>
        </form>
      </Section>

      <Section title="Fix queue: who approves, and the thresholds" note="Owner's decision 3 (6 Oct 2026): only the owner approves unless extended here to the SEO role. Thresholds follow SEO-OS section 6; every change is logged with its reason.">
        <form action={saveQueueSettings} style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
          <label style={label}>Who may approve, save for later and reject
            <select name="approvers" defaultValue={setting('approvers', 'admin')} style={{ ...input, marginTop: 4 }}>
              <option value="admin">The owner (admin) only</option>
              <option value="seo">The owner and the SEO role</option>
            </select>
          </label>
          <label style={label}>Least impressions before a phrase becomes a finding<input type="number" name="threshold.minImpressions" defaultValue={thresholds().minImpressions} min={1} max={10000} style={{ ...input, marginTop: 4 }} /></label>
          <label style={label}>Lost clicks: a page is flagged when its clicks fall by this much (%)<input type="number" name="threshold.lostClicksPct" defaultValue={thresholds().lostClicksPct} min={10} max={90} style={{ ...input, marginTop: 4 }} /></label>
          <label style={label}>A post counts as stale after this many days without an update<input type="number" name="threshold.staleDays" defaultValue={thresholds().staleDays} min={30} max={1000} style={{ ...input, marginTop: 4 }} /></label>
          <label style={label}>Reason for the change (kept with it)<input name="reason" required style={{ ...input, marginTop: 4 }} /></label>
          <div><button type="submit" style={button}>Save</button></div>
        </form>
        <Table head={['Setting', 'Value', 'Changed', 'By', 'Reason']} rows={(store().prepare('SELECT * FROM settings ORDER BY key').all() as { key: string; value: string; changed_at: string; changed_by: string; reason: string }[]).map((r) => [r.key, r.value, r.changed_at.slice(0, 10), r.changed_by, r.reason])} empty="Defaults in use; nothing changed yet." />
      </Section>

      <Section title="Paid connectors (off)" note="Prepared in the plan, switched on only when the owner buys a tool (nothing for the first two to three months; DataForSEO first, about USD 50 once, price to confirm). Each needs its key here once bought.">
        <Table head={['Tool', 'What it would add', 'State']} rows={[
          ['DataForSEO', 'Daily positions for the keyword map, search volumes, competitor gap, backlinks, mentions in assistants', <Badge key="a" tone="neutral">Off: not bought</Badge>],
          ['SE Ranking', 'Daily positions, site audit, backlinks, AI search visibility', <Badge key="b" tone="neutral">Off: not bought</Badge>],
          ['Ahrefs', 'Backlink detail, competitor keywords', <Badge key="c" tone="neutral">Off: not bought</Badge>],
          ['Moz', 'Domain and page authority', <Badge key="d" tone="neutral">Off: not bought</Badge>],
        ]} />
      </Section>

      <Section title="Everything the app needs">
        <Table head={['Setting', 'State']} rows={settingsPresence().map((s) => [s.name, <Badge key="b" tone={s.set ? 'good' : 'neutral'}>{s.set ? 'Set' : 'Not set'}</Badge>])} />
        <Source>Read from the server when this page loaded</Source>
      </Section>
    </>
  );
}
