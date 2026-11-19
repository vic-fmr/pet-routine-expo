import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import * as Updates from 'expo-updates';
import { useTheme } from '../context/theme-context';
import { alvoToque, espaco, raio } from '../theme';

export function OtaStatusCard() {
  const updates = Updates.useUpdates();
  const { colors } = useTheme();
  const [checking, setChecking] = useState(false);

  async function buscarAtualizacao() {
    if (__DEV__) {
      Alert.alert('OTA', 'OTA desabilitado em modo de desenvolvimento.');
      return;
    }
    setChecking(true);
    try {
      const check = await Updates.checkForUpdateAsync();
      if (check.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert('OTA', 'Seu aplicativo já está atualizado.');
      }
    } catch {
      Alert.alert('OTA', 'Não foi possível verificar atualizações.');
    } finally {
      setChecking(false);
    }
  }

  return (
    <View style={{ gap: espaco.sm, padding: espaco.md, borderRadius: raio.grande, backgroundColor: colors.surface }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: colors.text }}>Atualizações OTA</Text>
      <Text style={{ color: colors.textMuted }}>Canal: {updates.currentlyRunning.channel ?? 'Não informado'}</Text>
      <Text style={{ color: colors.textMuted }}>Runtime: {updates.currentlyRunning.runtimeVersion ?? 'Não informado'}</Text>
      <Pressable
        onPress={buscarAtualizacao}
        disabled={checking}
        accessibilityRole="button"
        accessibilityLabel="Buscar atualização OTA"
        style={({ pressed }) => ({ minHeight: alvoToque, justifyContent: 'center', padding: espaco.smd, borderRadius: raio.medio, backgroundColor: pressed ? colors.primaryPressed : colors.primary, opacity: checking ? 0.7 : 1, alignItems: 'center' })}
      >
        <Text style={{ color: colors.primaryText, fontWeight: '700' }}>{checking ? 'Verificando...' : 'Buscar Atualização OTA'}</Text>
      </Pressable>
    </View>
  );
}
