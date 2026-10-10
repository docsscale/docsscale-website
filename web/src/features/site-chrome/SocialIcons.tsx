import { SOCIAL_LINKS } from '@/content/site';

type SocialKey = (typeof SOCIAL_LINKS)[number]['key'];

// Simple one-colour marks drawn in the footer's text colour, so they sit quietly
// beside the links instead of shouting in four brand colours.
const ICONS: Record<SocialKey, React.ReactNode> = {
  facebook: (
    <path
      fill="currentColor"
      d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.8c0-.9.3-1.6 1.6-1.6h1.7V4.3c-.3 0-1.3-.1-2.5-.1-2.5 0-4.1 1.5-4.1 4.2v2.4H7.4V14h2.8v8z"
    />
  ),
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
    </g>
  ),
  linkedin: (
    <g fill="currentColor">
      <circle cx="5.5" cy="5.5" r="2" />
      <rect x="3.75" y="9" width="3.5" height="11.5" />
      <path d="M10 9h3.3v1.6c.5-.9 1.7-1.9 3.6-1.9 3.4 0 4.1 2.2 4.1 5.1v6.7h-3.5v-5.9c0-1.4 0-3.2-2-3.2s-2.2 1.5-2.2 3.1v6H10z" />
    </g>
  ),
  clutch: (
    <g>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        d="M17.6 7.2A7.5 7.5 0 1 0 17.6 16.8"
      />
      <circle cx="12.5" cy="12" r="2.2" fill="currentColor" />
    </g>
  ),
};

export function SocialIcons() {
  return (
    <ul style={{ display: 'flex', gap: 4, margin: '4px 0 0 -8px', padding: 0, listStyle: 'none' }}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`DocsScale on ${link.label} (opens in a new tab)`}
            title={link.label}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              color: 'rgba(250,249,246,.8)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              {ICONS[link.key]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
