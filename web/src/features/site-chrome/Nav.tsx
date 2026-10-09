'use client';

// Sticky top navigation: Services and Industries dropdowns (desktop) and the
// burger menu (below 900px, the breakpoint lives in globals.css under #nav-burger).
//
// The dropdowns follow the disclosure pattern:
// - the trigger is a button (aria-expanded, aria-controls); click or tap toggles;
// - a mouse opens it on hover too, with a short close delay. The panel starts
//   right at the trigger's edge (spacing is padding inside it), so moving down
//   into it never crosses a gap. Touch never uses hover, so a tap can't open
//   and immediately close it;
// - Escape closes it and returns focus to the trigger; it closes when focus
//   leaves it or on a click elsewhere; only one is open at a time.
// The mobile menu locks page scroll, keeps Tab inside it, and closes on Escape
// or navigation.
import Link from 'next/link';
import { type FocusEvent, type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { NAV_LINKS, type NavKey, SERVICE_STAGES, serviceHref } from '@/content/site';
import { industryHref } from '@/content/industry-href';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { BrandLogo } from './BrandLogo';

type Props = {
  active: NavKey;
  specialties: readonly { slug: string; name: string }[];
};
type MenuKey = 'services' | 'industries';

const border = `1px solid ${T.hairline}`;
const burgerBar = { width: 18, height: 2, background: T.ink, display: 'block' } as const;
const HOVER_CLOSE_DELAY = 150;
const pill = {
  color: T.ink,
  fontWeight: 600,
  fontSize: 14,
  padding: '8px 14px',
  borderRadius: 999,
  whiteSpace: 'nowrap',
} as const;
const card = {
  background: T.surface,
  border,
  borderRadius: 16,
  padding: 8,
  boxShadow: '0 8px 24px rgba(26,26,26,.08)',
} as const;
const stageTag = {
  display: 'inline-block',
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.06em',
  textTransform: 'uppercase',
  padding: '4px 9px',
  borderRadius: 999,
  margin: '0 0 6px 6px',
} as const;
const allLink = {
  fontWeight: 700,
  fontSize: 14,
  color: T.teal,
  padding: '6px 8px',
  borderRadius: 10,
} as const;

export function Nav({ active, specialties }: Props) {
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<MenuKey | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const triggerRefs = useRef<Partial<Record<MenuKey, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const openedByHover = useRef(false);

  const closeAll = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  // A click or tap outside the nav closes an open dropdown.
  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [openMenu]);

  // The mobile menu locks page scroll while open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const hoverOpen = (key: MenuKey) => (e: { pointerType: string }) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    if (openMenu !== key) openedByHover.current = true;
    setOpenMenu(key);
  };
  const hoverClose = (e: { pointerType: string }) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), HOVER_CLOSE_DELAY);
  };
  const toggle = (key: MenuKey) => {
    clearTimeout(closeTimer.current);
    // A click on a menu the mouse just opened keeps it open (instead of closing it
    // again); the next click closes it.
    if (openMenu === key && openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    openedByHover.current = false;
    setOpenMenu(openMenu === key ? null : key);
  };
  const onMenuKeyDown = (key: MenuKey) => (e: KeyboardEvent) => {
    if (e.key === 'Escape' && openMenu === key) {
      setOpenMenu(null);
      triggerRefs.current[key]?.focus();
    }
  };
  const onMenuBlur = (key: MenuKey) => (e: FocusEvent<HTMLDivElement>) => {
    if (openMenu === key && !e.currentTarget.contains(e.relatedTarget as Node | null)) setOpenMenu(null);
  };

  // Mobile menu: Escape closes it; Tab and Shift+Tab stay inside the nav.
  const onNavKeyDown = (e: KeyboardEvent) => {
    if (!mobileOpen) return;
    if (e.key === 'Escape') {
      setMobileOpen(false);
      burgerRef.current?.focus();
      return;
    }
    if (e.key !== 'Tab' || !navRef.current) return;
    const focusable = Array.from(
      navRef.current.querySelectorAll<HTMLElement>('#nav-burger, #nav-mobile a, #nav-mobile button'),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  const servicesPanel = (
    <div style={{ ...card, width: 648 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 8px', padding: 6 }}>
        {SERVICE_STAGES.map(({ stage, label, services }) => (
          <div
            key={stage}
            style={
              stage === 'retain'
                ? {
                    gridColumn: '1 / -1',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0 20px',
                    padding: '0 6px 4px',
                  }
                : { padding: '8px 6px 4px', gridRow: stage === 'attract' ? 'span 2' : undefined }
            }
          >
            <span
              style={{
                ...stageTag,
                background: STAGE_COLORS[stage].bg,
                color: STAGE_COLORS[stage].fg,
                ...(stage === 'retain' ? { gridColumn: '1 / -1', justifySelf: 'start' } : {}),
              }}
            >
              {label}
            </span>
            {services.map((service) => (
              <Link
                key={service.name}
                href={serviceHref(stage)}
                onClick={closeAll}
                className="nav-link"
                style={{ display: 'block', padding: '9px 12px', borderRadius: 10 }}
              >
                <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: T.ink }}>
                  {service.name}
                </span>
                <span
                  style={{
                    display: 'block',
                    fontSize: 12.5,
                    fontWeight: 500,
                    color: T.caption,
                    marginTop: 2,
                    lineHeight: 1.35,
                  }}
                >
                  {service.blurb}
                </span>
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div
        style={{
          borderTop: border,
          margin: '6px 8px 0',
          padding: '10px 4px 4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 12.5, color: T.caption }}>
          One system: Attract → Capture → Convert → Retain
        </span>
        <Link href="/services" onClick={closeAll} className="nav-link" style={allLink}>
          All services →
        </Link>
      </div>
    </div>
  );

  const industriesPanel = (
    <div style={{ ...card, width: 260 }}>
      {specialties.map((s) => (
        <Link
          key={s.slug}
          href={industryHref(s.slug)}
          onClick={closeAll}
          className="nav-link"
          style={{
            display: 'block',
            padding: '9px 12px',
            borderRadius: 10,
            color: T.body,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          {s.name}
        </Link>
      ))}
      <div style={{ borderTop: border, margin: '6px 4px 0', paddingTop: 8 }}>
        <Link
          href="/industries"
          onClick={closeAll}
          className="nav-link"
          style={{ ...allLink, display: 'inline-block' }}
        >
          All industries →
        </Link>
      </div>
    </div>
  );

  return (
    <div
      ref={navRef}
      data-screen-label="Nav"
      onKeyDown={onNavKeyDown}
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

        <nav
          id="nav-links"
          aria-label="Main"
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
          {NAV_LINKS.map((link) => {
            if (!('menu' in link)) {
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className="nav-link"
                  aria-current={active === link.key ? 'page' : undefined}
                  style={{ ...pill, background: active === link.key ? T.band : 'transparent' }}
                >
                  {link.label}
                </Link>
              );
            }
            const key = link.key as MenuKey;
            const open = openMenu === key;
            return (
              <div
                key={key}
                style={{ position: 'relative' }}
                onPointerEnter={hoverOpen(key)}
                onPointerLeave={hoverClose}
                onKeyDown={onMenuKeyDown(key)}
                onBlur={onMenuBlur(key)}
              >
                <button
                  type="button"
                  ref={(el) => {
                    triggerRefs.current[key] = el;
                  }}
                  onClick={() => toggle(key)}
                  aria-expanded={open}
                  aria-controls={`nav-menu-${key}`}
                  className="nav-link nav-trigger"
                  style={{
                    ...pill,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    border: 0,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    background: open || active === key ? T.band : 'transparent',
                  }}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 10,
                      display: 'inline-block',
                      transition: 'transform .15s',
                      transform: open ? 'rotate(180deg)' : 'none',
                    }}
                  >
                    ▾
                  </span>
                </button>
                {/* Positioned at 100% with padding-top, not a margin, so there's no hover gap. */}
                <div
                  id={`nav-menu-${key}`}
                  hidden={!open}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    paddingTop: 8,
                    ...(key === 'services' ? { left: '50%', transform: 'translateX(-50%)' } : { left: 0 }),
                  }}
                >
                  {key === 'services' ? servicesPanel : industriesPanel}
                </div>
              </div>
            );
          })}
        </nav>

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
            ref={burgerRef}
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls="nav-mobile"
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
              color: T.ink,
            }}
          >
            {mobileOpen ? (
              <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>
                ✕
              </span>
            ) : (
              <>
                <span style={burgerBar} />
                <span style={burgerBar} />
                <span style={burgerBar} />
              </>
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="nav-mobile"
          style={{
            borderTop: border,
            background: T.bg,
            height: 'calc(100dvh - 72px)',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
          }}
        >
          <div
            className="container"
            style={{
              padding: '8px clamp(20px,4vw,48px) 24px',
              display: 'flex',
              flexDirection: 'column',
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            {NAV_LINKS.map((link) => {
              if (!('menu' in link)) {
                return (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={closeAll}
                    aria-current={active === link.key ? 'page' : undefined}
                    style={{
                      color: T.ink,
                      minHeight: 52,
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: border,
                    }}
                  >
                    {link.label}
                  </Link>
                );
              }
              const key = link.key as MenuKey;
              const expanded = mobileSection === key;
              return (
                <div key={key} style={{ borderBottom: border }}>
                  <button
                    type="button"
                    onClick={() => setMobileSection(expanded ? null : key)}
                    aria-expanded={expanded}
                    aria-controls={`nav-mobile-${key}`}
                    style={{
                      width: '100%',
                      minHeight: 52,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'transparent',
                      border: 0,
                      padding: 0,
                      cursor: 'pointer',
                      font: 'inherit',
                      color: T.ink,
                    }}
                  >
                    {link.label}
                    <span
                      aria-hidden="true"
                      style={{
                        width: 44,
                        height: 44,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: T.caption,
                        fontSize: 14,
                      }}
                    >
                      {expanded ? '▴' : '▾'}
                    </span>
                  </button>
                  <div id={`nav-mobile-${key}`} hidden={!expanded} style={{ padding: '0 0 10px' }}>
                    {key === 'services'
                      ? SERVICE_STAGES.map(({ stage, label, services }) => (
                          <div key={stage}>
                            <div
                              style={{
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: '.06em',
                                textTransform: 'uppercase',
                                color: T.caption,
                                padding: '10px 0 2px 16px',
                              }}
                            >
                              {label}
                            </div>
                            {services.map((service) => (
                              <MobileSubLink key={service.name} href={serviceHref(stage)} onClick={closeAll}>
                                {service.name}
                              </MobileSubLink>
                            ))}
                          </div>
                        ))
                      : specialties.map((s) => (
                          <MobileSubLink key={s.slug} href={industryHref(s.slug)} onClick={closeAll}>
                            {s.name}
                          </MobileSubLink>
                        ))}
                    <MobileSubLink href={link.href} onClick={closeAll} accent>
                      {key === 'services' ? 'All services →' : 'All industries →'}
                    </MobileSubLink>
                  </div>
                </div>
              );
            })}
            <Link
              href="/book-a-call"
              onClick={closeAll}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                height: 52,
                marginTop: 16,
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

function MobileSubLink({
  href,
  onClick,
  accent = false,
  children,
}: {
  href: string;
  onClick: () => void;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        minHeight: 44,
        paddingLeft: 16,
        fontSize: 15,
        fontWeight: accent ? 700 : 600,
        color: accent ? T.teal : T.body,
      }}
    >
      {children}
    </Link>
  );
}
