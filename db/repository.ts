import { Feed, FeedItem } from '@/types';
import { eq } from 'drizzle-orm';
import { db } from './index';
import { DBFeedItem, DBSubscription, feedItems, subscriptions } from './schema';

// Mappers
export function mapDbToFeed(row: DBSubscription): Feed {
  return {
    id: row.id,
    urlFeed: row.urlFeed,
    name: row.name,
    iconLocation: row.iconLocation || '',
    lastSyncedAt: row.lastSyncedAt,
    lastUpdateTime: row.lastUpdateTime,
    itunes: row.itunesExplicit !== null && row.itunesExplicit !== undefined
      ? { explicit: Boolean(row.itunesExplicit) }
      : undefined,
  };
}

export function mapFeedToDb(feed: Feed) {
  return {
    id: feed.id,
    urlFeed: feed.urlFeed,
    name: feed.name,
    iconLocation: feed.iconLocation || '',
    lastSyncedAt: feed.lastSyncedAt,
    lastUpdateTime: feed.lastUpdateTime,
    itunesExplicit: feed.itunes?.explicit ?? false,
  };
}

export function mapDbToFeedItem(row: DBFeedItem): FeedItem {
  return {
    id: row.id,
    feedId: row.feedId,
    title: row.title,
    link: row.link || '',
    pubDate: row.pubDate || '',
    isRead: Boolean(row.isRead),
    content: {
      type: (row.contentType as 'text' | 'html') || 'text',
      value: row.contentValue || '',
    },
  };
}

export function mapFeedItemToDb(item: FeedItem, feedId: string) {
  return {
    id: item.id,
    feedId: feedId,
    title: item.title,
    link: item.link || '',
    pubDate: item.pubDate || '',
    isRead: item.isRead ?? false,
    contentType: item.content?.type || 'text',
    contentValue: item.content?.value || '',
  };
}

// --- Subscription Queries & Mutations ---

export async function getAllSubscriptionsDb(): Promise<Feed[]> {
  const rows = await db.select().from(subscriptions);
  return rows.map(mapDbToFeed);
}

export async function insertSubscriptionDb(feed: Feed): Promise<void> {
  const data = mapFeedToDb(feed);
  await db.insert(subscriptions).values(data).onConflictDoNothing();
}

export async function bulkInsertSubscriptionsDb(feeds: Feed[]): Promise<void> {
  if (feeds.length === 0) return;
  for (const feed of feeds) {
    await insertSubscriptionDb(feed);
  }
}

export async function updateSubscriptionMetadataDb(id: string, changes: Partial<Feed>): Promise<void> {
  const updateData: Partial<typeof subscriptions.$inferInsert> = {};
  if (changes.name !== undefined) updateData.name = changes.name;
  if (changes.urlFeed !== undefined) updateData.urlFeed = changes.urlFeed;
  if (changes.iconLocation !== undefined) updateData.iconLocation = changes.iconLocation;
  if (changes.lastSyncedAt !== undefined) updateData.lastSyncedAt = changes.lastSyncedAt;
  if (changes.lastUpdateTime !== undefined) updateData.lastUpdateTime = changes.lastUpdateTime;
  if (changes.itunes !== undefined) updateData.itunesExplicit = changes.itunes.explicit;

  if (Object.keys(updateData).length > 0) {
    await db.update(subscriptions).set(updateData).where(eq(subscriptions.id, id));
  }
}

export async function deleteSubscriptionDb(id: string): Promise<void> {
  await db.delete(subscriptions).where(eq(subscriptions.id, id));
}

// --- Feed Items Queries & Mutations ---

export async function getAllFeedItemsDb(): Promise<FeedItem[]> {
  const rows = await db.select().from(feedItems);
  return rows.map(mapDbToFeedItem);
}

export async function getFeedItemsByFeedIdDb(feedId: string): Promise<FeedItem[]> {
  const rows = await db.select().from(feedItems).where(eq(feedItems.feedId, feedId));
  return rows.map(mapDbToFeedItem);
}

export async function upsertFeedItemsDb(items: FeedItem[], feedId: string): Promise<void> {
  if (items.length === 0) return;
  for (const item of items) {
    const data = mapFeedItemToDb(item, feedId);
    await db.insert(feedItems).values(data).onConflictDoNothing();
  }
}

export async function markFeedItemAsReadDb(itemId: string, isRead: boolean = true): Promise<void> {
  await db.update(feedItems).set({ isRead }).where(eq(feedItems.id, itemId));
}
