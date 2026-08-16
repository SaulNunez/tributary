import {
  mapDbToFeed,
  mapDbToFeedItem,
  mapFeedItemToDb,
  mapFeedToDb,
} from '@/db/repository';
import { DBFeedItem, DBSubscription } from '@/db/schema';
import { Feed, FeedItem } from '@/types';

describe('Repository Data Mappers', () => {
  it('should map Feed domain object to DBSubscription insert format', () => {
    const feed: Feed = {
      id: 'https://example.com/rss',
      urlFeed: 'https://example.com/rss',
      name: 'Example Feed',
      iconLocation: 'https://example.com/icon.png',
      lastSyncedAt: '2026-08-06T00:00:00.000Z',
      lastUpdateTime: '2026-08-06T00:00:00.000Z',
      itunes: { explicit: true },
    };

    const dbObj = mapFeedToDb(feed);

    expect(dbObj.id).toBe('https://example.com/rss');
    expect(dbObj.urlFeed).toBe('https://example.com/rss');
    expect(dbObj.name).toBe('Example Feed');
    expect(dbObj.iconLocation).toBe('https://example.com/icon.png');
    expect(dbObj.itunesExplicit).toBe(true);
  });

  it('should map DBSubscription row to Feed domain object', () => {
    const dbRow: DBSubscription = {
      id: 'https://example.com/rss',
      urlFeed: 'https://example.com/rss',
      name: 'Example Feed',
      iconLocation: 'https://example.com/icon.png',
      lastSyncedAt: '2026-08-06T00:00:00.000Z',
      lastUpdateTime: '2026-08-06T00:00:00.000Z',
      itunesExplicit: false,
    };

    const feed = mapDbToFeed(dbRow);

    expect(feed.id).toBe('https://example.com/rss');
    expect(feed.name).toBe('Example Feed');
    expect(feed.itunes).toEqual({ explicit: false });
  });

  it('should map FeedItem to DB insert object and back', () => {
    const item: FeedItem = {
      id: 'item-1',
      feedId: 'https://example.com/rss',
      title: 'Episode 1',
      link: 'https://example.com/ep1',
      pubDate: '2026-08-06T12:00:00.000Z',
      isRead: false,
      content: { type: 'html', value: '<p>Hello</p>' },
    };

    const dbObj = mapFeedItemToDb(item, 'https://example.com/rss');
    expect(dbObj.feedId).toBe('https://example.com/rss');
    expect(dbObj.contentType).toBe('html');
    expect(dbObj.contentValue).toBe('<p>Hello</p>');

    const dbRow: DBFeedItem = {
      id: 'item-1',
      feedId: 'https://example.com/rss',
      title: 'Episode 1',
      link: 'https://example.com/ep1',
      pubDate: '2026-08-06T12:00:00.000Z',
      isRead: true,
      contentType: 'html',
      contentValue: '<p>Hello</p>',
    };

    const restoredItem = mapDbToFeedItem(dbRow);
    expect(restoredItem.id).toBe('item-1');
    expect(restoredItem.feedId).toBe('https://example.com/rss');
    expect(restoredItem.isRead).toBe(true);
    expect(restoredItem.content).toEqual({ type: 'html', value: '<p>Hello</p>' });
  });
});
