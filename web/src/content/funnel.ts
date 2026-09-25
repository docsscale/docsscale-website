// Copy and data for the /free-system/ funnel ("Claim the free system").

export const FUNNEL_FORM = {
  clinicTypes: ['Chiropractic', 'Dental', 'Med Spa', 'Physical Therapy', 'Weight Loss'],
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
