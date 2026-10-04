import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  loadItemsFromDb,
  markItemAsReadThunk,
  selectAllFeedItems,
} from '@/store/slices/itemSlice';
import { syncSubscriptionItems } from '@/store/slices/subscriptions/subscriptionThunks';
import { selectSubscriptionById } from '@/store/slices/subscriptionsSlice';
import { FeedItem } from '@/types';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { FlatList, ListRenderItemInfo, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export default function ItemReader() {
  const { feedId } = useLocalSearchParams<{ feedId: string }>();
  const dispatch = useAppDispatch();
  const allFeedItems = useAppSelector(selectAllFeedItems);
  const feed = useAppSelector((state) => (feedId ? selectSubscriptionById(state, feedId) : undefined));

  useEffect(() => {
    if (feedId) {
      dispatch(loadItemsFromDb(feedId));
    }
  }, [feedId, dispatch]);

  useEffect(() => {
    if (feed) {
      dispatch(syncSubscriptionItems([feed]));
    }
  }, [feed, dispatch]);

  const feedItems = feedId
    ? allFeedItems.filter((item) => item.feedId === feedId)
    : allFeedItems;

  const ItemElement = ({ item }: ListRenderItemInfo<FeedItem>) => {
    const formattedDate = item.pubDate
      ? new Intl.DateTimeFormat(undefined, {
          dateStyle: 'medium',
        }).format(new Date(item.pubDate))
      : '';

    return (
      <Pressable
        onPress={() => dispatch(markItemAsReadThunk(item.id))}
        style={styles.itemContainer}
      >
        <Text
          variant="titleMedium"
          style={{ color: item.isRead ? 'gray' : undefined }}
        >
          {item.title}
        </Text>
        {formattedDate ? (
          <Text variant="bodySmall" style={styles.dateText}>
            {formattedDate}
          </Text>
        ) : null}
      </Pressable>
    );
  };

  return (
    <>
      <Stack.Screen options={{ title: feed?.name ?? 'Feed' }} />
      <FlatList
        data={feedItems}
        renderItem={ItemElement}
        keyExtractor={(item) => item.id}
        contentContainerStyle={feedItems.length === 0 ? styles.emptyList : styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="titleMedium">No items yet</Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Items will show up here once this feed has been synced.
            </Text>
          </View>
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    color: 'gray',
  },
  itemContainer: {
    marginBottom: 16,
  },
  dateText: {
    marginTop: 4,
    color: 'gray',
  },
});