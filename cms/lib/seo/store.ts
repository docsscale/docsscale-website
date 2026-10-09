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
-- Phase 2 (docs/SEO-DASHBOARD-PLAN.md, sections 6 to 8): the fix queue, its
-- status history, the Overview's written note and "what to ignore" list, the
-- plan, the manual AI-check log and CSV imports.
CREATE TABLE IF NOT EXISTS findings (
  id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL UNIQUE, rule TEXT NOT NULL, page TEXT,
  what TEXT NOT NULL, evidence TEXT NOT NULL, impact TEXT NOT NULL, impact_reason TEXT NOT NULL,
  effort TEXT NOT NULL, who TEXT NOT NULL, status TEXT NOT NULL, note TEXT NOT NULL DEFAULT '',
  horizon INTEGER, created TEXT NOT NULL, last_seen TEXT NOT NULL, decided_by TEXT, decided_at TEXT,
  done_at TEXT, check_date TEXT, outcome TEXT, outcome_detail TEXT
);
CREATE TABLE IF NOT EXISTS finding_log (
  finding INTEGER NOT NULL, at TEXT NOT NULL, by TEXT NOT NULL, from_status TEXT NOT NULL, to_status TEXT NOT NULL, note TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, at TEXT NOT NULL, by TEXT NOT NULL, text TEXT NOT NULL, reason TEXT NOT NULL DEFAULT '', removed TEXT
);
CREATE TABLE IF NOT EXISTS plan_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT, horizon INTEGER NOT NULL, text TEXT NOT NULL, added_by TEXT NOT NULL, added_at TEXT NOT NULL, done_at TEXT
);
CREATE TABLE IF NOT EXISTS ai_checks (
  id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, by TEXT NOT NULL, assistant TEXT NOT NULL, question TEXT NOT NULL, cited INTEGER NOT NULL, detail TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS imports (
  id INTEGER PRIMARY KEY AUTOINCREMENT, at TEXT NOT NULL, by TEXT NOT NULL, source TEXT NOT NULL, filename TEXT NOT NULL,
  note TEXT NOT NULL, rows INTEGER NOT NULL, columns TEXT NOT NULL, data TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, value TEXT NOT NULL, changed_at TEXT NOT NULL, changed_by TEXT NOT NULL, reason TEXT NOT NULL
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

/** Snapshots of a source taken at or before a moment, newest first; used to
 *  compare a page before and after a change (History and outcomes). */
export function snapshotBefore<T>(source: string, iso: string): Snapshot<T> | null {
  const row = store()
    .prepare('SELECT id, taken, data FROM snapshots WHERE source = ? AND taken <= ? ORDER BY id DESC LIMIT 1')
    .get(source, iso) as { id: number; taken: string; data: string } | undefined;
  return row ? { id: row.id, taken: row.taken, data: JSON.parse(row.data) as T } : null;
}

/** A setting the admin can change on screen (approvers, thresholds); each
 *  change is kept with its reason (plan, section 9). */
export function setting(key: string, fallback: string): string {
  const row = store().prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
  return row?.value ?? fallback;
}

export function saveSetting(key: string, value: string, by: string, reason: string) {
  store()
    .prepare('INSERT INTO settings (key, value, changed_at, changed_by, reason) VALUES (?, ?, ?, ?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value, changed_at = excluded.changed_at, changed_by = excluded.changed_by, reason = excluded.reason')
    .run(key, value, now(), by, reason);
}
