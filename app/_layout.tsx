import { initDatabase } from '@/db';
import { useAppDispatch } from '@/hooks/redux';
import { loadItemsFromDb } from '@/store/slices/itemSlice';
import {
  loadSubscriptionsFromDb,
  syncSubscriptionItems,
} from '@/store/slices/subscriptions/subscriptionThunks';
import { store } from '@/store/store';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { Provider as StoreProvider } from 'react-redux';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    initDatabase().then(() => {
      dispatch(loadItemsFromDb());
      dispatch(loadSubscriptionsFromDb())
        .unwrap()
        .then((feeds) => dispatch(syncSubscriptionItems(feeds)));
    });
  }, [dispatch]);

  return null;
}

export default function RootLayout() {
  return (
    <StoreProvider store={store}>
      <PaperProvider>
        <AppInitializer />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal', title: 'Modal' }}
          />
        </Stack>
      </PaperProvider>
    </StoreProvider>
  );
}
