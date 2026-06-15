import type { ComponentType } from 'react';
import type { ModoJogo } from '../data/types';
import {
  IconCaca,
  IconCruzadinha,
  IconMultipla,
  IconPlacar,
  IconQuemE,
  IconVerdadeMito,
} from '../components/Icons';

export type Acento = 'lime' | 'coral' | 'amber';

export interface ModoInfo {
  id: ModoJogo;
  titulo: string;
  /** Título quebrado em 2 linhas para os cards da home. */
  tituloCurto: [string, string];
  descricao: string;
  Icon: ComponentType<{ size?: number }>;
  acento: Acento;
  usaDificuldade: boolean;
}

export const MODOS: ModoInfo[] = [
  {
    id: 'multipla_escolha',
    titulo: 'Múltipla Escolha',
    tituloCurto: ['Múltipla', 'Escolha'],
    descricao: 'Pergunta com 4 alternativas. Escolha a certa!',
    Icon: IconMultipla,
    acento: 'lime',
    usaDificuldade: true,
  },
  {
    id: 'verdade_mito',
    titulo: 'Verdade ou Mito',
    tituloCurto: ['Verdade', 'ou Mito'],
    descricao: 'É verdade ou é mito? Você decide.',
    Icon: IconVerdadeMito,
    acento: 'coral',
    usaDificuldade: true,
  },
  {
    id: 'placar',
    titulo: 'Complete o Placar',
    tituloCurto: ['Complete', 'o Placar'],
    descricao: 'Descubra o número de gols que falta no placar.',
    Icon: IconPlacar,
    acento: 'amber',
    usaDificuldade: true,
  },
  {
    id: 'quem_e',
    titulo: 'Quem é o Jogador?',
    tituloCurto: ['Quem é o', 'Jogador?'],
    descricao: 'Dicas progressivas. Acerte com menos dicas e ganhe mais.',
    Icon: IconQuemE,
    acento: 'lime',
    usaDificuldade: true,
  },
  {
    id: 'caca_palavras',
    titulo: 'Caça-palavras',
    tituloCurto: ['Caça-', 'palavras'],
    descricao: 'Ache nomes de clubes, jogadores e países na grade.',
    Icon: IconCaca,
    acento: 'coral',
    usaDificuldade: false,
  },
  {
    id: 'cruzadinha',
    titulo: 'Cruzadinha',
    tituloCurto: ['Cruza-', 'dinha'],
    descricao: 'Preencha as palavras a partir das dicas.',
    Icon: IconCruzadinha,
    acento: 'amber',
    usaDificuldade: false,
  },
];

export function modoInfo(id: ModoJogo): ModoInfo {
  return MODOS.find((m) => m.id === id)!;
}
