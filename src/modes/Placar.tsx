import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { PlacarQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';

export function Placar() {
  const indice = useGameStore((s) => s.indice);
  const total = useGameStore((s) => s.totalRodadas);
  const pergunta = useGameStore(
    (s) => s.perguntas[s.indice],
  ) as PlacarQuestion;
  const responderQuiz = useGameStore((s) => s.responderQuiz);
  const proximaPergunta = useGameStore((s) => s.proximaPergunta);
  const ultimoGanho = useGameStore((s) => s.ultimoGanho);

  const [valor, setValor] = useState('');
  const [respondido, setRespondido] = useState(false);

  const p = pergunta.payload;
  const correto = p.lacuna === 'gols_casa' ? p.gols_casa : p.gols_visitante;
  const golsCasaConhecido = p.lacuna !== 'gols_casa';

  function confirmar() {
    if (respondido || valor === '') return;
    setRespondido(true);
    responderQuiz(Number(valor) === correto);
  }

  function proximo() {
    setValor('');
    setRespondido(false);
    proximaPergunta();
  }

  function campoGols(conhecido: boolean, gols: number) {
    if (conhecido) return <span className="placar-gols">{gols}</span>;
    if (respondido) {
      return (
        <span
          className="placar-gols"
          style={{ color: Number(valor) === correto ? '#1f9d57' : '#d1372b' }}
        >
          {valor === '' ? '?' : valor}
        </span>
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
        aria-label="placar"
      />
    );
  }

  return (
    <>
      <Hud atual={indice + 1} total={total} />
      <div className="card">
        <div className="enunciado">{pergunta.enunciado}</div>
        <div className="placar-jogo">
          <span className="placar-time">{p.time_casa}</span>
          {campoGols(golsCasaConhecido, p.gols_casa)}
          <span>x</span>
          {campoGols(!golsCasaConhecido, p.gols_visitante)}
          <span className="placar-time">{p.time_visitante}</span>
        </div>
        {!respondido && (
          <button
            className="btn btn-primario"
            disabled={valor === ''}
            onClick={confirmar}
          >
            Confirmar
          </button>
        )}
        {respondido && (
          <Feedback
            acertou={Number(valor) === correto}
            explicacao={pergunta.explicacao}
            fonte={pergunta.fonte}
            ganho={ultimoGanho}
            textoComplementar={
              Number(valor) === correto
                ? undefined
                : `Placar correto: ${p.time_casa} ${p.gols_casa} x ${p.gols_visitante} ${p.time_visitante}`
            }
            onProximo={proximo}
          />
        )}
      </div>
    </>
  );
}
