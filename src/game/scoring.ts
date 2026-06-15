// Sistema de pontuação (seção 7 da spec).
// - Acerto vale pontos por dificuldade.
// - Streak: bônus crescente a cada 3 acertos seguidos.
// - "Quem é o jogador?": pontuação decresce a cada dica revelada.
// - Erro NÃO tira pontos (público infantojuvenil).

import type { Dificuldade } from '../data/types';

export const PONTOS_POR_DIFICULDADE: Record<Dificuldade, number> = {
  facil: 10,
  medio: 20,
  dificil: 30,
};

// A cada 3 acertos consecutivos, +5 de bônus por acerto.
const STREAK_BLOCO = 3;
const STREAK_BONUS = 5;

export function pontosBase(dificuldade: Dificuldade): number {
  return PONTOS_POR_DIFICULDADE[dificuldade];
}

// Bônus aplicado no acerto de número `streak` (1 = primeiro acerto da sequência).
export function bonusStreak(streak: number): number {
  if (streak < STREAK_BLOCO) return 0;
  return Math.floor(streak / STREAK_BLOCO) * STREAK_BONUS;
}

// "Quem é o jogador?": começa em 40 e cai 10 por dica revelada além da primeira.
// dicasReveladas = 1 -> 40, 2 -> 30, 3 -> 20, 4 -> 10 (mínimo 10).
export function pontosQuemE(dicasReveladas: number): number {
  const base = 40 - (Math.max(1, dicasReveladas) - 1) * 10;
  return Math.max(10, base);
}

export interface ResultadoAcerto {
  base: number;
  bonus: number;
  total: number;
}

// Calcula os pontos de um acerto comum (não-quem_e), dado o streak já incrementado.
export function calcularAcerto(
  dificuldade: Dificuldade,
  streakAtual: number,
): ResultadoAcerto {
  const base = pontosBase(dificuldade);
  const bonus = bonusStreak(streakAtual);
  return { base, bonus, total: base + bonus };
}
