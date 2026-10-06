// TRIAL: can this host keep a private file outside the app folder, across
// redeploys, and does the built-in SQLite work? Needs the trial key header.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const key = process.env.TRIAL_KEY;
  if (!key || request.headers.get('x-trial-key') !== key) return new Response('Not found', { status: 404 });

  const dir = path.join(os.homedir(), 'private-data', 'cms-trial');
  const result: Record<string, unknown> = {
    node: process.version,
    insideAppFolder: dir.startsWith(process.cwd()),
    source: new URL(request.url).searchParams.get('source') ?? 'manual',
  };
  try {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
    const log = path.join(dir, 'runs.jsonl');
    fs.appendFileSync(log, JSON.stringify({ at: new Date().toISOString(), source: result.source }) + '\n');
    const lines = fs.readFileSync(log, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
    result.jsonRuns = lines.length;
    result.firstRun = lines[0].at;
    result.cronRuns = lines.filter((l) => l.source === 'cron').length;
  } catch (error) {
    result.jsonError = String(error);
  }
  try {
    const { DatabaseSync } = await import('node:sqlite');
    const db = new DatabaseSync(path.join(dir, 'trial.sqlite'));
    db.exec('CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY, at TEXT NOT NULL, site_id TEXT NOT NULL)');
    db.prepare('INSERT INTO runs (at, site_id) VALUES (?, ?)').run(new Date().toISOString(), 'docsscale.com');
    result.sqliteRows = (db.prepare('SELECT COUNT(*) AS n FROM runs').get() as { n: number }).n;
    db.close();
  } catch (error) {
    result.sqliteError = String(error);
  }
  return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
}
