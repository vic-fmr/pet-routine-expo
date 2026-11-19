import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { signupUser } from '../../services/auth-service';
import { useTheme } from '../../context/theme-context';
import { alvoToque, espaco, raio } from '../../theme';

export default function SignupScreen() {
  const router = useRouter();
  const { colors } = useTheme();
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
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
          <TextInput value={name} onChangeText={setName} placeholder="Como devemos chamar você?" placeholderTextColor={colors.textMuted} textContentType="name" accessibilityLabel="Nome" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>E-mail</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="nome@exemplo.com" placeholderTextColor={colors.textMuted} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" accessibilityLabel="E-mail" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} />
        </View>
        <View style={styles.field}>
          <Text style={[styles.label, { color: colors.text }]}>Senha</Text>
          <TextInput value={password} onChangeText={setPassword} placeholder="Mínimo de 4 caracteres" placeholderTextColor={colors.textMuted} secureTextEntry textContentType="newPassword" accessibilityLabel="Senha" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} />
        </View>
        {error && <Text accessibilityRole="alert" style={[styles.error, { color: colors.error }]}>{error}</Text>}
        <Pressable onPress={() => void cadastrar()} disabled={loading} accessibilityRole="button" accessibilityLabel="Cadastrar nova conta" style={({ pressed }) => [styles.primary, { backgroundColor: pressed ? colors.primaryPressed : colors.primary, opacity: loading ? 0.7 : 1 }]}>
          {loading ? <ActivityIndicator color={colors.primaryText} /> : <Text style={[styles.primaryText, { color: colors.primaryText }]}>Cadastrar</Text>}
        </Pressable>
        <Link href="/(auth)/login" style={{ color: colors.primary, minHeight: alvoToque, textAlign: 'center', textAlignVertical: 'center', fontWeight: '700' }}>Já tenho conta</Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', padding: espaco.lg },
  card: { gap: espaco.smd, padding: espaco.lg, borderRadius: raio.extraGrande, boxShadow: '0 8px 24px rgba(38,50,56,0.12)' },
  title: { fontSize: 28, fontWeight: '800', textAlign: 'center' },
  field: { gap: espaco.xs },
  label: { fontSize: 14, fontWeight: '700' },
  input: { minHeight: alvoToque, borderWidth: 1, borderRadius: raio.medio, paddingHorizontal: espaco.smd, fontSize: 16 },
  error: { fontSize: 14, fontWeight: '700' },
  primary: { minHeight: alvoToque, alignItems: 'center', justifyContent: 'center', paddingHorizontal: espaco.md, borderRadius: raio.medio },
  primaryText: { fontSize: 16, fontWeight: '800' },
});
