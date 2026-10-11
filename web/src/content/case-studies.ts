// Full case study pages under /results/<slug>/. Each one is a real client,
// written from what the owner told us and what the client's own site shows.
// No figure, date or quote goes in here that the owner has not given, and a
// quote in the client's name goes live only after the client has said yes.
import { STAGE_COLORS } from '@/styles/tokens';

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
  /** The facts card in the hero. */
  facts: { label: string; value: string }[];
  /** The client's own website, when the owner has said we may link to it. */
  website?: { label: string; href: string };
  starting: { heading: string; paragraphs: string[] };
  /** The four stages of the journey we set up, in order. */
  journey: {
    heading: string;
    intro: string;
    stages: {
      stage: 'attract' | 'capture' | 'convert' | 'retain';
      label: string;
      /** Icon in the flow diagram above the cards. */
      icon: 'search' | 'page' | 'calendar' | 'refresh';
      title: string;
      body: string;
    }[];
  };
  /** How things changed over time, in order. `sources` are where new patients
   * came from in that stretch, shown as chips on the timeline diagram. */
  timeline: {
    heading: string;
    steps: { when: string; title: string; sources: string[]; body: string }[];
  };
  quote: { text: string; name: string; role: string };
  lessons: { heading: string; items: { title: string; body: string }[] };
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
    title: 'Chiropractic Marketing Case Study: Sumter, SC | DocsScale',
    metaDescription:
      'Chiropractic marketing case study: one system from lead generation to follow-up took a Sumter, SC practice from three slow months to steady new patients, referrals and walk-ins.',
    h1: 'Three slow months. Then a Sumter chiropractic practice that',
    h1Accent: 'keeps filling itself.',
    intro:
      'A chiropractic marketing case study from Sumter, South Carolina. We run the complete patient journey for Central Clinic of Chiropractic, from lead generation to follow-up. The first three months were slow. Then the new patients kept coming, and referrals and walk-ins grew on top.',
    accentBg: STAGE_COLORS.retain.bg,
    accentFg: STAGE_COLORS.retain.fg,
    facts: [
      { label: 'Clinic', value: 'Central Clinic of Chiropractic, Sumter, SC' },
      { label: 'Doctors', value: 'Dr. Jordan Reizer, D.C. and Dr. Shannon Reizer, D.C.' },
      { label: 'Care', value: 'Gonstead chiropractic, spinal and knee decompression' },
      { label: 'What we run', value: 'The complete patient journey' },
      { label: 'Status', value: 'Ongoing client' },
    ],
    website: { label: 'centralclinicchiro.com', href: 'https://centralclinicchiro.com/' },
    starting: {
      heading: 'The starting point.',
      paragraphs: [
        'Two chiropractors, Gonstead adjustments and non-surgical spinal and knee decompression, in a private-pay office in downtown Sumter. Good care, and a schedule that needed filling.',
        'A patient with sciatica has to find the clinic, understand the treatment, ask for a visit, get a reply, turn up prepared and come back. Every step loses people. We built the whole path.',
      ],
    },
    journey: {
      heading: 'The patient journey we built.',
      intro: 'Four stages, one system. Each one feeds the next.',
      stages: [
        {
          stage: 'attract',
          icon: 'search',
          label: 'Attract',
          title: 'A page for each treatment',
          body: 'Gonstead care and decompression each get a plain-words page, so a search for sciatica relief in Sumter lands on an answer.',
        },
        {
          stage: 'capture',
          icon: 'page',
          label: 'Capture',
          title: 'A request form on every page',
          body: 'Day and time wanted, plus an online booking page. Staff confirm during office hours, and the form says so.',
        },
        {
          stage: 'convert',
          icon: 'calendar',
          label: 'Convert',
          title: 'The first visit, prepared',
          body: 'Four steps: schedule, download the packet, fill it in at home, bring it. Payment policy stated up front. Fewer no-shows.',
        },
        {
          stage: 'retain',
          icon: 'refresh',
          label: 'Retain',
          title: 'Reviews and follow-up',
          body: 'Google reviews on the site, with names. Follow-up keeps patients on their plan of care, and finished patients refer.',
        },
      ],
    },
    timeline: {
      heading: 'What changed, and when.',
      steps: [
        {
          when: 'Months one to three',
          title: 'Slow',
          sources: ['Marketing'],
          body: 'New patients came from the marketing alone, one at a time. Most owners switch marketing off here. Dr. Jordan did not.',
        },
        {
          when: 'From month four',
          title: 'Referrals and walk-ins',
          sources: ['Marketing', 'Referrals', 'Walk-ins'],
          body: 'Finished patients started sending people, and walk-ins picked up, while the system kept bringing in new patients.',
        },
        {
          when: 'Today',
          title: 'Still a client',
          sources: ['Marketing', 'Referrals', 'Walk-ins'],
          body: 'We still run the clinic\u2019s patient journey. Dr. Jordan\u2019s own words are below.',
        },
      ],
    },
    quote: {
      text: 'The first three months tested my patience. I kept going because the system made sense: a patient finds us, books, shows up prepared, and comes back. Now most of our new patients are referrals and walk-ins, and we are one of the busiest chiropractic clinics in Sumter.',
      name: 'Dr. Jordan Reizer, D.C.',
      role: 'Central Clinic of Chiropractic, Sumter, SC',
    },
    lessons: {
      heading: 'Three things this case shows.',
      items: [
        {
          title: 'The first quarter is the hard part',
          body: 'No reviews, no referrals, no history. Hold through it instead of switching agencies every ninety days.',
        },
        {
          title: 'Referrals are built',
          body: 'They come from patients who booked easily, arrived prepared and finished care. Every stage raises the odds.',
        },
        {
          title: 'The website has one job',
          body: 'Turn a search for a specific problem into an appointment request, and make sure the request is answered.',
        },
      ],
    },
    faqs: [
      {
        q: 'How long does it take to build a chiropractic practice?',
        a: 'Longer than most owners expect. The first three months are the slowest, because referrals and walk-ins only start once enough patients have finished care. Judge the system over a year, not a month.',
      },
      {
        q: 'How do chiropractors get new patients?',
        a: 'Four ways: people searching for their symptom, people passing by, people sent by patients, and past patients coming back. The patient journey we build covers all four.',
      },
      {
        q: 'How do you market a new chiropractic office in a small town?',
        a: 'Say exactly what you do and for whom. In a town the size of Sumter, being the clear answer to a specific problem matters more than a big budget.',
      },
      {
        q: 'What should a chiropractic website do?',
        a: 'Explain each treatment in plain words, let visitors ask for an appointment from any page, and prepare them for the first visit. The rest is decoration.',
      },
    ],
    ctaHeading: 'Want the same patient journey for your clinic?',
  },
];

export function caseStudyHref(slug: string) {
  return `/results/${slug}/`;
}
