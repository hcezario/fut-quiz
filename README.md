# ⚽ Fut Quiz

App de quiz de futebol com foco em **futebol brasileiro, Santos FC e Copa do Mundo**.
MVP roda **100% offline**, sem backend e sem API de IA — todo o conteúdo vem de um
banco curado e verificado por humanos.

## Stack

- **React + Vite + TypeScript** — base web reaproveitável no app.
- **Zustand** — estado da partida (sem Redux).
- **Capacitor** — empacota o mesmo código web como iOS/Android.
- **Design "Matchday"** — papel quente, tinta verde-pinheiro, verde-limão elétrico
  + acentos coral/âmbar, sombras de adesivo, tipografia Anton + Archivo. As fontes
  são **auto-hospedadas** (`@fontsource`), sem CDN, para preservar o offline.
- **Conteúdo:** JSON estático curado em `content/` (zero infra, zero rede). A migração
  para SQLite/PostgreSQL na Fase 2 troca apenas `src/data/content.ts`.

## Rodando

```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run build      # typecheck + build de produção (gera dist/)
npm run preview    # serve o build
```

### Empacotar com Capacitor (Fase 2a)

```bash
npm run build
npx cap add android   # ou ios (requer SDK nativo instalado)
npm run cap:sync
```

O `capacitor.config.ts` já aponta `webDir: dist`. As pastas nativas (`android/`,
`ios/`) são geradas localmente e ficam fora do versionamento.

## Modos de jogo (MVP)

| Modo | Descrição |
|------|-----------|
| Múltipla escolha | Pergunta + 4 alternativas |
| Verdade ou Mito | Afirmação V/F com explicação |
| Complete o placar | Preenche o gol que falta |
| Quem é o jogador? | Dicas progressivas; menos dicas = mais pontos |
| Caça-palavras | Grade gerada por algoritmo |
| Cruzadinha | Gerada por algoritmo a partir de palavras + definições |

## Solo e Duelo

- **Solo** — um jogador; recorde, maior streak e nº de partidas ficam salvos.
- **Duelo (pai vs filho)** — passe e jogue: o jogador 1 responde sua leva de
  perguntas, passa o celular (tela de handoff, sem espiar), o jogador 2 responde
  a leva dele e a tela final compara os placares e aponta o vencedor. Disponível
  nos 4 modos de quiz.

## Perfis e recordes (locais)

Sem backend: os resultados ficam em `localStorage` (`src/data/storage.ts`), à
prova de falha (cai para memória se o storage estiver indisponível). Guarda
recorde por modo, maior streak e jogos por jogador, alimenta os atalhos de nome
na Home e o selo **"Novo recorde!"** na tela final.

## Pontuação (seção 7 da spec)

- Acerto: `fácil 10`, `médio 20`, `difícil 30`.
- **Streak:** +5 de bônus a cada bloco de 3 acertos consecutivos.
- **Quem é o jogador?:** 40 → 30 → 20 → 10 conforme dicas reveladas.
- Caça-palavras / cruzadinha: pontos por palavra encontrada.
- Erro **não** tira pontos (público infantojuvenil).

## Conteúdo — regra não negociável

`content/` é a **fonte da verdade humana**.

- Toda pergunta factual tem `verificado: 1` e uma `fonte` registrada. O loader
  (`src/data/content.ts`) **filtra e só exibe** perguntas com `verificado === 1`.
- IA **não** gera perguntas factuais no MVP (fica para o "Modo Livre" da Fase 2).
- Caça-palavras e cruzadinha são gerados por **algoritmo** a partir de `content/words.json`.

Banco atual: **126 perguntas** (42 por categoria) + 30 palavras.

### Editando o banco

As perguntas vivem em `content/questions.json` (array único com discriminador `tipo`
e `payload` em JSON por tipo). Edite o JSON legível — os IDs são atribuídos na carga,
nunca manualmente.

## Estrutura

```
src/
  components/   # UI reutilizável (Hud, Feedback)
  modes/        # um módulo por modo de jogo
  screens/      # Home, Config, Handoff, Resultado
  data/         # tipos + acesso ao conteúdo + perfis/recordes (storage)
  game/         # pontuação, streak, sorteio
  generators/   # caça-palavras e cruzadinha (algoritmos)
  store/        # estado da partida (Zustand)
content/        # banco curado, versionado (questions.json, words.json)
```

## Roadmap

- **MVP:** web + JSON local, 6 modos, banco curado. ✅
- **Modo Duelo (pai vs filho)** + **perfis/recordes locais.** ✅
- **Fase 2a:** Capacitor → app instalável.
- **Fase 2b:** Fastify + PostgreSQL + API (sincronizar perfis/recordes entre dispositivos).
- **Fase 2c:** Modo Livre (API Claude com disclaimer), histórico de evolução, conquistas.
