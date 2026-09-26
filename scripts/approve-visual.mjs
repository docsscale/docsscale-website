#!/usr/bin/env node
// Freezes the current build (web/out) as the approved visual reference.
// Run only after the owner has approved the visible changes on staging:
//   npm run visual:approve   (then commit reference/approved/)
// From then on, CI and the visual/interaction tests compare against it instead
// of the original live snapshot in reference/live-2026-09-25/.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'web/out');
const target = path.join(root, 'reference/approved');
if (!fs.existsSync(path.join(out, 'index.html'))) {
  console.error('approve-visual: build first (cd web && npm run build)');
  process.exit(1);
}
fs.rmSync(target, { recursive: true, force: true });
fs.cpSync(out, target, { recursive: true });
const commit = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
fs.writeFileSync(path.join(target, 'APPROVED.txt'), `Approved visual reference\ncommit: ${commit}\ndate: ${new Date().toISOString()}\n`);
console.log(`reference/approved/ now holds the build of ${commit}. Commit it to make it the CI baseline.`);
