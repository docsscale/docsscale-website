import Link from 'next/link';
import { CONTACT_LINES, FOOTER_COLUMNS, FOOTER_LEGAL_LINKS, SITE } from '@/content/site';
import { CookieSettingsLink } from '@/features/analytics/CookieSettingsLink';
import { BrandLogo } from './BrandLogo';

// Footer links keep the footer's light text colour instead of the global teal link colour.
const linkStyle = { color: 'rgba(250,249,246,.8)' } as const;
const columnStyle = { display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 } as const;
const headingStyle = {
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
  marginBottom: 4,
} as const;

export function Footer() {
  return (
    <div
      data-screen-label="Footer"
      style={{ background: '#1A1A1A', color: 'rgba(250,249,246,.8)', padding: 'clamp(48px,6vw,80px) 0 32px' }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))',
            gap: '40px 32px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <BrandLogo variant="light" height={30} rowHeight={27} lazy />
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, maxWidth: 300 }}>{SITE.tagline}</p>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading} style={columnStyle}>
              <div style={headingStyle}>{column.heading}</div>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} style={linkStyle}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <div style={columnStyle}>
            <div style={headingStyle}>Contact</div>
            {CONTACT_LINES.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            borderTop: '1px solid rgba(250,249,246,.15)',
            paddingTop: 24,
            fontSize: 13,
          }}
        >
          <span>{SITE.copyright}</span>
          {/* Wraps whole links onto a new line when they don't fit (only happens
              once "Cookie settings" is shown on small screens). */}
          <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: 20, rowGap: 8 }}>
            {FOOTER_LEGAL_LINKS.map((link) => (
              <Link key={link.label} href={link.href} style={linkStyle}>
                {link.label}
              </Link>
            ))}
            <CookieSettingsLink style={linkStyle} />
            <a href="#top" style={linkStyle}>
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
