// Persistência local de perfis e recordes (localStorage, offline).
// Sem backend: é a base do "histórico/evolução" da Fase 2 sem servidor.
// Tudo encapsulado e à prova de falha (modo privado / storage indisponível).

import type { ModoJogo } from './types';

const CHAVE = 'futquiz:v1';

export interface PerfilModo {
  melhorPontos: number;
  jogos: number;
}

export interface Perfil {
  nome: string; // forma de exibição (como digitado)
  jogos: number;
  melhorPontos: number;
  melhorStreak: number;
  porModo: Partial<Record<ModoJogo, PerfilModo>>;
  ultimaVez: number; // timestamp
}

interface Dados {
  perfis: Record<string, Perfil>;
}

const norm = (nome: string) => nome.trim().toLowerCase();

// Cache em memória — também serve de fallback se o localStorage falhar.
let cache: Dados | null = null;

function ler(): Dados {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(CHAVE);
    cache = raw ? (JSON.parse(raw) as Dados) : { perfis: {} };
  } catch {
    cache = { perfis: {} };
  }
  if (!cache.perfis) cache.perfis = {};
  return cache;
}

function gravar(d: Dados) {
  cache = d;
  try {
    localStorage.setItem(CHAVE, JSON.stringify(d));
  } catch {
    /* storage indisponível: mantém só em memória nesta sessão */
  }
}

export function listarJogadores(): { nome: string; melhorPontos: number }[] {
  return Object.values(ler().perfis)
    .sort((a, b) => b.ultimaVez - a.ultimaVez)
    .map((p) => ({ nome: p.nome, melhorPontos: p.melhorPontos }));
}

export function melhorPontosDoModo(nome: string, modo: ModoJogo): number {
  const p = ler().perfis[norm(nome)];
  return p?.porModo[modo]?.melhorPontos ?? 0;
}

export interface RegistroResultado {
  melhorAnterior: number; // recorde anterior nesse modo
  novoRecorde: boolean;
}

// Registra o fim de uma partida para um jogador e diz se bateu o recorde.
export function registrarResultado(
  nome: string,
  modo: ModoJogo,
  pontos: number,
  maxStreak: number,
): RegistroResultado {
  const limpo = nome.trim();
  if (!limpo) return { melhorAnterior: 0, novoRecorde: false };

  const d = ler();
  const k = norm(limpo);
  const p: Perfil = d.perfis[k] ?? {
    nome: limpo,
    jogos: 0,
    melhorPontos: 0,
    melhorStreak: 0,
    porModo: {},
    ultimaVez: 0,
  };

  const melhorAnterior = p.porModo[modo]?.melhorPontos ?? 0;
  const novoRecorde = pontos > melhorAnterior && pontos > 0;

  p.nome = limpo;
  p.jogos += 1;
  p.melhorPontos = Math.max(p.melhorPontos, pontos);
  p.melhorStreak = Math.max(p.melhorStreak, maxStreak);
  const pm = p.porModo[modo] ?? { melhorPontos: 0, jogos: 0 };
  pm.jogos += 1;
  pm.melhorPontos = Math.max(pm.melhorPontos, pontos);
  p.porModo[modo] = pm;
  p.ultimaVez = Date.now();

  d.perfis[k] = p;
  gravar(d);
  return { melhorAnterior, novoRecorde };
}
