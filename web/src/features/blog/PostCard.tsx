// One post in a list: the blog index and "Keep reading" under a post.
import Link from 'next/link';
import type { Post } from './posts';
import { STAGE_COLORS, T } from '@/styles/tokens';

export function PostCard({ post, level }: { post: Post; level: 'h2' | 'h3' }) {
  const accent = STAGE_COLORS[post.category?.stage ?? 'capture'];
  const Heading = level;
  return (
    <article
      className="post-card"
      style={{
        background: T.surface,
        border: `1px solid ${T.hairline}`,
        borderRadius: 28,
        padding: 'clamp(20px,2.6vw,28px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <span
        style={{
          alignSelf: 'flex-start',
          fontSize: 12,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          padding: '6px 10px',
          borderRadius: 999,
          background: accent.bg,
          color: accent.fg,
        }}
      >
        {post.category?.name ?? 'Blog'}
      </span>
      <Heading
        style={{ margin: 0, fontWeight: 800, fontSize: 22, lineHeight: 1.15, letterSpacing: '-.03em' }}
      >
        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
      </Heading>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: T.body }}>{post.summary}</p>
      <span style={{ marginTop: 'auto', paddingTop: 6, fontSize: 13, fontWeight: 600, color: T.caption }}>
        {[post.published, `${post.minutes} min read`].filter(Boolean).join(' · ')}
      </span>
    </article>
  );
}
