import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  urlFeed: text('url_feed').notNull(),
  name: text('name').notNull(),
  iconLocation: text('icon_location').default(''),
  lastSyncedAt: text('last_synced_at').notNull(),
  lastUpdateTime: text('last_update_time').notNull(),
  itunesExplicit: integer('itunes_explicit', { mode: 'boolean' }).default(false),
});

export const feedItems = sqliteTable('feed_items', {
  id: text('id').primaryKey(),
  feedId: text('feed_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  link: text('link'),
  pubDate: text('pub_date'),
  isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  contentType: text('content_type').$type<'text' | 'html'>().default('text'),
  contentValue: text('content_value'),
});

export type DBSubscription = typeof subscriptions.$inferSelect;
export type DBSubscriptionInsert = typeof subscriptions.$inferInsert;

export type DBFeedItem = typeof feedItems.$inferSelect;
export type DBFeedItemInsert = typeof feedItems.$inferInsert;
