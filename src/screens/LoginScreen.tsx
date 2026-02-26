import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Role, useRole } from '../context/RoleContext';
import { createUser, fetchAllUsers, User } from '../db/database';

const ROLES: Role[] = ['Doctor', 'Patient', 'ASHA Worker'];

export default function LoginScreen() {
    const { role, setRole, setActiveUserId, setActiveUserName } = useRole();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState<Role>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const allUsers = await fetchAllUsers();
            setUsers(allUsers);
        } catch (error) {
            console.error(error);
        }
    };

    const handleSelectUser = (user: User) => {
        setSelectedUserId(user.id);
        setRole(user.role);
        setActiveUserId(user.id);
        setActiveUserName(user.name);
    };

    const handleCreateUser = async () => {
        if (!newName || !newRole) return;
        try {
            const id = await createUser(newName, newRole);
            await loadUsers();
            setIsCreating(false);
            setNewName('');
            setNewRole(null);

            // Auto-select
            setSelectedUserId(id);
            setRole(newRole);
            setActiveUserId(id);
            setActiveUserName(newName);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogin = () => {
        if (role && selectedUserId) {
            router.push('/dashboard');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-surface-light dark:bg-surface-dark">
            <View className="flex-1 px-6 justify-center">
                <View className="mb-8 items-center">
                    <Text className="text-4xl font-bold text-primary-700 dark:text-primary-100 mb-2 mt-10">
                        MedAssist AI
                    </Text>
                    <Text className="text-lg text-slate-600 dark:text-slate-400 text-center">
                        Your intelligence partner in healthcare
                    </Text>
                </View>

                <View className="mb-4">
                    <Text className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                        Select Profile
                    </Text>

                    <ScrollView className="max-h-60 mb-4" showsVerticalScrollIndicator={false}>
                        {users.map((u) => {
                            const isActive = selectedUserId === u.id;
                            return (
                                <TouchableOpacity
                                    key={u.id}
                                    onPress={() => handleSelectUser(u)}
                                    className={`p-4 mb-2 rounded-xl border-2 flex-row items-center justify-between ${isActive ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/40' : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800'}`}
                                >
                                    <View>
                                        <Text className={`text-lg font-bold ${isActive ? 'text-primary-700 dark:text-primary-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {u.name}
                                        </Text>
                                        <Text className={`text-sm ${isActive ? 'text-primary-600 dark:text-primary-200' : 'text-slate-500 dark:text-slate-400'}`}>
                                            Role: {u.role}
                                        </Text>
                                    </View>
                                    <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isActive ? 'border-primary-500' : 'border-slate-300 dark:border-slate-600'}`}>
                                        {isActive && <View className="w-3 h-3 rounded-full bg-primary-500" />}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                        {users.length === 0 && (
                            <Text className="text-slate-500 dark:text-slate-400 italic mb-4">No profiles found.</Text>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => setIsCreating(true)}
                        className="py-3 items-center border-2 border-dashed border-primary-400 rounded-xl"
                    >
                        <Text className="text-primary-600 dark:text-primary-300 font-bold">+ Create New Profile</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    disabled={!selectedUserId}
                    className={`py-4 mt-4 rounded-xl items-center shadow-md ${selectedUserId ? 'bg-teal-DEFAULT opacity-100' : 'bg-slate-300 dark:bg-slate-700 opacity-70'}`}
                >
                    <Text className={`text-xl font-bold ${selectedUserId ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                        Continue to Dashboard
                    </Text>
                </TouchableOpacity>

                {/* Create Profile Modal */}
                <Modal visible={isCreating} animationType="slide" transparent={true}>
                    <View className="flex-1 justify-center px-6 bg-black/50">
                        <View className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700">
                            <Text className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create Profile</Text>

                            <Text className="text-slate-600 dark:text-slate-300 mb-2 font-semibold">Name</Text>
                            <TextInput
                                value={newName}
                                onChangeText={setNewName}
                                placeholder="e.g. Dr. Sharma"
                                className="border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 mb-4 text-slate-800 dark:text-slate-100"
                                placeholderTextColor="#94a3b8"
                            />

                            <Text className="text-slate-600 dark:text-slate-300 mb-2 font-semibold">Role</Text>
                            <View className="flex-col gap-2 mb-6">
                                {ROLES.map((r) => (
                                    <TouchableOpacity
                                        key={r}
                                        onPress={() => setNewRole(r)}
                                        className={`p-3 rounded-xl border-2 ${newRole === r ? 'border-primary-500 bg-primary-50 dark:bg-primary-900' : 'border-slate-200 dark:border-slate-700'}`}
                                    >
                                        <Text className={`font-semibold ${newRole === r ? 'text-primary-700 dark:text-primary-100' : 'text-slate-700 dark:text-slate-300'}`}>{r}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View className="flex-row gap-4">
                                <TouchableOpacity onPress={() => setIsCreating(false)} className="flex-1 py-3 items-center bg-slate-200 dark:bg-slate-700 rounded-xl">
                                    <Text className="font-bold text-slate-600 dark:text-slate-300">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleCreateUser}
                                    disabled={!newName || !newRole}
                                    className={`flex-1 py-3 items-center rounded-xl ${newName && newRole ? 'bg-primary-600' : 'bg-primary-300'}`}
                                >
                                    <Text className="font-bold text-white">Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
}
