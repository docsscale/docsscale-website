// Runs once when the server starts (Next.js instrumentation hook): the SEO
// dashboard prepares its private folder, so the run token and cron script
// exist before anything calls it, and keeps its own schedule going (a check
// every ten minutes; lib/seo/run.ts decides whether a run is due). Nothing
// here touches the public site.
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { ensureServerFiles } = await import('./lib/seo/server-files');
  const { runIfDue } = await import('./lib/seo/run');
  try {
    ensureServerFiles();
  } catch (e) {
    console.error('[seo] could not prepare the private folder:', (e as Error).message);
  }
  const g = globalThis as { __seoSchedule?: NodeJS.Timeout };
  if (g.__seoSchedule) return;
  const check = () => {
    try {
      const started = runIfDue();
      if (started) console.log(`[seo] scheduled ${started} run started`);
    } catch (e) {
      console.error('[seo] schedule check failed:', (e as Error).message);
    }
  };
  g.__seoSchedule = setInterval(check, 10 * 60_000);
  g.__seoSchedule.unref();
  setTimeout(check, 30_000).unref();
}
