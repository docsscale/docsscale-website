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
      title: string;
      body: string;
    }[];
  };
  /** How things changed over time, in order. */
  timeline: { heading: string; steps: { when: string; title: string; body: string }[] };
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
      'How a Sumter, SC chiropractor went from a slow first quarter to referrals and walk-ins with one patient journey, from lead generation to follow-up.',
    h1: 'How a Sumter chiropractor went from a slow first quarter to',
    h1Accent: 'referrals and walk-ins.',
    intro:
      'This chiropractic marketing case study follows Central Clinic of Chiropractic in Sumter, South Carolina. We set up the complete patient journey, from lead generation to follow-up, the same system every DocsScale client runs. The first three months were hard. Then the referrals started.',
    accentBg: STAGE_COLORS.retain.bg,
    accentFg: STAGE_COLORS.retain.fg,
    facts: [
      { label: 'Clinic', value: 'Central Clinic of Chiropractic, 11 E Calhoun Street, Sumter, SC' },
      { label: 'Doctors', value: 'Dr. Jordan Reizer, D.C. and Dr. Shannon Reizer, D.C.' },
      { label: 'Care', value: 'Gonstead chiropractic care, spinal decompression, knee decompression' },
      {
        label: 'What we run',
        value: 'The complete patient journey: website, booking, first visit, reviews and follow-up',
      },
      { label: 'Status', value: 'Ongoing client' },
    ],
    website: { label: 'centralclinicchiro.com', href: 'https://centralclinicchiro.com/' },
    starting: {
      heading: 'The starting point.',
      paragraphs: [
        'Dr. Jordan Reizer is a Gonstead chiropractor. Dr. Shannon Reizer trained in neurology, physiology and functional assessment. Between them the clinic offers specific adjustments plus non-surgical spinal and knee decompression, in a private-pay office in downtown Sumter.',
        'Good care is not the same as a full schedule. A patient with sciatica or a bulging disc has to find the clinic, understand what decompression is, ask for an appointment, get a reply, turn up with the paperwork done, and come back. Every one of those steps is a place to lose them. Our job was to build the whole path, not one piece of it.',
      ],
    },
    journey: {
      heading: 'The patient journey we built.',
      intro:
        'We do not sell a website, or ads, or follow-up on their own. We set up the four stages as one system, so each one feeds the next. Here is what that looks like at Central Clinic of Chiropractic.',
      stages: [
        {
          stage: 'attract',
          label: 'Attract',
          title: 'A page for each thing the clinic does',
          body: 'The website explains Gonstead chiropractic care on its own page and spinal and knee decompression on another, in plain words: what the condition is, what the treatment does, and who it is for. Someone in Sumter searching for sciatica relief or a non-surgical alternative to back surgery lands on a page that answers their question, not a brochure.',
        },
        {
          stage: 'capture',
          label: 'Capture',
          title: 'A way to ask for an appointment on every page',
          body: 'Every page carries an appointment request form with the day and time the patient wants, plus a separate online booking page for people who would rather pick a slot themselves. The form says plainly that a staff member will confirm during office hours, so nobody is left wondering whether their request went through.',
        },
        {
          stage: 'convert',
          label: 'Convert',
          title: 'The first visit prepared before they arrive',
          body: 'A first-visit page walks a new patient through four steps: schedule, download the new patient packet and financial policy, fill it in at home, bring it in. The private-pay policy and the cancellation policy are stated up front. Fewer surprises at the front desk means fewer people who book and never come.',
        },
        {
          stage: 'retain',
          label: 'Retain',
          title: 'Reviews that do the next patient’s research for them',
          body: 'The clinic’s Google reviews are shown on the site, with the patient’s name and the source, so a visitor reads what Sumter patients say before they read what the clinic says. Follow-up after the visit keeps the patient on their plan of care, and patients who finish care well are the ones who send their family and co-workers.',
        },
      ],
    },
    timeline: {
      heading: 'What changed, and when.',
      steps: [
        {
          when: 'Months one to three',
          title: 'Slow, and uncomfortable',
          body: 'New patients came in, but mostly from the marketing itself, one at a time. This is the stretch where most clinic owners decide marketing does not work and switch it off. Dr. Jordan did not.',
        },
        {
          when: 'From month four',
          title: 'Referrals and walk-ins',
          body: 'Patients who had finished care started sending people, and walk-ins picked up. The system kept bringing in new patients while word of mouth grew on top of it.',
        },
        {
          when: 'Today',
          title: 'Still a client',
          body: 'We still run the clinic’s patient journey. The site, the booking flow, the first-visit page and the reviews are live at centralclinicchiro.com, and Dr. Jordan’s own words on how the practice stands in Sumter now are below.',
        },
      ],
    },
    quote: {
      text: 'The first three months tested my patience. I kept going because the system made sense: a patient finds us, books, shows up prepared, and comes back. Now most of our new patients are referrals and walk-ins, and we are one of the busiest chiropractic clinics in Sumter.',
      name: 'Dr. Jordan Reizer, D.C.',
      role: 'Central Clinic of Chiropractic, Sumter, SC',
    },
    lessons: {
      heading: 'What this case says about chiropractic marketing.',
      items: [
        {
          title: 'The first quarter is the hard part',
          body: 'A new patient journey has no reviews, no referrals and no history behind it. The first three months run on marketing alone. The practices that grow are the ones that hold through that stretch instead of switching agencies every ninety days.',
        },
        {
          title: 'Referrals are built, not wished for',
          body: 'Word of mouth comes from patients who were booked easily, arrived prepared and finished their plan of care. Each stage of the journey raises the odds of that, which is why we set up all four rather than the one a clinic asks for first.',
        },
        {
          title: 'The website has one job',
          body: 'Not to look good. To turn a search for a specific problem into an appointment request, and to make sure the request is answered. Every page at Central Clinic of Chiropractic is built for that.',
        },
      ],
    },
    faqs: [
      {
        q: 'How long does it take to build a chiropractic practice?',
        a: 'Longer than most owners expect, and the first three months are the slowest. At Central Clinic of Chiropractic the early new patients came from the marketing alone. Referrals and walk-ins came later, once enough patients had finished care and had something to say. Plan for a slow first quarter and judge the system over a year, not a month.',
      },
      {
        q: 'How do chiropractors get new patients?',
        a: 'From four places: people searching for their symptom online, people who walk or drive past, people sent by existing patients, and past patients who come back. A clinic that relies on one of those is fragile. The patient journey we build covers all four: pages that answer a search, a request form on every page, a prepared first visit, and reviews and follow-up that turn patients into referrers.',
      },
      {
        q: 'How do you market a new chiropractic office in a small town?',
        a: 'Say exactly what you do and for whom. Central Clinic of Chiropractic offers Gonstead adjustments and spinal and knee decompression, so its site has a page for each, written for the person with sciatica or knee pain who has been told surgery is the only option. In a town the size of Sumter, being the clear answer to a specific problem matters more than a big budget.',
      },
      {
        q: 'Do referrals mean a chiropractor can stop marketing?',
        a: 'No. Referrals are the result of the system, not a replacement for it. When Dr. Jordan’s practice started getting referrals and walk-ins, we kept the journey running, because the pages, the booking flow and the reviews are what make a referred patient actually book instead of just meaning to.',
      },
      {
        q: 'What should a chiropractic website do?',
        a: 'Three things. Explain each treatment in plain words so a visitor knows it is for them. Let them ask for an appointment from any page, with a clear note on when they will hear back. Prepare them for the first visit, with the intake forms and the payment policy stated before they arrive. Design that does not serve one of those three is decoration.',
      },
      {
        q: 'Is the complete patient journey what DocsScale sets up for every clinic?',
        a: 'Yes. It is the thing we do. The channels change by specialty and by town, but every client gets the same four stages, Attract, Capture, Convert and Retain, as one connected system with one Monday report. The results page shows what it has done for dental, med spa, physical therapy and other chiropractic clients.',
      },
    ],
    ctaHeading: 'Want the same patient journey for your clinic?',
  },
];

export function caseStudyHref(slug: string) {
  return `/results/${slug}/`;
}
