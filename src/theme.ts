// ============================================================
// Prática 2 — Sistema de tokens de design
// Disciplina: Desenvolvimento Mobile (2026.2.DM) — CESAR School
//
// Tokens são VALORES (cores, espaçamentos, tipografia), nunca
// layouts prontos. Componentes consomem estes tokens — nunca o
// contrário. Nenhum componente deve ter um hex ou número mágico;
// tudo vem daqui.
//
// Regra: `as const` AQUI, nunca dentro de `StyleSheet.create`.
//
// ⚠️  Preencha este arquivo PRIMEIRO — os demais dependem dele.
// ============================================================

export const cores = {
  fundo: '#FEF7EE',
  cartao: '#FFFFFF',
  texto: '#333333',
  textoFraco: '#777777',
  primaria: '#B84E16',
  primariaClara: '#FFF0E5',
  sucesso: '#4CAF50',
  erro: '#F44336',
} as const;

export const espaco = {
  xs: 4,
  sm: 8,
  smd: 12,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const tipografia = {
  titulo: { fontSize: 24, fontWeight: '600' as const, color: '#333333' },
  corpo: { fontSize: 16, fontWeight: '400' as const, color: '#333333' },
  legenda: { fontSize: 12, fontWeight: '400' as const, color: '#777777' },
} as const;

export const raio = {
  pequeno: 8,
  medio: 12,
  grande: 16,
  extraGrande: 20,
} as const;

export const alvoToque = 44;
