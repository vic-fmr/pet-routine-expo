import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/theme-context';

export default function TabsLayout() {
  const { colors, isDark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
        tabBarActiveTintColor: isDark ? '#F7FAFC' : colors.primary,
        tabBarInactiveTintColor: isDark ? '#F7FAFC' : colors.textMuted,
        tabBarLabelStyle: {
          color: isDark ? '#F7FAFC' : colors.textMuted,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Meus Pets', tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Estatísticas', tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }} />
    </Tabs>
  );
}
