import type { Finding } from './findings';

// The Today tab's order and kinds, shared with the read API so the weekly
// run sees the same list the owner does.

export type Kind = 'Content' | 'On-page' | 'Technical' | 'Indexing' | 'Links';
export const KINDS: Kind[] = ['Content', 'On-page', 'Technical', 'Indexing', 'Links'];
const KIND_OF: Record<string, Kind> = {
  'missing-page': 'Content', stale: 'Content', 'near-page-one': 'Content',
  lint: 'On-page', 'no-clicks': 'On-page', cannibalization: 'On-page',
  orphan: 'Links', 'lost-link': 'Links',
  'site-check': 'Technical', 'page-status': 'Technical', 'bing-issue': 'Technical', 'lost-clicks': 'Technical',
  'not-indexed': 'Indexing',
};
export const kindOf = (f: Pick<Finding, 'rule'>): Kind => KIND_OF[f.rule] ?? 'Technical';
const IMPACT = { High: 0, Medium: 1, Low: 2 } as const;
const EFFORT = { Small: 0, Medium: 1, Large: 2 } as const;
const STATUS_RANK: Record<string, number> = { 'In progress': 0, Approved: 1, Recommended: 2, Detected: 3 };

/** Approved work first, then by impact, then the smaller job first, then the older item. */
export function rankOpen(list: Finding[]): Finding[] {
  return [...list].sort((a, b) =>
    (STATUS_RANK[a.status] ?? 9) - (STATUS_RANK[b.status] ?? 9)
    || IMPACT[a.impact] - IMPACT[b.impact]
    || EFFORT[a.effort] - EFFORT[b.effort]
    || a.created.localeCompare(b.created));
}
