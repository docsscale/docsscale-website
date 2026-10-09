// Homepage copy and demo data, section by section, in page order.
// Text only: layout and colours live in src/features/home/.
import { sentenceCase, specialtyList } from './served-specialties';

/** Specialties for the hero picker. `n1` is the demo "inquiries this week" number. */
export type HomeSpecialty = {
  key: string;
  label: string;
  service: string;
  adHeadline: string;
  inquiry: string;
  source: string;
  recall: string;
  n1: number;
};

export const HOME_SPECIALTIES: HomeSpecialty[] = [
  {
    key: 'all',
    label: 'All clinics',
    service: 'new patients',
    adHeadline: 'New patient visit, this week.',
    inquiry: 'Hi, do you have anything open this week?',
    source: 'Website form',
    recall: 'recall',
    n1: 34,
  },
  {
    key: 'dental',
    label: 'Dental',
    service: 'dental implants',
    adHeadline: 'New patient exam + implant consult, this week.',
    inquiry: "Hi, I'm missing a tooth and want to ask about implants.",
    source: 'Google Ads',
    recall: '6-month cleaning',
    n1: 41,
  },
  {
    key: 'chiro',
    label: 'Chiropractic',
    service: 'back pain relief',
    adHeadline: 'Same-week adjustment for lower back pain.',
    inquiry: "My lower back's been out for 3 days, can I get in this week?",
    source: 'Meta Ads',
    recall: 'maintenance adjustment',
    n1: 28,
  },
  {
    key: 'medspa',
    label: 'Med spa',
    service: 'injectables',
    adHeadline: 'New patient injectables consult, this week.',
    inquiry: 'Hi, do you have anything open for a Botox consult?',
    source: 'Instagram DM',
    recall: 'touch-up',
    n1: 19,
  },
  {
    key: 'pt',
    label: 'Physical therapy',
    service: 'post-op rehab',
    adHeadline: 'Post-op evaluation, this week.',
    inquiry: 'My surgeon said to start PT ASAP, do you have anything open?',
    source: 'Referral form',
    recall: 'maintenance visit',
    n1: 23,
  },
];

/**
 * Platforms shown in the strip at the bottom of the hero: [name, dot colour].
 * Owner's rule (6 Oct 2026): plain names, no official logos, and only platforms
 * we actually work on for clients (paid ads on Meta and Google, local SEO and
 * Google Business Profile, social media). Ask before adding one.
 */
export const INTEGRATIONS: [name: string, color: string][] = [
  ['Google Business Profile', '#4285F4'],
  ['Meta Ads', '#0866FF'],
  ['Google Ads', '#FBBC04'],
  ['Instagram', '#E1306C'],
];

export const HERO = {
  stagePills: ['Attract', 'Capture', 'Convert', 'Retain'],
  // Small line above the headline, inside the H1, so the page's main heading
  // names what we are in the words people search for.
  kicker: 'Healthcare marketing agency',
  headline: 'More patients on autopilot, ',
  headlineAccent: 'from click to chair.',
  intro:
    'The marketing agency for healthcare clinics that want one team on the whole patient journey, and one number that matters: booked appointments.',
  cta: { label: 'Book a strategy call', href: '/book-a-call' },
  attract: { label: 'This week · Attract', suffix: 'new patient inquiries for ' },
  convert: {
    label: 'Convert · replied in 2 min',
    reply: 'Thursday 9:30 with Dr. Hannah is open. Hold it for you?',
    confirm: 'Yes please.',
  },
  picker: { label: 'Built for your kind of clinic', hint: 'Tap one, the page adapts' },
  report: {
    label: 'Every Monday · Report',
    rows: [
      { label: 'Requests captured', value: 47 },
      { label: 'Booked', value: 29 },
      { label: 'Rebooked from recall', value: 14 },
    ],
    footnote: 'Never clicks.',
  },
  ownership: { label: 'Month to month', text: 'You keep every account, page and number.' },
};

export const GAPS = {
  eyebrow: 'Why clinics plateau',
  headline: 'Most clinics buy marketing in pieces. ',
  headlineAccent: 'Patients fall through the gaps.',
  intro:
    "An ad vendor here, a web designer there, a front desk that's already busy. Nobody owns the step where a click becomes a patient. DocsScale owns every step.",
  items: [
    {
      stage: 'attract',
      title: 'An ad agency that reports clicks',
      body: "You pay for traffic. Nobody owns what happens after the form, so the report looks fine and the schedule doesn't move.",
    },
    {
      stage: 'capture',
      title: "A website that doesn't book",
      body: "Looks professional. Doesn't turn a visitor on a phone at 9 pm into an appointment on your calendar.",
    },
    {
      stage: 'convert',
      title: 'Follow-up left to the front desk',
      body: 'After-hours inquiries wait until morning. By then the patient has booked with whoever answered first.',
    },
  ],
} as const;

export const SERVICES_SECTION = {
  eyebrow: 'Services',
  headline: 'Everything a clinic needs to grow, ',
  headlineAccent: 'under one roof.',
  filters: [
    { key: 'all', label: 'All' },
    { key: 'attract', label: 'Attract' },
    { key: 'capture', label: 'Capture' },
    { key: 'convert', label: 'Convert' },
    { key: 'retain', label: 'Retain' },
  ],
} as const;

/** The eight services, each tagged with the system stage it belongs to. */
export const SERVICES = [
  {
    stage: 'attract',
    n: '01',
    title: 'Paid advertising',
    body: 'Meta and Google campaigns around one service line at a time, reported in booked appointments.',
  },
  {
    stage: 'capture',
    n: '02',
    title: 'Funnel design',
    body: 'Landing pages, offers, and forms that turn a click into a request your front desk can act on.',
  },
  {
    stage: 'capture',
    n: '03',
    title: 'Website design',
    body: 'A clinic site that books, not a brochure. Fast on phones, built for local search.',
  },
  {
    stage: 'attract',
    n: '04',
    title: 'SEO',
    body: 'Rank for the treatments you want more of, in the neighborhoods you actually serve.',
  },
  {
    stage: 'attract',
    n: '05',
    title: 'Social media management',
    body: 'Consistent posting in your voice, planned a month ahead, approved by you in ten minutes.',
  },
  {
    stage: 'convert',
    n: '06',
    title: 'Follow-up & booking',
    body: 'Every inquiry answered within minutes, day or night, and moved onto the schedule.',
  },
  {
    stage: 'retain',
    n: '07',
    title: 'Reputation & reviews',
    body: 'Review requests after every visit, replies handled, a rating that holds up when patients compare.',
  },
  {
    stage: 'retain',
    n: '08',
    title: 'Reactivation & recall',
    body: 'Past patients invited back at the right time, in your name, without a discount.',
  },
] as const;

/** "How it works" steps. `stage` picks the step's colour. */
export const PROCESS_STEPS = [
  {
    label: '01 / Call',
    n: 1,
    stage: 'attract',
    title: 'Strategy call',
    body: 'We look at your services, market, and current numbers, and pick the one service line to grow first.',
    meta: '30 minutes · free',
  },
  {
    label: '02 / Build',
    n: 2,
    stage: 'capture',
    title: 'Build the system',
    body: 'Funnel, website changes, ad accounts, follow-up sequences, front-desk scripts. You approve everything before it goes live.',
    meta: 'Weeks 1–3',
  },
  {
    label: '03 / Launch',
    n: 3,
    stage: 'convert',
    title: 'Go live',
    body: 'Ads go live, inquiries start, and every one is answered and booked, whether your front desk is open or not.',
    meta: 'Day one of campaigns',
  },
  {
    label: '04 / Report',
    n: 4,
    stage: 'retain',
    title: 'Report, weekly',
    body: 'Inquiries, booked, showed, revenue. One email every Monday. Never clicks or impressions.',
    meta: 'Every Monday',
  },
] as const;

/** Smaller result tiles next to the featured case study. */
export const RESULT_STATS = [
  {
    stage: 'convert',
    tag: 'Med spa · Las Vegas',
    n: '62',
    body: 'booked consults from one injectables campaign · Q1 2026',
  },
  {
    stage: 'retain',
    tag: 'Physical therapy · Denver',
    n: '2.4×',
    body: 'more post-op evaluations, same ad budget · Feb–Jul 2026',
  },
  {
    stage: 'capture',
    tag: 'Chiropractic · Tampa',
    n: '31',
    body: 'dormant patients rebooked in the first month of recall · Aug 2026',
  },
] as const;

export const FAQS = [
  {
    q: 'Do you only work with one kind of clinic?',
    a: `No. ${sentenceCase(specialtyList())}. The system is the same; offers, timing, and compliance rules change by specialty.`,
  },
  {
    q: 'We already have a website. Do we have to rebuild it?',
    a: "Only if it can't book. If it can, we build funnels around it. If it can't, we fix that first, because ads pointed at a site that doesn't convert waste your money.",
  },
  {
    q: 'Who pays for and owns the ad spend?',
    a: 'You pay the platform directly from your own ad account. We manage it, you own it, and the account, pages, and numbers stay yours if we ever part ways.',
  },
  {
    q: 'How quickly will we see new patients?',
    a: 'Most clinics see their first booked patients from ads within 2–3 weeks of launch and a full pipeline by month three.',
  },
  {
    q: 'Are we locked into a contract?',
    a: "Month to month, 30 days' notice. Clinics stay because the schedule fills, not because a contract says so.",
  },
  {
    q: 'How do you handle patient information?',
    a: 'We sign a BAA with every clinic and never store clinical records; contact details live in your own accounts. The minimum data needed, never sold or shared.',
  },
] as const;
