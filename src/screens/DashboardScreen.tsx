import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function DashboardScreen() {
    const router = useRouter();

    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'image/*'],
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                router.push({
                    pathname: '/results',
                    params: { fileUri: asset.uri, mimeType: asset.mimeType || 'application/pdf' }
                });
            }
        } catch (err) {
            console.log('Error selecting document:', err);
        }
    };

    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera permissions to make this work!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                router.push({
                    pathname: '/results',
                    params: { fileUri: asset.uri, mimeType: asset.mimeType || 'image/jpeg' }
                });
            }
        } catch (err) {
            console.log('Error capturing image:', err);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
            <View className="flex-1 px-6 justify-center">
                <View className="mb-10 items-center">
                    <Text className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 mt-10 text-center">
                        Upload Medical Record
                    </Text>
                    <Text className="text-slate-600 dark:text-slate-400 text-center text-lg">
                        Securely upload or scan reports for instant AI analysis and translation.
                    </Text>
                </View>

                {/* Upload Options */}
                <View className="flex-col gap-6">
                    <TouchableOpacity
                        onPress={pickDocument}
                        className="bg-white dark:bg-slate-800 border-2 border-dashed border-primary-500 rounded-3xl p-10 items-center justify-center shadow-sm"
                        accessibilityLabel="Upload PDF Document"
                        accessibilityRole="button"
                    >
                        <View className="bg-primary-50 dark:bg-slate-700 p-4 rounded-full mb-4">
                            <FontAwesome name="file-pdf-o" size={40} color="#0ea5e9" />
                        </View>
                        <Text className="text-xl font-bold text-primary-700 dark:text-primary-100 mb-1">
                            Upload PDF or Image
                        </Text>
                        <Text className="text-slate-500 dark:text-slate-400 text-center">
                            Browse your device files
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={takePhoto}
                        className="bg-teal-DEFAULT rounded-3xl p-6 flex-row items-center justify-center shadow-md shadow-teal-700/20"
                        accessibilityLabel="Take a Photo of the document"
                        accessibilityRole="button"
                    >
                        <FontAwesome5 name="camera" size={24} color="#ffffff" className="mr-3" />
                        <Text className="text-xl font-bold text-white ml-2">
                            Use Camera
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push({ pathname: '/history' } as any)}
                        className="bg-slate-200 dark:bg-slate-700 rounded-3xl p-4 flex-row items-center justify-center shadow-sm"
                    >
                        <FontAwesome5 name="history" size={20} color="#475569" className="mr-3" />
                        <Text className="text-lg font-bold text-slate-700 dark:text-slate-200">
                            View Past Records
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-auto mb-10 items-center">
                    <Text className="text-sm text-slate-400 dark:text-slate-500 text-center px-4">
                        Your documents are securely processed and never stored permanently without consent.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
