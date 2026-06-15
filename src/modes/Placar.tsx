import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { PlacarQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';
import { IconPlacar } from '../components/Icons';

function abreviacao(nome: string): string {
  return nome
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z]/g, '')
    .slice(0, 3)
    .toUpperCase();
}

export function Placar() {
  const indice = useGameStore((s) => s.indice);
  const total = useGameStore((s) => s.totalRodadas);
  const pergunta = useGameStore((s) => s.perguntas[s.indice]) as PlacarQuestion;
  const responderQuiz = useGameStore((s) => s.responderQuiz);
  const proximaPergunta = useGameStore((s) => s.proximaPergunta);
  const ultimoGanho = useGameStore((s) => s.ultimoGanho);

  const [valor, setValor] = useState('');
  const [respondido, setRespondido] = useState(false);

  const p = pergunta.payload;
  const correto = p.lacuna === 'gols_casa' ? p.gols_casa : p.gols_visitante;
  const golsCasaConhecido = p.lacuna !== 'gols_casa';
  const acertou = Number(valor) === correto;

  function confirmar() {
    if (respondido || valor === '') return;
    setRespondido(true);
    responderQuiz(acertou);
  }

  function proximo() {
    setValor('');
    setRespondido(false);
    proximaPergunta();
  }

  function campoGols(conhecido: boolean, gols: number) {
    if (conhecido) return <div className="score-gols">{gols}</div>;
    if (respondido) {
      return (
        <div
          className="score-gols"
          style={{ color: acertou ? 'var(--lime)' : 'var(--coral)' }}
        >
          {valor === '' ? '?' : valor}
        </div>
      );
    }
    return (
      <input
        className="placar-input"
        type="number"
        min={0}
        inputMode="numeric"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        aria-label="gols"
      />
    );
  }

  return (
    <>
      <Hud atual={indice + 1} total={total} />
      <div className="tela">
        <div className="modo-cabecalho">
          <span className="icon-tile sm bg-amber">
            <IconPlacar size={20} />
          </span>
          <div className="titulo">COMPLETE O PLACAR</div>
        </div>

        <div className="enunciado" style={{ fontSize: 15, fontWeight: 700 }}>
          {pergunta.enunciado}
        </div>

        <div className="scoreboard">
          <div className="scoreboard-linha">
            <div className="score-time">
              <div className="score-crest casa">{abreviacao(p.time_casa)}</div>
              <div className="nome">{p.time_casa}</div>
            </div>
            {campoGols(golsCasaConhecido, p.gols_casa)}
            <div className="score-x">×</div>
            {campoGols(!golsCasaConhecido, p.gols_visitante)}
            <div className="score-time">
              <div className="score-crest visit">
                {abreviacao(p.time_visitante)}
              </div>
              <div className="nome">{p.time_visitante}</div>
            </div>
          </div>
        </div>

        {!respondido ? (
          <button
            className="btn btn-lime btn-press"
            disabled={valor === ''}
            onClick={confirmar}
            style={{ marginTop: 'auto' }}
          >
            Confirmar
          </button>
        ) : (
          <Feedback
            acertou={acertou}
            explicacao={pergunta.explicacao}
            fonte={pergunta.fonte}
            ganho={ultimoGanho}
            textoComplementar={
              acertou
                ? undefined
                : `Placar certo: ${p.time_casa} ${p.gols_casa} x ${p.gols_visitante} ${p.time_visitante}`
            }
            onProximo={proximo}
          />
        )}
      </div>
    </>
  );
}
