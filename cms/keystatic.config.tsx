import { config } from '@keystatic/core';
import { contentCollections } from './content-schema';
import { countedText } from './fields/counted-text';

// Local files on a developer's machine; Keystatic Cloud (email sign-in, no
// GitHub account) on the server. The project key is not a secret.
const onServer = process.env.NODE_ENV === 'production';

/** The working copy: the one branch the editing screen saves to. Nothing saved
 *  here reaches the live site until the publish workflow copies it to main. */
export const WORKING_BRANCH = 'content/working';

export default config({
  storage: onServer ? { kind: 'cloud', branchPrefix: 'content/' } : { kind: 'local' },
  cloud: { project: 'docsscale/docsscale-website' },
  ui: { brand: { name: 'DocsScale content' } },
  collections: contentCollections({
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
  }),
});
