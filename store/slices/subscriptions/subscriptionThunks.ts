import { fetchAndParseFeed } from '@/fetchFeed';
import { Feed } from '@/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { bulkAddSubscriptions, updateSubscriptionMetadata } from '../subscriptionsSlice';

export const importFromOpml = createAsyncThunk(
  'subscriptions/importFromOpml',
  async (opmlItems: { url: string; name: string }[], { dispatch }) => {
    
    // 1. Create skeleton objects to show in UI immediately
    const initialFeeds: Feed[] = opmlItems.map(item => ({
      id: item.url,
      urlFeed: item.url,
      name: item.name,
      lastSyncedAt: new Date(0),
      iconLocation: '',
      lastUpdateTime: new Date(0),
      // itunes is undefined for now
    }));

    // Add them to the store immediately so the user sees progress
    dispatch(bulkAddSubscriptions(initialFeeds));

    // 2. Hydrate each feed in the background
    for (const feed of initialFeeds) {
      try {
        const response = await fetchAndParseFeed(feed.urlFeed);
        let icon: string = '';
        if (response.feedType === 'rss') {
          icon = response.image?.url || '';
        } else if( response.feedType === 'atom') {
          icon = response?.icon || '';
        }

        let lastUpdate = new Date(0);
        if (response.feedType === 'rss' && response.lastBuildDate) {
          lastUpdate = new Date(response.lastBuildDate);
        } else if (response.feedType === 'atom' && response.updated) {
          lastUpdate = new Date(response.updated);
        }

        let itunes = response.feedType === 'rss' ? {explicit: response.itunes?.explicit || false}: undefined;

        // Update the specific entity with full data
        dispatch(updateSubscriptionMetadata({
          id: feed.urlFeed,
          changes: {
            iconLocation: icon,
            itunes: itunes,
            lastUpdateTime: lastUpdate
          }
        }));
      } catch (e) {
        console.error(`Failed to hydrate ${feed.urlFeed}`, e);
      }
    }
  }
);