// Gerador de caça-palavras por algoritmo (sem IA), a partir de palavras curadas.

import { shuffle } from '../game/random';
import type { Word } from '../data/types';

export interface PalavraColocada {
  word: Word;
  // coordenadas de cada letra na grade (linha, coluna)
  celulas: { row: number; col: number }[];
}

export interface CacaPalavras {
  grade: string[][]; // letras maiúsculas
  size: number;
  colocadas: PalavraColocada[]; // palavras que couberam
  naoColocadas: Word[]; // palavras que não couberam (raro)
}

type Direcao = { dr: number; dc: number };

// 8 direções (horizontal, vertical e diagonais, em ambos os sentidos).
const DIRECOES: Direcao[] = [
  { dr: 0, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: -1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: -1, dc: -1 },
  { dr: 1, dc: -1 },
  { dr: -1, dc: 1 },
];

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function cabe(
  grade: (string | null)[][],
  palavra: string,
  row: number,
  col: number,
  dir: Direcao,
  size: number,
): { row: number; col: number }[] | null {
  const celulas: { row: number; col: number }[] = [];
  for (let i = 0; i < palavra.length; i++) {
    const r = row + dir.dr * i;
    const c = col + dir.dc * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return null;
    const atual = grade[r][c];
    if (atual !== null && atual !== palavra[i]) return null; // conflito
    celulas.push({ row: r, col: c });
  }
  return celulas;
}

export interface OpcoesCacaPalavras {
  size?: number;
  maxPalavras?: number;
}

export function gerarCacaPalavras(
  palavras: Word[],
  opcoes: OpcoesCacaPalavras = {},
): CacaPalavras {
  const candidatas = shuffle(palavras).filter((w) => w.palavra.length >= 3);
  const maxPalavras = opcoes.maxPalavras ?? 8;
  const escolhidas = candidatas.slice(0, maxPalavras);

  // Grade pelo menos do tamanho da maior palavra (+ folga).
  const maiorPalavra = escolhidas.reduce(
    (m, w) => Math.max(m, w.palavra.length),
    0,
  );
  const size = opcoes.size ?? Math.max(10, maiorPalavra + 2);

  const grade: (string | null)[][] = Array.from({ length: size }, () =>
    Array<string | null>(size).fill(null),
  );

  const colocadas: PalavraColocada[] = [];
  const naoColocadas: Word[] = [];

  for (const word of escolhidas) {
    const palavra = word.palavra.toUpperCase();
    let colocada = false;
    // Tenta várias posições/direções aleatórias.
    const dirs = shuffle(DIRECOES);
    const posicoes = shuffle(
      Array.from({ length: size * size }, (_, k) => k),
    );
    busca: for (const dir of dirs) {
      for (const pos of posicoes) {
        const row = Math.floor(pos / size);
        const col = pos % size;
        const celulas = cabe(grade, palavra, row, col, dir, size);
        if (celulas) {
          celulas.forEach((cel, i) => {
            grade[cel.row][cel.col] = palavra[i];
          });
          colocadas.push({ word, celulas });
          colocada = true;
          break busca;
        }
      }
    }
    if (!colocada) naoColocadas.push(word);
  }

  // Preenche vazios com letras aleatórias.
  const gradeFinal: string[][] = grade.map((linha) =>
    linha.map((cel) => cel ?? ALFABETO[Math.floor(Math.random() * 26)]),
  );

  return { grade: gradeFinal, size, colocadas, naoColocadas };
}
