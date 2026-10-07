import { BLOG_INDEX } from '@/content/blog';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { BlogIndex } from '@/features/blog/BlogIndex';
import { OFFERS } from '@/content/offers';
import { getPosts } from '@/features/blog/posts';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import '@/styles/blog.css';

export const metadata = pageMetadata({
  title: BLOG_INDEX.title,
  description: BLOG_INDEX.description,
  path: '/blog/',
  // Stays out of search engines until the owner has supplied its wording.
  robots: BLOG_INDEX.description ? 'marketing' : 'noindex-nofollow',
});

export default async function BlogPage() {
  return (
    <>
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <main>
        <BlogIndex posts={await getPosts()} offers={OFFERS} copy={BLOG_INDEX} />
      </main>
    </>
  );
}
