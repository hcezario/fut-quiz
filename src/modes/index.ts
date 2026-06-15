import type { ModoJogo } from '../data/types';

export interface ModoInfo {
  id: ModoJogo;
  titulo: string;
  descricao: string;
  emoji: string;
  usaDificuldade: boolean;
}

export const MODOS: ModoInfo[] = [
  {
    id: 'multipla_escolha',
    titulo: 'Quiz de Múltipla Escolha',
    descricao: 'Pergunta com 4 alternativas. Escolha a certa!',
    emoji: '❓',
    usaDificuldade: true,
  },
  {
    id: 'verdade_mito',
    titulo: 'Verdade ou Mito',
    descricao: 'É verdade ou é mito? Você decide.',
    emoji: '🤔',
    usaDificuldade: true,
  },
  {
    id: 'placar',
    titulo: 'Complete o Placar',
    descricao: 'Descubra o número de gols que falta no placar.',
    emoji: '🔢',
    usaDificuldade: true,
  },
  {
    id: 'quem_e',
    titulo: 'Quem é o Jogador?',
    descricao: 'Dicas progressivas. Acerte com menos dicas e ganhe mais.',
    emoji: '🕵️',
    usaDificuldade: true,
  },
  {
    id: 'caca_palavras',
    titulo: 'Caça-palavras',
    descricao: 'Ache nomes de clubes, jogadores e países na grade.',
    emoji: '🔎',
    usaDificuldade: false,
  },
  {
    id: 'cruzadinha',
    titulo: 'Cruzadinha',
    descricao: 'Preencha as palavras a partir das dicas.',
    emoji: '✏️',
    usaDificuldade: false,
  },
];

export function modoInfo(id: ModoJogo): ModoInfo {
  return MODOS.find((m) => m.id === id)!;
}
