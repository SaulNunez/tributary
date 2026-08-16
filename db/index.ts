import { openDatabaseSync } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import * as schema from './schema';

export const DATABASE_NAME = 'tributary.db';

export const expoDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb, { schema });

export async function initDatabase() {
  await expoDb.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY NOT NULL,
      url_feed TEXT NOT NULL,
      name TEXT NOT NULL,
      icon_location TEXT DEFAULT '',
      last_synced_at TEXT NOT NULL,
      last_update_time TEXT NOT NULL,
      itunes_explicit INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS feed_items (
      id TEXT PRIMARY KEY NOT NULL,
      feed_id TEXT NOT NULL,
      title TEXT NOT NULL,
      link TEXT,
      pub_date TEXT,
      is_read INTEGER NOT NULL DEFAULT 0,
      content_type TEXT DEFAULT 'text',
      content_value TEXT,
      FOREIGN KEY (feed_id) REFERENCES subscriptions(id) ON DELETE CASCADE
    );
  `);
}
