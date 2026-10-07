// Template for the blog index (/blog/): the newest post large, then the rest
// beside the offers panel.
import Link from 'next/link';
import type { BlogIndexCopy } from '@/content/blog';
import { STAGE_COLORS, T } from '@/styles/tokens';
import { eyebrow } from './BlogPost';
import { OffersPanel } from './OffersPanel';
import { Picture } from './Picture';
import { PostCard } from './PostCard';
import type { Offer } from '@/content/offers';
import type { Post } from './posts';

const pill = { ...eyebrow, fontSize: 11, padding: '6px 12px', borderRadius: 999 } as const;

export function BlogIndex({ posts, offers, copy }: { posts: Post[]; offers: Offer[]; copy: BlogIndexCopy }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;
  const accent = STAGE_COLORS[featured.category?.stage ?? 'attract'];
  return (
    <>
      {/* Heading, on the brand's teal tint; the newest post overlaps its lower edge. */}
      <div
        data-screen-label="Hero"
        style={{ background: T.tealTintBg, paddingBottom: 'clamp(120px,14vw,230px)' }}
      >
        <div
          className="container"
          style={{
            maxWidth: 1240,
            padding: 'clamp(32px,5vw,76px) clamp(20px,4vw,48px) clamp(28px,4vw,52px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <span style={{ ...eyebrow, fontSize: 13, color: T.teal }}>Blog</span>
          <h1
            style={{
              margin: 0,
              fontWeight: 800,
              fontSize: 'clamp(38px,6vw,76px)',
              lineHeight: 1,
              letterSpacing: '-.045em',
              maxWidth: 860,
              textWrap: 'balance',
            }}
          >
            {copy.heading}
          </h1>
          {copy.intro && (
            <p style={{ margin: 0, fontSize: 19, lineHeight: 1.55, color: '#33514F', maxWidth: 620 }}>
              {copy.intro}
            </p>
          )}
        </div>
      </div>

      <div className="container post-overlap" style={{ maxWidth: 1240 }}>
        <article
          className="post-featured post-card"
          style={{
            background: T.surface,
            border: `1px solid ${T.hairline}`,
            borderRadius: 'clamp(20px,2.4vw,28px)',
            overflow: 'hidden',
            boxShadow: '0 24px 48px -28px rgba(15,95,99,.5)',
          }}
        >
          {featured.cover ? (
            <Picture
              picture={featured.cover}
              decorative
              priority
              sizes="(max-width: 860px) calc(100vw - 40px), 620px"
              style={{
                flex: '1.2 1 380px',
                minHeight: 280,
                width: 0,
                height: 'auto',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div aria-hidden="true" style={{ flex: '1.2 1 380px', minHeight: 280, background: accent.bg }} />
          )}
          <div
            style={{
              flex: '1 1 340px',
              padding: 'clamp(24px,3.4vw,48px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              justifyContent: 'center',
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ ...pill, background: T.teal, color: '#fff' }}>Newest</span>
              {featured.category && (
                <span style={{ ...pill, background: accent.bg, color: accent.fg }}>
                  {featured.category.name}
                </span>
              )}
            </div>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(26px,3vw,40px)',
                lineHeight: 1.08,
                letterSpacing: '-.04em',
              }}
            >
              <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
            </h2>
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.55, color: T.body }}>{featured.summary}</p>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.caption }}>
              {[featured.author?.name, featured.published, `${featured.minutes} min read`]
                .filter(Boolean)
                .join(' · ')}
            </span>
          </div>
        </article>
      </div>

      <div
        data-screen-label="Posts"
        className="container post-columns"
        style={{ maxWidth: 1240, padding: 'clamp(44px,6vw,80px) clamp(20px,4vw,48px) clamp(48px,6vw,88px)' }}
      >
        <div className="post-main post-cards">
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} level="h2" />
          ))}
        </div>
        <OffersPanel offers={offers} />
      </div>
    </>
  );
}
