import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useRole } from '../context/RoleContext';
import { saveMedicalRecord } from '../db/database';
import { processMedicalDocument } from '../services/geminiService';

export default function ResultsScreen() {
    const { role, activeUserId } = useRole();
    const { fileUri, mimeType } = useLocalSearchParams<{ fileUri: string, mimeType: string }>();

    const [language, setLanguage] = useState<'english' | 'hindi'>('english');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(true);
    const [summary, setSummary] = useState('');
    const [error, setError] = useState<string | null>(null);

    const currentRole = role || 'Patient';
    const isProfessional = currentRole === 'Doctor';

    const analyzeDocument = useCallback(async () => {
        try {
            setIsProcessing(true);
            setError(null);

            // 1. Process with Gemini
            const resultText = await processMedicalDocument(fileUri, mimeType, currentRole);
            setSummary(resultText);

            // 2. Save to history
            if (activeUserId) {
                await saveMedicalRecord(activeUserId, fileUri, resultText);
            }
        } catch (err: any) {
            console.error('Failed to process document', err);
            setError(err.message || 'An error occurred while analyzing the document.');
        } finally {
            setIsProcessing(false);
        }
    }, [fileUri, mimeType, currentRole, activeUserId]);

    useEffect(() => {
        if (fileUri && mimeType) {
            analyzeDocument();
        } else {
            setIsProcessing(false);
            setError('No document provided.');
        }
    }, [fileUri, mimeType, analyzeDocument]);

    const textClassName = isProfessional
        ? "text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium"
        : "text-2xl text-slate-800 dark:text-slate-100 leading-snug font-semibold";

    const handlePlayAudio = () => {
        setIsPlaying(!isPlaying);
    };

    if (isProcessing) {
        return (
            <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark justify-center items-center">
                <ActivityIndicator size="large" color="#0ea5e9" />
                <Text className="mt-4 text-lg font-bold text-primary-700 dark:text-primary-100">
                    Analyzing Document...
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 mt-2 text-center px-6">
                    Using Gemini 1.5 Flash to extract and summarize your medical record based on your profile.
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark bg-white">
            <View className="px-6 pt-10 pb-4 flex-row justify-between items-center bg-white dark:bg-slate-900 shadow-sm z-10 border-b border-slate-100 dark:border-slate-800">
                <View className="flex-row bg-slate-100 dark:bg-slate-800 rounded-lg p-1 mt-4">
                    <TouchableOpacity
                        onPress={() => setLanguage('english')}
                        className={`px-4 py-2 rounded-md ${language === 'english' ? 'bg-white border border-slate-200 dark:border-slate-700 shadow-sm dark:bg-slate-700' : ''}`}
                    >
                        <Text className={`font-bold ${language === 'english' ? 'text-primary-700 dark:text-primary-100' : 'text-slate-500 dark:text-slate-400'}`}>ENG</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setLanguage('hindi')}
                        className={`px-4 py-2 rounded-md ${language === 'hindi' ? 'bg-white border border-slate-200 dark:border-slate-700 shadow-sm dark:bg-slate-700' : ''}`}
                    >
                        <Text className={`font-bold ${language === 'hindi' ? 'text-primary-700 dark:text-primary-100' : 'text-slate-500 dark:text-slate-400'}`}>हिंदी</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-6 pt-6 mb-[120px]">
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="text-sm font-bold text-teal-DEFAULT tracking-widest uppercase">
                        {currentRole} View
                    </Text>

                    <TouchableOpacity
                        onPress={handlePlayAudio}
                        className={`flex-row items-center px-4 py-2 rounded-full ${isPlaying ? 'bg-primary-100 dark:bg-primary-900 border border-primary-500' : 'bg-primary-50 dark:bg-slate-800'}`}
                    >
                        <FontAwesome5 name={isPlaying ? "stop-circle" : "play-circle"} size={20} color="#0ea5e9" />
                        <Text className="ml-2 font-bold text-primary-700 dark:text-primary-100">
                            {isPlaying ? 'Stop' : 'Read Aloud'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {error ? (
                    <View className="bg-red-50 dark:bg-red-900/20 rounded-3xl p-6 border border-red-200 dark:border-red-800">
                        <Text className="text-red-700 dark:text-red-400 font-bold mb-2">Error Processing Document</Text>
                        <Text className="text-red-600 dark:text-red-300">{error}</Text>
                        <TouchableOpacity onPress={analyzeDocument} className="mt-4 bg-red-100 dark:bg-red-800/50 py-2 rounded-lg items-center">
                            <Text className="text-red-700 dark:text-red-300 font-bold">Try Again</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View className={`bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border ${isProfessional ? 'border-primary-100 dark:border-slate-700' : 'border-teal-100/50 dark:border-teal-900'}`}>
                        <Text className={textClassName}>
                            {summary || "No summary available."}
                        </Text>
                    </View>
                )}

                <View className="mt-4 flex-row items-center justify-end px-2">
                    <MaterialIcons name="verified-user" size={18} color="#14b8a6" />
                    <Text className="ml-1 text-teal-DEFAULT font-bold text-sm">
                        AI Generated Summary
                    </Text>
                </View>
            </ScrollView>

            <View className="absolute bottom-0 w-full bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 pb-10 flex-row items-start shadow-lg">
                <View className="mt-0.5 w-[24px]">
                    <MaterialIcons name="info-outline" size={24} color="#64748b" />
                </View>
                <View className="ml-3 flex-1">
                    <Text className="text-slate-700 dark:text-slate-300 font-bold mb-1">
                        Important Disclaimer
                    </Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-sm leading-tight text-wrap">
                        MedAssist AI provides informational insights only and does not substitute professional medical diagnosis. Always consult a certified doctor before making medical decisions.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}
