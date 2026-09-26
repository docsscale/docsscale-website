// About page data.

/**
 * The team, in display order. To add a photo, put the file in
 * public/images/team/ and set `photo: '/images/team/<file>.jpg'`
 * (a portrait crop works best; it's shown 280px tall, cropped to fill).
 */
export type TeamMember = { name: string; role: string; photo?: string };

// The first person is also named under the founder photo at the top of the page.
export const TEAM: TeamMember[] = [
  { name: 'Abdul Samad', role: 'CEO & Co-Founder' },
  { name: 'Ahmed Mustafa', role: 'Co-Founder' },
  { name: 'Mohsin', role: 'Senior Developer' },
  { name: 'Omar', role: 'Marketing Manager' },
  { name: 'Owais', role: 'Automation & CRM Expert' },
  { name: 'Ali', role: 'Automation & CRM Expert' },
];
