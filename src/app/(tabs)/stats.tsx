import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { usePetStore } from '../../store/use-pet-store';
import { useAuthStore } from '../../store/use-auth-store';
import { useTheme } from '../../context/theme-context';
import { logoutUser } from '../../services/auth-service';
import { NativePetReminderSettings } from '../../components/native-pet-reminder-settings';
import { OtaStatusCard } from '../../components/ota-status-card';
import { alvoToque } from '../../theme';

export default function StatsScreen() {
  const router = useRouter();
  const pets = usePetStore((state) => state.pets);
  const user = useAuthStore((state) => state.user);
  const { isDark, toggleTheme, colors } = useTheme();
  const total = pets.length;
  const concluidos = pets.filter((pet) => pet.statusPasseio === 'concluido').length;
  const pendentes = pets.filter((pet) => pet.statusPasseio === 'pendente').length;
  const cancelados = pets.filter((pet) => pet.statusPasseio === 'cancelado').length;
  const percent = total === 0 ? 0 : Math.round((concluidos / total) * 100);

  async function sair() {
    await logoutUser();
    router.replace('/(auth)/login');
  }

  const background = colors.background;
  const card = colors.surface;
  const text = colors.text;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: background }} contentContainerStyle={styles.content}>
      <View style={[styles.profile, { backgroundColor: card }]}>
        <Text style={[styles.title, { color: text }]}>Olá, {user?.name ?? 'Tutor'}!</Text>
        <Text style={{ color: colors.textMuted }}>{user?.email}</Text>
      </View>
      <View style={styles.metrics}>
        <Metric label="Pets" value={total} card={card} text={text} />
        <Metric label="Concluídos" value={concluidos} card={card} text={text} />
        <Metric label="Pendentes" value={pendentes} card={card} text={text} />
        <Metric label="Cancelados" value={cancelados} card={card} text={text} />
      </View>
      <View style={[styles.card, { backgroundColor: card }]}>
        <Text style={[styles.cardTitle, { color: text }]}>Progresso hoje</Text>
        <Text style={[styles.percent, { color: colors.primary }]}>{percent}%</Text>
        <View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${percent}%` }]} /></View>
      </View>
      <View style={[styles.card, { backgroundColor: card }]}>
        <View style={styles.themeRow}>
          <Text style={[styles.cardTitle, { color: text }]}>Tema escuro</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            accessibilityLabel="Alternar tema claro ou escuro"
          />
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: card }]}>
        <NativePetReminderSettings />
      </View>
      <OtaStatusCard />
      <Pressable
        onPress={() => void sair()}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
        style={({ pressed }) => [styles.logout, pressed && styles.pressed]}
      >
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

function Metric({ label, value, card, text }: { label: string; value: number; card: string; text: string }) {
  return (
    <View style={[styles.metric, { backgroundColor: card }]}>
      <Text style={[styles.metricValue, { color: text }]}>{value}</Text>
      <Text style={{ color: '#607D8B', fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  profile: { gap: 4, padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(38,50,56,0.10)' },
  title: { fontSize: 24, fontWeight: '800' },
  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  metric: { width: '48%', minHeight: alvoToque, alignItems: 'center', gap: 4, padding: 14, borderRadius: 14, boxShadow: '0 4px 12px rgba(38,50,56,0.08)' },
  metricValue: { fontSize: 28, fontWeight: '800' },
  card: { gap: 10, padding: 16, borderRadius: 16, boxShadow: '0 4px 12px rgba(38,50,56,0.08)' },
  cardTitle: { fontSize: 18, fontWeight: '800' },
  percent: { fontSize: 32, fontWeight: '800' },
  progressTrack: { height: 10, borderRadius: 5, overflow: 'hidden', backgroundColor: '#E3E8EB' },
  progressFill: { height: '100%', backgroundColor: '#FF8C42' },
  themeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logout: { minHeight: alvoToque, alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, backgroundColor: '#D32F2F' },
  pressed: { opacity: 0.75 },
  logoutText: { color: '#FFFFFF', fontWeight: '800' },
});
