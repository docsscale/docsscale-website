// Waits until a page has visually settled: web fonts loaded and every finite
// CSS/Web animation finished (endless ones, like the logo marquee, are skipped
// because they never finish). Used by every screenshot tool so no capture can
// catch a half-finished entrance animation.
export async function settle(page, { timeout = 8000 } = {}) {
  await page.evaluate(async (limit) => {
    await document.fonts.ready;
    const finite = document
      .getAnimations()
      .filter((a) => a.effect?.getComputedTiming().iterations !== Infinity && a.playState !== 'finished');
    await Promise.race([Promise.all(finite.map((a) => a.finished.catch(() => {}))), new Promise((r) => setTimeout(r, limit))]);
  }, timeout);
}
