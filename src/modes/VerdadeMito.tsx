import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { VerdadeMitoQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';
import { IconCheck, IconVerdadeMito, IconX } from '../components/Icons';
import { CATEGORIA_LABEL } from '../data/labels';

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
      <div className="tela">
        <div className="modo-cabecalho">
          <span className="icon-tile sm bg-coral">
            <IconVerdadeMito size={20} />
          </span>
          <div className="titulo">VERDADE OU MITO?</div>
        </div>

        <div className="sticker vm-frase">
          <span className="tag" style={{ alignSelf: 'flex-start', marginBottom: 14 }}>
            {CATEGORIA_LABEL[pergunta.categoria].toUpperCase()}
          </span>
          <div className="texto">{pergunta.enunciado}</div>
        </div>

        {!respondido ? (
          <div className="vm-botoes">
            <button
              className="btn btn-lime btn-press btn-vm"
              onClick={() => responder(true)}
            >
              <IconCheck size={26} />
              VERDADE
            </button>
            <button
              className="btn btn-coral btn-press btn-vm"
              onClick={() => responder(false)}
            >
              <IconX size={26} />
              MITO
            </button>
          </div>
        ) : (
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
