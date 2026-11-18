import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signupUser } from '../../services/auth-service';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function cadastrar() {
    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await signupUser(name, email, password);
      router.replace('/(tabs)');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Criar conta</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Nome" style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="E-mail" autoCapitalize="none" keyboardType="email-address" style={styles.input} />
        <TextInput value={password} onChangeText={setPassword} placeholder="Senha" secureTextEntry style={styles.input} />
        {error && <Text style={styles.error}>{error}</Text>}
        <Pressable onPress={cadastrar} disabled={loading} style={({ pressed }) => [styles.primary, pressed && styles.pressed]}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.primaryText}>Cadastrar</Text>}
        </Pressable>
        <Link href="/(auth)/login" style={styles.link}>Já tenho conta</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#FEF7EE' },
  card: { gap: 14, padding: 20, borderRadius: 20, backgroundColor: '#FFFFFF' },
  title: { fontSize: 28, fontWeight: '800', color: '#263238', textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#CBD5DA', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12 },
  error: { color: '#D32F2F' },
  primary: { alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: '#FF8C42' },
  pressed: { opacity: 0.75 },
  primaryText: { color: '#FFFFFF', fontWeight: '800' },
  link: { color: '#FF8C42', textAlign: 'center', fontWeight: '700' },
});
