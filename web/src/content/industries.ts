// Copy for the /industries/ overview. The industry cards come from specialties.ts.
import { SERVED_SPECIALTIES } from './served-specialties';
import { SPECIALTIES } from './specialties';

const withPage = new Set(SPECIALTIES.map((s) => s.name.toLowerCase()));
const withoutPage = SERVED_SPECIALTIES.map((name) => name.toLowerCase()).filter(
  (name) => !withPage.has(name),
);
const others = `${withoutPage.slice(0, -1).join(', ')} and ${withoutPage.at(-1)}`;

export const INDUSTRIES_PAGE = {
  title: 'Industries We Serve: Dental, Chiropractic, Physical Therapy, Med Spa | DocsScale',
  metaDescription:
    'One patient-growth system, set up around your specialty. See how DocsScale works for dental, chiropractic, physical therapy and med spa clinics.',
  eyebrow: 'Industries',
  h1: 'One system, set up around ',
  h1Accent: 'your specialty.',
  intro:
    'The same four stages, built around the treatments, patients and questions your clinic actually gets. Pick your specialty to see what we run for it.',
  cardLink: 'See',
  others: `We also work with ${others} clinics. The system is the same; book a call and we'll show you how it fits yours.`,
} as const;
