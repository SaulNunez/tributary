import { Feed } from '@/types';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

const subscriptionsAdapter = createEntityAdapter({
  selectId: (subscription: Feed) => subscription.id,
});



const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState: subscriptionsAdapter.getInitialState(),
  reducers: {
    addSubscription: subscriptionsAdapter.addOne,
    removeSubscription: subscriptionsAdapter.removeOne,
    updateSubscriptionMetadata: subscriptionsAdapter.updateOne,
    bulkAddSubscriptions: subscriptionsAdapter.addMany,
  },
});

export const { bulkAddSubscriptions, addSubscription, 
  removeSubscription, updateSubscriptionMetadata } = subscriptionsSlice.actions;

export default subscriptionsSlice.reducer;