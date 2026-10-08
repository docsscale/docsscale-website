// The blog's feed (/blog/rss.xml), written as a plain file at build time.
import { BLOG_INDEX } from '@/content/blog';
import { SITE } from '@/content/site';
import { getPosts } from '@/features/blog/posts';

export const dynamic = 'force-static';

const escape = (text: string) =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const posts = await getPosts();
  const items = posts
    .map((post) => {
      const url = `${SITE.url}/blog/${post.slug}/`;
      const date = post.publishedIso
        ? `<pubDate>${new Date(`${post.publishedIso}T12:00:00Z`).toUTCString()}</pubDate>`
        : '';
      const author = post.author ? `<dc:creator>${escape(post.author.name)}</dc:creator>` : '';
      const category = post.category ? `<category>${escape(post.category.name)}</category>` : '';
      return `<item><title>${escape(post.title)}</title><link>${url}</link><guid>${url}</guid>${date}${author}${category}<description>${escape(post.summary)}</description></item>`;
    })
    .join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${escape(`${SITE.name} blog`)}</title><link>${SITE.url}/blog/</link><description>${escape(BLOG_INDEX.description || BLOG_INDEX.heading)}</description><language>en-us</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
