import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import * as schema from './schema';

const dbPath = resolve(process.env['DB_PATH'] || 'data/simpa.db');
mkdirSync(dirname(dbPath), { recursive: true });

export const sqlite = new Database(dbPath);

// Ensure tables exist on first start (compatible with existing TypeORM-created DBs)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS site (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    createdAt TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS count (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    siteId TEXT NOT NULL,
    date TEXT NOT NULL DEFAULT (datetime('now')),
    referer TEXT NOT NULL DEFAULT '',
    page TEXT NOT NULL DEFAULT '',
    country TEXT NOT NULL DEFAULT '',
    ip TEXT NOT NULL DEFAULT '',
    client TEXT NOT NULL DEFAULT ''
  );

  CREATE INDEX IF NOT EXISTS idx_count_siteId ON count (siteId);

  CREATE TABLE IF NOT EXISTS day_count (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    siteId TEXT NOT NULL,
    date TEXT NOT NULL,
    test TEXT NOT NULL
  );
`);

export const db = drizzle(sqlite, { schema });
