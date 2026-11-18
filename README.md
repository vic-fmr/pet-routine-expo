# Pet Routine Expo

Aplicativo Expo Router para gestão de pets e rotina de passeios. Integra autenticação JWT, CRUD REST, estado Zustand, tema persistido, SQLite local e notificações.

## Requisitos

- Node.js 22+
- Expo CLI
- Backend Express em execução

## Instalação e execução

```bash
npm install
cd backend
npm install
npm run dev
```

Em outro terminal:

```bash
npx expo start
```

Configure a API copiando `.env.example` para `.env` e ajustando `EXPO_PUBLIC_API_URL`. Em Android Emulator use `http://10.0.2.2:3000`; no aparelho físico use o IP da máquina.

Conta de demonstração: `tutor@cesar.school` / `123456`.

## Arquitetura

- `src/app`: apenas layouts e rotas Expo Router.
- `src/components`: cartões, cronômetro, controles nativos e OTA.
- `src/store`: sessões e pets com Zustand.
- `src/context`: tema claro/escuro persistido com AsyncStorage.
- `src/services`: API, autenticação, notificações e SQLite.
- `backend`: API Express, JWT e SQLite fornecidos pela disciplina.

## Comandos

```bash
npm run typecheck
cd backend
npm run typecheck
```

## Reformulação de UI/UX

A interface foi reorganizada em hierarquia de cartões, navegação por abas e estados visuais consistentes. Login e cadastro usam espaçamento amplo e feedback de carregamento; a lista separa pendentes, concluídos e cancelados com badges semânticos; detalhe usa foto, coordenadas, cronômetro e histórico local; estatísticas mostram métricas reais da conta.

- **Antes:** tela única baseada em estado local, lista mockada e estilos antigos.
- **Depois:** abas, autenticação, layout responsivo, tema claro/escuro, controles nativos, estados de vazio/erro e ações de feedback.
- Os cartões usam `gap`, bordas e elevação moderna compatível com o React Native atual.
- O componente nativo `@expo/ui` fica encapsulado em `<Host matchContents>`.
- Contraste e textos foram revisados para os dois temas.

Capturas de tela podem ser adicionadas aqui após validação em emulador ou aparelho físico.

## Build

O perfil `preview` gera APK Android e simulador iOS no EAS. Execute `npx eas build --profile preview`.
