// The cards beside every post and the blog list: DocsScale's own offers, never
// outside ads. Kept here, not in the editing screen (owner's decision, 7 Oct
// 2026): the editing screen is for posts and SEO only, and a new offer or
// funnel is set up by the developer when the owner asks. Shown in this order.
import type { Stage } from '@/styles/tokens';

export type Offer = {
  title: string;
  /** Small label above the title. */
  badge?: string;
  /** A big number. Only a real, proven figure, for example from a case study. */
  figure?: string;
  text: string;
  image?: { src: string; alt: string };
  buttonLabel: string;
  link: string;
  /** The colour pair of a stage; "capture" is the solid teal card. */
  colour: Stage;
};

export const OFFERS: Offer[] = [
  {
    title: 'The Free System',
    badge: 'Free',
    text: '6 pre-built funnels and 17 done-for-you automations. No credit card. No trial. No catch.',
    image: {
      src: '/free-system/images/funnel-application-800.webp',
      alt: 'The clinic application page from the Free System',
    },
    buttonLabel: 'Get the Free System',
    link: '/free-system/',
    colour: 'attract',
  },
  {
    title: 'Book a strategy call',
    badge: '30 minutes',
    text: 'Thirty minutes with your numbers. Free, and you leave with a plan either way.',
    buttonLabel: 'Book a call',
    link: '/book-a-call/',
    colour: 'capture',
  },
  {
    // The dental case study on /results/.
    title: 'New patients booked in six months',
    badge: 'Client result',
    figure: '184',
    text: 'A dental clinic in Dallas. 91% of them showed.',
    buttonLabel: 'See the results',
    link: '/results/',
    colour: 'convert',
  },
];
