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
  /** `href`: the service's own page, once it exists (content/service-href.ts). */
  services: { title: string; body: string; href?: string }[];
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
      'The dental marketing agency built for booked chairs, not just inbox leads: implant and Invisalign campaigns, local SEO, and recall for overdue patients.',
    h1: 'The dental marketing agency that turns searches into',
    h1Accent: 'booked exams.',
    intro:
      'Referrals only take a practice so far. DocsScale is a dental marketing agency that runs the paid ads, local SEO, and follow-up that keep your chairs full, especially for the high-value treatments that pay for the marketing.',
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
        href: '/services/paid-ads/',
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
    title: 'Chiropractor Marketing Agency | DocsScale',
    metaDescription:
      'The chiropractor marketing agency built for same-week bookings: pain-driven ad campaigns, missed-call text-back, and recall for maintenance-care patients.',
    h1: 'The chiropractor marketing agency built for',
    h1Accent: 'same-week bookings.',
    intro:
      'Someone searching for a chiropractor today wants an appointment this week, not a newsletter. DocsScale is the chiropractor marketing agency that gets you in front of them and answers before they call the next practice.',
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
        href: '/services/paid-ads/',
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
    faqs: [
      {
        q: 'How do we get more chiropractic patients without spending more on ads?',
        a: "Start with the patients you already have. Most practices have years of people in their software who finished care and were never invited back, and they already know you. Write to them in the doctor's own voice. For our Tampa client we sent a reactivation campaign to 640 patients not seen in 12+ months, with a review request after every completed visit. The result: 31 rebooked in month one, 19 new Google reviews, zero ad spend. In the owner's words: “Patients we assumed had moved away. They just hadn't been asked.”",
      },
      {
        q: 'Should a chiropractor advertise on Google or Facebook?',
        a: "Google first for most practices, because someone searching for back pain, sciatica or neck pain wants relief this week. Facebook and Instagram reach people who aren't searching yet, which suits wellness and maintenance care better than acute pain. Google doesn't allow ads targeted by health condition, so an ad that follows people around can't hint at their pain. We build campaigns around specific complaints rather than generic “chiropractic care”, and judge them by booked visits, not clicks.",
      },
      {
        q: 'Can we advertise a free or discounted first exam?',
        a: "Check your state chiropractic board's rules first. Several states require the ad to list every charge that can follow the free exam, x-rays included, and some require a signed disclosure in the office. For Medicare and Medicaid patients, free services can count as an improper inducement under federal law. We don't run discount specials. We would rather answer every inquiry within minutes, day or night, so the person in pain books with you before they call someone else.",
      },
      {
        q: 'How should we market maintenance care?',
        a: "Be clear about what it is and who pays for it. Medicare pays for active, corrective care only, so maintenance visits are usually paid by the patient, and they should know that before they commit. If you sell prepaid or wellness plans, some states regulate them, with rules on written terms and refunds. Then invite people back at the right time. We set up recall timed to each patient's treatment plan, so maintenance care doesn't depend on patients remembering.",
      },
      {
        q: 'What can a chiropractor claim in ads?',
        a: "Say what you treat and how. Don't promise what it cures. The Federal Trade Commission requires competent and reliable scientific evidence for any claim about treating disease, and in 2020 it warned chiropractors who advertised that their care could prevent or treat COVID-19. Some state boards also treat superlatives such as “best chiropractor in town” as misleading. Every ad we write gets your sign-off before it goes live, and the compliance rules for your specialty are part of every review.",
      },
      {
        q: 'How do we get more Google reviews, and can we offer a reward for them?',
        a: "Ask every patient, every time, after a good visit, with a direct link to your Google profile. Don't post fake reviews, offer a reward only for positive ones, or have staff review the practice without saying who they are. A federal rule in force since October 2024 bans all three, and Google's own rules don't allow rewards for reviews at all. When you reply, never confirm the reviewer is a patient. We send a review request after every visit and reply within 24 hours in your voice.",
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
      'A referral that waits a day for a callback is a referral that goes somewhere else. Our physical therapy marketing builds the fast follow-up and direct-access campaigns that keep your schedule full.',
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
        href: '/services/paid-ads/',
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
    faqs: [
      {
        q: "Can patients come to physical therapy without a doctor's referral?",
        a: "Yes, in every state, though the rules differ. Some states allow it without limits, others cap the number of visits or days before a referral is needed. Medicare doesn't require a referral either, but a physician still has to certify the plan of care for the visits to be paid. So a direct-access campaign should name the conditions you treat and say plainly whether a patient needs a referral in your state. We run direct-access ads and local search for the conditions and post-op categories you actually treat.",
      },
      {
        q: 'Why do our post-op leads go cold?',
        a: "Usually because nobody calls them back fast enough. A patient fresh out of surgery is comparing wait times, and a callback the next business day is often too late. Our Denver client was referral-dependent, with a Google Ads account nobody had touched in a year, and web form leads were called back the next business day. We built a post-surgery rehab landing page with insurance screening, rebuilt their Google campaigns, and set up a callback within four minutes on every form. The result: 2.4× more evaluations booked and cost per booked visit down 41%. In the owner's words: “Four-minute callbacks did more than the new ads did.”",
      },
      {
        q: 'How do we get more referrals from orthopedic surgeons?',
        a: "Make it easy and safe for a surgeon's office to send patients to you. That means a fast callback, so their patient is booked before leaving the parking lot, a clear page for each type of surgery you rehab, and updates on how their patients are doing. Be careful with gifts. Federal anti-kickback and self-referral rules limit what you can give someone who refers Medicare patients, so check with a healthcare attorney first. After we built our Denver client's post-surgery page, two new referring surgeons found them through it.",
      },
      {
        q: 'How do we answer insurance questions without losing the patient?',
        a: "Answer them before the patient has to ask. Unclear coverage is one of the most common reasons an evaluation request never becomes a visit. List the plans you're in network with, give a self-pay price if you have one, and add a short screening question to the form so your team can check benefits before calling back. We build condition and post-op pages that answer the insurance question up front, so the booking doesn't stall on price.",
      },
      {
        q: 'How do we keep patients through their full plan of care?',
        a: "Measure it first. The drop-off percentages you'll see quoted online rarely come from a published study, so track your own: visits attended against visits planned, by therapist and by condition. Then tell each patient at the evaluation how many visits they need and why, book ahead, and send reminders between visits. We set up plan-of-care reminders that reduce drop-off mid-treatment, and the Monday report shows booked and showed visits so you can see the trend.",
      },
      {
        q: 'Can we use patient success stories in our marketing?',
        a: "Yes, with the patient's written permission, signed before you post. HIPAA requires a written authorization to use a patient's story, name, photo or video in marketing, and the U.S. Department of Health and Human Services has settled with a physical therapy provider that posted testimonials without one. Show results that are typical for your patients, not only your best case, because a “results may vary” line is no longer enough for the Federal Trade Commission. We don't post anything about a patient without your sign-off.",
      },
    ],
  },
  {
    slug: 'med-spa',
    name: 'Med Spa',
    title: 'Med Spa Marketing Agency | DocsScale',
    metaDescription:
      'The med spa marketing agency that turns followers into booked consults: Instagram and Meta injectables campaigns, fast DM replies, and touch-up recall.',
    h1: 'The med spa marketing agency that turns followers into',
    h1Accent: 'booked consults.',
    intro:
      'A strong following with a weak calendar is a marketing problem, not a content problem. DocsScale is the med spa marketing agency that gets consult requests answered before they DM the med spa two doors down.',
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
        href: '/services/paid-ads/',
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
    faqs: [
      {
        q: "Why don't our Instagram followers turn into booked consults?",
        a: "Usually because nobody answers fast enough. Injectables and aesthetics clients compare several providers at once, and a DM answered the next day has often booked elsewhere. Our Las Vegas client had a strong Instagram following and a weak calendar, with DMs answered the next day, if at all. We built an injectables consult funnel, Instagram and Meta campaigns, DM and form replies within minutes, and a reminder sequence with a same-day reschedule for no-shows. The result: 62 booked consults in the quarter, 54 showed, and a 38% treatment acceptance on first visit. In the owner's words: “Same followers, same budget. The difference was somebody answering at 9 pm.”",
      },
      {
        q: 'How do we cut no-shows for consults?',
        a: "Confirm the booking right away, remind them before the visit, and have a plan for the ones who miss. A consult booked from an ad is easy to forget, so a quick confirmation and a reminder the day before do most of the work. When someone does miss, offer a new time the same day while they're still interested. For our Las Vegas client we set up a reminder sequence with a same-day reschedule for no-shows, and 54 of 62 booked consults showed.",
      },
      {
        q: 'Can we use before-and-after photos in our ads and posts?',
        a: "Only with the client's written consent for that specific use, kept separate from their treatment consent. Show results that are typical, not just your best one: the Federal Trade Commission no longer treats a “results may vary” line as enough. Meta and Google also have their own rules for cosmetic procedure ads, including age targeting, and they change often, so check them before every campaign. Every ad, post and page we make gets your sign-off before it goes live.",
      },
      {
        q: 'Can a med spa advertise Botox and fillers by name?',
        a: "Carefully. Botox is a registered trademark and a prescription drug, so the rules are stricter than for a facial. Google requires certification before you can advertise prescription drug keywords in the U.S. The FDA has sent warning letters to med spas over misleading claims about the drugs they offer. Never call an off-label use “FDA-approved”, and ask your attorney or your medical director how your state's rules apply to brand names. We build campaigns around the treatments you want to grow, and compliance rules are part of every review.",
      },
      {
        q: 'When should we remind clients to rebook neurotoxin?',
        a: "Around three months after the treatment. The FDA label for Botox Cosmetic puts results for frown lines at about three to four months and says not to treat more often than every three months, so a reminder at about twelve weeks lands at the right time. Other brands and other treatments follow their own timing. We set up touch-up recall timed to each treatment, so rebooking doesn't rely on clients remembering.",
      },
      {
        q: 'Should a med spa sell treatments on Groupon or deal sites?',
        a: "Think twice. The American Med Spa Association warns that deal-site vouchers can count as fee-splitting in states where a physician must own the practice, because the site takes a cut of a medical fee. Deals also tend to bring in one-time bargain hunters rather than clients who come back. We don't run discount specials. We would rather fill the calendar by answering every inquiry fast and bringing past clients back when they're due.",
      },
    ],
  },
];

export const SPECIALTY_LINKS = SPECIALTIES.map(({ slug, name }) => ({ slug, name }));

export { industryHref } from './industry-href';
