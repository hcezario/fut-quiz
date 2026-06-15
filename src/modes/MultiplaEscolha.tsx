import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { MultiplaEscolhaQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';

export function MultiplaEscolha() {
  const indice = useGameStore((s) => s.indice);
  const total = useGameStore((s) => s.totalRodadas);
  const pergunta = useGameStore(
    (s) => s.perguntas[s.indice],
  ) as MultiplaEscolhaQuestion;
  const responderQuiz = useGameStore((s) => s.responderQuiz);
  const proximaPergunta = useGameStore((s) => s.proximaPergunta);
  const ultimoGanho = useGameStore((s) => s.ultimoGanho);

  const [escolha, setEscolha] = useState<number | null>(null);
  const respondido = escolha !== null;
  const correta = pergunta.payload.correta;

  function escolher(i: number) {
    if (respondido) return;
    setEscolha(i);
    responderQuiz(i === correta);
  }

  function proximo() {
    setEscolha(null);
    proximaPergunta();
  }

  return (
    <>
      <Hud atual={indice + 1} total={total} />
      <div className="card">
        <div className="enunciado">{pergunta.enunciado}</div>
        <div className="alternativas">
          {pergunta.payload.alternativas.map((alt, i) => {
            let cls = 'btn alt';
            if (respondido && i === correta) cls += ' correta';
            else if (respondido && i === escolha) cls += ' errada';
            return (
              <button
                key={i}
                className={cls}
                disabled={respondido}
                onClick={() => escolher(i)}
              >
                {alt}
              </button>
            );
          })}
        </div>
        {respondido && (
          <Feedback
            acertou={escolha === correta}
            explicacao={pergunta.explicacao}
            fonte={pergunta.fonte}
            ganho={ultimoGanho}
            textoComplementar={
              escolha === correta
                ? undefined
                : `Resposta correta: ${pergunta.payload.alternativas[correta]}`
            }
            onProximo={proximo}
          />
        )}
      </div>
    </>
  );
}
