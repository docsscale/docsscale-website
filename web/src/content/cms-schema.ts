// The content model: which files the editing screen (cms.docsscale.com) writes
// and the site reads at build time. One definition for both, so they can't
// drift apart. Files live in /content at the repo root.
// docs/COMPLETION-PLAN.md, section 6, lists every field and why it exists.
import { collection, config, fields } from '@keystatic/core';

const seo = fields.object(
  {
    title: fields.text({ label: 'Page title', description: 'Shown in search results. Up to 60 characters.' }),
    description: fields.text({
      label: 'Meta description',
      description: 'The two lines under the title in search results. 120 to 160 characters.',
      multiline: true,
    }),
    noindex: fields.checkbox({
      label: 'Hide from search engines',
      description: 'Removes the page from the sitemap. Leave off unless you are sure.',
    }),
  },
  { label: 'Search engines (SEO)' },
);

export const POST_STATUSES = ['draft', 'review', 'published'] as const;

export default config({
  storage: { kind: 'local' },
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
        seo,
        body: fields.markdoc({ label: 'Body' }),
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
  },
});
