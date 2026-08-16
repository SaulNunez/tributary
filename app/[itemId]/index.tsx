import { useAppSelector } from "@/hooks/redux";
import { selectFeedItemById } from "@/store/slices/itemSlice";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, ScrollView, useWindowDimensions } from "react-native";
import RenderHtml from 'react-native-render-html';

export default function ItemReader() {
  const { itemId } = useLocalSearchParams();
  const itemIdString = itemId as string;
  const item = useAppSelector(state => selectFeedItemById(state, itemIdString));
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ padding: 20 }}>
        <RenderHtml
          contentWidth={width}
          source={{html: item.content.value}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}