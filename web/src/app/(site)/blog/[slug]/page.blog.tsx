import { notFound } from 'next/navigation';
import { SPECIALTY_LINKS } from '@/content/specialties';
import { BlogPost } from '@/features/blog/BlogPost';
import { postSchema } from '@/features/blog/post-schema';
import { getOffers, getPosts, INCLUDE_DRAFTS } from '@/features/blog/posts';
import { JsonLd } from '@/features/seo/JsonLd';
import { pageMetadata } from '@/features/seo/metadata';
import { Nav } from '@/features/site-chrome/Nav';
import '@/styles/blog.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = async () => (await getPosts()).map((post) => ({ slug: post.slug }));

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = (await getPosts()).find((item) => item.slug === slug);
  if (!post) return {};
  const meta = pageMetadata({
    title: post.seo.title || `${post.title} | DocsScale`,
    description: post.seo.description || post.summary,
    path: `/blog/${slug}/`,
    // The preview site shows drafts; none of it may be indexed.
    robots: INCLUDE_DRAFTS || post.seo.noindex ? 'noindex-nofollow' : 'marketing',
  });
  // Shared links show the post as an article with its own photo and dates.
  return {
    ...meta,
    openGraph: {
      ...meta.openGraph,
      type: 'article',
      publishedTime: post.publishedIso ?? undefined,
      modifiedTime: post.updatedIso ?? post.publishedIso ?? undefined,
      authors: post.author ? [post.author.name] : undefined,
      ...(post.cover ? { images: [{ url: post.cover.src, alt: post.cover.alt }] } : {}),
    },
    twitter: { ...meta.twitter, ...(post.cover ? { images: [post.cover.src] } : {}) },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await getPosts();
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();
  return (
    <>
      {postSchema(post).map((data, i) => (
        <JsonLd key={i} data={data} />
      ))}
      <Nav active="home" specialties={SPECIALTY_LINKS} />
      <main>
        <BlogPost
          post={post}
          related={posts.filter((item) => item !== post).slice(0, 3)}
          offers={await getOffers()}
        />
      </main>
    </>
  );
}
