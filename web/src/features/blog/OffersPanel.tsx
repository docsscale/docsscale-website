// The cards beside a post and the blog list: DocsScale's own offers, edited in
// the CMS (content/offers). Never outside ads.
import Link from 'next/link';
import { STAGE_COLORS, T } from '@/styles/tokens';
import type { Offer } from './posts';

const badge = {
  alignSelf: 'flex-start',
  padding: '6px 12px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: '.08em',
  textTransform: 'uppercase',
} as const;

// Text colours darker than the stage's own, for body text on its tint (WCAG AA).
const DEEP = { attract: '#3F2410', capture: '#FFFFFF', convert: '#2D2450', retain: '#12402C' } as const;

export function OfferCard({ offer }: { offer: Offer }) {
  const solid = offer.colour === 'capture';
  const tint = STAGE_COLORS[offer.colour];
  const heading = DEEP[offer.colour];
  const body = solid ? '#CFE8E6' : tint.fg;
  return (
    <div
      style={{
        background: solid ? T.teal : tint.bg,
        color: heading,
        borderRadius: 24,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {offer.badge && (
        <span style={{ ...badge, background: solid ? T.tealTintBg : T.surface, color: tint.fg }}>
          {offer.badge}
        </span>
      )}
      {offer.image && (
        // eslint-disable-next-line @next/next/no-img-element -- static export; fixed-ratio box, no layout shift
        <img
          src={offer.image.src}
          alt={offer.image.alt}
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            aspectRatio: '16 / 10',
            objectFit: 'cover',
            borderRadius: 16,
            display: 'block',
          }}
        />
      )}
      {offer.figure && (
        <span style={{ fontWeight: 800, fontSize: 44, lineHeight: 1, letterSpacing: '-.04em' }}>
          {offer.figure}
        </span>
      )}
      <strong style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.12 }}>
        {offer.title}
      </strong>
      {offer.text && <span style={{ fontSize: 15, lineHeight: 1.5, color: body }}>{offer.text}</span>}
      <Link
        data-lift="1"
        href={offer.link}
        style={{
          background: solid ? T.surface : T.ink,
          color: solid ? T.teal : T.bg,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: 15,
          padding: '15px 20px',
          borderRadius: 999,
          textAlign: 'center',
        }}
      >
        {offer.buttonLabel}
      </Link>
    </div>
  );
}

export function OffersPanel({ offers, children }: { offers: Offer[]; children?: React.ReactNode }) {
  if (!offers.length && !children) return null;
  return (
    <aside aria-label="DocsScale offers" className="post-aside">
      {children}
      {offers.map((offer) => (
        <OfferCard key={offer.slug} offer={offer} />
      ))}
    </aside>
  );
}
