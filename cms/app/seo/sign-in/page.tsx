import { requestLink } from '../actions';
import { T, button, input } from '../ui';
import { SignInFrame } from './frame';

export const dynamic = 'force-dynamic';

export default async function SignIn({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const q = await searchParams;
  return (
    <SignInFrame>
      {q.sent === '1' ? (
        <p style={{ margin: 0, color: T.body }}>If that address may sign in, a link is on its way. It works once and expires in 15 minutes.</p>
      ) : q.sent === 'error' ? (
        <p style={{ margin: 0, color: T.peachFg }}>The email could not be sent. Try again in a few minutes; if it keeps failing, tell the developer.</p>
      ) : (
        <>
          {q.expired && <p style={{ margin: '0 0 12px', color: T.peachFg, background: T.peachBg, borderRadius: 9, padding: '8px 12px', fontSize: 13 }}>That link has expired or was already used. Ask for a new one.</p>}
          <p style={{ margin: '0 0 16px', color: T.body }}>Type your work email. We will send you a sign-in link.</p>
          <form action={requestLink} style={{ display: 'grid', gap: 10 }}>
            <label htmlFor="email" style={{ fontSize: 13 }}>Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@docsscale.com" style={input} />
            <button type="submit" style={{ ...button, padding: '11px 16px', marginTop: 4 }}>Send me a link</button>
          </form>
        </>
      )}
    </SignInFrame>
  );
}
