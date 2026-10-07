// Template for a blog post (/blog/<slug>/). Server Component: no JavaScript of
// its own, so the page stays light. The table of contents is plain links.
import Link from 'next/link';
import React, { type ReactNode } from 'react';
import Markdoc from '@markdoc/markdoc';
import { OffersPanel } from './OffersPanel';
import type { Offer, Post } from './posts';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { PostCard } from './PostCard';

export const eyebrow = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
} as const;
const card = { background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 28 } as const;
const prose = { margin: 0, fontSize: 18, lineHeight: 1.75, color: '#3B3A36' } as const;
const h2 = {
  margin: '26px 0 0',
  fontWeight: 800,
  fontSize: 'clamp(24px,2.6vw,32px)',
  lineHeight: 1.15,
  letterSpacing: '-.03em',
  scrollMarginTop: 96,
} as const;

const CTAS = {
  call: {
    heading: 'Want this done for your clinic?',
    text: 'Thirty minutes with your numbers. Free, and you leave with a plan either way.',
    label: 'Book a strategy call',
    href: '/book-a-call',
  },
  'free-system': {
    heading: 'Start with the Free System',
    text: 'The follow-up system we set up for clinics, free.',
    label: 'Get the Free System',
    href: '/free-system',
  },
} as const;

function Toc({ post }: { post: Post }) {
  return (
    <ol
      style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}
    >
      {post.headings.map((h) => (
        <li key={h.id} style={{ fontSize: 14, lineHeight: 1.4, color: T.body }}>
          <a href={`#${h.id}`}>{h.text}</a>
        </li>
      ))}
      {post.faqs.length > 0 && (
        <li style={{ fontSize: 14, lineHeight: 1.4, color: T.body }}>
          <a href="#questions">Common questions</a>
        </li>
      )}
    </ol>
  );
}

// How each piece of a post's body (Markdoc) is drawn. Editors choose the piece;
// the look is fixed here.
type Kids = { children?: ReactNode };
const listStyle = { ...prose, paddingLeft: 22, display: 'flex', flexDirection: 'column', gap: 8 } as const;
const components = {
  Paragraph: ({ children }: Kids) => <p style={prose}>{children}</p>,
  Heading: ({ level, id, children }: Kids & { level: number; id?: string }) =>
    level <= 2 ? (
      <h2 id={id} style={h2}>
        {children}
      </h2>
    ) : (
      <h3 style={{ margin: '8px 0 0', fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>
        {children}
      </h3>
    ),
  List: ({ ordered, children }: Kids & { ordered?: boolean }) =>
    ordered ? <ol style={listStyle}>{children}</ol> : <ul style={listStyle}>{children}</ul>,
  Blockquote: ({ children }: Kids) => (
    <blockquote
      className="serif post-quote"
      style={{
        margin: '8px 0',
        padding: 'clamp(22px,3vw,32px)',
        background: T.peachBg,
        borderRadius: 24,
        fontSize: 'clamp(24px,3vw,34px)',
        lineHeight: 1.25,
        color: '#3F2410',
      }}
    >
      {children}
    </blockquote>
  ),
  Table: ({ children }: Kids) => (
    <div className="post-table" style={{ ...card, borderRadius: 20 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15, minWidth: 480 }}>
        {children}
      </table>
    </div>
  ),
  Th: ({ children }: Kids) => (
    <th scope="col" style={{ textAlign: 'left', padding: '14px 18px', fontWeight: 700, background: T.band }}>
      {children}
    </th>
  ),
  Td: ({ children }: Kids) => (
    <td style={{ padding: '14px 18px', borderTop: `1px solid ${T.hairline}`, color: T.body }}>{children}</td>
  ),
  Cta: ({ kind }: { kind: string }) => {
    const cta = CTAS[kind === 'free-system' ? 'free-system' : 'call'];
    return (
      <aside
        style={{
          ...card,
          margin: '8px 0',
          padding: 'clamp(20px,3vw,28px)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 18,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: 420 }}>
          <strong style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.02em' }}>{cta.heading}</strong>
          <span style={{ fontSize: 15, lineHeight: 1.5, color: T.body }}>{cta.text}</span>
        </div>
        <Link
          data-lift="1"
          href={cta.href}
          style={{
            background: T.teal,
            color: '#fff',
            padding: '14px 22px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {cta.label}
        </Link>
      </aside>
    );
  },
};

export function BlogPost({ post, related, offers }: { post: Post; related: Post[]; offers: Offer[] }) {
  const accent = STAGE_COLORS[post.category?.stage ?? 'capture'];
  const author = post.author;
  const initials = (author?.name ?? '')
    .split(' ')
    .map((word) => word[0])
    .join('');
  const meta = [post.published, post.updated && `Updated ${post.updated}`, `${post.minutes} min read`];
  return (
    <>
      {/* Title, on the brand's teal tint; the cover photo overlaps its lower edge. */}
      <div
        data-screen-label="Hero"
        style={{ background: T.tealTintBg, paddingBottom: post.cover ? 'clamp(110px,13vw,210px)' : 0 }}
      >
        <div
          className="container"
          style={{
            maxWidth: 1000,
            padding: 'clamp(32px,5vw,76px) clamp(20px,4vw,48px) clamp(28px,4vw,48px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
          }}
        >
          <nav
            aria-label="Breadcrumb"
            style={{
              ...eyebrow,
              fontSize: 13,
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Link href="/blog" style={{ textDecoration: 'none', padding: '6px 0' }}>
              Blog
            </Link>
            {post.category && (
              <>
                <span aria-hidden="true" style={{ color: '#8FB5B4' }}>
                  /
                </span>
                <span
                  style={{
                    fontSize: 12,
                    padding: '6px 12px',
                    borderRadius: 999,
                    background: accent.bg === T.tealTintBg ? T.surface : accent.bg,
                    color: accent.fg,
                  }}
                >
                  {post.category.name}
                </span>
              </>
            )}
          </nav>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(34px,5.2vw,64px)',
              lineHeight: 1.04,
              letterSpacing: '-.04em',
              textWrap: 'balance',
            }}
          >
            {post.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 'clamp(18px,1.6vw,21px)',
              lineHeight: 1.55,
              color: '#33514F',
              maxWidth: 760,
            }}
          >
            {post.summary}
          </p>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', paddingTop: 4 }}>
            {author && (
              <span
                aria-hidden="true"
                style={{
                  flex: '0 0 auto',
                  width: 44,
                  height: 44,
                  borderRadius: 999,
                  background: T.surface,
                  color: T.teal,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                {initials}
              </span>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {author && (
                <a
                  href="#author"
                  style={{ fontSize: 15, fontWeight: 700, color: T.ink, textDecoration: 'none' }}
                >
                  {author.name}
                </a>
              )}
              <span style={{ fontSize: 13, color: '#33514F' }}>{meta.filter(Boolean).join(' · ')}</span>
            </div>
          </div>
        </div>
      </div>

      {post.cover && (
        <div className="container post-overlap" style={{ maxWidth: 1240 }}>
          <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static export; fixed-ratio box, no layout shift */}
            <img
              src={post.cover.src}
              alt={post.cover.alt}
              fetchPriority="high"
              style={{
                width: '100%',
                aspectRatio: '16 / 8',
                objectFit: 'cover',
                display: 'block',
                borderRadius: 'clamp(18px,2.4vw,28px)',
                background: T.surface,
                boxShadow: '0 24px 48px -28px rgba(15,95,99,.5)',
              }}
            />
            {post.cover.caption && (
              <figcaption style={{ fontSize: 13, color: T.caption }}>{post.cover.caption}</figcaption>
            )}
          </figure>
        </div>
      )}

      <div
        data-screen-label="Content"
        className="container post-columns"
        style={{ maxWidth: 1240, padding: 'clamp(36px,5vw,64px) clamp(20px,4vw,48px) clamp(48px,6vw,88px)' }}
      >
        <article
          className="post-body post-main"
          style={{ maxWidth: 760, display: 'flex', flexDirection: 'column', gap: 22 }}
        >
          {post.takeaways.length > 0 && (
            <div
              style={{
                ...card,
                borderRadius: 20,
                borderTop: `4px solid ${T.teal}`,
                padding: 'clamp(20px,3vw,28px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <span style={{ ...eyebrow, color: T.teal }}>In short</span>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  fontSize: 17,
                  lineHeight: 1.55,
                  fontWeight: 600,
                  color: T.ink,
                }}
              >
                {post.takeaways.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Long posts on a phone: the side panel sits under the article there, so
              the list of sections is offered here, closed until tapped. */}
          {post.headings.length > 0 && (
            <details
              className="post-toc post-toc-inline"
              style={{ ...card, borderRadius: 20, padding: '14px 18px' }}
            >
              <summary style={{ fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>On this page</summary>
              <div style={{ paddingTop: 14 }}>
                <Toc post={post} />
              </div>
            </details>
          )}

          {Markdoc.renderers.react(post.body, React, { components })}

          {post.faqs.length > 0 && (
            <>
              <h2 id="questions" style={h2}>
                Common questions
              </h2>
              <div style={{ borderTop: `1px solid ${T.hairline}` }}>
                {post.faqs.map((faq, i) => (
                  <details key={i} style={{ padding: '18px 0', borderBottom: `1px solid ${T.hairline}` }}>
                    <summary style={{ fontWeight: 700, fontSize: 18, cursor: 'pointer' }}>
                      {faq.question}
                    </summary>
                    <p style={{ ...prose, fontSize: 17, paddingTop: 10 }}>{faq.answer}</p>
                  </details>
                ))}
              </div>
            </>
          )}

          {author && (
            <div
              id="author"
              style={{
                display: 'flex',
                gap: 18,
                alignItems: 'flex-start',
                marginTop: 30,
                paddingTop: 30,
                borderTop: `1px solid ${T.hairline}`,
                scrollMarginTop: 96,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flex: '0 0 auto',
                  width: 72,
                  height: 72,
                  borderRadius: 999,
                  background: accent.bg,
                  color: accent.fg,
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 20,
                }}
              >
                {initials}
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ ...eyebrow, color: T.caption }}>Written by</span>
                <strong style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-.02em' }}>
                  {author.name}
                </strong>
                <span style={{ fontSize: 14, fontWeight: 600, color: T.caption }}>{author.role}</span>
                <p style={{ margin: '4px 0 0', fontSize: 16, lineHeight: 1.6, color: T.body }}>
                  {author.bio}
                </p>
                {post.reviewed && (
                  <span style={{ fontSize: 13, color: T.caption }}>{`Last reviewed ${post.reviewed}`}</span>
                )}
              </div>
            </div>
          )}
        </article>

        <OffersPanel offers={offers}>
          {post.headings.length > 0 && (
            <nav
              aria-label="On this page"
              className="post-toc post-toc-side"
              style={{
                ...card,
                borderRadius: 20,
                padding: 22,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <span style={{ ...eyebrow, color: T.caption }}>On this page</span>
              <Toc post={post} />
            </nav>
          )}
        </OffersPanel>
      </div>

      {related.length > 0 && (
        <div data-screen-label="Related" style={{ background: T.band, padding: 'clamp(40px,5vw,72px) 0' }}>
          <div
            className="container"
            style={{ maxWidth: 1240, display: 'flex', flexDirection: 'column', gap: 26 }}
          >
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(24px,2.6vw,32px)',
                letterSpacing: '-.03em',
              }}
            >
              Keep reading
            </h2>
            <div className="post-cards">
              {related.map((item) => (
                <PostCard key={item.slug} post={item} level="h3" />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
