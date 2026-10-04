import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { deleteSubscriptionThunk } from "@/store/slices/subscriptions/subscriptionThunks";
import { selectAllSubscriptions } from "@/store/slices/subscriptionsSlice";
import { Feed } from "@/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, ListRenderItemInfo, StyleSheet, View } from "react-native";
import { Button, IconButton, List, Menu, Text, useTheme } from "react-native-paper";

const NoFeedScreen = () => {
    const router = useRouter();

    return (
        <View style={styles.emptyContainer}>
            <Text variant="titleMedium" style={styles.emptyText}>No feed found</Text>
            <Button icon="rss" mode="contained" onPress={() => { /* TODO: Implement Add RSS */ }} style={styles.button}>
                Add RSS feed
            </Button>
            <Button icon="import" mode="outlined" onPress={() => router.push('/import')} style={styles.button}>
                Import from another app
            </Button>
        </View>
    );
}

export default function SubscriptionsScreen() {
    const [openElementId, setOpenElementId] = useState<string | null>(null);
    const feeds = useAppSelector(selectAllSubscriptions);
    const dispatch = useAppDispatch();
    const theme = useTheme();
    const router = useRouter();

    const FeedElement = ({ item }: ListRenderItemInfo<Feed>) =>
        <List.Item
            onPress={() => router.push({
                pathname: '/feeds/[feedId]',
                params: { feedId: item.id }
            })}
            title={item.name}
            left={(props) => (
                item.iconLocation
                    ? <Image source={{ uri: item.iconLocation }} {...props} />
                    : <List.Icon {...props} icon="rss" />
            )}
            right={props => (
                <Menu
                    visible={item.id === openElementId}
                    onDismiss={() => setOpenElementId(null)}
                    anchor={<IconButton icon="dots-vertical" onPress={() => setOpenElementId(item.id)} {...props} />} >
                    <Menu.Item leadingIcon="delete" onPress={() => dispatch(deleteSubscriptionThunk(item.id))} title="Delete" />
                </Menu>
            )}
        />;


    return (
        <FlatList
            style={{ backgroundColor: theme.colors.background }}
            data={feeds}
            contentContainerStyle={feeds.length === 0 ? styles.emptyList : undefined}
            renderItem={FeedElement}
            ListEmptyComponent={NoFeedScreen}
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