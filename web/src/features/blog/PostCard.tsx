// One post in a list: the blog index and "Keep reading" under a post.
import Link from 'next/link';
import { STAGE_COLORS } from '@/styles/tokens';
import { T } from '@/styles/tokens';
import type { Post } from './posts';

export function PostCard({ post, level }: { post: Post; level: 'h2' | 'h3' }) {
  const accent = STAGE_COLORS[post.category?.stage ?? 'capture'];
  const Heading = level;
  return (
    <article className="post-card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {post.cover ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export; fixed-ratio box, no layout shift
        <img
          src={post.cover.src}
          alt=""
          loading="lazy"
          decoding="async"
          style={{
            width: '100%',
            aspectRatio: '3 / 2',
            objectFit: 'cover',
            borderRadius: 18,
            display: 'block',
          }}
        />
      ) : (
        // No photo yet: the category's colour holds the place, so cards stay aligned.
        <div aria-hidden="true" style={{ aspectRatio: '3 / 2', borderRadius: 18, background: accent.bg }} />
      )}
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
      <Heading
        style={{ margin: 0, fontWeight: 800, fontSize: 22, lineHeight: 1.18, letterSpacing: '-.03em' }}
      >
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </Heading>
      <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: T.body }}>{post.summary}</p>
      <span style={{ fontSize: 13, fontWeight: 600, color: T.caption }}>
        {[post.published, `${post.minutes} min read`].filter(Boolean).join(' · ')}
      </span>
    </article>
  );
}
