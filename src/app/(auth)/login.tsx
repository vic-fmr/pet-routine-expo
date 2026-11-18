import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { loginUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';

export default function LoginScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function entrar() {
    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await loginUser(email, password);
      router.replace('/(tabs)');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  const colors = isDark ? dark : light;
  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.card}>
        <Text className="text-3xl font-bold text-center" style={[styles.title, { color: colors.text }]}>Pet Routine 🐾</Text>
        <Text style={{ color: colors.muted }}>Entre para cuidar da rotina dos seus pets.</Text>
        <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        {error && <Text style={{ color: '#D32F2F' }}>{error}</Text>}
        <Pressable onPress={entrar} disabled={loading} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Entrar</Text>}
        </Pressable>
        <Link href="/(auth)/signup" style={{ color: colors.primary, textAlign: 'center', fontWeight: '700' }}>Criar uma conta</Link>
      </View>
    </View>
  );
}

const light = { background: '#FEF7EE', text: '#263238', muted: '#607D8B', border: '#CBD5DA', primary: '#FF8C42' };
const dark = { background: '#17212B', text: '#F7FAFC', muted: '#B0BEC5', border: '#455A64', primary: '#FFAB76' };
const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24 },
  card: { gap: 14, padding: 20, borderRadius: 20, backgroundColor: '#FFFFFF18' },
  title: { fontSize: 30, fontWeight: '800', textAlign: 'center' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  primary: { alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: '#FF8C42' },
  pressed: { opacity: 0.75 },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
});
