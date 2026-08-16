import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { markItemAsReadThunk, selectAllFeedItems } from "@/store/slices/itemSlice";
import { selectAllSubscriptions } from "@/store/slices/subscriptionsSlice";
import { FeedItem } from "@/types";
import { useRouter } from "expo-router";
import { FlatList, Image, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Button, List, Text, useTheme } from "react-native-paper";

const NoItemsScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>No items yet</Text>
            <Button icon="rss" mode="contained" onPress={() => router.push('/subscriptions')} style={styles.button}>
                Manage subscriptions
            </Button>
        </View>
    );
}

export default function HomeScreen() {
    const items = useAppSelector(selectAllFeedItems);
    const feeds = useAppSelector(selectAllSubscriptions);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();

    const feedsById = Object.fromEntries(feeds.map((feed) => [feed.id, feed]));

    const ItemElement = ({ item }: ListRenderItemInfo<FeedItem>) => {
        const feed = feedsById[item.feedId];
        const formattedDate = item.pubDate
            ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(item.pubDate))
            : '';

        return (
            <List.Item
                onPress={() => {
                    dispatch(markItemAsReadThunk(item.id));
                    router.push({
                        pathname: '/[itemId]',
                        params: { itemId: item.id },
                    });
                }}
                title={item.title}
                titleStyle={{ color: item.isRead ? theme.colors.onSurfaceDisabled : undefined }}
                description={[feed?.name, formattedDate].filter(Boolean).join(' · ')}
                left={(props) => (
                    feed?.iconLocation
                        ? <Image source={{ uri: feed.iconLocation }} {...props} />
                        : <List.Icon {...props} icon="rss" />
                )}
            />
        );
    };

    return (
        <FlatList
            style={{ backgroundColor: theme.colors.background }}
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={items.length === 0 ? styles.emptyList : undefined}
            renderItem={ItemElement}
            ListEmptyComponent={NoItemsScreen}
        />
    );
}

const styles = StyleSheet.create({
    emptyList: {
        flexGrow: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        gap: 12,
    },
    emptyText: {
        marginBottom: 8,
    },
    button: {
        width: '100%',
    }
});
