import {
  getAllFeedItemsDb,
  getFeedItemsByFeedIdDb,
  markFeedItemAsReadDb,
  upsertFeedItemsDb,
} from '@/db/repository';
import { FeedItem } from '@/types';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import type { RootState } from '../store';

const itemsAdapter = createEntityAdapter({
  selectId: (item: FeedItem) => item.id,
  sortComparer: (a, b) => (new Date(b.pubDate) > new Date(a.pubDate) ? 1 : -1), // Keep latest on top
});

export const loadItemsFromDb = createAsyncThunk(
  'items/loadFromDb',
  async (feedId: string | undefined, { dispatch }) => {
    const items = feedId
      ? await getFeedItemsByFeedIdDb(feedId)
      : await getAllFeedItemsDb();
    dispatch(itemsActions.receivedItems(items));
    return items;
  }
);

export const saveAndReceiveItems = createAsyncThunk(
  'items/saveAndReceive',
  async (
    { items, feedId }: { items: FeedItem[]; feedId: string },
    { dispatch }
  ) => {
    await upsertFeedItemsDb(items, feedId);
    dispatch(itemsActions.receivedItems(items));
  }
);

export const markItemAsReadThunk = createAsyncThunk(
  'items/markAsRead',
  async (itemId: string, { dispatch }) => {
    await markFeedItemAsReadDb(itemId, true);
    dispatch(itemsActions.markAsRead(itemId));
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: itemsAdapter.getInitialState(),
  reducers: {
    receivedItems: (state, action: PayloadAction<FeedItem[]>) => {
      // Freshly parsed feed items always arrive with isRead: false, so never
      // let an incoming item clear the read state of one we already have.
      const items = action.payload.map((item) => {
        const existing = state.entities[item.id];
        return existing?.isRead ? { ...item, isRead: true } : item;
      });
      itemsAdapter.upsertMany(state, items);
    },
    markAsRead: (state, action) => {
      itemsAdapter.updateOne(state, {
        id: action.payload,
        changes: { isRead: true },
      });
    },
  },
});

export const itemsActions = itemsSlice.actions;

export const {
  selectById: selectFeedItemById,
  selectAll: selectAllFeedItems,
  selectIds: selectFeedItemIds,
} = itemsAdapter.getSelectors((state: RootState) => state.items);

export default itemsSlice.reducer;