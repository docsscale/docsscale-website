// The content model as the site's build reads it. The model itself is in
// content-schema.ts, shared with the editing app.
import { config, fields } from '@keystatic/core';
import { contentCollections } from './content-schema';

export default config({
  storage: { kind: 'local' },
  collections: contentCollections({
    title: fields.text({ label: 'Page title' }),
    description: fields.text({ label: 'Meta description', multiline: true }),
  }),
});
