import itemsReducer, {
  itemsActions,
  saveAndReceiveItems,
} from '@/store/slices/itemSlice';
import { FeedItem } from '@/types';
import { configureStore } from '@reduxjs/toolkit';

jest.mock('@/db/repository', () => ({
  getAllFeedItemsDb: jest.fn().mockResolvedValue([]),
  getFeedItemsByFeedIdDb: jest.fn().mockResolvedValue([]),
  markFeedItemAsReadDb: jest.fn().mockResolvedValue(undefined),
  upsertFeedItemsDb: jest.fn().mockResolvedValue(undefined),
}));

const makeItem = (id: string, overrides: Partial<FeedItem> = {}): FeedItem => ({
  id,
  feedId: 'feed-1',
  title: `Item ${id}`,
  link: `https://example.com/${id}`,
  pubDate: '2026-08-06T00:00:00.000Z',
  isRead: false,
  content: { type: 'text', value: '' },
  ...overrides,
});

const makeStore = () => configureStore({ reducer: { items: itemsReducer } });

describe('itemSlice receivedItems', () => {
  it('keeps isRead when an already-read item is received again as unread', () => {
    let state = itemsReducer(undefined, itemsActions.receivedItems([makeItem('a')]));
    state = itemsReducer(state, itemsActions.markAsRead('a'));

    state = itemsReducer(
      state,
      itemsActions.receivedItems([makeItem('a', { title: 'Updated title' })])
    );

    expect(state.entities['a']?.isRead).toBe(true);
    expect(state.entities['a']?.title).toBe('Updated title');
  });

  it('adds new items as unread', () => {
    const state = itemsReducer(undefined, itemsActions.receivedItems([makeItem('b')]));
    expect(state.entities['b']?.isRead).toBe(false);
  });

  it('accepts read state from the payload', () => {
    const state = itemsReducer(
      undefined,
      itemsActions.receivedItems([makeItem('c', { isRead: true })])
    );
    expect(state.entities['c']?.isRead).toBe(true);
  });
});

describe('saveAndReceiveItems', () => {
  it('does not clear read state for items already in the store', async () => {
    const store = makeStore();
    store.dispatch(itemsActions.receivedItems([makeItem('a', { isRead: true }), makeItem('b')]));

    await store.dispatch(
      saveAndReceiveItems({
        items: [makeItem('a'), makeItem('b'), makeItem('c')],
        feedId: 'feed-1',
      })
    );

    const { entities } = store.getState().items;
    expect(entities['a']?.isRead).toBe(true);
    expect(entities['b']?.isRead).toBe(false);
    expect(entities['c']?.isRead).toBe(false);
  });
});
