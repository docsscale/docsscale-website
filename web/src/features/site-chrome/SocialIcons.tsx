import { SOCIAL_LINKS } from '@/content/site';

// The drawings live in one shared file (public/brand/social-icons.svg) rather than
// inline: written into every page they pushed the HTML of /blog/ past a network
// round trip and slowed its first paint in the performance budget.
// One-colour marks in the footer's text colour, so they sit quietly beside the links.
export function SocialIcons() {
  return (
    <ul style={{ display: 'flex', gap: 4, margin: '4px 0 0 -8px', padding: 0, listStyle: 'none' }}>
      {SOCIAL_LINKS.map((link) => (
        <li key={link.key}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`DocsScale on ${link.label}`}
            style={{ display: 'flex', padding: 10, color: 'rgba(250,249,246,.8)' }}
          >
            <svg width="20" height="20" aria-hidden="true">
              <use href={`/brand/social-icons.svg#${link.key}`} />
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
