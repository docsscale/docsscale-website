// Every clinic specialty DocsScale works with: the one list behind the About
// count, the form dropdowns, the funnel chips and "who it's for" line, the FAQ
// answers, structured data and llms.txt (keep public/llms.txt in step by hand).
// Dedicated industry pages (/services/<slug>/, content/specialties.ts) exist only
// where there are real clients and results.
export const SERVED_SPECIALTIES = [
  'Dental',
  'Chiropractic',
  'Physical therapy',
  'Med spa',
  'Weight loss',
  'Dermatology',
  'Primary care',
  'Optometry',
  'Mental health',
] as const;

/** "Physical therapy" → "Physical Therapy" (the funnel's title-case style). */
export const titleCase = (name: string) => name.replace(/\b\w/g, (c) => c.toUpperCase());

/** "dental, chiropractic, …, and mental health" for running text. */
export function specialtyList(conjunction: 'and' | 'or' = 'and') {
  const names = SERVED_SPECIALTIES.map((name) => name.toLowerCase());
  return `${names.slice(0, -1).join(', ')}, ${conjunction} ${names.at(-1)}`;
}

/** First letter capitalised: "dental, chiropractic…" → "Dental, chiropractic…". */
export const sentenceCase = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
