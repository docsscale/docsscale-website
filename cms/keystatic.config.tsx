import { collection, config, fields, singleton } from '@keystatic/core';
import { countedText } from './fields/counted-text';

// TRIAL schema: one collection and one settings form, enough to prove the file
// format, the SEO block with live length warnings and image uploads.
const seo = fields.object(
  {
    title: countedText({
      label: 'Page title',
      description: 'Shown in search results and the browser tab.',
      limits: { warnOver: 55, max: 60 },
    }),
    description: countedText({
      label: 'Meta description',
      description: 'The two lines under the title in search results.',
      multiline: true,
      limits: { warnUnder: 120, warnOver: 150, max: 160 },
    }),
    noindex: fields.checkbox({
      label: 'Hide from search engines',
      description: 'Removes the page from the sitemap. Leave off unless you are sure.',
    }),
  },
  { label: 'Search engines (SEO)' },
);

// Local files on a developer's machine; Keystatic Cloud (email sign-in, no
// GitHub account) on the server. The project key is not a secret.
const onServer = process.env.NODE_ENV === 'production';

/** The branch the editing screen is kept on. Saves must never go to main. */
export const WORKING_BRANCH = 'trial/content';

export default config({
  storage: onServer ? { kind: 'cloud', branchPrefix: 'trial/' } : { kind: 'local' },
  cloud: { project: 'docsscale/docsscale-website' },
  ui: { brand: { name: 'DocsScale content' } },
  collections: {
    posts: collection({
      label: 'Blog posts',
      path: 'content/posts/*/',
      slugField: 'title',
      format: { contentField: 'body' },
      entryLayout: 'content',
      columns: ['title', 'status'],
      schema: {
        title: fields.slug({ name: { label: 'Title', validation: { isRequired: true } } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Draft', value: 'draft' },
            { label: 'Ready for review', value: 'review' },
            { label: 'Published', value: 'published' },
          ],
          defaultValue: 'draft',
        }),
        summary: fields.text({
          label: 'Summary',
          description: 'Two or three sentences that answer the main question of the post.',
          multiline: true,
          validation: { isRequired: true },
        }),
        cover: fields.image({
          label: 'Cover image',
          directory: 'web/public/uploads/posts',
          publicPath: '/uploads/posts/',
        }),
        coverAlt: fields.text({ label: 'Cover image description (alt text)' }),
        seo,
        body: fields.markdoc({ label: 'Body' }),
      },
    }),
  },
  singletons: {
    homeSeo: singleton({
      label: 'Home page: SEO',
      path: 'content/pages/home',
      format: 'yaml',
      schema: { seo },
    }),
  },
});
