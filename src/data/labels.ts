import type { Categoria, Dificuldade } from './types';

export const CATEGORIA_LABEL: Record<Categoria, string> = {
  'futebol-brasileiro': 'Futebol Brasileiro',
  santos: 'Santos FC',
  'copa-do-mundo': 'Copa do Mundo',
};

export const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
};

// Cor do "ponto" usado nas tags de dificuldade (classes de --styles.css).
export const DIFICULDADE_DOT: Record<Dificuldade, string> = {
  facil: 'dot-lime',
  medio: 'dot-amber',
  dificil: 'dot-coral',
};
