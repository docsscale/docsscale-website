// The service pages (/services/<slug>/), one per confirmed service, written one
// at a time as the keyword map orders them (docs/seo/keywords/keyword-map.md).
// Each entry holds all of that page's copy; the layout is
// features/services/ServicePage.tsx. Rules (docs/COMPLETION-PLAN.md, section 2):
// a direct answer at the top, our own process in order, a real client example
// copied exactly from /results/, who it suits and who it doesn't, real
// questions, and links to the industries. Nothing invented: every figure here
// is one the results page already publishes.
import { PAID_ADS_HERO } from '@/content/images';
import { T } from '@/styles/tokens';

/** Line icons drawn in features/services/ServicePage.tsx. */
export type ProcessIcon =
  'target' | 'page' | 'megaphone' | 'reply' | 'refresh' | 'chart' | 'search' | 'calendar';

export type ServicePage = {
  slug: string;
  /** The service's name as the nav and footer show it (content/site.ts). */
  name: string;
  /** The stage it belongs to, for the eyebrow and the accent colour. */
  stage: 'Attract' | 'Capture' | 'Convert' | 'Retain';
  title: string;
  metaDescription: string;
  h1: string;
  h1Accent: string;
  /** The direct answer, 40–60 words, with the page's search phrase. */
  intro: string;
  accentBg: string;
  accentFg: string;
  /** The hero photo (a licensed stock photo; source in incoming/README.md). */
  heroPhoto: { src: string; sizes: string; alt: string; position: string };
  /** Services that work alongside this one, with the page or section they link to. */
  worksWith: { label: string; href: string }[];
  processHeading: string;
  /** The patient's path in four stops, shown as a strip above the steps. */
  processFlow: { label: string; icon: ProcessIcon }[];
  process: { title: string; body: string; icon: ProcessIcon }[];
  /** Copied word for word from ResultsCases.tsx; change both together. */
  caseStudy: {
    heading: string;
    meta: string;
    period: string;
    stat: string;
    statLine: string;
    tags: string[];
    built: string;
    result: string;
    quote: string;
    name: string;
    role: string;
    href: string;
  };
  /** A second published result, one line, with its link. */
  alsoFromResults?: { text: string; href: string };
  fit: { heading: string; items: string[] };
  notFit: { heading: string; items: string[] };
  faqs: { q: string; a: string }[];
  /** Heading above the four industry links; the blurbs come from specialties.ts. */
  industriesHeading: string;
  ctaHeading: string;
};

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'paid-ads',
    name: 'Paid ads (Meta & Google)',
    stage: 'Attract',
    title: 'Healthcare PPC Agency for Clinics | DocsScale',
    metaDescription:
      'DocsScale is a healthcare PPC agency for clinics: Google and Meta ads split by treatment, run in your own accounts, and reported in booked appointments.',
    h1: 'The healthcare PPC agency that counts',
    h1Accent: 'booked patients, not clicks.',
    intro:
      'DocsScale is a healthcare PPC agency: we run pay-per-click ads on Google, Facebook and Instagram for clinics, one service line at a time. Each campaign sends people to a page built for that treatment, every inquiry is answered within minutes, and your Monday report counts booked appointments and cost per booked visit.',
    accentBg: T.peachBg,
    accentFg: T.peachFg,
    heroPhoto: {
      src: PAID_ADS_HERO,
      sizes: '(max-width: 760px) calc(100vw - 32px), 430px',
      alt: 'A clinician going through a treatment plan with a patient on a tablet in a clinic waiting area',
      position: '50% 45%',
    },
    worksWith: [
      { label: 'Websites & landing pages', href: '/services#capture' },
      { label: 'Lead follow-up & booking', href: '/services#convert' },
      { label: 'Local SEO & Google Business Profile', href: '/services#attract' },
      { label: 'Reactivation & recall', href: '/services#retain' },
    ],
    processHeading: 'What we do, in order.',
    processFlow: [
      { label: 'Someone searches or scrolls', icon: 'search' },
      { label: 'Lands on the treatment page', icon: 'page' },
      { label: 'Gets a reply within minutes', icon: 'reply' },
      { label: 'Books the appointment', icon: 'calendar' },
    ],
    process: [
      {
        title: 'Pick one service line',
        icon: 'target',
        body: 'Implants, clear aligners, injectables, post-op rehab: the treatment that pays for the marketing. One campaign per service line, never one campaign for the whole practice.',
      },
      {
        title: 'Build the page the ad lands on',
        icon: 'page',
        body: 'A page for that treatment with two or three screening questions, so your front desk calls people who can book, not everyone who clicked.',
      },
      {
        title: 'Launch Google and Meta campaigns in your own accounts',
        icon: 'megaphone',
        body: 'Google reaches people already searching, for example “dental implants near me”. Facebook and Instagram reach people who are not searching yet, which suits elective treatments. The accounts are yours and stay yours.',
      },
      {
        title: 'Answer every inquiry within minutes',
        icon: 'reply',
        body: 'An ad lead that waits until the next business day usually books somewhere else. Every form and every missed call gets a reply in minutes, before the ad budget is wasted.',
      },
      {
        title: 'Refresh the creative every month',
        icon: 'refresh',
        body: 'New copy and images each month so the campaign does not go stale, and a check against what each platform allows: no ad that hints at a reader’s condition.',
      },
      {
        title: 'Report what matters every Monday',
        icon: 'chart',
        body: 'Booked appointments and cost per booked visit, by campaign. Never clicks. Campaigns are usually live within two to three weeks.',
      },
    ],
    caseStudy: {
      heading: 'A real campaign, in numbers.',
      meta: 'Physical therapy · Denver, CO',
      period: 'Feb–Jul 2026',
      stat: '2.4×',
      statLine: 'more post-op evaluations on the same ad budget.',
      tags: ['Post-op rehab', 'Growth'],
      built:
        'A post-surgery rehab landing page with insurance screening, rebuilt Google campaigns, and a callback within four minutes on every form.',
      result:
        '2.4× more evaluations booked, cost per booked visit down 41%, two new referring surgeons who found them through the page.',
      quote: 'Four-minute callbacks did more than the new ads did.',
      name: 'Dr. Emily Foster',
      role: 'Owner, physical therapy · Denver, CO',
      href: '/results/',
    },
    alsoFromResults: {
      text: 'Also on our results page: 62 booked consults from one injectables campaign for a Las Vegas med spa, 54 of them showed.',
      href: '/results/',
    },
    fit: {
      heading: 'Paid ads suit you if',
      items: [
        'There is one treatment you want more of, and room in the schedule to take it.',
        'Someone, your front desk or our follow-up, can answer an inquiry in the same hour.',
        'You want the report in booked patients, and you will give a campaign two to three months.',
      ],
    },
    notFit: {
      heading: 'They are the wrong place to start if',
      items: [
        'The schedule is already full. Recall and reactivation fill the gaps for less, with no ad spend.',
        'Marketing is judged in clicks, likes or impressions. We do not report those.',
        'You want ads that name the reader’s condition. Google and Meta do not allow it, and we will not write them.',
      ],
    },
    faqs: [
      {
        q: 'Should a clinic advertise on Google or on Facebook and Instagram?',
        a: 'Usually both, because they do different jobs. Google reaches people who are already searching, for example “dentist near me” or “physical therapy after knee surgery”. Facebook and Instagram reach people who are not searching yet, which suits elective treatments such as clear aligners, cosmetic work and injectables. For an urgent problem like back pain, Google comes first. We give each treatment its own campaign and judge it by booked patients.',
      },
      {
        q: 'How soon do paid ads bring booked patients?',
        a: 'Campaigns are usually live within two to three weeks of starting, because the landing page and the follow-up are built first. Booked patients normally start in the first weeks after launch. Give a campaign two to three months before judging its cost per booked visit, so there is enough data to adjust it rather than guess.',
      },
      {
        q: 'Who owns the ad accounts and the pages?',
        a: 'You do. We build the campaigns in your own Google and Meta ad accounts, and the pages sit on your site. Everything is month to month, and if we part ways you keep every account, page and number.',
      },
      {
        q: 'Why do our ad leads not book?',
        a: 'Usually because nobody calls them back fast enough. Our Denver client was referral-dependent, with a Google Ads account nobody had touched in a year, and web form leads were called back the next business day. We built a post-surgery rehab landing page with insurance screening, rebuilt their Google campaigns, and set up a callback within four minutes on every form. The result: 2.4× more evaluations booked and cost per booked visit down 41%. In the owner’s words: “Four-minute callbacks did more than the new ads did.”',
      },
      {
        q: 'What can a clinic not say in an ad?',
        a: 'Google does not allow ads targeted by health condition, so an ad cannot follow people around hinting at their pain. Meta rejects ads that suggest the reader has a condition, for example “Do you suffer from sciatica?”, and ads that promise a cure or a guaranteed result. We write ads about the treatment and the practice, not the reader, and check the current policy before every campaign.',
      },
      {
        q: 'What do you report, and how often?',
        a: 'Every Monday: inquiries, booked appointments, how many showed, and cost per booked visit, by campaign. Never clicks. If a campaign is not paying for itself once there is enough data, we say so and change it or stop it.',
      },
    ],
    industriesHeading: 'Paid ads by specialty.',
    ctaHeading: "Let's look at your ad numbers.",
  },
];
