import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { VerdadeMitoQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';

export function VerdadeMito() {
  const indice = useGameStore((s) => s.indice);
  const total = useGameStore((s) => s.totalRodadas);
  const pergunta = useGameStore(
    (s) => s.perguntas[s.indice],
  ) as VerdadeMitoQuestion;
  const responderQuiz = useGameStore((s) => s.responderQuiz);
  const proximaPergunta = useGameStore((s) => s.proximaPergunta);
  const ultimoGanho = useGameStore((s) => s.ultimoGanho);

  const [resposta, setResposta] = useState<boolean | null>(null);
  const respondido = resposta !== null;
  const correto = pergunta.payload.verdadeiro;

  function responder(valor: boolean) {
    if (respondido) return;
    setResposta(valor);
    responderQuiz(valor === correto);
  }

  function proximo() {
    setResposta(null);
    proximaPergunta();
  }

  return (
    <>
      <Hud atual={indice + 1} total={total} />
      <div className="card">
        <div className="enunciado">{pergunta.enunciado}</div>
        <div className="vm-botoes">
          <button
            className="btn btn-verdade"
            disabled={respondido}
            onClick={() => responder(true)}
          >
            ✅ Verdade
          </button>
          <button
            className="btn btn-mito"
            disabled={respondido}
            onClick={() => responder(false)}
          >
            ❌ Mito
          </button>
        </div>
        {respondido && (
          <Feedback
            acertou={resposta === correto}
            explicacao={pergunta.explicacao}
            fonte={pergunta.fonte}
            ganho={ultimoGanho}
            textoComplementar={`Era ${correto ? 'VERDADE' : 'MITO'}.`}
            onProximo={proximo}
          />
        )}
      </div>
    </>
  );
}
