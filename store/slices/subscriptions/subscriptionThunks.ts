import {
  bulkInsertSubscriptionsDb,
  deleteSubscriptionDb,
  getAllSubscriptionsDb,
  updateSubscriptionMetadataDb,
} from '@/db/repository';
import { fetchAndParseFeed, mapFeedResponseToItems } from '@/fetchFeed';
import { Feed } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { saveAndReceiveItems } from '../itemSlice';
import {
  bulkAddSubscriptions,
  removeSubscription,
  updateSubscriptionMetadata,
} from '../subscriptionsSlice';

export const loadSubscriptionsFromDb = createAsyncThunk(
  'subscriptions/loadFromDb',
  async (_, { dispatch }) => {
    const feeds = await getAllSubscriptionsDb();
    dispatch(bulkAddSubscriptions(feeds));
    return feeds;
  }
);

export const deleteSubscriptionThunk = createAsyncThunk(
  'subscriptions/delete',
  async (id: string, { dispatch }) => {
    await deleteSubscriptionDb(id);
    dispatch(removeSubscription(id));
  }
);

export const importFromOpml = createAsyncThunk(
  'subscriptions/importFromOpml',
  async (opmlItems: { url: string; name: string }[], { dispatch }) => {
    // 1. Create skeleton objects to show in UI immediately
    const initialFeeds: Feed[] = opmlItems.map((item) => ({
      id: item.url,
      urlFeed: item.url,
      name: item.name,
      lastSyncedAt: new Date(0).toISOString(),
      iconLocation: '',
      lastUpdateTime: new Date(0).toISOString(),
    }));

    // Add them to SQLite and Redux store immediately so the user sees progress
    await bulkInsertSubscriptionsDb(initialFeeds);
    dispatch(bulkAddSubscriptions(initialFeeds));

    // 2. Hydrate each feed in the background
    for (const feed of initialFeeds) {
      try {
        const response = await fetchAndParseFeed(feed.urlFeed);
        let icon: string = '';
        if (response.feedType === 'rss') {
          icon = response.image?.url || '';
        } else if (response.feedType === 'atom') {
          icon = response?.icon || '';
        }

        let lastUpdate = new Date(0);
        if (response.feedType === 'rss' && response.lastBuildDate) {
          lastUpdate = new Date(response.lastBuildDate);
        } else if (response.feedType === 'atom' && response.updated) {
          lastUpdate = new Date(response.updated);
        }

        let itunes =
          response.feedType === 'rss'
            ? { explicit: response.itunes?.explicit || false }
            : undefined;

        const changes = {
          iconLocation: icon,
          itunes: itunes,
          lastUpdateTime: lastUpdate.toISOString(),
        };

        // Persist to SQLite
        await updateSubscriptionMetadataDb(feed.urlFeed, changes);

        // Update Redux state
        dispatch(
          updateSubscriptionMetadata({
            id: feed.urlFeed,
            changes,
          })
        );

        const items = mapFeedResponseToItems(response, feed.id);
        await dispatch(saveAndReceiveItems({ items, feedId: feed.id }));
      } catch (e) {
        console.error(`Failed to hydrate ${feed.urlFeed}`, e);
      }
    }
  }
);

export const syncSubscriptionItems = createAsyncThunk(
  'subscriptions/syncItems',
  async (feeds: Feed[], { dispatch }) => {
    await Promise.all(
      feeds.map(async (feed) => {
        try {
          const response = await fetchAndParseFeed(feed.urlFeed);
          const items = mapFeedResponseToItems(response, feed.id);
          await dispatch(saveAndReceiveItems({ items, feedId: feed.id }));
        } catch (e) {
          console.error(`Failed to sync items for ${feed.urlFeed}`, e);
        }
      })
    );
  }
);