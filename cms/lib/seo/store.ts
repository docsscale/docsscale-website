import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { seoConfig } from './config';

// The private store: one SQLite file in the private folder, never in the
// repository or the public build. Built into Node.js 24, so no compiled add-on
// (tested on Hostinger, 6 Oct 2026). docs/SEO-DASHBOARD-PLAN.md, section 2.

let db: DatabaseSync | null = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  email TEXT PRIMARY KEY, role TEXT NOT NULL, added_at TEXT NOT NULL, added_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS login_tokens (
  hash TEXT PRIMARY KEY, email TEXT NOT NULL, expires TEXT NOT NULL, used_at TEXT
);
CREATE TABLE IF NOT EXISTS sign_in_requests (
  at TEXT NOT NULL, email TEXT NOT NULL, ip TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  hash TEXT PRIMARY KEY, email TEXT NOT NULL, created TEXT NOT NULL, last_seen TEXT NOT NULL,
  ip TEXT NOT NULL, device TEXT NOT NULL, ended TEXT
);
CREATE TABLE IF NOT EXISTS page_views (
  session TEXT NOT NULL, at TEXT NOT NULL, path TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT, job TEXT NOT NULL, started TEXT NOT NULL,
  finished TEXT, ok INTEGER, started_by TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sources (
  name TEXT PRIMARY KEY, last_attempt TEXT, last_success TEXT, status TEXT, message TEXT
);
CREATE TABLE IF NOT EXISTS snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT, source TEXT NOT NULL, taken TEXT NOT NULL, data TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS snapshots_source ON snapshots (source, id);
CREATE TABLE IF NOT EXISTS edits (
  sha TEXT NOT NULL, file TEXT NOT NULL, at TEXT NOT NULL, author TEXT NOT NULL, message TEXT NOT NULL,
  branch TEXT NOT NULL, fields TEXT NOT NULL, words_before INTEGER, words_after INTEGER,
  PRIMARY KEY (sha, file)
);
`;

export function store(): DatabaseSync {
  if (db) return db;
  fs.mkdirSync(seoConfig.dataDir, { recursive: true, mode: 0o700 });
  db = new DatabaseSync(path.join(seoConfig.dataDir, 'seo.sqlite'));
  db.exec('PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;');
  db.exec(SCHEMA);
  // Admins named at install time are kept, so a later install that names
  // none (an automatic one after a code change) keeps the same admins.
  for (const email of seoConfig.adminEmails) {
    db.prepare('INSERT INTO users (email, role, added_at, added_by) VALUES (?, ?, ?, ?) ON CONFLICT (email) DO UPDATE SET role = excluded.role')
      .run(email, 'admin', now(), 'install');
  }
  return db;
}

export const now = () => new Date().toISOString();

/** Every number on screen says where it came from and when it was fetched. */
export type Snapshot<T> = { id: number; taken: string; data: T };

export function saveSnapshot(source: string, data: unknown) {
  store().prepare('INSERT INTO snapshots (source, taken, data) VALUES (?, ?, ?)').run(source, now(), JSON.stringify(data));
}

export function latestSnapshot<T>(source: string): Snapshot<T> | null {
  const row = store()
    .prepare('SELECT id, taken, data FROM snapshots WHERE source = ? ORDER BY id DESC LIMIT 1')
    .get(source) as { id: number; taken: string; data: string } | undefined;
  return row ? { id: row.id, taken: row.taken, data: JSON.parse(row.data) as T } : null;
}

/** The day-zero baseline: the first snapshot a source ever returned. */
export function firstSnapshot<T>(source: string): Snapshot<T> | null {
  const row = store()
    .prepare('SELECT id, taken, data FROM snapshots WHERE source = ? ORDER BY id ASC LIMIT 1')
    .get(source) as { id: number; taken: string; data: string } | undefined;
  return row ? { id: row.id, taken: row.taken, data: JSON.parse(row.data) as T } : null;
}

export type SourceRow = { name: string; last_attempt: string | null; last_success: string | null; status: string | null; message: string | null };

export function sourceRows(): SourceRow[] {
  return store().prepare('SELECT * FROM sources ORDER BY name').all() as SourceRow[];
}

export function recordSource(name: string, status: 'ok' | 'failing' | 'not set up', message: string) {
  const t = now();
  store()
    .prepare(
      `INSERT INTO sources (name, last_attempt, last_success, status, message) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (name) DO UPDATE SET last_attempt = excluded.last_attempt, status = excluded.status,
         message = excluded.message, last_success = COALESCE(excluded.last_success, sources.last_success)`,
    )
    .run(name, t, status === 'ok' ? t : null, status, message);
}
