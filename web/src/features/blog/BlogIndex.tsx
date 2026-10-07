// Template for the blog index (/blog/): the newest post large, then the rest.
import Link from 'next/link';
import type { BlogPost } from '@/content/blog-sample';
import { Placeholder } from '@/components/ui/Placeholder';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { eyebrow } from './BlogPost';
import { PostCard } from './PostCard';

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;
  const accent = STAGE_COLORS[featured.stage];
  const categories = [...new Set(posts.map((post) => post.category))];
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
            Sample heading for the <span className="serif">blog</span>
          </h1>
          <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5, color: T.body, maxWidth: 640 }}>
            Sample introduction. One or two sentences on what clinic owners will find here.
          </p>
        </div>
      </div>

      <div
        data-screen-label="Posts"
        style={{ background: T.band, padding: 'clamp(40px,5vw,72px) 0 clamp(56px,7vw,96px)' }}
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <article
            className="post-featured post-card"
            style={{
              background: T.surface,
              border: `1px solid ${T.hairline}`,
              borderRadius: 28,
              overflow: 'hidden',
            }}
          >
            <Placeholder
              placeholder="Sample image (16:9)"
              radius={0}
              style={{ aspectRatio: '16 / 9', minHeight: 220, height: 'auto' }}
            />
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
                {featured.category}
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
                {`${featured.published} · ${featured.minutes} min read`}
              </span>
            </div>
          </article>

          <nav aria-label="Categories" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['All posts', ...categories].map((name, i) => (
              <span
                key={name}
                style={{
                  padding: '9px 16px',
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  border: `1px solid ${i ? T.hairline : T.ink}`,
                  background: i ? T.surface : T.ink,
                  color: i ? T.ink : T.bg,
                }}
              >
                {name}
              </span>
            ))}
          </nav>

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
