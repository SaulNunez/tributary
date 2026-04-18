import { FeedItem } from '@/types';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const itemsAdapter = createEntityAdapter({
  selectId: (item: FeedItem) => item.id,
  sortComparer: (a, b) => new Date(b.pubDate) > new Date(a.pubDate )? 1 : -1, // Keep latest on top
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: itemsAdapter.getInitialState(),
  reducers: {
    // This handles the "Merge" logic automatically
    receivedItems: (state, action) => {
      itemsAdapter.upsertMany(state, action.payload);
    },
    markAsRead: (state, action) => {
      itemsAdapter.updateOne(state, { id: action.payload, changes: { isRead: true } });
    }
  },
});

export const itemsActions = itemsSlice.actions;

export default itemsSlice.reducer;