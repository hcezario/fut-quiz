import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { MultiplaEscolhaQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';
import { IconCheck } from '../components/Icons';
import { CATEGORIA_LABEL, DIFICULDADE_DOT, DIFICULDADE_LABEL } from '../data/labels';

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];

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
      <div className="tela">
        <div className="sticker pad">
          <div style={{ display: 'flex', gap: 7, marginBottom: 11 }}>
            <span className="tag">{CATEGORIA_LABEL[pergunta.categoria].toUpperCase()}</span>
            <span className="tag">
              <span className={`dot ${DIFICULDADE_DOT[pergunta.dificuldade]}`} />
              {DIFICULDADE_LABEL[pergunta.dificuldade].toUpperCase()}
            </span>
          </div>
          <div className="enunciado" style={{ marginBottom: 14 }}>
            {pergunta.enunciado}
          </div>
          <div className="alternativas">
            {pergunta.payload.alternativas.map((alt, i) => {
              let cls = 'alt';
              if (respondido && i === correta) cls += ' correta';
              else if (respondido && i === escolha) cls += ' errada';
              return (
                <button
                  key={i}
                  className={cls}
                  disabled={respondido}
                  onClick={() => escolher(i)}
                >
                  <span className="letra">{LETRAS[i]}</span>
                  {alt}
                  {respondido && i === correta && (
                    <span className="marca">
                      <IconCheck size={20} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
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
                : `Resposta certa: ${pergunta.payload.alternativas[correta]}`
            }
            onProximo={proximo}
          />
        )}
      </div>
    </>
  );
}
