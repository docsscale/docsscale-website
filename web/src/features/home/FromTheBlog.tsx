// "From the blog" on the home page: the newest posts, so readers and search
// engines reach the blog from the home page (owner, 8 Oct 2026: a home-page
// section and a footer link, no header link). Renders nothing until a post is
// published. On the brand teal so it stands out from the sections around it
// (owner, 8 Oct 2026), with the posts on white cards.
import Link from 'next/link';
import { BLOG_INDEX } from '@/content/blog';
import { PostCard } from '@/features/blog/PostCard';
import { getPosts } from '@/features/blog/posts';
import { T } from '@/styles/tokens';

/** How many posts the section shows. */
const COUNT = 3;

export async function FromTheBlog() {
  const posts = (await getPosts()).slice(0, COUNT);
  if (posts.length === 0) return null;
  return (
    <div
      id="blog"
      data-screen-label="Blog"
      style={{ background: T.teal, padding: 'clamp(64px,8vw,112px) 0' }}
    >
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
                color: T.tealTintBg,
              }}
            >
              From the blog
            </span>
            <h2
              style={{
                margin: 0,
                fontWeight: 800,
                fontSize: 'clamp(32px,4vw,54px)',
                lineHeight: 1,
                letterSpacing: '-.045em',
                textWrap: 'balance',
                color: T.surface,
              }}
            >
              {BLOG_INDEX.heading}
            </h2>
          </div>
          {/* Same shape as the home page's main button, in white on the teal. */}
          <Link
            href="/blog"
            className="btn-light-to-tint"
            data-lift="1"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              height: 56,
              padding: '0 8px 0 26px',
              background: T.surface,
              color: T.teal,
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            }}
          >
            All posts
            <span
              aria-hidden="true"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: T.teal,
                color: T.surface,
              }}
            >
              →
            </span>
          </Link>
        </div>
        <div className="home-posts">
          {posts.map((post) => (
            <div
              key={post.slug}
              style={{ background: T.surface, borderRadius: 24, padding: 14, paddingBottom: 22 }}
            >
              <PostCard post={post} level="h3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
