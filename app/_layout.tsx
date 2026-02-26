import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { RoleProvider } from '../src/context/RoleContext';
import { initDb } from '../src/db/database';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDb().catch(console.error);
  }, []);

  return (
    <RoleProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="dashboard" options={{ headerShown: true, title: 'Dashboard' }} />
          <Stack.Screen name="results" options={{ headerShown: true, title: 'AI Results' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </RoleProvider>
  );
}
