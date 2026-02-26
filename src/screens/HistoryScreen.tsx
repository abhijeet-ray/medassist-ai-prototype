import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useRole } from '../context/RoleContext';
import { fetchRecordsByUser, MedicalRecord } from '../db/database';

export default function HistoryScreen() {
    const { activeUserId, activeUserName } = useRole();
    const [records, setRecords] = useState<MedicalRecord[]>([]);

    useEffect(() => {
        const loadRecords = async () => {
            try {
                if (activeUserId) {
                    const history = await fetchRecordsByUser(activeUserId);
                    setRecords(history);
                }
            } catch (error) {
                console.error('Failed to fetch records', error);
            }
        };

        loadRecords();
    }, [activeUserId]);

    return (
        <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
            <View className="px-6 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
                <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    {activeUserName}&apos;s History
                </Text>
                <Text className="text-slate-500 dark:text-slate-400 mt-1">
                    Past processed documents and summaries
                </Text>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {records.length === 0 ? (
                    <View className="mt-10 items-center justify-center">
                        <Text className="text-lg text-slate-500 dark:text-slate-400 text-center">
                            No records found.
                        </Text>
                    </View>
                ) : (
                    records.map((record) => (
                        <View key={record.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl mb-4 shadow-sm border border-slate-100 dark:border-slate-700">
                            <Text className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2">
                                {new Date(record.date_created).toLocaleString()}
                            </Text>
                            <Text className="text-base text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-3">
                                {record.ai_summary}
                            </Text>
                            <Text className="text-xs text-primary-600 dark:text-primary-400 font-bold" numberOfLines={1}>
                                Doc URI: {record.document_uri}
                            </Text>
                        </View>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
