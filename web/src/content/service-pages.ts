// The service pages (/services/<slug>/), one per confirmed service, written one
// at a time as the keyword map orders them (docs/seo/keywords/keyword-map.md).
// Each entry holds all of that page's copy; the layout is
// features/services/ServicePage.tsx. Rules (docs/COMPLETION-PLAN.md, section 2):
// a direct answer at the top, our own process in order, a real client example
// copied exactly from /results/, who it suits and who it doesn't, real
// questions, and links to the industries. Nothing invented: every figure here
// is one the results page already publishes.
import { PAID_ADS_AD } from '@/content/images';
import { T } from '@/styles/tokens';

/** Line icons drawn in features/services/ServicePage.tsx. */
export type ProcessIcon =
  'target' | 'page' | 'megaphone' | 'reply' | 'refresh' | 'chart' | 'search' | 'calendar' | 'mail' | 'star';

/** The example graphic beside the heading (features/services/ServicePage.tsx, HeroGraphic). */
export type HeroGraphic =
  | {
      /** An example search ad and social ad for one treatment. */
      kind: 'ads';
      ariaLabel: string;
      label: string;
      search: { title: string; text: string };
      social: { text: string; photo: string; photoSizes: string; url: string; cta: string };
      booked: string;
    }
  | {
      /** An example email to a past patient. */
      kind: 'email';
      ariaLabel: string;
      label: string;
      from: string;
      note: string;
      subject: string;
      body: string;
      cta: string;
      /** The doctor's sign-off under the button; a line break splits it. */
      signOff: string;
      /** Small print at the foot of the email; an "Unsubscribe" link follows it. */
      footer: string;
      booked: string;
    };

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
  heroGraphic: HeroGraphic;
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
  /** Words that pick each specialty's matching service card for its blurb. */
  industryMatch: string[];
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
    heroGraphic: {
      kind: 'ads',
      ariaLabel:
        'Example: a search ad and a social ad for dental implants from a clinic, both leading to a booked consultation',
      label: 'One treatment, two ads',
      search: {
        title: 'Dental implants · Free consultation',
        text: 'Planned in one visit, with same-week appointments. Book online in a minute.',
      },
      social: {
        text: 'Dental implants, planned in one visit. A free thirty-minute consultation, booked online.',
        photo: PAID_ADS_AD,
        photoSizes: '(max-width: 1100px) calc(100vw - 68px), 394px',
        url: 'yourclinic.com/implants',
        cta: 'Book a consultation',
      },
      booked: 'Booked: new patient consultation, Tuesday 10:30',
    },
    worksWith: [
      { label: 'Websites & landing pages', href: '/services#capture' },
      { label: 'Lead follow-up & booking', href: '/services#convert' },
      { label: 'Local SEO & Google Business Profile', href: '/services#attract' },
      { label: 'Reactivation & recall', href: '/services/patient-reactivation/' },
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
    industryMatch: ['paid'],
    ctaHeading: "Let's look at your ad numbers.",
  },
  {
    slug: 'patient-reactivation',
    name: 'Reactivation & recall',
    stage: 'Retain',
    title: 'Patient Reactivation for Clinics | DocsScale',
    metaDescription:
      "Patient reactivation for clinics: past patients invited back by email in the doctor's voice, timed to their care, and reported in rebooked visits.",
    h1: 'Patient reactivation that brings past patients',
    h1Accent: 'back to the schedule.',
    intro:
      "Patient reactivation means inviting back people who already know your clinic but have not been in for a while. We write to them by email in the doctor's own voice, time each message to their care, ask for a review after a good visit, and report rebooked visits every Monday. No discounts, and no ad spend.",
    accentBg: T.sageBg,
    accentFg: T.sageFg,
    heroGraphic: {
      kind: 'email',
      ariaLabel:
        'Example: an email from a clinic to a past patient, inviting her to book a check-in visit, and the visit she rebooked',
      label: 'One email, one rebooked visit',
      from: 'Dr. Your Name · Your Clinic',
      note: 'Sent 12 months after the last visit',
      subject: 'It has been a while. Time for a check-in?',
      body: 'Hi Maria, it has been over a year since your last visit. If you would like to come in, you can pick a time that suits you here.',
      cta: 'Pick a time',
      signOff: 'See you soon,\nDr. Your Name',
      footer: 'You are receiving this because you are a patient of Your Clinic.',
      booked: 'Rebooked: check-in visit, Thursday 9:00',
    },
    worksWith: [
      { label: 'Lead follow-up & booking', href: '/services#convert' },
      { label: 'Websites & landing pages', href: '/services#capture' },
      { label: 'Paid ads (Meta & Google)', href: '/services/paid-ads/' },
      { label: 'Local SEO & Google Business Profile', href: '/services#attract' },
    ],
    processHeading: 'What we do, in order.',
    processFlow: [
      { label: 'Find patients not seen in a while', icon: 'search' },
      { label: 'An email from the doctor', icon: 'mail' },
      { label: 'Picks a time online', icon: 'calendar' },
      { label: 'Comes back and leaves a review', icon: 'star' },
    ],
    process: [
      {
        title: 'Find who has drifted away',
        icon: 'search',
        body: 'From your own patient list: people not seen in 12 months or more, and people who stopped partway through a plan of care. Most clinics have years of them, and nobody has asked them back.',
      },
      {
        title: "Write in the doctor's voice",
        icon: 'mail',
        body: 'A short, personal note from the doctor, not a newsletter. No discount, and nothing in the message that reveals what the patient was treated for.',
      },
      {
        title: 'Time it to their care',
        icon: 'calendar',
        body: 'Recall for patients who are due, such as a six-month cleaning or a touch-up, and a separate invitation for past patients who have been gone a long time. Each list gets its own message.',
      },
      {
        title: 'Make booking one click',
        icon: 'reply',
        body: 'Every email links straight to a booking page, and every reply gets an answer within minutes, so a patient who is ready does not have to chase you.',
      },
      {
        title: 'Ask for a review after a good visit',
        icon: 'star',
        body: 'Patients who come back and have a good visit get one short request to review you on Google. It builds the reputation new patients check before they book.',
      },
      {
        title: 'Report rebooked visits every Monday',
        icon: 'chart',
        body: 'How many were invited, how many booked, how many came in, and how many reviews followed. First results usually come within the first month.',
      },
    ],
    caseStudy: {
      heading: 'A real reactivation campaign, in numbers.',
      meta: 'Chiropractic · Tampa, FL',
      period: 'Aug 2026',
      stat: '31',
      statLine: 'dormant patients rebooked in the first month. Zero ad spend.',
      tags: ['Reactivation', 'Retain only'],
      built:
        "A reactivation campaign to 640 patients not seen in 12+ months, written in the doctor's voice, with a review request after every completed visit.",
      result: '31 rebooked in month one, 19 new Google reviews, zero ad spend.',
      quote: "Patients we assumed had moved away. They just hadn't been asked.",
      name: 'Dr. Stephanie Carter',
      role: 'Owner, chiropractic · Tampa, FL',
      href: '/results/',
    },
    alsoFromResults: {
      text: 'Also on our results page: a recall campaign for 412 dormant patients was part of the system behind 184 new patients for a Dallas dental practice.',
      href: '/results/',
    },
    fit: {
      heading: 'Reactivation suits you if',
      items: [
        'You have been open a few years and have past patients who have not been back.',
        'There are gaps in the schedule you would rather fill without paying for ads.',
        'Someone, your front desk or our follow-up, can answer replies the same day.',
      ],
    },
    notFit: {
      heading: 'It is the wrong place to start if',
      items: [
        'The practice is new and there are few past patients to invite back. Paid ads come first.',
        'You want a discount blast to everyone on the list. We do not send those.',
        'Nobody can take the replies and bookings when patients answer.',
      ],
    },
    faqs: [
      {
        q: 'What is patient reactivation?',
        a: 'Inviting back patients who already know your clinic but have not been in for a while, usually 12 months or more, or who stopped partway through care. Recall is the routine part: reminding patients who are due for their next visit, such as a cleaning or a maintenance check. We run both, as separate lists with separate messages.',
      },
      {
        q: 'How many past patients actually come back?',
        a: "It depends on the list and the specialty. For our Tampa client we sent a reactivation campaign to 640 patients not seen in 12+ months, with a review request after every completed visit. The result: 31 rebooked in month one, 19 new Google reviews, zero ad spend. In the owner's words: “Patients we assumed had moved away. They just hadn't been asked.”",
      },
      {
        q: 'Are we allowed to email past patients?',
        a: 'In general, a clinic may write to its own patients about their own care, such as a reminder that they are due for a visit. Every email has an unsubscribe link, and none says what the patient was treated for. The rules vary by state and by specialty, so we check the plan with you before anything is sent.',
      },
      {
        q: 'Do we need to offer a discount to get patients back?',
        a: 'No. We write a personal invitation from the doctor, not a promotion. A discount teaches patients to wait for the next one and lowers what each visit is worth.',
      },
      {
        q: 'How soon do rebooked visits start?',
        a: 'The lists and the booking link are set up first, then the emails go out. First results usually come within the first month, and recall then keeps running in the background as patients come due.',
      },
      {
        q: 'What do you report?',
        a: 'Every Monday: how many patients were invited, how many booked, how many came in, and how many reviews followed. Never opens or clicks on their own.',
      },
    ],
    industriesHeading: 'Reactivation by specialty.',
    industryMatch: ['reactivation', 'recall'],
    ctaHeading: "Let's look at your past patients.",
  },
];
