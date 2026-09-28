// Copy and data for the /free-system/ funnel ("Claim the free system").
import { SERVED_SPECIALTIES, titleCase } from './served-specialties';

export const FUNNEL_FORM = {
  // The funnel's original five first (in their original order), then the rest, then Other.
  clinicTypes: [
    ...['Chiropractic', 'Dental', 'Med Spa', 'Physical Therapy', 'Weight Loss'],
    ...SERVED_SPECIALTIES.map(titleCase).filter(
      (name) => !['Chiropractic', 'Dental', 'Med Spa', 'Physical Therapy', 'Weight Loss'].includes(name),
    ),
    'Other',
  ],
  submit: 'Send me the free system →',
  genericError: 'Something went wrong. Please try again.',
  footnote: 'No credit card. No trial. No catch. Yours to keep forever.',
} as const;

/** The five stat cards under the hero. Cards with `value` count up from 0 on scroll. */
export type FunnelStat = {
  bg: string;
  numColor: string;
  labelColor: string;
  label: string;
  value?: number;
  suffix?: string;
  staticText?: string;
};

export const FUNNEL_STATS: FunnelStat[] = [
  {
    bg: '#DDEEEE',
    numColor: '#0F5F63',
    labelColor: '#0F5F63',
    label: 'Pre-built funnels included',
    value: 6,
  },
  { bg: '#DAEDE2', numColor: '#1F5A40', labelColor: '#1F5A40', label: 'Done-for-you automations', value: 17 },
  {
    bg: '#FBE7D6',
    numColor: '#8A4B1E',
    labelColor: '#8A4B1E',
    label: 'Cost to claim the system',
    staticText: '$0',
  },
  {
    bg: '#E5DFF5',
    numColor: '#4A3D75',
    labelColor: '#4A3D75',
    label: 'Runs without you',
    staticText: '24/7',
  },
  {
    bg: '#1A1A1A',
    numColor: '#FAF9F6',
    labelColor: 'rgba(250,249,246,.55)',
    label: 'Free to keep forever',
    value: 100,
    suffix: '%',
  },
];

/** The six funnels shown in "What's inside" (click a thumbnail to enlarge it). */
export const FUNNELS = [
  {
    title: 'Get New Patients',
    desc: 'Turns cold traffic into booked first visits — on autopilot.',
    img: '/free-system/images/funnel-new-patient.jpg',
  },
  {
    title: 'Fill Your Best Service Line',
    desc: 'Fills a specific treatment or offer fast.',
    img: '/free-system/images/funnel-service-promo.jpg',
  },
  {
    title: 'Kill the Phone Tag',
    desc: 'Gets patients onto the calendar in one flow.',
    img: '/free-system/images/funnel-booking.jpg',
  },
  {
    title: 'Only Talk to the Right Patients',
    desc: 'Filters high-value cases before they book.',
    img: '/free-system/images/funnel-application.jpg',
  },
  {
    title: 'Win Back Dormant Patients',
    desc: 'Brings dormant patients back through the door.',
    img: '/free-system/images/funnel-reactivation.jpg',
  },
  {
    title: 'Build Your Google Reputation',
    desc: 'Turns happy patients into 5-star Google reviews.',
    img: '/free-system/images/funnel-review.jpg',
  },
] as const;

/** /free-system/book-a-call/: the three points above the calendar. */
export const BOOKING_POINTS = [
  {
    bg: '#DAEDE2',
    path: 'M2 6.5l2.8 2.8 5.2-5.6',
    stroke: '#1F5A40',
    title: 'What you will walk away with',
    rest: ' — clarity on exactly what is leaking in your patient pipeline.',
    roundJoin: true,
  },
  {
    bg: '#FBE7D6',
    path: 'M3 3l6 6M9 3l-6 6',
    stroke: '#8A4B1E',
    title: 'What we will not do',
    rest: ' — pitch you something you do not need.',
    roundJoin: false,
  },
  {
    bg: '#DDEEEE',
    path: 'M6 2a3 3 0 100 6 3 3 0 000-6zM1 11c0-2.2 2.2-4 5-4s5 1.8 5 4',
    stroke: '#0F5F63',
    title: 'Who this is for',
    rest: ' — clinic owners who want more booked patients, not more marketing reports.',
    roundJoin: true,
  },
] as const;

export const BOOKING_CHIPS = ['Free', '30 minutes', 'No obligation'] as const;

/** Shown after booking (GoHighLevel redirects back with ?booked=1). */
export const BOOKED_STEPS = [
  { bg: '#DAEDE2', stroke: '#1F5A40', text: 'Check your email for the calendar invite' },
  { bg: '#DDEEEE', stroke: '#0F5F63', text: 'Have your monthly new patient numbers ready' },
  { bg: '#FBE7D6', stroke: '#8A4B1E', text: '30 minutes — we will lead the conversation' },
] as const;
