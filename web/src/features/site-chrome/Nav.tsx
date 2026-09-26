'use client';

// Sticky top navigation. Client component because of the Services dropdown
// (desktop, opens on hover or click) and the burger menu (below 900px, the
// breakpoint lives in globals.css under #nav-burger).
import Link from 'next/link';
import { useState } from 'react';
import { NAV_LINKS, type NavKey } from '@/content/site';
import { T } from '@/styles/tokens';
import { BrandLogo } from './BrandLogo';

type Props = {
  active: NavKey;
  specialties: readonly { slug: string; name: string }[];
};

const border = `1px solid ${T.hairline}`;
const burgerBar = { width: 18, height: 2, background: T.ink, display: 'block' } as const;

export function Nav({ active, specialties }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <div
      data-screen-label="Nav"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(250,249,246,.86)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        color: T.ink,
      }}
    >
      <div
        className="container"
        style={{
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
        }}
      >
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: T.ink }}>
          {/* Same width as the old mark + wordmark, so the centred links stay put. */}
          <BrandLogo variant="dark" width={134.125} />
        </Link>

        <div
          id="nav-links"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: T.surface,
            border,
            borderRadius: 999,
            padding: 4,
          }}
        >
          {NAV_LINKS.map((link) =>
            link.key === 'services' ? (
              <div
                key={link.key}
                style={{ position: 'relative' }}
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link
                    href={link.href}
                    className="nav-link"
                    style={{
                      color: T.ink,
                      fontWeight: 600,
                      fontSize: 14,
                      padding: '8px 4px 8px 14px',
                      borderRadius: 999,
                      background: active === link.key ? T.band : 'transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {link.label}
                  </Link>
                  <button
                    onClick={() => setServicesOpen((open) => !open)}
                    aria-label="Toggle services menu"
                    aria-expanded={servicesOpen}
                    style={{
                      background: 'transparent',
                      border: 0,
                      cursor: 'pointer',
                      padding: '8px 10px 8px 2px',
                      borderRadius: 999,
                      color: T.ink,
                      fontSize: 10,
                    }}
                  >
                    ▾
                  </button>
                </div>
                {servicesOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      minWidth: 220,
                      background: T.surface,
                      border,
                      borderRadius: 16,
                      padding: 8,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      boxShadow: '0 8px 24px rgba(26,26,26,.08)',
                    }}
                  >
                    <Link
                      href="/services"
                      onClick={() => setServicesOpen(false)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 10,
                        color: T.ink,
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                      className="nav-link"
                    >
                      All services
                    </Link>
                    <div style={{ height: 1, background: T.hairline, margin: '4px 8px' }} />
                    {specialties.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        onClick={() => setServicesOpen(false)}
                        style={{
                          padding: '9px 12px',
                          borderRadius: 10,
                          color: T.body,
                          fontWeight: 600,
                          fontSize: 14,
                        }}
                        className="nav-link"
                      >
                        {s.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.key}
                href={link.href}
                className="nav-link"
                style={{
                  color: T.ink,
                  fontWeight: 600,
                  fontSize: 14,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: active === link.key ? T.band : 'transparent',
                  whiteSpace: 'nowrap',
                }}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            id="nav-cta"
            href="/book-a-call"
            className="btn-teal"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: 44,
              padding: '0 20px',
              background: T.teal,
              color: '#FFFFFF',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 14,
              whiteSpace: 'nowrap',
            }}
          >
            Book a call
          </Link>
          <button
            id="nav-burger"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menu"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              background: T.surface,
              border,
              borderRadius: 999,
              cursor: 'pointer',
              flexDirection: 'column',
              gap: 5,
              padding: 0,
            }}
          >
            <span style={burgerBar} />
            <span style={burgerBar} />
            <span style={burgerBar} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div style={{ borderTop: border, background: T.bg }}>
          <div
            className="container"
            style={{
              padding: '16px clamp(20px,4vw,48px) 24px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            {NAV_LINKS.map((link) =>
              link.key === 'services' ? (
                <div
                  key={link.key}
                  style={{ display: 'flex', flexDirection: 'column', borderBottom: border }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      style={{ color: T.ink, padding: '12px 0', flex: 1 }}
                    >
                      {link.label}
                    </Link>
                    <button
                      onClick={() => setMobileServicesOpen((open) => !open)}
                      aria-label="Toggle services submenu"
                      style={{
                        background: 'transparent',
                        border: 0,
                        cursor: 'pointer',
                        padding: 12,
                        fontSize: 14,
                        color: T.caption,
                      }}
                    >
                      {mobileServicesOpen ? '▴' : '▾'}
                    </button>
                  </div>
                  {mobileServicesOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingBottom: 10 }}>
                      {specialties.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          onClick={() => setMobileOpen(false)}
                          style={{ color: T.body, fontSize: 15, fontWeight: 600, padding: '8px 0 8px 16px' }}
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  style={{ color: T.ink, padding: '12px 0', borderBottom: border }}
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href="/book-a-call"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 52,
                marginTop: 12,
                background: T.teal,
                color: '#FFFFFF',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 15,
              }}
            >
              Book a strategy call
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
