import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, SectionList, StyleSheet, Text, TextInput, View } from 'react-native';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import { usePetStore } from '../../store/use-pet-store';
import { useTheme } from '../../context/theme-context';
import { agrupar, filtrarPorNome, type Secao } from '../../lib/agrupar';
import type { EspeciePet, Pet, PortePet } from '../../types/pet';
import { rotuloEspecie, rotuloStatusPasseio } from '../../types/pet';

const ESPECIES: EspeciePet[] = ['cachorro', 'gato', 'ave', 'outro'];
const PORTES: PortePet[] = ['pequeno', 'medio', 'grande'];

function PetCard({ pet, onToggle }: { pet: Pet; onToggle: (id: string) => void }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push(`/pet/${pet.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${pet.nome}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {pet.fotoUri ? (
        <Image source={{ uri: pet.fotoUri }} style={styles.photo} contentFit="cover" recyclingKey={pet.id} />
      ) : (
        <View style={[styles.photo, styles.placeholder]}><Text style={styles.placeholderText}>🐾</Text></View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.petName}>{pet.nome}</Text>
        <View style={styles.badges}>
          <Text style={styles.badge}>{rotuloEspecie(pet.especie)}</Text>
          <Text style={[styles.badge, styles.status]}>{rotuloStatusPasseio(pet.statusPasseio)}</Text>
        </View>
        <Text style={styles.age}>{pet.idadeMeses} meses</Text>
        <Pressable
          onPress={() => onToggle(pet.id)}
          accessibilityRole="button"
          accessibilityLabel={`Alternar passeio de ${pet.nome}`}
          style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
        >
          <Text style={styles.toggleText}>Alternar passeio</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function PetsScreen() {
  const { pets, isLoading, error, fetchPets, addPet, togglePasseio } = usePetStore();
  const { isDark } = useTheme();
  const [busca, setBusca] = useState('');
  const [modal, setModal] = useState(false);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<EspeciePet>('cachorro');
  const [porte, setPorte] = useState<PortePet>('medio');
  const [idade, setIdade] = useState('12');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (usePetStore.getState().pets.length === 0) void fetchPets();
  }, [fetchPets]);

  const secoes = useMemo(() => agrupar(filtrarPorNome(pets, busca)), [pets, busca]);

  async function cadastrar() {
    if (!nome.trim()) {
      setFormError('Informe o nome do pet.');
      return;
    }
    const idadeMeses = Number(idade);
    if (!Number.isFinite(idadeMeses) || idadeMeses < 0) {
      setFormError('Informe uma idade válida.');
      return;
    }
    await addPet({ nome: nome.trim(), especie, porte, idadeMeses });
    setModal(false);
    setNome('');
    setFormError(null);
  }

  const background = isDark ? '#17212B' : '#FEF7EE';
  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <View style={styles.header}>
        <TextInput value={busca} onChangeText={setBusca} placeholder="Buscar pet por nome..." placeholderTextColor="#78909C" style={styles.search} />
        <Pressable
          onPress={() => setModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo pet"
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
        >
          <Text style={styles.addText}>＋</Text>
        </Pressable>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" /></View>
      ) : (
        <SectionList<Pet, Secao>
          sections={secoes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PetCard pet={item} onToggle={(id) => void togglePasseio(id)} />}
          renderSectionHeader={({ section }) => <Text style={[styles.section, { color: isDark ? '#FFFFFF' : '#263238' }]}>{section.title}</Text>}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: isDark ? '#FFFFFF' : '#263238' }]}>
                {pets.length === 0 ? 'Sua conta ainda não tem pets' : 'Nenhum pet corresponde à busca'}
              </Text>
              {pets.length === 0 && <Pressable onPress={() => setModal(true)} style={styles.toggle}><Text style={styles.toggleText}>Cadastrar primeiro pet</Text></Pressable>}
            </View>
          }
          refreshing={isLoading}
          onRefresh={() => void fetchPets()}
          contentContainerStyle={styles.list}
        />
      )}
      <Link href="/sobre" style={styles.about}>Sobre o app</Link>
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Novo pet</Text>
            {formError && <Text style={styles.error}>{formError}</Text>}
            <TextInput value={nome} onChangeText={setNome} placeholder="Nome" style={styles.input} />
            <TextInput value={idade} onChangeText={setIdade} placeholder="Idade em meses" keyboardType="number-pad" style={styles.input} />
            <View style={styles.optionRow}>
              {ESPECIES.map((item) => (
                <Pressable key={item} onPress={() => setEspecie(item)} style={[styles.option, especie === item && styles.optionActive]}><Text>{item}</Text></Pressable>
              ))}
            </View>
            <View style={styles.optionRow}>
              {PORTES.map((item) => (
                <Pressable key={item} onPress={() => setPorte(item)} style={[styles.option, porte === item && styles.optionActive]}><Text>{item}</Text></Pressable>
              ))}
            </View>
            <View style={styles.optionRow}>
              <Pressable onPress={() => setModal(false)} style={styles.cancel}><Text>Cancelar</Text></Pressable>
              <Pressable onPress={() => void cadastrar()} style={styles.save}><Text style={styles.toggleText}>Salvar</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', gap: 8, padding: 16 },
  search: { flex: 1, borderWidth: 1, borderColor: '#CBD5DA', borderRadius: 12, backgroundColor: '#FFFFFF', paddingHorizontal: 12 },
  addButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF8C42' },
  addText: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 24 },
  section: { paddingVertical: 8, fontSize: 18, fontWeight: '800' },
  card: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(38,50,56,0.12)' },
  pressed: { opacity: 0.75 },
  photo: { width: 104, height: 104, borderRadius: 12 },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF2F4' },
  placeholderText: { fontSize: 36 },
  cardBody: { flex: 1, gap: 6 },
  petName: { fontSize: 20, fontWeight: '800', color: '#263238' },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EDF2F4', color: '#455A64', fontSize: 12, fontWeight: '700' },
  status: { backgroundColor: '#FFF0E5', color: '#C76525' },
  age: { color: '#607D8B' },
  toggle: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FF8C42' },
  toggleText: { color: '#FFFFFF', fontWeight: '700' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#D32F2F', paddingHorizontal: 16 },
  empty: { alignItems: 'center', gap: 12, padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  about: { padding: 12, textAlign: 'center', color: '#FF8C42', fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000055' },
  modalCard: { gap: 12, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: '#FFFFFF' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#263238' },
  input: { borderWidth: 1, borderColor: '#CBD5DA', borderRadius: 10, padding: 12 },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 8, backgroundColor: '#EDF2F4' },
  optionActive: { backgroundColor: '#FFD8BF' },
  cancel: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#EDF2F4' },
  save: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#FF8C42' },
});
