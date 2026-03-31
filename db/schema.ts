import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const site = sqliteTable('site', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  url: text('url').notNull(),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`(datetime('now'))`),
});

export const count = sqliteTable('count', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  siteId: text('siteId').notNull(),
  date: text('date')
    .notNull()
    .default(sql`(datetime('now'))`),
  referer: text('referer').notNull().default(''),
  page: text('page').notNull().default(''),
  country: text('country').notNull().default(''),
  ip: text('ip').notNull().default(''),
  client: text('client').notNull().default(''),
});

// Unused in original but kept for schema compatibility
export const dayCount = sqliteTable('day_count', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  siteId: text('siteId').notNull(),
  date: text('date').notNull(),
  test: text('test').notNull(),
});
