// Team card image: the person's photo when `photo` is set in content/about.ts,
// otherwise their initials on one of the site's four stage colour pairs
// (peach, teal tint, lavender, sage), rotating by position.
import type { TeamMember } from '@/content/about';
import { STAGE_COLORS } from '@/styles/tokens';

const PALETTE = Object.values(STAGE_COLORS);

/** "Abdul Samad" → "AS", "Mohsin" → "M". */
export const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('');

export function TeamPhoto({ member, index }: { member: TeamMember; index: number }) {
  if (member.photo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export; photos are pre-sized
      <img
        src={member.photo}
        alt={member.name}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    );
  }
  const color = PALETTE[index % PALETTE.length]!;
  return (
    <div
      aria-hidden="true"
      style={{
        width: '100%',
        height: '100%',
        background: color.bg,
        color: color.fg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 72,
        letterSpacing: '-.04em',
        lineHeight: 1,
      }}
    >
      {initials(member.name)}
    </div>
  );
}
