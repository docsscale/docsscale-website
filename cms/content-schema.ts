// The content model: which files the editing screen (cms.docsscale.com) writes
// and the site reads at build time. docs/COMPLETION-PLAN.md, section 6, lists
// every field and why it exists.
//
// THIS FILE EXISTS TWICE, byte for byte: web/src/content/content-schema.ts and
// cms/content-schema.ts. The site and the editing app are separate packages and
// neither can import from the other's folder. CI fails if the two differ, so
// change one and copy it over the other.
import { collection, fields, type BasicFormField } from '@keystatic/core';
import { block } from '@keystatic/core/content-components';

/** The two SEO text fields are supplied by the caller: the editing app passes
 *  fields that count characters while typing, the site plain text fields. Both
 *  store a plain string, so the files are the same. */
type SeoField = ReturnType<typeof fields.text> | BasicFormField<string>;
export type SeoText = { title: SeoField; description: SeoField };

export function contentCollections(seoText: SeoText) {
  const seo = fields.object(
    {
      title: seoText.title,
      description: seoText.description,
      focusKeyword: fields.text({
        label: 'Focus keyword',
        description:
          'The one search phrase this post should be found for, as people type it. The SEO dashboard checks the title, heading, description and opening paragraphs for it before the post is published.',
      }),
      noindex: fields.checkbox({
        label: 'Hide from search engines',
        description: 'Removes the page from the sitemap. Leave off unless you are sure.',
      }),
    },
    { label: 'Search engines (SEO)' },
  );
  return {
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
          description: 'One or two sentences that say what the reader will be able to do after reading.',
          multiline: true,
          validation: { isRequired: true },
        }),
        category: fields.relationship({ label: 'Category', collection: 'categories' }),
        author: fields.relationship({ label: 'Author', collection: 'team' }),
        published: fields.date({ label: 'Published on' }),
        updated: fields.date({
          label: 'Last updated',
          description: 'Change only for a meaningful update, not for a typo.',
        }),
        reviewed: fields.date({
          label: 'Last reviewed',
          description: 'The day a person reread the whole post. Never filled automatically.',
        }),
        takeaways: fields.array(fields.text({ label: 'Takeaway' }), {
          label: 'In short',
          description: 'Two to four points a reader should leave with.',
          itemLabel: (item) => item.value,
        }),
        onlyDocsScale: fields.text({
          label: 'What only DocsScale could say here',
          description:
            'The real client example, real numbers or our own process in this post. Not shown on the page.',
          multiline: true,
        }),
        faqs: fields.array(
          fields.object({
            question: fields.text({ label: 'Question' }),
            answer: fields.text({ label: 'Answer', multiline: true }),
          }),
          { label: 'Common questions', itemLabel: (item) => item.fields.question.value },
        ),
        cover: fields.image({
          label: 'Cover photo',
          description:
            'Wide photo shown at the top of the post and on its card. A real photo; record its source.',
          directory: 'web/public/uploads/posts',
          publicPath: '/uploads/posts/',
        }),
        coverAlt: fields.text({ label: 'Cover photo: description for people who cannot see it (alt text)' }),
        coverCaption: fields.text({ label: 'Cover photo: caption (what it shows and where it comes from)' }),
        seo,
        body: fields.markdoc({
          label: 'Body',
          options: { image: { directory: 'web/public/uploads/posts', publicPath: '/uploads/posts/' } },
          // Blocks an editor can insert into a post. Their look and wording are
          // fixed in the site's code; the editor only chooses which one.
          components: {
            cta: block({
              label: 'Call to action',
              description: 'A box that invites the reader to act. The wording is fixed.',
              schema: {
                kind: fields.select({
                  label: 'Which one',
                  options: [
                    { label: 'Book a strategy call', value: 'call' },
                    { label: 'Get the Free System', value: 'free-system' },
                  ],
                  defaultValue: 'call',
                }),
              },
            }),
          },
        }),
      },
    }),
    categories: collection({
      label: 'Categories',
      path: 'content/categories/*',
      slugField: 'name',
      format: 'yaml',
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        // The colour pair the category takes from the four stages of the system.
        stage: fields.select({
          label: 'Stage colour',
          options: [
            { label: 'Attract', value: 'attract' },
            { label: 'Capture', value: 'capture' },
            { label: 'Convert', value: 'convert' },
            { label: 'Retain', value: 'retain' },
          ],
          defaultValue: 'attract',
        }),
        description: fields.text({ label: 'Description', multiline: true }),
      },
    }),
    team: collection({
      label: 'Team members',
      path: 'content/team/*',
      slugField: 'name',
      format: 'yaml',
      schema: {
        name: fields.slug({ name: { label: 'Name', validation: { isRequired: true } } }),
        role: fields.text({ label: 'Role' }),
        bio: fields.text({ label: 'Short bio', multiline: true }),
      },
    }),
  };
}
