import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { usePetStore } from '../store/use-pet-store';

type FalhaCamera = 'camera-negada' | 'camera-bloqueada';

const MENSAGENS_FALHA: Record<FalhaCamera, string> = {
  'camera-negada': 'A câmera foi negada. Toque em “Tirar foto” novamente e permita o acesso.',
  'camera-bloqueada': 'A câmera está bloqueada. Abra Ajustes e habilite a câmera para este app.',
};

export default function TelaFotoDoPet() {
  const router = useRouter();
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
    <View style={styles.screen}>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={styles.preview} contentFit="cover" />
      ) : (
        <View style={[styles.preview, styles.placeholder]}><Text style={styles.placeholderText}>Nenhuma foto selecionada</Text></View>
      )}
      {falha && <Text style={styles.error}>{MENSAGENS_FALHA[falha]}</Text>}
      <Pressable onPress={() => void tirarFoto()} style={styles.button}><Text style={styles.buttonText}>Tirar foto</Text></Pressable>
      <Pressable onPress={() => void escolherDaGaleria()} style={styles.secondary}><Text style={styles.secondaryText}>Escolher da galeria</Text></Pressable>
      <Pressable onPress={() => void concluir()} disabled={!fotoUri} style={[styles.button, !fotoUri && styles.disabled]}><Text style={styles.buttonText}>Concluir</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 24, gap: 16, backgroundColor: '#FEF7EE' },
  preview: { width: '100%', aspectRatio: 1, borderRadius: 20 },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF2F4' },
  placeholderText: { color: '#607D8B', fontWeight: '700' },
  error: { color: '#D32F2F', padding: 12, borderRadius: 10, backgroundColor: '#FFEBEE' },
  button: { alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: '#FF8C42' },
  disabled: { opacity: 0.45 },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  secondary: { alignItems: 'center', padding: 14, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#FF8C42' },
  secondaryText: { color: '#C76525', fontWeight: '800' },
});
