import { useAppDispatch } from '@/hooks/redux';
import { processOpml } from '@/opml_processor';
import { importFromOpml } from '@/store/slices/subscriptions/subscriptionThunks';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ImportScreen() {
    const dispatch = useAppDispatch();

    async function importFeed() {
        try {
            // 1. Pick the file
            const result = await DocumentPicker.getDocumentAsync({
                type: ['text/xml', 'application/xml'], // Filter for XML files
                copyToCacheDirectory: true,            // Required to read with FileSystem
            });

            if (result.canceled) return;

            const { uri } = result.assets[0];

            // 2. Read the file content as a string
            const file = new File(uri);
            const fileContent = await file.text();
            const feeds = processOpml(fileContent);
            dispatch(importFromOpml(feeds));
        } catch (error) {
            Alert.alert("Error", "Could not read the XML file.");
            throw error;
        }
    }

    return (
        <View style={styles.container}>
            <Text variant="titleMedium" style={styles.text}>
                Import followed podcasts from another app
            </Text>
            <Button mode="contained" onPress={importFeed}>
                Import
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        marginBottom: 20,
        textAlign: 'center',
    },
});
