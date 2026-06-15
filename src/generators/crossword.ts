// Gerador de cruzadinha por algoritmo (sem IA), a partir de palavras + definições.
// Estratégia gulosa: coloca a primeira palavra, depois encaixa cada palavra
// seguinte cruzando uma letra com as já posicionadas.

import { shuffle } from '../game/random';
import type { Word } from '../data/types';

export type Orientacao = 'horizontal' | 'vertical';

export interface EntradaCruzadinha {
  word: Word;
  row: number;
  col: number;
  orientacao: Orientacao;
  numero: number; // numeração da dica
}

export interface Cruzadinha {
  rows: number;
  cols: number;
  entradas: EntradaCruzadinha[];
  // mapa "row,col" -> letra correta (gabarito)
  solucao: Map<string, string>;
}

const key = (r: number, c: number) => `${r},${c}`;

interface Colocacao {
  row: number;
  col: number;
  orientacao: Orientacao;
}

function letrasDe(entrada: { word: Word; row: number; col: number; orientacao: Orientacao }) {
  const p = entrada.word.palavra.toUpperCase();
  const out: { r: number; c: number; ch: string }[] = [];
  for (let i = 0; i < p.length; i++) {
    const r = entrada.orientacao === 'horizontal' ? entrada.row : entrada.row + i;
    const c = entrada.orientacao === 'horizontal' ? entrada.col + i : entrada.col;
    out.push({ r, c, ch: p[i] });
  }
  return out;
}

// Verifica se a palavra pode ser colocada sem conflito e cruzando ao menos uma
// letra existente (exceto a primeira palavra). Também evita palavras coladas.
function valida(
  ocupado: Map<string, string>,
  word: Word,
  col: Colocacao,
  exigeCruzamento: boolean,
): boolean {
  const letras = letrasDe({ word, ...col });
  let cruzou = false;
  for (const { r, c, ch } of letras) {
    const existente = ocupado.get(key(r, c));
    if (existente !== undefined) {
      if (existente !== ch) return false; // conflito de letra
      cruzou = true;
    } else {
      // célula vazia: as células perpendiculares adjacentes devem estar livres
      // (evita palavras paralelas grudadas formando lixo).
      if (col.orientacao === 'horizontal') {
        if (ocupado.has(key(r - 1, c)) || ocupado.has(key(r + 1, c))) return false;
      } else {
        if (ocupado.has(key(r, c - 1)) || ocupado.has(key(r, c + 1))) return false;
      }
    }
  }
  // Células imediatamente antes e depois da palavra devem estar livres.
  const first = letras[0];
  const last = letras[letras.length - 1];
  if (col.orientacao === 'horizontal') {
    if (ocupado.has(key(first.r, first.c - 1))) return false;
    if (ocupado.has(key(last.r, last.c + 1))) return false;
  } else {
    if (ocupado.has(key(first.r - 1, first.c))) return false;
    if (ocupado.has(key(last.r + 1, last.c))) return false;
  }
  if (exigeCruzamento && !cruzou) return false;
  return true;
}

export interface OpcoesCruzadinha {
  maxPalavras?: number;
}

export function gerarCruzadinha(
  palavras: Word[],
  opcoes: OpcoesCruzadinha = {},
): Cruzadinha {
  const maxPalavras = opcoes.maxPalavras ?? 8;
  // Palavras mais longas primeiro ajudam a cruzar mais.
  const candidatas = shuffle(palavras.filter((w) => w.palavra.length >= 3)).sort(
    (a, b) => b.palavra.length - a.palavra.length,
  );

  const ocupado = new Map<string, string>();
  const colocadas: { word: Word; col: Colocacao }[] = [];

  for (const word of candidatas) {
    if (colocadas.length >= maxPalavras) break;
    const palavra = word.palavra.toUpperCase();

    if (colocadas.length === 0) {
      // primeira palavra: horizontal na origem
      const col: Colocacao = { row: 0, col: 0, orientacao: 'horizontal' };
      letrasDe({ word, ...col }).forEach(({ r, c, ch }) =>
        ocupado.set(key(r, c), ch),
      );
      colocadas.push({ word, col });
      continue;
    }

    // tenta cruzar com cada letra já posicionada
    let posicionou = false;
    const alvos = shuffle(colocadas);
    busca: for (const { word: outra, col: posOutra } of alvos) {
      const letrasOutra = letrasDe({ word: outra, ...posOutra });
      for (let i = 0; i < palavra.length; i++) {
        for (const lo of letrasOutra) {
          if (lo.ch !== palavra[i]) continue;
          const orientacao: Orientacao =
            posOutra.orientacao === 'horizontal' ? 'vertical' : 'horizontal';
          const col: Colocacao =
            orientacao === 'vertical'
              ? { row: lo.r - i, col: lo.c, orientacao }
              : { row: lo.r, col: lo.c - i, orientacao };
          if (valida(ocupado, word, col, true)) {
            letrasDe({ word, ...col }).forEach(({ r, c, ch }) =>
              ocupado.set(key(r, c), ch),
            );
            colocadas.push({ word, col });
            posicionou = true;
            break busca;
          }
        }
      }
    }
    void posicionou;
  }

  // Normaliza coordenadas para começar em (0,0).
  let minR = Infinity;
  let minC = Infinity;
  for (const k of ocupado.keys()) {
    const [r, c] = k.split(',').map(Number);
    minR = Math.min(minR, r);
    minC = Math.min(minC, c);
  }
  if (!isFinite(minR)) {
    minR = 0;
    minC = 0;
  }

  const solucao = new Map<string, string>();
  let maxR = 0;
  let maxC = 0;
  for (const [k, ch] of ocupado) {
    const [r, c] = k.split(',').map(Number);
    const nr = r - minR;
    const nc = c - minC;
    solucao.set(key(nr, nc), ch);
    maxR = Math.max(maxR, nr);
    maxC = Math.max(maxC, nc);
  }

  // Numera as entradas em ordem de leitura (cima->baixo, esq->dir).
  const ordenadas = colocadas
    .map(({ word, col }) => ({
      word,
      row: col.row - minR,
      col: col.col - minC,
      orientacao: col.orientacao,
    }))
    .sort((a, b) => (a.row - b.row) || (a.col - b.col));

  const entradas: EntradaCruzadinha[] = ordenadas.map((e, i) => ({
    ...e,
    numero: i + 1,
  }));

  return { rows: maxR + 1, cols: maxC + 1, entradas, solucao };
}
