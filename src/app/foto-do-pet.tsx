import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePetStore } from '../store/use-pet-store';
import { useTheme } from '../context/theme-context';
import { alvoToque, espaco, raio } from '../theme';

type FalhaCamera = 'camera-negada' | 'camera-bloqueada';

const MENSAGENS_FALHA: Record<FalhaCamera, string> = {
  'camera-negada': 'A câmera foi negada. Toque em “Tirar foto” novamente e permita o acesso.',
  'camera-bloqueada': 'A câmera está bloqueada. Abra Ajustes e habilite a câmera para este app.',
};

export default function TelaFotoDoPet() {
  const router = useRouter();
  const { colors } = useTheme();
  const { petId } = useLocalSearchParams<{ petId?: string }>();
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [falha, setFalha] = useState<FalhaCamera | null>(null);

  async function escolherDaGaleria() {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissao.granted) {
      setFalha(null);
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (resultado.canceled) return;
    setFotoUri(resultado.assets[0].uri);
  }

  async function tirarFoto() {
    const permissao = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissao.granted) {
      setFalha(permissao.canAskAgain ? 'camera-negada' : 'camera-bloqueada');
      return;
    }
    setFalha(null);
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (resultado.canceled) return;
    setFotoUri(resultado.assets[0].uri);
  }

  async function concluir() {
    if (petId && fotoUri) {
      await usePetStore.getState().updatePet(petId, { fotoUri });
    }
    router.back();
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={styles.preview} contentFit="cover" />
      ) : (
        <View style={[styles.preview, styles.placeholder, { backgroundColor: colors.surfaceMuted }]}><Text style={[styles.placeholderText, { color: colors.textMuted }]}>Nenhuma foto selecionada</Text></View>
      )}
      {falha && <Text accessibilityRole="alert" style={styles.error}>{MENSAGENS_FALHA[falha]}</Text>}
      <Pressable onPress={() => void tirarFoto()} accessibilityRole="button" accessibilityLabel="Tirar foto do pet" style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}><Text style={[styles.buttonText, { color: colors.primaryText }]}>Tirar foto</Text></Pressable>
      <Pressable onPress={() => void escolherDaGaleria()} accessibilityRole="button" accessibilityLabel="Escolher foto do pet na galeria" style={[styles.secondary, { borderColor: colors.primary }]}><Text style={[styles.secondaryText, { color: colors.primary }]}>Escolher da galeria</Text></Pressable>
      <Pressable onPress={() => void concluir()} disabled={!fotoUri} accessibilityRole="button" accessibilityLabel="Concluir alteração da foto" style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }, !fotoUri && styles.disabled]}><Text style={[styles.buttonText, { color: colors.primaryText }]}>Concluir</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: espaco.lg, gap: espaco.md },
  preview: { width: '100%', aspectRatio: 1, borderRadius: raio.extraGrande },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontWeight: '700' },
  error: { color: '#D32F2F', padding: 12, borderRadius: 10, backgroundColor: '#FFEBEE' },
  button: { minHeight: alvoToque, alignItems: 'center', justifyContent: 'center', padding: espaco.smd, borderRadius: raio.medio },
  disabled: { opacity: 0.45 },
  buttonText: { fontWeight: '800' },
  secondary: { minHeight: alvoToque, alignItems: 'center', justifyContent: 'center', padding: espaco.smd, borderRadius: raio.medio, borderWidth: 1 },
  secondaryText: { fontWeight: '800' },
});
