import { requestLink } from '../actions';
import { T, button, input } from '../ui';

export const dynamic = 'force-dynamic';

export default async function SignIn({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <main style={{ maxWidth: 420, margin: '10vh auto', padding: '0 16px', fontFamily: 'system-ui, sans-serif', color: T.ink }}>
      <h1 style={{ fontSize: 24, fontWeight: 600 }}>DocsScale SEO dashboard</h1>
      {q.sent === '1' ? (
        <p>If that address may sign in, a link is on its way. It works once and expires in 15 minutes.</p>
      ) : q.sent === 'error' ? (
        <p style={{ color: T.peachFg }}>The email could not be sent. Try again in a few minutes; if it keeps failing, tell the developer.</p>
      ) : (
        <>
          {q.expired && <p style={{ color: T.peachFg }}>That link has expired or was already used. Ask for a new one.</p>}
          <p style={{ color: T.body }}>Type your work email. We will send you a sign-in link.</p>
          <form action={requestLink} style={{ display: 'grid', gap: 12 }}>
            <label htmlFor="email" style={{ fontSize: 14 }}>Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" style={input} />
            <button type="submit" style={button}>Send me a link</button>
          </form>
        </>
      )}
    </main>
  );
}
