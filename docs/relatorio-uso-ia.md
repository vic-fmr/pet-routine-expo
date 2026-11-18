# Relatório de Uso de Inteligência Artificial — Mini-Projeto

**Disciplina:** Desenvolvimento Mobile (2026.2.DM) — CESAR School
**Projeto:** Pet Routine Expo
**Integrantes:** Alessandra Barbosa, Camila Teixeira, Lucas Rodrigues, Rayane Cavalcanti, René Lucena, Samuel Araujo, Ana Sofia e Gabriela Damásio
**Data:** 18/11/2026

## 1. Declaração Obrigatória

- [x] Utilizei GPT-5.6 Luna, ferramenta constante no Catálogo de IA do CESAR, na implementação.
- [ ] NÃO utilizei nenhuma ferramenta de inteligência artificial.

Texto oficial:

> “Declaramos que utilizamos o GPT-5.6 Luna, ferramenta constante no Catálogo de IA do CESAR, nesta atividade, com a finalidade de gerar rascunhos sobre a estrutura Expo Router, autenticação, Zustand, persistência SQLite, notificações, integração com o backend e reformulação de UI/UX. Realizamos análise crítica e curadoria técnica das informações apresentadas. Não tratamos dados pessoais, senhas reais ou chaves privadas no uso da ferramenta. Revisamos o conteúdo gerado, identificamos e corrigimos imprecisões, e assumimos responsabilidade integral pela versão final apresentada.”

## 2. Registro por Etapa

| Etapa | Ferramenta | Uso | Aproveitado | Curadoria |
|---|---|---|---|---|
| 1 — Router e foto | GPT-5.6 Luna | Criou rotas, ImagePicker e app.json | Estrutura final e contrato 1:1 | Corrigido para `mediaTypes: ['images']`, cancelamento antes de assets e permissão bloqueada/negada |
| 2 — Tabs, detalhe e notificações | GPT-5.6 Luna | Criou Tabs, rota dinâmica e agendamento | Navegação e listeners | Adicionados cleanup dos listeners e navegação por `/pet/[id]` |
| 3 — Tema, timer e SQLite | GPT-5.6 Luna | Criou contexto, intervalo e banco local | Persistência e histórico | Incluído cleanup de intervalo e placeholders seguros |
| 4 — Auth e API | GPT-5.6 Luna | Criou stores, guardas e CRUD | Fluxo JWT completo | Revisado tratamento 401/403, hidratação e tipagem estrita |
| 5 — UI, OTA e EAS | GPT-5.6 Luna | Criou redesign, controles nativos e perfis | Componentes e builds | Configurado OTA com proteção `__DEV__`, APK preview e identificadores nativos |
| UI/UX | GPT-5.6 Luna | Reformulou telas e estados | Hierarquia visual, badges e tema | Aplicados `gap`, feedback press, estados vazios/erro e remoção de estilos legados |

## 3. Curadoria Técnica

### 3.1. Acertos

A IA acelerou a criação da estrutura de pastas, tipos, rotas e integração entre Zustand e API. A separação entre componentes reutilizáveis e arquivos de rota preservou a organização exigida.

### 3.2. Imprecisões corrigidas

1. **Sugestão antiga de Image Picker:** a IA poderia usar `MediaTypeOptions.Images` e ler `assets` sem verificar cancelamento. Isso violava as regras 18 e 19. Corrigimos para `mediaTypes: ['images']` e `if (resultado.canceled) return`.

2. **Sugestão de estilos legados:** rascunhos poderiam usar `shadowColor`, `shadowOffset`, `shadowOpacity` e `shadowRadius`. Substituímos por `boxShadow`, conforme a regra 4.

Outros ajustes incluíram remoção de `any`, limpeza obrigatória de listeners e intervalos, uso de `Link` para navegação declarativa e `router.push/replace/back` em ações de função.

## 4. Proteção de Dados e Autoria

- [x] Nenhum dado pessoal ou sensível foi inserido em prompts.
- [x] Entendo a arquitetura final e posso explicar e modificar os principais arquivos.
