import { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import * as Updates from 'expo-updates';

export function OtaStatusCard() {
  const updates = Updates.useUpdates();
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
    <View style={{ gap: 8, padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF' }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: '#263238' }}>Atualizações OTA</Text>
      <Text>Canal: {updates.currentlyRunning.channel ?? 'Não informado'}</Text>
      <Text>Runtime: {updates.currentlyRunning.runtimeVersion ?? 'Não informado'}</Text>
      <Pressable onPress={buscarAtualizacao} disabled={checking} style={{ padding: 12, borderRadius: 10, backgroundColor: '#FF8C42', alignItems: 'center' }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{checking ? 'Verificando...' : 'Buscar Atualização OTA'}</Text>
      </Pressable>
    </View>
  );
}
