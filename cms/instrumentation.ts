// Runs once when the server starts (Next.js instrumentation hook): the SEO
// dashboard prepares its private folder, so the cron script and its token
// exist before the first scheduled run. Nothing here touches the public site.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { ensureServerFiles } = await import('./lib/seo/server-files');
  try {
    ensureServerFiles();
  } catch (e) {
    console.error('[seo] could not prepare the private folder:', (e as Error).message);
  }
}
