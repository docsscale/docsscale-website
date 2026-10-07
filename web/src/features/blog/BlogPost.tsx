// Template for a blog post (/blog/<slug>/). Server Component: no JavaScript of
// its own, so the page stays light. The table of contents is plain links.
import Link from 'next/link';
import React, { type ReactNode } from 'react';
import Markdoc from '@markdoc/markdoc';
import type { Post } from './posts';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { PostCard } from './PostCard';

export const eyebrow = {
  fontSize: 12,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '.08em',
} as const;
const card = { background: T.surface, border: `1px solid ${T.hairline}`, borderRadius: 28 } as const;
const prose = { margin: 0, fontSize: 17, lineHeight: 1.7, color: T.body } as const;
const h2 = {
  margin: '20px 0 0',
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
        padding: '4px 0 4px 20px',
        borderLeft: `3px solid ${T.teal}`,
        fontSize: 'clamp(22px,2.4vw,28px)',
        lineHeight: 1.3,
        color: T.ink,
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

export function BlogPost({ post, related }: { post: Post; related: Post[] }) {
  const accent = STAGE_COLORS[post.category?.stage ?? 'capture'];
  const author = post.author;
  const initials = (author?.name ?? '')
    .split(' ')
    .map((word) => word[0])
    .join('');
  return (
    <>
      <div data-screen-label="Hero" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(36px,5vw,56px)' }}>
        <div
          className="container"
          style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 920 }}
        >
          <nav
            aria-label="Breadcrumb"
            style={{ fontSize: 13, color: T.caption, display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog">Blog</Link>
          </nav>
          <span
            style={{
              ...eyebrow,
              alignSelf: 'flex-start',
              padding: '7px 12px',
              borderRadius: 999,
              background: accent.bg,
              color: accent.fg,
            }}
          >
            {post.category?.name ?? 'Blog'}
          </span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(34px,5vw,60px)',
              lineHeight: 1.02,
              letterSpacing: '-.04em',
              textWrap: 'balance',
            }}
          >
            {post.title}
          </h1>
          <p style={{ margin: 0, fontSize: 'clamp(17px,1.6vw,20px)', lineHeight: 1.5, color: T.body }}>
            {post.summary}
          </p>
          <div
            style={{
              display: 'flex',
              gap: '6px 18px',
              flexWrap: 'wrap',
              fontSize: 13,
              fontWeight: 600,
              color: T.caption,
            }}
          >
            {author && (
              <span>
                {'By '}
                <a href="#author" style={{ color: T.ink }}>
                  {author.name}
                </a>
              </span>
            )}
            {post.published && <span>{`Published ${post.published}`}</span>}
            {post.updated && <span>{`Updated ${post.updated}`}</span>}
            <span>{`${post.minutes} min read`}</span>
          </div>
        </div>
      </div>

      <div
        data-screen-label="Content"
        style={{ background: T.band, padding: 'clamp(40px,5vw,72px) 0 clamp(56px,7vw,96px)' }}
      >
        <div className="container post-layout">
          <nav aria-label="On this page" className="post-toc post-toc-side">
            <span style={{ ...eyebrow, color: T.caption, display: 'block', marginBottom: 14 }}>
              On this page
            </span>
            <Toc post={post} />
          </nav>

          <article className="post-body" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {post.takeaways.length > 0 && (
              <div
                style={{
                  ...card,
                  padding: 'clamp(20px,3vw,28px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <span style={{ ...eyebrow, color: accent.fg }}>In short</span>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: 20,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 8,
                    fontSize: 16,
                    lineHeight: 1.55,
                    color: T.ink,
                  }}
                >
                  {post.takeaways.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            <details
              className="post-toc post-toc-top"
              style={{ ...card, borderRadius: 20, padding: '14px 18px' }}
            >
              <summary style={{ fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>On this page</summary>
              <div style={{ paddingTop: 14 }}>
                <Toc post={post} />
              </div>
            </details>

            {Markdoc.renderers.react(post.body, React, { components })}

            {post.faqs.length > 0 && (
              <>
                <h2 id="questions" style={h2}>
                  Common questions
                </h2>
                <div style={{ ...card, borderRadius: 20, padding: '4px 20px' }}>
                  {post.faqs.map((faq, i) => (
                    <details
                      key={i}
                      style={{ padding: '16px 0', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}
                    >
                      <summary style={{ fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                        {faq.question}
                      </summary>
                      <p style={{ ...prose, fontSize: 16, paddingTop: 10 }}>{faq.answer}</p>
                    </details>
                  ))}
                </div>
              </>
            )}

            {author && (
              <div
                id="author"
                style={{
                  ...card,
                  marginTop: 20,
                  padding: 'clamp(20px,3vw,28px)',
                  display: 'flex',
                  gap: 18,
                  alignItems: 'flex-start',
                  scrollMarginTop: 96,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    flex: '0 0 auto',
                    width: 56,
                    height: 56,
                    borderRadius: 999,
                    background: accent.bg,
                    color: accent.fg,
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 800,
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
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: T.body }}>{author.bio}</p>
                  {post.reviewed && (
                    <span style={{ fontSize: 13, color: T.caption }}>{`Last reviewed ${post.reviewed}`}</span>
                  )}
                </div>
              </div>
            )}
          </article>
        </div>
      </div>

      {related.length > 0 && (
        <div data-screen-label="Related" style={{ padding: 'clamp(48px,6vw,80px) 0' }}>
          <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(26px,3vw,40px)',
                lineHeight: 1,
                letterSpacing: '-.04em',
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
