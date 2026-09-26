// Which build the visual and interaction tests treat as "correct":
// reference/approved/ once the owner has approved visible changes
// (npm run visual:approve), otherwise the original live snapshot.
import fs from 'node:fs';

export const BASELINE_SITE =
  process.env.VISUAL_BASELINE ||
  (fs.existsSync('reference/approved/index.html') ? 'reference/approved' : 'reference/live-2026-09-25');
