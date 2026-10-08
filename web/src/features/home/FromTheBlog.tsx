// Homepage: the newest blog posts, between Results and the FAQ. Shown only when
// at least one post is published; the posts come from /content like the blog's.
import Link from 'next/link';
import { HOME_BLOG } from '@/content/blog';
import { getPosts } from '@/features/blog/posts';
import { STAGE_COLORS, T } from '@/styles/tokens';

export async function FromTheBlog() {
  const posts = (await getPosts()).slice(0, 3);
  if (!posts.length) return null;
  return (
    <div id="blog" data-screen-label="Blog" style={{ padding: 'clamp(64px,8vw,112px) 0' }}>
      <div
        className="container"
        style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(32px,4vw,48px)' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'end',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 760 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '.08em',
                color: T.caption,
              }}
            >
              {HOME_BLOG.eyebrow}
            </span>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(36px,4.6vw,66px)',
                lineHeight: 0.98,
                letterSpacing: '-.045em',
                textWrap: 'balance',
              }}
            >
              {HOME_BLOG.heading}
            </h2>
          </div>
          <Link href="/blog" style={{ fontWeight: 700, fontSize: 15, color: T.ink, padding: '12px 0' }}>
            {HOME_BLOG.allPosts}
          </Link>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))',
            gap: 14,
          }}
        >
          {posts.map((post) => {
            const accent = STAGE_COLORS[post.category?.stage ?? 'capture'];
            return (
              <article
                key={post.slug}
                style={{
                  background: T.surface,
                  border: `1px solid ${T.hairline}`,
                  borderRadius: 28,
                  padding: 'clamp(24px,3vw,36px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {post.category && (
                  <span
                    style={{
                      alignSelf: 'flex-start',
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '.08em',
                      padding: '6px 10px',
                      borderRadius: 999,
                      background: accent.bg,
                      color: accent.fg,
                    }}
                  >
                    {post.category.name}
                  </span>
                )}
                <h3
                  style={{
                    margin: 0,
                    fontWeight: 800,
                    fontSize: 'clamp(22px,2.2vw,28px)',
                    lineHeight: 1.12,
                    letterSpacing: '-.03em',
                    maxWidth: 720,
                  }}
                >
                  <Link href={`/blog/${post.slug}`} style={{ color: T.ink, textDecoration: 'none' }}>
                    {post.title}
                  </Link>
                </h3>
                <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: T.body, maxWidth: 720 }}>
                  {post.summary}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  aria-label={`${HOME_BLOG.read}: ${post.title}`}
                  style={{ marginTop: 'auto', paddingTop: 6, fontWeight: 700, fontSize: 15 }}
                >
                  {HOME_BLOG.read}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
