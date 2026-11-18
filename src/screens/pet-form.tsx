// ============================================================
// Prática 2 — Formulário de cadastro/edição de Pet
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Dentro de um ScrollView, com padding no contentContainerStyle.
// Componentes permitidos: View, ScrollView, Text, TextInput,
//   Image, Button, Switch + StyleSheet.
//
// Restrições:
//   • Inputs controlados (value + onChangeText)
//   • Switch controlado (value + onValueChange)
//   • Button desabilitado quando o nome estiver vazio
//   • Pelo menos um estilo condicional (ex: borda vermelha no input vazio)
//   • Nenhuma cor ou espaçamento mágico — tudo vem do theme.ts
//   • Espaçamento entre irmãos com `gap`, não com `margin`
//
// Para testar: importe este componente em App.tsx temporariamente.
// ============================================================
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';

import { cores, espaco, tipografia } from '../theme';

export default function PetForm() {
  const [nome, setNome] = useState('');
  const [raca, setRaca] = useState('');
  const [alertaVacina, setAlertaVacina] = useState(false);

    //   O nome está vazio quando nome.trim() === ''.
  const nomeVazio = nome.trim() === '';

  return (
    <ScrollView
      style={styles.tela}
            //   Responda em um comentário e confirme que está na prop certa.
      // Resposta: O padding deve ficar em contentContainerStyle para aplicar no conteúdo interno, permitindo que a rolagem aconteça corretamente sem cortar o início ou o final.
      contentContainerStyle={styles.conteudo}
    >
      <Text style={styles.rotulo}>Nome do pet</Text>
      <TextInput style={[styles.input, nomeVazio && styles.inputInvalido]} placeholder="Ex: Rex" value={nome} onChangeText={setNome} />

      <Text style={styles.rotulo}>Raça</Text>
      <TextInput style={styles.input} placeholder="Ex: Golden Retriever" value={raca} onChangeText={setRaca} />

      <View style={styles.linha}>
        <Text style={styles.rotulo}>Alerta de vacina</Text>
        <Switch value={alertaVacina} onValueChange={setAlertaVacina} />
      </View>

      <View style={styles.areaBotao}>
        <Button title="Salvar" onPress={() => {}} disabled={nomeVazio} color={cores.primaria} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
        backgroundColor: cores.fundo,
  },
  conteudo: {
        //   Se você precisar de margin em algum filho, algo está errado.
    //   Use espaco.md para padding e espaco.md para gap (ou a escala que escolheu).
    padding: espaco.md,
    gap: espaco.md,
  },
  input: {
    borderWidth: 1,
        //   Exemplo: borderColor: cores.textoFraco, padding: espaco.sm
    borderColor: cores.textoFraco,
    borderRadius: espaco.sm,
    padding: espaco.sm,
    fontSize: tipografia.corpo.fontSize,
  },
  inputInvalido: {
        //   Não repita borderWidth, padding etc. — o array de estilos já herda.
    //   Exemplo: borderColor: cores.erro
    borderColor: cores.erro,
  },
  linha: {
        //   alignItems 'center' — os dois filhos ficam nas pontas, alinhados.
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rotulo: {
        ...tipografia.corpo,
  },
  areaBotao: {
    borderRadius: 8,
    overflow: 'hidden',
        //   não espaço entre irmãos. Use um token de espaco (ex: espaco.lg).
    marginTop: espaco.lg,
  },
});
