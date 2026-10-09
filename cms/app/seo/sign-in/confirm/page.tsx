import { confirmLink } from '../../actions';
import { T, button } from '../../ui';
import { SignInFrame } from '../frame';

export const dynamic = 'force-dynamic';

// Opening the link only shows this button; pressing it signs in. Mail programs
// open links on their own to check them, which would otherwise use the link up.
export default async function Confirm({ searchParams }: { searchParams: Promise<{ t?: string }> }) {
  const { t = '' } = await searchParams;
  return (
    <SignInFrame>
      <p style={{ margin: '0 0 16px', color: T.body }}>Press the button to finish signing in.</p>
      <form action={confirmLink}>
        <input type="hidden" name="t" value={t} />
        <button type="submit" style={{ ...button, padding: '11px 16px', width: '100%' }}>Sign in</button>
      </form>
    </SignInFrame>
  );
}
