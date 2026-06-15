import { create } from 'zustand';
import type {
  Categoria,
  Dificuldade,
  ModoJogo,
  Question,
  TipoPergunta,
} from '../data/types';
import { filtrarPerguntas } from '../data/content';
import { sample } from '../game/random';
import { bonusStreak, pontosBase } from '../game/scoring';
import { registrarResultado } from '../data/storage';

export type Screen = 'home' | 'config' | 'jogo' | 'handoff' | 'resultado';
export type ModoPartida = 'solo' | 'duelo';

export const RODADAS_PADRAO = 10;
export const DUELO_RODADAS = 5; // perguntas por jogador no duelo

// Modos de quiz que consomem a tabela `questions` (1 pergunta = 1 `tipo`).
const TIPO_POR_MODO: Partial<Record<ModoJogo, TipoPergunta>> = {
  multipla_escolha: 'multipla_escolha',
  verdade_mito: 'verdade_mito',
  placar: 'placar',
  quem_e: 'quem_e',
};

export function isModoQuiz(modo: ModoJogo): boolean {
  return modo in TIPO_POR_MODO;
}

interface Placar {
  pontos: number;
  streak: number;
  maxStreak: number;
  acertos: number;
}

// Resultado por jogador (1 item no solo, 2 no duelo) — unifica a tela final.
export interface ResultadoJogador {
  nome: string;
  pontos: number;
  acertos: number;
  total: number;
  maxStreak: number;
  novoRecorde: boolean;
}

const zeros = (): Placar => ({ pontos: 0, streak: 0, maxStreak: 0, acertos: 0 });

interface GameState {
  screen: Screen;
  modoPartida: ModoPartida;
  jogador: string; // nome no modo solo
  jogadores: string[]; // nomes no modo duelo (2)
  modo: ModoJogo | null;
  categorias: Categoria[]; // vazio = todas (Misto)
  dificuldades: Dificuldade[]; // vazio = todas

  // partida em andamento
  perguntas: Question[];
  indice: number; // índice global na sequência de perguntas
  vez: number; // jogador atual (0 no solo; 0/1 no duelo)
  rodadasPorJogador: number;
  placares: Placar[]; // placar acumulado de cada jogador

  // campos "ao vivo" do jogador da vez (lidos pela UI dos modos)
  pontos: number;
  streak: number;
  maxStreak: number;
  acertos: number;
  totalRodadas: number; // rodadas do jogador da vez
  ultimoGanho: number;

  resultados: ResultadoJogador[]; // preenchido no fim da partida

  setModoPartida: (m: ModoPartida) => void;
  setJogador: (nome: string) => void;
  setJogadorDuelo: (i: number, nome: string) => void;
  abrirConfig: (modo: ModoJogo) => void;
  voltarHome: () => void;
  toggleCategoria: (c: Categoria) => void;
  toggleDificuldade: (d: Dificuldade) => void;
  perguntasDisponiveis: () => number;
  iniciarPartida: () => void;
  /** Registra resposta de um modo de quiz. Não avança o índice. */
  responderQuiz: (correto: boolean, pontosBaseCustom?: number) => void;
  /** Avança para a próxima pergunta, troca de turno ou vai ao resultado. */
  proximaPergunta: () => void;
  /** Confirma o handoff do duelo e começa o turno do próximo jogador. */
  continuarHandoff: () => void;
  /** Usado pelos modos de algoritmo (caça-palavras/cruzadinha) ao terminar. */
  finalizarComResultado: (
    pontos: number,
    acertos: number,
    total: number,
    maxStreak?: number,
  ) => void;
  reiniciar: () => void;
}

const estadoPartidaInicial = {
  perguntas: [] as Question[],
  indice: 0,
  vez: 0,
  rodadasPorJogador: 0,
  placares: [] as Placar[],
  pontos: 0,
  streak: 0,
  maxStreak: 0,
  acertos: 0,
  totalRodadas: 0,
  ultimoGanho: 0,
  resultados: [] as ResultadoJogador[],
};

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'home',
  modoPartida: 'solo',
  jogador: '',
  jogadores: ['', ''],
  modo: null,
  categorias: [],
  dificuldades: [],
  ...estadoPartidaInicial,

  setModoPartida: (m) => set({ modoPartida: m }),
  setJogador: (nome) => set({ jogador: nome }),
  setJogadorDuelo: (i, nome) =>
    set((s) => {
      const jogadores = s.jogadores.slice();
      jogadores[i] = nome;
      return { jogadores };
    }),

  abrirConfig: (modo) => {
    // No duelo só valem os modos de quiz.
    if (get().modoPartida === 'duelo' && !isModoQuiz(modo)) return;
    set({ modo, screen: 'config' });
  },

  voltarHome: () => set({ screen: 'home', modo: null, ...estadoPartidaInicial }),

  toggleCategoria: (c) =>
    set((s) => ({
      categorias: s.categorias.includes(c)
        ? s.categorias.filter((x) => x !== c)
        : [...s.categorias, c],
    })),

  toggleDificuldade: (d) =>
    set((s) => ({
      dificuldades: s.dificuldades.includes(d)
        ? s.dificuldades.filter((x) => x !== d)
        : [...s.dificuldades, d],
    })),

  perguntasDisponiveis: () => {
    const { modo, categorias, dificuldades } = get();
    if (!modo || !isModoQuiz(modo)) return Infinity; // modos de algoritmo
    const tipo = TIPO_POR_MODO[modo]!;
    return filtrarPerguntas({ categorias, dificuldades, tipos: [tipo] }).length;
  },

  iniciarPartida: () => {
    const { modo, categorias, dificuldades, modoPartida, jogador, jogadores } =
      get();
    if (!modo) return;

    if (modoPartida === 'duelo') {
      if (!isModoQuiz(modo)) return;
      const tipo = TIPO_POR_MODO[modo]!;
      const pool = filtrarPerguntas({ categorias, dificuldades, tipos: [tipo] });
      const n = Math.max(1, Math.min(DUELO_RODADAS, Math.floor(pool.length / 2)));
      const perguntas = sample(pool, n * 2); // distintas: jogadores não repetem
      set({
        ...estadoPartidaInicial,
        jogadores: [jogadores[0] || 'Jogador 1', jogadores[1] || 'Jogador 2'],
        perguntas,
        rodadasPorJogador: n,
        totalRodadas: n,
        placares: [zeros(), zeros()],
        screen: 'jogo',
      });
      return;
    }

    // Solo
    const nome = jogador || 'Jogador';
    if (isModoQuiz(modo)) {
      const tipo = TIPO_POR_MODO[modo]!;
      const pool = filtrarPerguntas({ categorias, dificuldades, tipos: [tipo] });
      const perguntas = sample(pool, RODADAS_PADRAO);
      set({
        ...estadoPartidaInicial,
        jogador: nome,
        perguntas,
        rodadasPorJogador: perguntas.length,
        totalRodadas: perguntas.length,
        placares: [zeros()],
        screen: 'jogo',
      });
    } else {
      // Modos de algoritmo gerenciam o próprio conteúdo na tela.
      set({
        ...estadoPartidaInicial,
        jogador: nome,
        placares: [zeros()],
        screen: 'jogo',
      });
    }
  },

  responderQuiz: (correto, pontosBaseCustom) => {
    set((s) => {
      if (!correto) {
        return { streak: 0, ultimoGanho: 0 }; // erro não tira pontos, zera streak
      }
      const pergunta = s.perguntas[s.indice];
      const novoStreak = s.streak + 1;
      const base =
        pontosBaseCustom ?? (pergunta ? pontosBase(pergunta.dificuldade) : 0);
      const ganho = base + bonusStreak(novoStreak);
      return {
        streak: novoStreak,
        maxStreak: Math.max(s.maxStreak, novoStreak),
        acertos: s.acertos + 1,
        pontos: s.pontos + ganho,
        ultimoGanho: ganho,
      };
    });
  },

  proximaPergunta: () => {
    const s = get();
    const prox = s.indice + 1;

    if (s.modoPartida === 'duelo') {
      const n = s.rodadasPorJogador;
      // Salva o placar "ao vivo" do jogador da vez.
      const placarAtual: Placar = {
        pontos: s.pontos,
        streak: s.streak,
        maxStreak: s.maxStreak,
        acertos: s.acertos,
      };

      if (prox >= n * 2) {
        const placares = s.placares.slice();
        placares[s.vez] = placarAtual;
        finalizarDuelo(set, s.modo, s.jogadores, placares, n);
        return;
      }
      if (prox === n) {
        // troca de jogador (handoff)
        const placares = s.placares.slice();
        placares[0] = placarAtual;
        set({
          placares,
          indice: prox,
          vez: 1,
          ...zeros(),
          ultimoGanho: 0,
          screen: 'handoff',
        });
        return;
      }
      set({ indice: prox, ultimoGanho: 0 });
      return;
    }

    // Solo
    if (prox >= s.perguntas.length) {
      finalizarSolo(set, s);
      return;
    }
    set({ indice: prox, ultimoGanho: 0 });
  },

  continuarHandoff: () => set({ screen: 'jogo' }),

  finalizarComResultado: (pontos, acertos, total, maxStreak = 0) => {
    const s = get();
    const nome = s.jogador || 'Jogador';
    const reg = s.modo
      ? registrarResultado(nome, s.modo, pontos, maxStreak)
      : { novoRecorde: false };
    set({
      pontos,
      acertos,
      totalRodadas: total,
      maxStreak,
      resultados: [
        { nome, pontos, acertos, total, maxStreak, novoRecorde: reg.novoRecorde },
      ],
      screen: 'resultado',
    });
  },

  reiniciar: () => {
    if (get().modo) get().iniciarPartida();
  },
}));

type SetState = (partial: Partial<GameState>) => void;

function finalizarSolo(set: SetState, s: GameState) {
  const nome = s.jogador || 'Jogador';
  const reg = s.modo
    ? registrarResultado(nome, s.modo, s.pontos, s.maxStreak)
    : { novoRecorde: false };
  set({
    resultados: [
      {
        nome,
        pontos: s.pontos,
        acertos: s.acertos,
        total: s.totalRodadas,
        maxStreak: s.maxStreak,
        novoRecorde: reg.novoRecorde,
      },
    ],
    screen: 'resultado',
  });
}

function finalizarDuelo(
  set: SetState,
  modo: ModoJogo | null,
  jogadores: string[],
  placares: Placar[],
  rodadasPorJogador: number,
) {
  const resultados: ResultadoJogador[] = placares.map((pl, i) => {
    const nome = jogadores[i] || `Jogador ${i + 1}`;
    const reg = modo
      ? registrarResultado(nome, modo, pl.pontos, pl.maxStreak)
      : { novoRecorde: false };
    return {
      nome,
      pontos: pl.pontos,
      acertos: pl.acertos,
      total: rodadasPorJogador,
      maxStreak: pl.maxStreak,
      novoRecorde: reg.novoRecorde,
    };
  });
  set({ placares, resultados, screen: 'resultado' });
}
