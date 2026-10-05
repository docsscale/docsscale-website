// The homepage hero graphic: five example patients, each showing a different
// situation the system handles, four steps each. Edit the wording here.
// Rules (owner, Oct 2026): examples only, no statistics; first names that are
// not clients or team members; plain language, no automation jargon; never
// name the software behind it.
// Keep every title and detail short: each sits on one line at phone width, and
// the tile must not change height between examples.
import type { STAGE_COLORS } from '@/styles/tokens';

export type JourneyStep = {
  stage: keyof typeof STAGE_COLORS;
  title: string;
  detail: string;
  time: string;
  /** An automated message: shows a brief "Sending…" before it lands. */
  sent?: boolean;
};
export type JourneyPatient = { name: string; situation: string; steps: readonly JourneyStep[] };

export const STAGE_LABELS = {
  attract: 'Attract',
  capture: 'Capture',
  convert: 'Convert',
  retain: 'Retain',
} as const;

export const HERO_JOURNEY = {
  eyebrow: 'One patient, start to finish',
  example: 'Example',
  sending: 'Sending',
  waiting: 'Up next',
  caption: 'Every step runs on its own. Times vary by clinic.',
  /** Read by screen readers instead of the moving graphic. */
  description:
    'Example patient journeys. Maya taps your ad at 9:41 PM, gets an automatic reply, is booked for Thursday 9:30 with an intake form sent, shows up and is asked for a review. Other examples: a missed call texted back in 31 seconds, a follow-up for someone who did not book right away, a missed appointment recovered and rebooked, and a past patient invited back.',
  patients: [
    {
      name: 'Maya',
      situation: 'New patient, after hours',
      steps: [
        { stage: 'attract', title: 'Tapped your ad', detail: 'On her phone, after closing', time: '9:41 PM' },
        {
          stage: 'convert',
          title: 'Replied automatically',
          detail: 'Offered Thu 9:30',
          time: '9:43 PM',
          sent: true,
        },
        { stage: 'convert', title: 'Booked Thu 9:30', detail: 'Intake form sent', time: '9:45 PM' },
        { stage: 'retain', title: 'Showed up', detail: 'Review requested', time: 'Thu 9:30 AM' },
      ],
    },
    {
      name: 'Leo',
      situation: 'Called during lunch',
      steps: [
        { stage: 'capture', title: 'Called, no answer', detail: 'Front desk was at lunch', time: '12:14 PM' },
        {
          stage: 'convert',
          title: 'Texted back in 31 sec',
          detail: 'Asked how to help',
          time: '12:14 PM',
          sent: true,
        },
        { stage: 'convert', title: 'Booked Fri 8:00', detail: 'Insurance info collected', time: '12:20 PM' },
        {
          stage: 'convert',
          title: 'Reminder confirmed',
          detail: 'He replied yes',
          time: 'Thu 5:00 PM',
          sent: true,
        },
      ],
    },
    {
      name: 'Nina',
      situation: 'Not ready to book',
      steps: [
        { stage: 'capture', title: 'Asked about pricing', detail: "Didn't book yet", time: 'Mon 3:20 PM' },
        {
          stage: 'convert',
          title: 'Follow-up sent',
          detail: 'Day 2, a friendly check-in',
          time: 'Tue 10:00 AM',
          sent: true,
        },
        {
          stage: 'convert',
          title: 'Call reminder for you',
          detail: 'Front desk follows up',
          time: 'Wed 9:00 AM',
        },
        {
          stage: 'convert',
          title: 'Booked Thu 11:15',
          detail: 'Added to your schedule',
          time: 'Wed 9:40 AM',
        },
      ],
    },
    {
      name: 'Ben',
      situation: 'Missed his appointment',
      steps: [
        { stage: 'convert', title: 'Missed his visit', detail: 'No call, no show', time: 'Tue 10:00 AM' },
        {
          stage: 'retain',
          title: 'Recovery message sent',
          detail: 'Offered new times',
          time: 'Tue 10:30 AM',
          sent: true,
        },
        { stage: 'retain', title: 'Rebooked next Tue', detail: 'Reminder set', time: 'Tue 1:15 PM' },
        { stage: 'retain', title: 'Showed up', detail: 'Back on schedule', time: 'Next Tue' },
      ],
    },
    {
      name: 'Ruth',
      situation: 'Past patient',
      steps: [
        {
          stage: 'retain',
          title: 'Last visit 8 months ago',
          detail: 'Overdue for a check-up',
          time: '8 months',
        },
        {
          stage: 'retain',
          title: 'Recall message sent',
          detail: "In your clinic's name",
          time: 'Mon 9:00 AM',
          sent: true,
        },
        {
          stage: 'retain',
          title: 'Rebooked Thu 2:30',
          detail: 'Added to your schedule',
          time: 'Mon 9:25 AM',
        },
        {
          stage: 'retain',
          title: 'Treatment plan follow-up',
          detail: 'Sent after her visit',
          time: 'Fri 10:00 AM',
          sent: true,
        },
      ],
    },
  ],
} as const satisfies {
  patients: readonly JourneyPatient[];
  [key: string]: unknown;
};
