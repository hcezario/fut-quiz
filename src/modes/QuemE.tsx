import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { QuemEQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';
import { IconBulb } from '../components/Icons';
import { pontosQuemE } from '../game/scoring';

// Normaliza para comparar respostas (sem acento, minúsculo, sem espaços extras).
function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function acertou(resposta: string, gabarito: string): boolean {
  const a = normalizar(resposta);
  const b = normalizar(gabarito);
  if (!a) return false;
  return a === b || b.includes(a) || a.includes(b);
}

export function QuemE() {
  const pergunta = useGameStore((s) => s.perguntas[s.indice]) as QuemEQuestion;
  const responderQuiz = useGameStore((s) => s.responderQuiz);
  const proximaPergunta = useGameStore((s) => s.proximaPergunta);
  const ultimoGanho = useGameStore((s) => s.ultimoGanho);

  const dicas = pergunta.payload.dicas;
  const [reveladas, setReveladas] = useState(1);
  const [palpite, setPalpite] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [foiCerto, setFoiCerto] = useState(false);

  const ocultas = dicas.length - reveladas;

  function revelarMais() {
    if (respondido) return;
    setReveladas((r) => Math.min(r + 1, dicas.length));
  }

  function responder() {
    if (respondido || palpite.trim() === '') return;
    const certo = acertou(palpite, pergunta.payload.resposta);
    setFoiCerto(certo);
    setRespondido(true);
    responderQuiz(certo, pontosQuemE(reveladas));
  }

  function desistir() {
    if (respondido) return;
    setFoiCerto(false);
    setRespondido(true);
    responderQuiz(false);
  }

  function proximo() {
    setReveladas(1);
    setPalpite('');
    setRespondido(false);
    setFoiCerto(false);
    proximaPergunta();
  }

  return (
    <>
      <Hud />
      <div className="tela">
        <div className="modo-cabecalho">
          <div className="quem-avatar">?</div>
          <div className="quem-titulo">
            QUEM É O<br />
            JOGADOR?
          </div>
          <div className="quem-vale">
            vale
            <br />
            <span className="num">{pontosQuemE(reveladas)}</span>
          </div>
        </div>

        <div className="dicas">
          {dicas.slice(0, reveladas).map((d, i) => (
            <div className="dica" key={i}>
              <span style={{ color: 'var(--amber)', display: 'flex', flex: 'none' }}>
                <IconBulb size={18} />
              </span>
              <span className="texto">{d}</span>
            </div>
          ))}
          {ocultas > 0 && !respondido && (
            <div className="dica-oculta">
              + {ocultas} dica{ocultas > 1 ? 's' : ''} escondida
              {ocultas > 1 ? 's' : ''}
            </div>
          )}
        </div>

        {!respondido ? (
          <>
            <input
              className="input-quem"
              placeholder="Digite o nome do jogador"
              value={palpite}
              onChange={(e) => setPalpite(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && responder()}
            />
            <button
              className="btn btn-lime btn-press"
              disabled={palpite.trim() === ''}
              onClick={responder}
            >
              Responder
            </button>
            <div className="quem-extra" style={{ marginTop: 'auto' }}>
              <button
                className="btn btn-ghost"
                onClick={revelarMais}
                disabled={reveladas >= dicas.length}
                style={{ color: 'var(--ink)' }}
              >
                Revelar dica
              </button>
              <button className="btn btn-ghost" onClick={desistir}>
                Passar
              </button>
            </div>
          </>
        ) : (
          <Feedback
            acertou={foiCerto}
            explicacao={pergunta.explicacao}
            fonte={pergunta.fonte}
            ganho={ultimoGanho}
            textoComplementar={`Era ${pergunta.payload.resposta}.`}
            onProximo={proximo}
          />
        )}
      </div>
    </>
  );
}
