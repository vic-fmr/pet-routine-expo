// ============================================================
// Prática 2 — Componente Card reutilizável
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Este componente é genérico — ele não sabe nada sobre Pet.
// Props tipadas, children: ReactNode, prop opcional `destacado`.
//
// Restrições:
//   • Sombra com `boxShadow` (uma string), não com shadow*/elevation
//   • Espaçamento interno com `gap`
//   • Nenhum hex ou número mágico — tudo vem do theme.ts
// ============================================================
import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { cores, espaco } from '../theme';

type CardProps = {
  children: ReactNode;
    destacado?: boolean;
};

export function Card({ children , destacado }: CardProps) {
    //   Exemplo: style={[styles.card, destacado && styles.cardDestacado]}
  return <View style={[styles.card, destacado && styles.cardDestacado]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
        //   Nenhum hex e nenhum número solto neste arquivo.
    padding: espaco.md,
    borderRadius: espaco.sm,
    backgroundColor: cores.cartao,
        //   e espaçamento entre filhos com `gap`
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    gap: espaco.sm,
  },
  cardDestacado: {
        //   Borda colorida? Fundo diferente? Escolha e justifique no README.
    borderWidth: 2,
    borderColor: cores.primaria,
  },
});
