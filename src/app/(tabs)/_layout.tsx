import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../../context/theme-context';

export default function TabsLayout() {
  const { isDark } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? '#17212B' : '#FEF7EE' },
        headerTintColor: isDark ? '#FFFFFF' : '#263238',
        tabBarStyle: { backgroundColor: isDark ? '#17212B' : '#FFFFFF' },
        tabBarActiveTintColor: '#FF8C42',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Meus Pets', tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} /> }} />
      <Tabs.Screen name="stats" options={{ title: 'Estatísticas', tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" size={size} color={color} /> }} />
    </Tabs>
  );
}
