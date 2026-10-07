import { SAMPLE_POSTS } from '@/content/blog-sample';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { BlogIndex } from '@/features/blog/BlogIndex';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import '@/styles/blog.css';

// Design review only: sample content, so the page is kept out of search engines.
export const metadata = pageMetadata({
  title: 'Sample blog | DocsScale',
  description: 'Sample page for the blog design review. Not for publication.',
  path: '/blog/',
  robots: 'noindex-nofollow',
});

export default function BlogPage() {
  return (
    <>
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <main>
        <BlogIndex posts={SAMPLE_POSTS} />
      </main>
    </>
  );
}
