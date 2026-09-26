// Waits until a page has visually settled: web fonts and images loaded, every finite
// CSS/Web animation finished (endless ones, like the logo marquee, are skipped
// because they never finish). Used by every screenshot tool so no capture can
// catch a half-finished entrance animation.
export async function settle(page, { timeout = 8000 } = {}) {
  await page.evaluate(async (limit) => {
    await document.fonts.ready;
    // Every image must finish loading, lazy ones included (they are switched to
    // eager so a full-page capture never races them); event-based, so it also
    // works under Playwright's fake clock.
    for (const img of document.images) if (img.loading === 'lazy') img.loading = 'eager';
    await Promise.all(
      [...document.images]
        .filter((img) => !img.complete)
        .map(
          (img) =>
            new Promise((done) =>
              ['load', 'error'].forEach((e) => img.addEventListener(e, done, { once: true })),
            ),
        ),
    );
    // ...and be decoded (decoding="async" images can paint a frame later).
    await Promise.all([...document.images].map((img) => img.decode().catch(() => {})));
    const finite = document
      .getAnimations()
      .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity && a.playState !== 'finished');
    await Promise.race([
      Promise.all(finite.map((a) => a.finished.catch(() => {}))),
      new Promise((r) => setTimeout(r, limit)),
    ]);
  }, timeout);
}
