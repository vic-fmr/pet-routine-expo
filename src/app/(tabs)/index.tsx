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
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={() => router.push(`/pet/${pet.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Abrir detalhes de ${pet.nome}`}
      style={({ pressed }) => [styles.card, { backgroundColor: colors.surface }, pressed && styles.pressed]}
    >
      {pet.fotoUri ? (
        <Image source={{ uri: pet.fotoUri }} style={styles.photo} contentFit="cover" recyclingKey={pet.id} />
      ) : (
        <View style={[styles.photo, styles.placeholder, { backgroundColor: colors.surfaceMuted }]}><Text style={styles.placeholderText}>🐾</Text></View>
      )}
      <View style={styles.cardBody}>
        <Text style={[styles.petName, { color: colors.text }]}>{pet.nome}</Text>
        <View style={styles.badges}>
          <Text style={[styles.badge, { backgroundColor: colors.surfaceMuted, color: colors.textMuted }]}>{rotuloEspecie(pet.especie)}</Text>
          <Text style={[styles.badge, styles.status, { backgroundColor: colors.primaryPressed, color: colors.primaryText }]}>{rotuloStatusPasseio(pet.statusPasseio)}</Text>
        </View>
        <Text style={[styles.age, { color: colors.textMuted }]}>{pet.idadeMeses} meses</Text>
        <Pressable
          onPress={() => onToggle(pet.id)}
          accessibilityRole="button"
          accessibilityLabel={`Alternar passeio de ${pet.nome}`}
          style={({ pressed }) => [styles.toggle, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }, pressed && styles.pressed]}
        >
          <Text style={[styles.toggleText, { color: colors.primaryText }]}>Alternar passeio</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

export default function PetsScreen() {
  const { pets, isLoading, error, fetchPets, addPet, togglePasseio } = usePetStore();
  const { colors } = useTheme();
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

  const background = colors.background;
  return (
    <View style={[styles.screen, { backgroundColor: background }]}>
      <View style={styles.header}>
        <TextInput value={busca} onChangeText={setBusca} placeholder="Buscar pet por nome..." placeholderTextColor={colors.textMuted} style={[styles.search, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} />
        <Pressable
          onPress={() => setModal(true)}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar novo pet"
          style={({ pressed }) => [styles.addButton, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }, pressed && styles.pressed]}
        >
          <Text style={[styles.addText, { color: colors.primaryText }]}>＋</Text>
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
          renderSectionHeader={({ section }) => <Text style={[styles.section, { color: colors.text }]}>{section.title}</Text>}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>
                {pets.length === 0 ? 'Sua conta ainda não tem pets' : 'Nenhum pet corresponde à busca'}
              </Text>
              {pets.length === 0 && (
                <Pressable
                  onPress={() => setModal(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Cadastrar primeiro pet"
                  style={({ pressed }) => [
                    styles.firstPetButton,
                    { backgroundColor: pressed ? colors.primaryPressed : colors.primary },
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={[styles.firstPetIcon, { color: colors.primaryText }]}>＋</Text>
                  <Text style={[styles.firstPetText, { color: colors.primaryText }]}>Cadastrar primeiro pet</Text>
                </Pressable>
              )}
            </View>
          }
          refreshing={isLoading}
          onRefresh={() => void fetchPets()}
          contentContainerStyle={[styles.list, styles.listContent]}
        />
      )}
      <Link href="/sobre" style={[styles.about, { color: colors.primary }]}>Sobre o app</Link>
      <Modal visible={modal} transparent animationType="slide" onRequestClose={() => setModal(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Novo pet</Text>
            {formError && <Text style={styles.error}>{formError}</Text>}
            <TextInput value={nome} onChangeText={setNome} placeholder="Nome" placeholderTextColor={colors.textMuted} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} />
            <TextInput value={idade} onChangeText={setIdade} placeholder="Idade em meses" placeholderTextColor={colors.textMuted} keyboardType="number-pad" style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.surface }]} />
            <View style={styles.optionRow}>
              {ESPECIES.map((item) => (
                <Pressable key={item} onPress={() => setEspecie(item)} accessibilityRole="button" style={[styles.option, { backgroundColor: colors.surfaceMuted }, especie === item && { backgroundColor: colors.primaryPressed }]}><Text style={{ color: especie === item ? colors.primaryText : colors.text }}>{item}</Text></Pressable>
              ))}
            </View>
            <View style={styles.optionRow}>
              {PORTES.map((item) => (
                <Pressable key={item} onPress={() => setPorte(item)} accessibilityRole="button" style={[styles.option, { backgroundColor: colors.surfaceMuted }, porte === item && { backgroundColor: colors.primaryPressed }]}><Text style={{ color: porte === item ? colors.primaryText : colors.text }}>{item}</Text></Pressable>
              ))}
            </View>
            <View style={styles.optionRow}>
              <Pressable onPress={() => setModal(false)} accessibilityRole="button" style={[styles.cancel, { backgroundColor: colors.surfaceMuted }]}><Text style={{ color: colors.text }}>Cancelar</Text></Pressable>
              <Pressable onPress={() => void cadastrar()} accessibilityRole="button" style={[styles.save, { backgroundColor: colors.primary }]}><Text style={[styles.toggleText, { color: colors.primaryText }]}>Salvar</Text></Pressable>
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
  search: { flex: 1, minHeight: 48, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
  addButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  addText: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  list: { gap: 10, paddingHorizontal: 16, paddingBottom: 24 },
  listContent: { flexGrow: 1 },
  section: { paddingVertical: 8, fontSize: 18, fontWeight: '800' },
  card: { flexDirection: 'row', gap: 12, padding: 12, borderRadius: 16, boxShadow: '0 4px 12px rgba(38,50,56,0.12)' },
  pressed: { opacity: 0.75 },
  photo: { width: 104, height: 104, borderRadius: 12 },
  placeholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDF2F4' },
  placeholderText: { fontSize: 36 },
  cardBody: { flex: 1, gap: 6 },
  petName: { fontSize: 20, fontWeight: '800' },
  badges: { flexDirection: 'row', gap: 6 },
  badge: { borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4, backgroundColor: '#EDF2F4', color: '#455A64', fontSize: 12, fontWeight: '700' },
  status: { backgroundColor: '#FFF0E5', color: '#C76525' },
  age: { color: '#607D8B' },
  toggle: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, backgroundColor: '#FF8C42' },
  toggleText: { color: '#FFFFFF', fontWeight: '700' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#D32F2F', paddingHorizontal: 16 },
  empty: { flex: 1, minHeight: 420, alignItems: 'center', justifyContent: 'center', gap: 18, padding: 24 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  firstPetButton: {
    width: '100%',
    maxWidth: 360,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
  },
  firstPetIcon: { fontSize: 34, lineHeight: 38, fontWeight: '700' },
  firstPetText: { fontSize: 17, fontWeight: '800' },
  about: { padding: 12, textAlign: 'center', color: '#FF8C42', fontWeight: '700' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#00000055' },
  modalCard: { gap: 12, padding: 20, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800' },
  input: { borderWidth: 1, borderColor: '#CBD5DA', borderRadius: 10, padding: 12 },
  optionRow: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, alignItems: 'center', padding: 8, borderRadius: 8, backgroundColor: '#EDF2F4' },
  optionActive: { backgroundColor: '#FFD8BF' },
  cancel: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#EDF2F4' },
  save: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, backgroundColor: '#FF8C42' },
});
