// schema.org data for a blog post, built from the post itself so it can never
// say something the page does not show.
import { ORGANIZATION } from '@/content/structured-data';
import { SITE } from '@/content/site';
import type { Post } from './posts';

export function postSchema(post: Post) {
  const url = `${SITE.url}/blog/${post.slug}/`;
  const blocks: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.seo.description || post.summary,
      mainEntityOfPage: url,
      datePublished: post.publishedIso,
      dateModified: post.updatedIso ?? post.publishedIso,
      // A named person from the team; without one, the post is DocsScale's.
      author: post.author
        ? { '@type': 'Person', name: post.author.name, jobTitle: post.author.role }
        : { '@id': ORGANIZATION['@id'] },
      publisher: { '@id': ORGANIZATION['@id'] },
      ...(post.cover ? { image: `${SITE.url}${post.cover.src}` } : {}),
      ...(post.category ? { articleSection: post.category.name } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.url}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE.url}/blog/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
  // Only with the questions visible on the page (they always are, when present).
  if (post.faqs.length)
    blocks.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: post.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
    });
  return [ORGANIZATION, ...blocks];
}
