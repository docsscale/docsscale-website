import { SOCIAL_LINKS } from '@/content/site';

// The drawings live in one shared file (public/brand/social-icons.svg), shown as
// lazy images: drawn inline they added to every page's HTML, and fetched as an
// SVG sprite they competed with the page's own files while it loaded, which
// pushed /services/patient-reactivation/ over the performance budget. A lazy
// image is fetched only when the footer comes near the screen.
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
            style={{ display: 'flex', padding: 10 }}
          >
            <img src={`/brand/social-icons.svg#${link.key}`} alt="" width={20} height={20} loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  );
}
