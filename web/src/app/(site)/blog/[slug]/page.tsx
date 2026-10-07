import { notFound } from 'next/navigation';
import { SAMPLE_POSTS } from '@/content/blog-sample';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { BlogPost } from '@/features/blog/BlogPost';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import '@/styles/blog.css';

// Only the full sample post has a page; the others exist to fill the lists.
const POSTS = SAMPLE_POSTS.filter((post) => post.body.length > 0);

export const dynamicParams = false;
export const generateStaticParams = () => POSTS.map((post) => ({ slug: post.slug }));

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Design review only: sample content, so the page is kept out of search engines.
  return pageMetadata({
    title: 'Sample post | DocsScale',
    description: 'Sample page for the blog design review. Not for publication.',
    path: `/blog/${slug}/`,
    robots: 'noindex-nofollow',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS.find((item) => item.slug === slug);
  if (!post) notFound();
  return (
    <>
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <main>
        <BlogPost post={post} related={SAMPLE_POSTS.filter((item) => item !== post).slice(0, 3)} />
      </main>
    </>
  );
}
