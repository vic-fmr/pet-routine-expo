import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { ThemeProvider, useTheme } from '../context/theme-context';
import { useAuthStore } from '../store/use-auth-store';

function AppShell() {
  const router = useRouter();
  const segments = useSegments();
  const { sessionToken, isHydrated } = useAuthStore();
  const { isDark, colors } = useTheme();

  useEffect(() => {
    if (!isHydrated) return;
    if (!sessionToken && segments[0] !== '(auth)') router.replace('/(auth)/login');
    if (sessionToken && segments[0] === '(auth)') router.replace('/(tabs)');
  }, [sessionToken, isHydrated, segments, router]);

  useEffect(() => {
    const received = Notifications.addNotificationReceivedListener(() => undefined);
    const response = Notifications.addNotificationResponseReceivedListener((notification) => {
      const data = notification.notification.request.content.data;
      const petId = data?.petId;
      if (typeof petId === 'string') router.push(`/pet/${petId}`);
    });
    return () => {
      received.remove();
      response.remove();
    };
  }, [router]);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="pet/[id]"
          options={{
            headerShown: true,
            title: 'Detalhes do pet',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="foto-do-pet"
          options={{
            headerShown: true,
            title: 'Foto do pet',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="sobre"
          options={{
            headerShown: true,
            title: 'Sobre',
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { color: colors.text, fontWeight: '700' },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <GluestackUIProvider config={config}>
        <AppShell />
      </GluestackUIProvider>
    </ThemeProvider>
  );
}
