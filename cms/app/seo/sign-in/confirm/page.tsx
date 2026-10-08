import { confirmLink } from '../../actions';
import { T, button } from '../../ui';

export const dynamic = 'force-dynamic';

// Opening the link only shows this button; pressing it signs in. Mail programs
// open links on their own to check them, which would otherwise use the link up.
export default async function Confirm({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t = '' } = await searchParams;
  return (
    <main style={{ maxWidth: 420, margin: '10vh auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: T.ink }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>DocsScale SEO dashboard</h1>
      <form action={confirmLink}>
        <input type="hidden" name="t" value={t} />
        <button type="submit" style={button}>Sign in</button>
      </form>
    </main>
  );
}
