// Acesso ao banco curado. Fonte da verdade = arquivos em /content (JSON versionado).
//
// No MVP web puro carregamos o conteúdo como JSON estático importado no bundle:
// zero infraestrutura, zero chamadas de rede (atende ao critério "100% offline").
// Quando empacotado com Capacitor, o mesmo bundle roda no app sem alterações.
// A migração para SQLite (sql.js / arquivo .db) na Fase 2 troca apenas este módulo.

import rawQuestions from '../../content/questions.json';
import rawWords from '../../content/words.json';
import type {
  Categoria,
  Dificuldade,
  Question,
  TipoPergunta,
  Word,
} from './types';

// IDs são atribuídos na carga (o conteúdo em JSON é editado sem IDs manuais).
const allQuestions: Question[] = (rawQuestions as Omit<Question, 'id'>[]).map(
  (q, i) => ({ ...q, id: i + 1 }) as Question,
);

const allWords: Word[] = (rawWords as Omit<Word, 'id'>[]).map(
  (w, i) => ({ ...w, id: i + 1 }) as Word,
);

// Regra de conteúdo (não negociável): só fatos verificados entram em produção.
export const questions: Question[] = allQuestions.filter(
  (q) => q.verificado === 1,
);
export const words: Word[] = allWords;

export interface FiltroPerguntas {
  categorias: Categoria[]; // vazio = todas
  dificuldades: Dificuldade[]; // vazio = todas
  tipos?: TipoPergunta[]; // restringe por modo de jogo
}

export function filtrarPerguntas(filtro: FiltroPerguntas): Question[] {
  return questions.filter((q) => {
    if (filtro.categorias.length && !filtro.categorias.includes(q.categoria)) {
      return false;
    }
    if (
      filtro.dificuldades.length &&
      !filtro.dificuldades.includes(q.dificuldade)
    ) {
      return false;
    }
    if (filtro.tipos && filtro.tipos.length && !filtro.tipos.includes(q.tipo)) {
      return false;
    }
    return true;
  });
}

export function filtrarPalavras(categorias: Categoria[]): Word[] {
  if (!categorias.length) return words;
  return words.filter((w) => categorias.includes(w.categoria));
}
