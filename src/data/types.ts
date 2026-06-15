// Modelo de dados compartilhado entre conteúdo (JSON) e app.
// Espelha o schema da tabela `questions` da spec (discriminador `tipo` + `payload`).

export type Categoria = 'futebol-brasileiro' | 'santos' | 'copa-do-mundo';
export type Dificuldade = 'facil' | 'medio' | 'dificil';
export type TipoPergunta = 'multipla_escolha' | 'verdade_mito' | 'placar' | 'quem_e';

export interface PayloadMultiplaEscolha {
  alternativas: string[];
  correta: number; // índice da alternativa correta
}

export interface PayloadVerdadeMito {
  verdadeiro: boolean;
}

export interface PayloadPlacar {
  time_casa: string;
  time_visitante: string;
  gols_casa: number;
  gols_visitante: number;
  lacuna: 'gols_casa' | 'gols_visitante'; // campo que o jogador preenche
}

export interface PayloadQuemE {
  resposta: string;
  dicas: string[]; // ordem de revelação
}

export type Payload =
  | PayloadMultiplaEscolha
  | PayloadVerdadeMito
  | PayloadPlacar
  | PayloadQuemE;

export interface QuestionBase {
  id: number;
  categoria: Categoria;
  dificuldade: Dificuldade;
  enunciado: string;
  explicacao: string;
  verificado: number; // 1 = fato conferido
  fonte: string;
}

export interface MultiplaEscolhaQuestion extends QuestionBase {
  tipo: 'multipla_escolha';
  payload: PayloadMultiplaEscolha;
}
export interface VerdadeMitoQuestion extends QuestionBase {
  tipo: 'verdade_mito';
  payload: PayloadVerdadeMito;
}
export interface PlacarQuestion extends QuestionBase {
  tipo: 'placar';
  payload: PayloadPlacar;
}
export interface QuemEQuestion extends QuestionBase {
  tipo: 'quem_e';
  payload: PayloadQuemE;
}

export type Question =
  | MultiplaEscolhaQuestion
  | VerdadeMitoQuestion
  | PlacarQuestion
  | QuemEQuestion;

export interface Word {
  id: number;
  palavra: string; // sem espaços/acentos para a grade (ex: PELE)
  exibicao: string; // forma legível (ex: Pelé)
  definicao: string; // dica para cruzadinha
  categoria: Categoria;
}

export type ModoJogo =
  | 'multipla_escolha'
  | 'verdade_mito'
  | 'placar'
  | 'quem_e'
  | 'caca_palavras'
  | 'cruzadinha';
