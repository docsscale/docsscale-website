import { pagespeedKey, seoConfig } from '../config';
import { getJson } from '../http';

// PageSpeed Insights: lab scores on a simulated phone, plus real-visitor speed
// (Chrome UX Report) where Google publishes it. For a site of this size expect
// "Insufficient data" for real visitors; that is reported as such, not as zero.

export const SPEED_PAGES = ['/', '/free-system/', '/book-a-call/', '/services/', '/industries/dental/', '/blog/'];

type Field = { percentile: number; category: string } | null;
export type SpeedPage = {
  path: string;
  performance: number | null;
  accessibility: number | null;
  bestPractices: number | null;
  seo: number | null;
  lcpMs: number | null;
  cls: number | null;
  field: { lcp: Field; inp: Field; cls: Field } | null;
  error?: string;
};
export type SpeedData = { strategy: 'mobile'; pages: SpeedPage[]; originField: { lcp: Field; inp: Field; cls: Field } | null };

type Metrics = Record<string, { percentile: number; category: string } | undefined>;
const field = (m?: Metrics) =>
  m && Object.keys(m).length
    ? {
        lcp: m.LARGEST_CONTENTFUL_PAINT_MS ? { percentile: m.LARGEST_CONTENTFUL_PAINT_MS.percentile, category: m.LARGEST_CONTENTFUL_PAINT_MS.category } : null,
        inp: m.INTERACTION_TO_NEXT_PAINT ? { percentile: m.INTERACTION_TO_NEXT_PAINT.percentile, category: m.INTERACTION_TO_NEXT_PAINT.category } : null,
        cls: m.CUMULATIVE_LAYOUT_SHIFT_SCORE ? { percentile: m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100, category: m.CUMULATIVE_LAYOUT_SHIFT_SCORE.category } : null,
      }
    : null;

export async function collectPageSpeed(): Promise<SpeedData> {
  const pages: SpeedPage[] = [];
  let originField: SpeedData['originField'] = null;
  for (const path of SPEED_PAGES) {
    const q = new URLSearchParams({ url: `${seoConfig.siteUrl}${path}`, strategy: 'mobile' });
    for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) q.append('category', c);
    if (pagespeedKey()) q.set('key', pagespeedKey());
    try {
      const r = await getJson<{
        lighthouseResult: { categories: Record<string, { score: number | null }>; audits: Record<string, { numericValue?: number }> };
        loadingExperience?: { metrics?: Metrics; origin_fallback?: boolean };
        originLoadingExperience?: { metrics?: Metrics };
      }>(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`);
      const cat = (k: string) => {
        const s = r.lighthouseResult.categories[k]?.score;
        return s == null ? null : Math.round(s * 100);
      };
      const lcp = r.lighthouseResult.audits['largest-contentful-paint']?.numericValue;
      const cls = r.lighthouseResult.audits['cumulative-layout-shift']?.numericValue;
      pages.push({
        path,
        performance: cat('performance'), accessibility: cat('accessibility'), bestPractices: cat('best-practices'), seo: cat('seo'),
        lcpMs: lcp == null ? null : Math.round(lcp), cls: cls == null ? null : Math.round(cls * 1000) / 1000,
        field: r.loadingExperience?.origin_fallback ? null : field(r.loadingExperience?.metrics),
      });
      originField ??= field(r.originLoadingExperience?.metrics);
    } catch (e) {
      pages.push({ path, performance: null, accessibility: null, bestPractices: null, seo: null, lcpMs: null, cls: null, field: null, error: (e as Error).message });
    }
  }
  if (pages.every((p) => p.error)) throw new Error(pages[0].error);
  return { strategy: 'mobile', pages, originField };
}
