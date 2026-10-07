// Template for the blog index (/blog/): the newest post large, then the rest.
import Link from 'next/link';
import type { BlogIndexCopy } from '@/content/blog';
import type { Post } from './posts';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { eyebrow } from './BlogPost';
import { PostCard } from './PostCard';

export function BlogIndex({ posts, copy }: { posts: Post[]; copy: BlogIndexCopy }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;
  const accent = STAGE_COLORS[featured.category?.stage ?? 'capture'];
  return (
    <>
      <div data-screen-label="Hero" style={{ padding: 'clamp(28px,4vw,56px) 0 clamp(36px,5vw,56px)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span style={{ ...eyebrow, color: T.caption }}>Blog</span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(36px,5.4vw,72px)',
              lineHeight: 1,
              letterSpacing: '-.04em',
              maxWidth: 900,
              textWrap: 'balance',
            }}
          >
            {copy.heading}
          </h1>
          {copy.intro && (
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: T.body, maxWidth: 640 }}>
              {copy.intro}
            </p>
          )}
        </div>
      </div>

      <div
        data-screen-label="Posts"
        style={{ background: T.band, padding: 'clamp(40px,5vw,72px) 0 clamp(56px,7vw,96px)' }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <article
            className="post-card"
            style={{
              background: T.surface,
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: 'clamp(24px,3.4vw,44px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                justifyContent: 'center',
              }}
            >
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
                {featured.category?.name ?? 'Blog'}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontWeight: 800,
                  fontSize: 'clamp(26px,3vw,40px)',
                  lineHeight: 1.05,
                  letterSpacing: '-.04em',
                }}
              >
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: T.body }}>{featured.summary}</p>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.caption }}>
                {[featured.published, `${featured.minutes} min read`].filter(Boolean).join(' · ')}
              </span>
            </div>
          </article>

          <div className="post-cards">
            {rest.map((post) => (
              <PostCard key={post.slug} post={post} level="h2" />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
