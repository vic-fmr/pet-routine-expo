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
    //   texto, textoFraco, primaria, sucesso, erro.
  //   Escolha cores que façam sentido para um app de pets.
  //   Exemplo: primaria poderia ser um laranja acolhedor.
  texto: '#333333',
  textoFraco: '#777777',
  primaria: '#FF8C00',
  sucesso: '#4CAF50',
  erro: '#F44336',
} as const;

export const espaco = {
    //   Escolha uma progressão consistente — 4/8/16/24 é um bom default.
  //   Exemplo: xs: 4, sm: 8, md: 16, lg: 24
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const tipografia = {
    //   de TEXTO (fontSize, fontWeight, color).
  //   A legenda pode reaproveitar `cores.textoFraco`.
  //   Não inclua layout (margin, padding) — isso é decisão do componente.
  //
  //   Exemplo de formato:
  //   titulo: { fontSize: 20, fontWeight: '600' as const, color: cores.texto },
  titulo: { fontSize: 24, fontWeight: '600' as const, color: '#333333' },
  corpo: { fontSize: 16, fontWeight: '400' as const, color: '#333333' },
  legenda: { fontSize: 12, fontWeight: '400' as const, color: '#777777' },
} as const;

//   do componente NÃO usa? Responda em um comentário de uma linha aqui.
// O as const permite inferência de tipos literais fortes para os tokens; StyleSheet.create já retorna tipos válidos pro RN e não precisa de cast literal.
