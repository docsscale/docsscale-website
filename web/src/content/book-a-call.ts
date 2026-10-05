// Copy for the /book-a-call/ page (owner-approved, 4 Oct 2026). The headline and
// eyebrow stay as they were; the form lives in features/lead-form/BookCallForm.tsx.
export const BOOK_A_CALL = {
  eyebrow: 'Book a strategy call',
  headline: 'Thirty minutes. Your numbers. ',
  headlineAccent: 'A plan either way.',
  subheadline:
    "A working session with a DocsScale strategist, not a sales pitch. We look at how patients find you, where they slip away, and what to fix first. If we're not the right fit, we'll tell you who is.",
  coverHeading: "What we'll cover",
  cover: [
    {
      title: 'Where your patients come from today',
      body: 'Referrals, search, ads, walk-ins. Rough numbers are fine.',
    },
    {
      title: 'Where leads are slipping away',
      body: 'Missed calls, slow replies, after-hours inquiries, and no-shows.',
    },
    {
      title: 'What a booked appointment really costs you',
      body: 'Your current spend, measured against what actually lands in the chair.',
    },
    {
      title: 'The one service line to grow first',
      body: 'The treatment with the best return for your clinic right now.',
    },
    {
      title: 'A realistic 90-day plan',
      body: 'What to do first, what it takes, and what results to expect.',
    },
    { title: 'A straight answer on fit', body: "Whether we're the right team for you, and if not, who is." },
  ],
  reassurance: 'Free. No pitch deck. No pressure. You keep the plan whether we work together or not.',
} as const;
