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
  },
];

export const SPECIALTY_LINKS = SPECIALTIES.map(({ slug, name }) => ({ slug, name }));

export const industryHref = (slug: string) => `/industries/${slug}`;
