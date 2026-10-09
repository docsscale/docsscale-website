// The four industry pages (/industries/<slug>/; until v1.2 they were at
// /services/<slug>/, which now 301s here). Each entry holds all of that page's
// copy; the nav and footer only use slug + name.
import { T } from '@/styles/tokens';

export type Specialty = {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  h1Accent: string;
  intro: string;
  accentBg: string;
  accentFg: string;
  painPoints: { title: string; body: string }[];
  stages: { label: string; title: string; body: string; tags: string[] }[];
  services: { title: string; body: string }[];
  /** This specialty's case from /results/. Owner-approved, with permission on
   *  file (6 Oct 2026): every string is copied exactly from ResultsCases.tsx,
   *  so change both together. */
  caseStudy: {
    meta: string;
    period: string;
    stat: string;
    statLine: string;
    tags: string[];
    result: string;
    quote: string;
    name: string;
    role: string;
    href: string;
  };
  /** Questions this specialty's owners ask, with visible answers. Shown as a
   *  section (and FAQPage schema) only once real, owner-approved entries exist;
   *  leave empty rather than invent them. */
  faqs?: { q: string; a: string }[];
};

export const SPECIALTIES: Specialty[] = [
  {
    slug: 'dental',
    name: 'Dental',
    title: 'Dental Marketing Agency | DocsScale',
    metaDescription:
      'Dental marketing built for booked chairs, not just inbox leads: implant and Invisalign campaigns, local SEO, and recall for overdue patients.',
    h1: 'Dental marketing that turns searches into',
    h1Accent: 'booked exams.',
    intro:
      'Referrals only take a practice so far. DocsScale runs the paid ads, local SEO, and follow-up that keep your chairs full, especially for the high-value treatments that pay for the marketing.',
    accentBg: T.peachBg,
    accentFg: T.peachFg,
    painPoints: [
      {
        title: "Growth stalls when it's referral-only",
        body: "A steady referral stream feels safe until it isn't. When referrals slow down, most practices have no second engine to fall back on.",
      },
      {
        title: 'Competitors rank for "dentist near me"',
        body: "Patients searching right now are landing on someone else's Google Business Profile, not yours.",
      },
      {
        title: 'High-value treatments get generic ads',
        body: "Implants and Invisalign patients search and decide differently than a routine cleaning. One generic ad campaign can't serve both.",
      },
    ],
    stages: [
      {
        label: 'Attract',
        title: 'Campaigns built around the treatments you want more of.',
        body: "Separate campaigns for implants, Invisalign, and cosmetic work, each with its own screening questions, so the front desk isn't fielding calls that were never a fit.",
        tags: ['Implant campaigns', 'Invisalign ads', 'Local SEO'],
      },
      {
        label: 'Capture',
        title: "A booking flow that works on the phone someone's holding.",
        body: 'Landing pages built for each treatment, with a form that asks what actually matters and confirms by text in seconds.',
        tags: ['Treatment landing pages', 'Instant text confirmation'],
      },
      {
        label: 'Convert',
        title: "Replies fast enough that patients don't call the next practice.",
        body: 'Every inquiry answered within minutes, insurance and financing questions handled up front, booked straight into your practice software.',
        tags: ['Fast reply', 'Insurance screening', 'Practice software booking'],
      },
      {
        label: 'Retain',
        title: "Recall for the patients who are overdue and don't know it.",
        body: 'Automated recall for six-month cleanings and treatment follow-ups, plus review requests after every visit.',
        tags: ['Recall campaigns', 'Review requests'],
      },
    ],
    services: [
      {
        title: 'Paid advertising',
        body: 'Meta and Google campaigns split by treatment, so implant and Invisalign leads get a different message than a routine cleaning search.',
      },
      {
        title: 'Local SEO',
        body: 'Google Business Profile management and a page per treatment, built to rank for "dentist near me" and treatment-specific searches.',
      },
      {
        title: 'Recall & reactivation',
        body: "Automated outreach for six-month cleanings and patients who've drifted, without discounting the visit.",
      },
    ],
    caseStudy: {
      meta: 'Dental · Dallas, TX',
      period: 'Jan–Jun 2026',
      stat: '184',
      statLine: 'new patients booked in six months. 91% showed.',
      tags: ['Implants', 'Full system'],
      result:
        '184 new patients booked, 167 showed, $48k attributed in the last month measured. Hiring a third hygienist.',
      quote: 'The weekly report is the only marketing email I actually open.',
      name: 'Dr. Kevin Patel',
      role: 'Owner, dental practice · Dallas, TX',
      href: '/results/',
    },
    faqs: [
      {
        q: 'How much should a dental practice spend on marketing?',
        a: "There is no standard figure. The percentages you'll see quoted are consultants' rules of thumb. Start from your own numbers: what a new patient is worth to you, how many more you can see each week, and what you can afford to spend to win one. Then look at the patients you already have before buying more ads, because your cheapest new visit is usually someone who already trusts you and is overdue for a cleaning. The ad budget itself is paid to Google or Meta from your own account.",
      },
      {
        q: 'Is a dental marketing agency worth it?',
        a: "Only if you can see what it brings in. Judge any agency, us included, by new inquiries, booked appointments, patients who showed up and the revenue they brought. Clicks and impressions can climb while the schedule stays empty. Before working with us, our Dallas client had an ad agency reporting clicks. We send one report every Monday with inquiries, booked, showed and revenue. In the Dallas owner's words: “The weekly report is the only marketing email I actually open.”",
      },
      {
        q: 'What should we ask a dental marketing company before signing?',
        a: "Four questions. Who owns the website pages, ad accounts and data if we leave? How long is the contract, and what does it take to end it? Who answers the inquiries your ads create, especially after 5 pm? Can you show a real dental result with a place and a date on it? Our answers: everything stays in your accounts, it's month to month with 30 days' notice, every inquiry is answered within minutes, day or night, and the Dallas case is on this page.",
      },
      {
        q: 'Should a dental practice advertise on Google or Facebook?',
        a: "Usually both, because they do different jobs. Google Ads reach people who are already searching, for example “dentist near me” or “dental implants near me”. Facebook and Instagram reach people who aren't searching yet, which suits elective treatments such as clear aligners and cosmetic work. Give each treatment its own campaign and judge each one by booked patients, not clicks. We run Meta and Google campaigns split by treatment, in your own ad accounts.",
      },
      {
        q: "Why don't our dental implant leads book?",
        a: 'Implant patients take longer to decide and usually want answers about cost and financing before they come in. A generic ad and a slow callback lose them. Give implants their own campaign and landing page, answer the financing question up front, and ask a few screening questions so your team calls the people who are ready first. For our Dallas client we built one implant funnel with three screening questions, Meta and Google campaigns in their own accounts, text-back on every missed call, reminders, and a recall campaign for 412 dormant patients. The result: 184 new patients booked in six months. 91% showed.',
      },
      {
        q: 'What can a dental practice say in its ads?',
        a: "Your state dental board sets the rules, and they vary from state to state. The common trouble spots are a general dentist advertising as a “specialist”, patient photos or before-and-afters used without the patient's written permission, and price ads without the disclosures some states require. We don't run discount specials, the compliance rules for dental advertising are part of every review, and nothing goes live until you approve it.",
      },
      {
        q: 'How should we reply to patient reviews without breaking HIPAA?',
        a: 'Thank the reviewer, keep it short, and never confirm they are a patient or mention their treatment, even if they mentioned it first. The U.S. Department of Health and Human Services has penalized dental practices for revealing patient details in replies to online reviews. For an unhappy review, invite them to call the office so it can be handled privately. We ask for a review after every visit and reply within 24 hours in your voice.',
      },
    ],
  },
  {
    slug: 'chiropractic',
    name: 'Chiropractic',
    title: 'Chiropractic Marketing Agency | DocsScale',
    metaDescription:
      'Chiropractic marketing built for same-week bookings: pain-driven ad campaigns, missed-call text-back, and recall for maintenance-care patients.',
    h1: 'Chiropractic marketing built for',
    h1Accent: 'same-week bookings.',
    intro:
      'Someone searching for a chiropractor today wants an appointment this week, not a newsletter. DocsScale gets you in front of them and answers before they call the next practice.',
    accentBg: T.tealTintBg,
    accentFg: T.tealTintFg,
    painPoints: [
      {
        title: "Pain doesn't wait for a callback",
        body: "A patient in pain who doesn't hear back within minutes is already calling someone else.",
      },
      {
        title: 'After-hours calls go to voicemail',
        body: "Most people search for relief in the evening. If nobody answers, the inquiry doesn't wait until morning.",
      },
      {
        title: 'Maintenance-care patients quietly drift',
        body: "Patients who finish acute care and never get invited back to maintenance are lost revenue nobody's tracking.",
      },
    ],
    stages: [
      {
        label: 'Attract',
        title: "Ads that speak to the pain someone's searching for, right now.",
        body: 'Campaigns built around specific complaints, back pain, sciatica, neck pain, so the person who clicks is already a fit.',
        tags: ['Pain-specific ad campaigns', 'Local SEO'],
      },
      {
        label: 'Capture',
        title: 'A form that gets you an appointment request in under a minute.',
        body: 'Short, mobile-first forms and a missed-call text-back that sends the same booking page automatically.',
        tags: ['Missed-call text-back', 'Mobile booking forms'],
      },
      {
        label: 'Convert',
        title: 'Same-week booking, confirmed before they change their mind.',
        body: 'Replies within minutes, day or night, with reminders that cut no-shows for the first visit.',
        tags: ['Fast reply', 'Reminder sequence'],
      },
      {
        label: 'Retain',
        title: "Maintenance care that doesn't rely on patients remembering.",
        body: 'Recall timed to their treatment plan, plus review requests that build the reputation new patients check before booking.',
        tags: ['Maintenance recall', 'Review requests'],
      },
    ],
    services: [
      {
        title: 'Paid advertising',
        body: 'Meta and Google campaigns built around specific pain points, not generic "chiropractic care" messaging.',
      },
      {
        title: 'Follow-up & booking',
        body: "Missed-call text-back and replies within minutes, because pain-driven patients don't wait for a callback.",
      },
      {
        title: 'Reactivation & recall',
        body: 'Outreach to patients who finished acute care and never got invited back to maintenance visits.',
      },
    ],
    caseStudy: {
      meta: 'Chiropractic · Tampa, FL',
      period: 'Aug 2026',
      stat: '31',
      statLine: 'dormant patients rebooked in the first month. Zero ad spend.',
      tags: ['Reactivation', 'Retain only'],
      result: '31 rebooked in month one, 19 new Google reviews, zero ad spend.',
      quote: "Patients we assumed had moved away. They just hadn't been asked.",
      name: 'Dr. Stephanie Carter',
      role: 'Owner, chiropractic · Tampa, FL',
      href: '/results/',
    },
  },
  {
    slug: 'physical-therapy',
    name: 'Physical Therapy',
    title: 'Physical Therapy Marketing Agency | DocsScale',
    metaDescription:
      'Physical therapy marketing that protects referrals and books more evaluations: fast callback on every lead, post-op landing pages, and insurance clarity.',
    h1: 'Physical therapy marketing that protects',
    h1Accent: 'every referral.',
    intro:
      'A referral that waits a day for a callback is a referral that goes somewhere else. DocsScale builds the fast follow-up and direct-access campaigns that keep your schedule full.',
    accentBg: T.sageBg,
    accentFg: T.sageFg,
    painPoints: [
      {
        title: 'Referrals leak between the surgeon and your front desk',
        body: 'A patient told to "call and schedule PT" is an easy referral to lose if nobody follows up.',
      },
      {
        title: 'Slow callbacks lose post-op patients',
        body: 'Patients fresh out of surgery are comparing wait times. A next-business-day callback is often too slow.',
      },
      {
        title: 'Insurance confusion stalls the booking',
        body: 'Unclear coverage and pricing is one of the biggest reasons an evaluation request never turns into a visit.',
      },
    ],
    stages: [
      {
        label: 'Attract',
        title: "Direct-access campaigns for patients who don't need a referral yet.",
        body: 'Local SEO and ads for the specific conditions and post-op categories you treat, not generic "physical therapy near me."',
        tags: ['Direct-access ads', 'Local SEO'],
      },
      {
        label: 'Capture',
        title: 'A landing page that answers the insurance question before they ask.',
        body: "Post-op and condition-specific pages with clear insurance and self-pay information, and a form that's fast on a phone.",
        tags: ['Post-op landing pages', 'Insurance clarity'],
      },
      {
        label: 'Convert',
        title: 'A callback inside minutes, not the next business day.',
        body: 'Every referral and web inquiry answered fast, booked straight into your scheduling software, with reminders that hold the slot.',
        tags: ['Fast callback', 'Scheduling software booking'],
      },
      {
        label: 'Retain',
        title: 'Patients who finish their full plan of care, not just visit one.',
        body: 'Reminder sequences that reduce drop-off mid-treatment, plus review requests and referral prompts to the surgeons who send you patients.',
        tags: ['Plan-of-care reminders', 'Referral relationships'],
      },
    ],
    services: [
      {
        title: 'Paid advertising',
        body: 'Campaigns built around direct-access and specific post-op categories, reported in booked evaluations.',
      },
      {
        title: 'Follow-up & booking',
        body: 'Fast callback on every referral and web inquiry, because slow follow-up is where post-op patients get lost.',
      },
      {
        title: 'Website design',
        body: "Condition and post-op pages that answer the insurance question up front, so the visit doesn't stall on price confusion.",
      },
    ],
    caseStudy: {
      meta: 'Physical therapy · Denver, CO',
      period: 'Feb–Jul 2026',
      stat: '2.4×',
      statLine: 'more post-op evaluations on the same ad budget.',
      tags: ['Post-op rehab', 'Growth'],
      result:
        '2.4× more evaluations booked, cost per booked visit down 41%, two new referring surgeons who found them through the page.',
      quote: 'Four-minute callbacks did more than the new ads did.',
      name: 'Dr. Emily Foster',
      role: 'Owner, physical therapy · Denver, CO',
      href: '/results/',
    },
  },
  {
    slug: 'med-spa',
    name: 'Med Spa',
    title: 'Med Spa Marketing Agency | DocsScale',
    metaDescription:
      'Med spa marketing that turns followers into booked consults: Instagram and Meta injectables campaigns, fast DM replies, and touch-up recall.',
    h1: 'Med spa marketing that turns followers into',
    h1Accent: 'booked consults.',
    intro:
      'A strong following with a weak calendar is a marketing problem, not a content problem. DocsScale gets consult requests answered before they DM the med spa two doors down.',
    accentBg: T.lavenderBg,
    accentFg: T.lavenderFg,
    painPoints: [
      {
        title: "Followers don't equal booked consults",
        body: 'A large, engaged audience means nothing if DMs and comments go unanswered for a day.',
      },
      {
        title: 'Consult requests go to whoever replies first',
        body: 'Injectables and aesthetics patients are comparing multiple providers at once, in real time.',
      },
      {
        title: 'Touch-ups get forgotten',
        body: 'Your best, easiest bookings are patients due for a touch-up who nobody reminded.',
      },
    ],
    stages: [
      {
        label: 'Attract',
        title: 'Campaigns built around the treatments you want to grow.',
        body: 'Instagram and Meta campaigns for injectables, skin, and body treatments, each with its own creative and offer.',
        tags: ['Instagram & Meta ads', 'Treatment-specific creative'],
      },
      {
        label: 'Capture',
        title: 'A consult booking flow as fast as your following expects.',
        body: "Landing pages and forms built for the treatments you're promoting, with instant confirmation by text.",
        tags: ['Consult landing pages', 'Instant confirmation'],
      },
      {
        label: 'Convert',
        title: 'DMs and forms answered in minutes, not by end of day.',
        body: 'Every inquiry, DM, and form reply handled fast, booked straight onto your calendar, with reminders that cut no-shows.',
        tags: ['Fast DM & form replies', 'Reminder sequence'],
      },
      {
        label: 'Retain',
        title: 'Touch-up recall that keeps the chair full between campaigns.',
        body: 'Automated outreach timed to when a patient is due for a touch-up, plus review requests after every visit.',
        tags: ['Touch-up recall', 'Review requests'],
      },
    ],
    services: [
      {
        title: 'Paid advertising',
        body: 'Instagram and Meta campaigns built around specific treatments, reported in booked consults, not follower growth.',
      },
      {
        title: 'Social media management',
        body: 'Consistent posting in your voice, planned ahead, with comments and DMs answered as part of the system, not an afterthought.',
      },
      {
        title: 'Reactivation & recall',
        body: "Automated touch-up reminders timed to each treatment, so rebooking doesn't rely on patients remembering.",
      },
    ],
    caseStudy: {
      meta: 'Med spa · Las Vegas, NV',
      period: 'Q1 2026',
      stat: '62',
      statLine: 'booked consults from one injectables campaign.',
      tags: ['Injectables', 'Growth'],
      result: '62 booked consults in the quarter, 54 showed, and a 38% treatment acceptance on first visit.',
      quote: 'Same followers, same budget. The difference was somebody answering at 9 pm.',
      name: 'Dr. Nicole Ramirez',
      role: 'Owner, med spa · Las Vegas, NV',
      href: '/results/',
    },
  },
];

export const SPECIALTY_LINKS = SPECIALTIES.map(({ slug, name }) => ({ slug, name }));

export { industryHref } from './industry-href';
