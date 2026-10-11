// Full case study pages under /results/<slug>/. Each one is a real client,
// written from what the owner told us and what the client's own site shows.
// No figure, date or quote goes in here that the owner has not given, and a
// quote in the client's name goes live only after the client has said yes.
import { STAGE_COLORS } from '@/styles/tokens';

export type Stage = 'attract' | 'capture' | 'convert' | 'retain';

export type CaseStudy = {
  slug: string;
  /** Short form for cards and links, e.g. "Central Clinic of Chiropractic". */
  clinic: string;
  city: string;
  specialty: string;
  /** Day the page first went live, for the Article schema (YYYY-MM-DD). */
  published: string;
  title: string;
  metaDescription: string;
  h1: string;
  h1Accent: string;
  intro: string;
  accentBg: string;
  accentFg: string;
  /** The numbers panel in the hero. The first one is the big one. */
  stats: { value: string; label: string }[];
  /** Short facts under the heading: who the clinic is, in a few chips. */
  facts: string[];
  /** The client's own website, when the owner has said we may link to it. */
  website?: { label: string; href: string };
  /** The four stages of the journey we run, in order, each with what runs. */
  journey: {
    heading: string;
    intro: string;
    stages: {
      stage: Stage;
      label: string;
      /** Icon in the stage card. */
      icon: 'megaphone' | 'chat' | 'calendar' | 'refresh';
      title: string;
      points: string[];
    }[];
    /** One patient's path through the system, as a chain of short stops. */
    path: { heading: string; stops: { stage: Stage; text: string }[] };
  };
  /** How things changed over time, in order. `sources` are where new patients
   * came from in that stretch, shown as chips on the timeline diagram. */
  timeline: {
    heading: string;
    steps: { when: string; title: string; sources: string[]; body: string }[];
  };
  quote: { text: string; name: string; role: string };
  /** The free system section: the same system, free to claim. */
  freeSystem: { heading: string; body: string };
  faqs: { q: string; a: string }[];
  ctaHeading: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: 'central-clinic-of-chiropractic',
    clinic: 'Central Clinic of Chiropractic',
    city: 'Sumter, SC',
    specialty: 'Chiropractic',
    published: '2026-10-11',
    title: 'Chiropractic Case Study: 30+ Patients a Month | DocsScale',
    metaDescription:
      'Chiropractic marketing case study: Meta and Google ads plus one automated patient journey bring a Sumter, SC clinic 30+ qualified new patients a month.',
    h1: '30+ new patients a month,',
    h1Accent: 'on autopilot.',
    intro:
      'Meta and Google ads bring people in. One system answers them in seconds, books them, follows up, and brings them back. Running for Central Clinic of Chiropractic in Sumter, South Carolina since January 2026.',
    accentBg: STAGE_COLORS.retain.bg,
    accentFg: STAGE_COLORS.retain.fg,
    stats: [
      { value: '30+', label: 'qualified new patients a month, on average' },
      { value: 'Jan 2026', label: 'system live, and still running today' },
      { value: '~$3k', label: 'a month on Meta and Google ads' },
    ],
    facts: ['Two chiropractors', 'Gonstead care and decompression', 'Downtown Sumter', 'Private pay'],
    website: { label: 'centralclinicchiro.com', href: 'https://centralclinicchiro.com/' },
    journey: {
      heading: 'The patient journey we run for them.',
      intro:
        'Four stages, one system. Every enquiry is answered, booked, reminded and followed up without anyone at the clinic chasing it.',
      stages: [
        {
          stage: 'attract',
          icon: 'megaphone',
          label: 'Attract',
          title: 'Ads that reach people in pain',
          points: [
            'Meta and Google ads, around $3k a month',
            'Shown to people in and around Sumter',
            'Every click lands on a page built to book',
          ],
        },
        {
          stage: 'capture',
          icon: 'chat',
          label: 'Capture',
          title: 'Every message answered in seconds',
          points: [
            'An assistant replies on social media and the website, any hour',
            'It answers questions and books the consultation itself',
            'No enquiry waits for the front desk to open',
          ],
        },
        {
          stage: 'convert',
          icon: 'calendar',
          label: 'Convert',
          title: 'Booked, reminded, shown up',
          points: [
            'Automatic follow-ups until the visit is booked',
            'Confirmations and reminders before the appointment',
            'Staff call when they choose to; a receptionist line covers the rest',
          ],
        },
        {
          stage: 'retain',
          icon: 'refresh',
          label: 'Retain',
          title: 'Back for care, and talking about it',
          points: [
            'Email marketing between visits',
            'Review requests after care, so happy patients say so on Google',
            'Win-back emails bring lapsed patients back',
          ],
        },
      ],
      path: {
        heading: 'One new patient, start to finish',
        stops: [
          { stage: 'attract', text: 'Sees an ad' },
          { stage: 'capture', text: 'Sends a message' },
          { stage: 'capture', text: 'Gets an answer in seconds' },
          { stage: 'convert', text: 'Books a consultation' },
          { stage: 'convert', text: 'Gets a reminder' },
          { stage: 'convert', text: 'Comes in' },
          { stage: 'retain', text: 'Leaves a review' },
          { stage: 'retain', text: 'Comes back' },
        ],
      },
    },
    timeline: {
      heading: 'From a slow start to 30+ a month.',
      steps: [
        {
          when: 'January 2026',
          title: 'System goes live',
          sources: ['Ads', 'System'],
          body: 'Ads, the booking assistant, follow-ups and email all switched on together.',
        },
        {
          when: 'Months one to three',
          title: 'Hard going',
          sources: ['Ads', 'System'],
          body: 'Patients came in one at a time. Most owners stop here. Dr. Jordan kept going.',
        },
        {
          when: 'Month four onward',
          title: 'Referrals and walk-ins on top',
          sources: ['Ads', 'System', 'Referrals', 'Walk-ins'],
          body: 'Finished patients sent friends, foot traffic grew, and the ads kept delivering.',
        },
        {
          when: 'Today',
          title: '30+ qualified patients a month',
          sources: ['Ads', 'System', 'Referrals', 'Walk-ins'],
          body: 'On average, every month. Still a client, and the system still runs the whole journey.',
        },
      ],
    },
    quote: {
      text: 'DocsScale runs our ads, our messages and our follow-ups. We just see the patients. Easy to work with, and they get it done.',
      name: 'Dr. Jordan Reizer, D.C.',
      role: 'Central Clinic of Chiropractic, Sumter, SC',
    },
    freeSystem: {
      heading: 'The system behind this case is free.',
      body: 'The booking, follow-up, reminder, review and email pieces at Central Clinic run on the same system we give clinics for free: six pre-built funnels and 17 done-for-you automations, set up in your account and yours to keep.',
    },
    faqs: [
      {
        q: 'How do chiropractors get more new patients?',
        a: 'Three sources that feed each other: ads that reach people in pain near you, a system that answers and books every enquiry, and finished patients who refer. At Central Clinic all three run at once.',
      },
      {
        q: 'How much should a chiropractor spend on ads?',
        a: 'Central Clinic spends around $3k a month on Meta and Google. The budget matters less than what happens after the click: an enquiry nobody answers is an ad wasted.',
      },
      {
        q: 'How long does chiropractic marketing take to work?',
        a: 'Here, the first three months were slow, and month four is when referrals and walk-ins started stacking on top of the ads. Judge a system over a year, not a month.',
      },
      {
        q: 'Does the clinic still talk to patients itself?',
        a: 'Whenever it wants to. The system books, reminds and follows up on its own, staff call the patients they choose to, and a receptionist line covers the phone when they are busy.',
      },
    ],
    ctaHeading: 'Want this patient journey in your clinic?',
  },
];

export function caseStudyHref(slug: string) {
  return `/results/${slug}/`;
}
