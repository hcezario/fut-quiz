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

export type Screen = 'home' | 'config' | 'jogo' | 'resultado';

export const RODADAS_PADRAO = 10;

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

interface GameState {
  screen: Screen;
  jogador: string;
  modo: ModoJogo | null;
  categorias: Categoria[]; // vazio = todas (Misto)
  dificuldades: Dificuldade[]; // vazio = todas

  // partida em andamento (modos de quiz)
  perguntas: Question[];
  indice: number;

  // placar da partida (vale para todos os modos)
  pontos: number;
  streak: number;
  maxStreak: number;
  acertos: number;
  totalRodadas: number;

  ultimoGanho: number; // pontos somados na última resposta (feedback)

  setJogador: (nome: string) => void;
  abrirConfig: (modo: ModoJogo) => void;
  voltarHome: () => void;
  toggleCategoria: (c: Categoria) => void;
  toggleDificuldade: (d: Dificuldade) => void;
  perguntasDisponiveis: () => number;
  iniciarPartida: () => void;
  /** Registra resposta de um modo de quiz. Não avança o índice. */
  responderQuiz: (correto: boolean, pontosBaseCustom?: number) => void;
  /** Avança para a próxima pergunta ou para o resultado. */
  proximaPergunta: () => void;
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
  pontos: 0,
  streak: 0,
  maxStreak: 0,
  acertos: 0,
  totalRodadas: 0,
  ultimoGanho: 0,
};

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'home',
  jogador: '',
  modo: null,
  categorias: [],
  dificuldades: [],
  ...estadoPartidaInicial,

  setJogador: (nome) => set({ jogador: nome }),

  abrirConfig: (modo) => set({ modo, screen: 'config' }),

  voltarHome: () =>
    set({ screen: 'home', modo: null, ...estadoPartidaInicial }),

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
    const { modo, categorias, dificuldades } = get();
    if (!modo) return;

    if (isModoQuiz(modo)) {
      const tipo = TIPO_POR_MODO[modo]!;
      const pool = filtrarPerguntas({
        categorias,
        dificuldades,
        tipos: [tipo],
      });
      // Sem repetição dentro da partida (sample sorteia itens distintos).
      const perguntas = sample(pool, RODADAS_PADRAO);
      set({
        ...estadoPartidaInicial,
        perguntas,
        totalRodadas: perguntas.length,
        screen: 'jogo',
      });
    } else {
      // Modos de algoritmo gerenciam o próprio conteúdo na tela.
      set({ ...estadoPartidaInicial, screen: 'jogo' });
    }
  },

  responderQuiz: (correto, pontosBaseCustom) => {
    set((s) => {
      if (!correto) {
        // Erro não tira pontos e zera o streak.
        return { streak: 0, ultimoGanho: 0 };
      }
      const pergunta = s.perguntas[s.indice];
      const novoStreak = s.streak + 1;
      const base =
        pontosBaseCustom ??
        (pergunta ? pontosBase(pergunta.dificuldade) : 0);
      const bonus = bonusStreak(novoStreak);
      const ganho = base + bonus;
      return {
        streak: novoStreak,
        maxStreak: Math.max(s.maxStreak, novoStreak),
        acertos: s.acertos + 1,
        pontos: s.pontos + ganho,
        ultimoGanho: ganho,
      };
    });
  },

  proximaPergunta: () =>
    set((s) => {
      const prox = s.indice + 1;
      if (prox >= s.perguntas.length) {
        return { screen: 'resultado' };
      }
      return { indice: prox, ultimoGanho: 0 };
    }),

  finalizarComResultado: (pontos, acertos, total, maxStreak = 0) =>
    set({
      pontos,
      acertos,
      totalRodadas: total,
      maxStreak,
      screen: 'resultado',
    }),

  reiniciar: () => {
    const { modo } = get();
    if (modo) get().iniciarPartida();
  },
}));
