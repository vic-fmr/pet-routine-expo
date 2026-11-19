import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/theme-context';
import { alvoToque, espaco, raio } from '../theme';

export default function SobreScreen() {
  const { colors } = useTheme();
  return (
    <ScrollView style={[styles.screen, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: colors.text }]}>Pet Routine Expo</Text>
      <Text style={[styles.text, { color: colors.textMuted }]}>Versão 1.0.0</Text>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Equipe</Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>Alessandra Barbosa, Camila Teixeira, Lucas Rodrigues, Rayane Cavalcanti, René Lucena, Samuel Araujo, Ana Sofia e Gabriela Damásio</Text>
      </View>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.heading, { color: colors.text }]}>Arquitetura</Text>
        <Text style={[styles.text, { color: colors.textMuted }]}>Expo Router, React Native, Zustand, API REST com JWT, SQLite local, AsyncStorage, Expo Notifications e expo-updates.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: espaco.lg, gap: espaco.md },
  title: { fontSize: 30, fontWeight: '800' },
  heading: { fontSize: 20, fontWeight: '800' },
  text: { lineHeight: 22 },
  card: { minHeight: alvoToque, gap: espaco.sm, padding: espaco.md, borderRadius: raio.grande, boxShadow: '0 4px 12px rgba(38,50,56,0.08)' },
});
