import { requireUser } from '../../../../lib/seo/auth';
import { latestSnapshot, store } from '../../../../lib/seo/store';
import type { ContentData } from '../../../../lib/seo/sources/content';
import { H1, Section, Source, Table, when } from '../../ui';

export const dynamic = 'force-dynamic';

type Edit = { sha: string; file: string; at: string; author: string; message: string; branch: string; fields: string; words_before: number | null; words_after: number | null };

export default async function EditLog() {
  await requireUser('/seo/edits');
  const edits = store().prepare('SELECT * FROM edits ORDER BY at DESC LIMIT 300').all() as Edit[];
  const content = latestSnapshot<ContentData>('content');
  const repo = content?.data.repo ?? 'docsscale/docsscale-website';
  const words = (n: number | null) => (n == null ? '—' : String(n));

  return (
    <>
      <H1>Edit log</H1>
      <Section
        title="Every change to the content files"
        note="Saves in the editing screen land on the working copy; publishing copies them to the live branch. Words are the body's words before and after."
      >
        <Table
          head={['When', 'Who', 'File', 'Fields changed', 'Words before', 'Words after', 'Where', 'Change']}
          rows={edits.map((e) => [
            when(e.at), e.author, e.file.replace(/^content\//, ''), e.fields, words(e.words_before), words(e.words_after),
            e.branch === 'main' ? 'Live branch' : 'Working copy',
            <a key="c" href={`https://github.com/${repo}/commit/${e.sha}`} style={{ color: '#0F5F63' }}>{e.message.slice(0, 60)}</a>,
          ])}
          empty="No edits read yet."
        />
        <Source>
          Git history on GitHub{content ? `, last read ${when(content.taken)}` : ''}{content?.data.pendingEdits ? ' · older changes are still being read, a few dozen per run' : ''}{content?.data.editsError ? ` · last read stopped early: ${content.data.editsError.slice(0, 120)}` : ''}
        </Source>
      </Section>
    </>
  );
}
