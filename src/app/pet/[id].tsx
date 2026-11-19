import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { usePetStore } from '../../store/use-pet-store';
import { useTheme } from '../../context/theme-context';
import { rotuloEspecie, rotuloStatusPasseio, type Pet } from '../../types/pet';
import { WalkTimer } from '../../components/walk-timer';
import { listarSessoesPasseio, salvarSessaoPasseio, type PasseioLog } from '../../services/passeio-db';
import { agendarLembretePasseio } from '../../services/notifications';
import { alvoToque, espaco, raio } from '../../theme';

export default function PetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const pets = usePetStore((state) => state.pets);
  const pet = useMemo(() => pets.find((item) => item.id === id), [pets, id]);
  const { togglePasseio, registrarPasseio, removePet } = usePetStore();
  const { colors } = useTheme();
  const [logs, setLogs] = useState<PasseioLog[]>([]);
  const [sensorError, setSensorError] = useState<string | null>(null);
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    if (!pet) return;
    void listarSessoesPasseio(pet.id).then(setLogs).catch(() => setLogs([]));
  }, [pet]);

  async function registrarComFoto() {
    const serviceEnabled = await Location.hasServicesEnabledAsync();
    if (!serviceEnabled) {
      setSensorError('O serviço de localização está desligado. Ative o GPS nas configurações do aparelho.');
      return;
    }

    const locationPermission = await Location.requestForegroundPermissionsAsync();
    let local: Pet['local'] | undefined;
    if (!locationPermission.granted) {
      setSensorError(locationPermission.canAskAgain
        ? 'Permissão de localização negada. Toque novamente e permita o acesso.'
        : 'Permissão de localização bloqueada. Abra Ajustes e habilite a localização.');
      return;
    }

    // High accuracy balances practical walking-route precision and battery use.
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    local = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      precisaoMetros: position.coords.accuracy ?? 0,
    };
    setSensorError(null);
    await registrarPasseio(pet!.id, local);
  }

  async function escolherFoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setSensorError('Acesso à galeria negado. Permita o acesso nas configurações do aparelho.');
      return;
    }
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (resultado.canceled) return;
    await registrarPasseio(pet!.id, pet?.local, resultado.assets[0].uri);
  }

  async function salvarTempo(seconds: number) {
    if (!pet) return;
    await salvarSessaoPasseio(pet.id, seconds);
    setLogs(await listarSessoesPasseio(pet.id));
  }

  async function agendar() {
    if (!pet) return;
    const scheduled = await agendarLembretePasseio(pet.id, pet.nome);
    setNotificationSent(scheduled);
  }

  async function excluir() {
    if (!pet) return;
    Alert.alert('Excluir pet', `Deseja excluir ${pet.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => {
        void removePet(pet.id).then(() => router.back());
      } },
    ]);
  }

  if (!pet) {
    return <View style={styles.center}><Text>Pet não encontrado.</Text><Link href="/(tabs)" style={styles.link}>Voltar</Link></View>;
  }

  const background = colors.background;
  const text = colors.text;
  return (
    <ScrollView style={{ flex: 1, backgroundColor: background }} contentContainerStyle={styles.content}>
      {pet.fotoUri ? (
        <Image source={{ uri: pet.fotoUri }} style={styles.hero} contentFit="cover" recyclingKey={pet.id} />
      ) : (
        <View style={[styles.hero, styles.placeholder]}><Text style={styles.placeholderText}>🐾</Text></View>
      )}
      <View style={styles.card}>
        <Text style={[styles.name, { color: text }]}>{pet.nome}</Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>{rotuloEspecie(pet.especie)}</Text>
          <Text style={styles.badge}>{pet.porte}</Text>
          <Text style={styles.badge}>{pet.idadeMeses} meses</Text>
          <Text style={styles.statusBadge}>{rotuloStatusPasseio(pet.statusPasseio)}</Text>
        </View>
        {pet.local ? (
          <Text style={{ color: text }}>
            Último local: {pet.local.latitude.toFixed(5)}, {pet.local.longitude.toFixed(5)} (±{Math.round(pet.local.precisaoMetros)}m)
          </Text>
        ) : <Text style={{ color: text }}>Nenhuma coordenada registrada.</Text>}
      </View>
      {sensorError && <Text style={styles.error}>{sensorError}</Text>}
      <View style={styles.actions}>
        <Pressable onPress={() => void togglePasseio(pet.id)} accessibilityRole="button" accessibilityLabel={`Alternar status de ${pet.nome}`} style={styles.action}><Text style={styles.actionText}>Alternar status</Text></Pressable>
        <Pressable onPress={() => void registrarComFoto()} accessibilityRole="button" accessibilityLabel={`Registrar passeio de ${pet.nome} com GPS`} style={styles.action}><Text style={styles.actionText}>Registrar com GPS</Text></Pressable>
        <Pressable onPress={() => void escolherFoto()} accessibilityRole="button" accessibilityLabel={`Escolher foto para o passeio de ${pet.nome}`} style={styles.action}><Text style={styles.actionText}>Escolher foto</Text></Pressable>
        <Link href={{ pathname: '/foto-do-pet', params: { petId: pet.id } }} style={styles.actionLink} accessibilityRole="button">Abrir câmera e galeria</Link>
      </View>
      <WalkTimer onSalvar={(seconds) => void salvarTempo(seconds)} />
      <Pressable onPress={() => void agendar()} accessibilityRole="button" accessibilityLabel="Agendar lembrete de passeio para cinco segundos" style={styles.action}><Text style={styles.actionText}>Agendar lembrete em 5 segundos</Text></Pressable>
      {notificationSent && <Text style={styles.success}>Lembrete agendado.</Text>}
      <View style={styles.card}>
        <Text style={[styles.sectionTitle, { color: text }]}>Histórico local</Text>
        {logs.length === 0 ? <Text style={{ color: text }}>Nenhuma sessão registrada ainda.</Text> : logs.map((log) => (
          <View key={log.id} style={styles.logRow}>
            <Text style={{ color: text }}>{Math.floor(log.seconds / 60)}m {log.seconds % 60}s</Text>
            <Text style={{ color: text }}>{new Date(log.createdAt).toLocaleString()}</Text>
          </View>
        ))}
      </View>
      <Pressable onPress={() => void excluir()} accessibilityRole="button" accessibilityLabel={`Excluir ${pet.nome}`} style={styles.delete}><Text style={styles.actionText}>Excluir pet</Text></Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: espaco.smd, padding: espaco.md, paddingBottom: espaco.xl },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  link: { color: '#FF8C42', fontWeight: '700' },
  hero: { width: '100%', aspectRatio: 1.35, borderRadius: 20 },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF2F4' },
  placeholderText: { fontSize: 72 },
  card: { gap: 10, padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(38,50,56,0.08)' },
  name: { fontSize: 28, fontWeight: '800' },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12, backgroundColor: '#EDF2F4', color: '#455A64', fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 12, backgroundColor: '#FFF0E5', color: '#C76525', fontWeight: '700' },
  error: { color: '#D32F2F', padding: 10, borderRadius: 10, backgroundColor: '#FFEBEE' },
  success: { color: '#2E7D32', fontWeight: '700' },
  actions: { gap: 8 },
  action: { minHeight: alvoToque, justifyContent: 'center', alignItems: 'center', padding: espaco.smd, borderRadius: raio.medio, backgroundColor: '#FF8C42' },
  actionLink: { minHeight: alvoToque, textAlign: 'center', textAlignVertical: 'center', padding: espaco.smd, borderRadius: raio.medio, backgroundColor: '#FFE2CD', color: '#263238', fontWeight: '700' },
  actionText: { color: '#FFFFFF', fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '800' },
  logRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8, paddingVertical: 6 },
  delete: { minHeight: alvoToque, justifyContent: 'center', alignItems: 'center', padding: espaco.smd, borderRadius: raio.medio, backgroundColor: '#D32F2F' },
});
