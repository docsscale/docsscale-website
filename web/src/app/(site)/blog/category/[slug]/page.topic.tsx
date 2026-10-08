import { notFound } from 'next/navigation';
import { OFFERS } from '@/content/offers';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { BlogIndex } from '@/features/blog/BlogIndex';
import { getTopics, INCLUDE_DRAFTS } from '@/features/blog/posts';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import '@/styles/blog.css';

// One page per topic that has at least three posts (next.config.ts decides
// whether this file is part of the build at all).
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = async () => (await getTopics()).map((topic) => ({ slug: topic.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const topic = (await getTopics()).find((item) => item.slug === slug);
  if (!topic) return {};
  return pageMetadata({
    title: `${topic.name} | DocsScale blog`,
    description: topic.description,
    path: `/blog/category/${slug}/`,
    // Without its own description a topic page stays out of search engines.
    robots: INCLUDE_DRAFTS || !topic.description ? 'noindex-nofollow' : 'marketing',
  });
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params;
  const topics = await getTopics();
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) notFound();
  return (
    <>
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <main>
        <BlogIndex
          posts={topic.posts}
          topics={topics}
          activeTopic={topic.slug}
          offers={OFFERS}
          copy={{ heading: topic.name, intro: topic.description, title: '', description: '' }}
        />
      </main>
    </>
  );
}
