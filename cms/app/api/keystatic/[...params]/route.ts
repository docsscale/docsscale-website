import path from 'node:path';
import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../keystatic.config';

// Content lives at the repo root (content/, web/public/uploads/), one level up
// from this app. Only used in local mode; in cloud mode paths are repo-relative.
export const { POST, GET } = makeRouteHandler({
  config,
  localBaseDirectory: path.resolve(process.cwd(), '..'),
});
