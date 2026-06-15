import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { QuemEQuestion } from '../data/types';
import { Hud } from '../components/Hud';
import { Feedback } from '../components/Feedback';
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
  const indice = useGameStore((s) => s.indice);
  const total = useGameStore((s) => s.totalRodadas);
  const pergunta = useGameStore(
    (s) => s.perguntas[s.indice],
  ) as QuemEQuestion;
  const responderQuiz = useGameStore((s) => s.responderQuiz);
  const proximaPergunta = useGameStore((s) => s.proximaPergunta);
  const ultimoGanho = useGameStore((s) => s.ultimoGanho);

  const dicas = pergunta.payload.dicas;
  const [reveladas, setReveladas] = useState(1);
  const [palpite, setPalpite] = useState('');
  const [respondido, setRespondido] = useState(false);
  const [foiCerto, setFoiCerto] = useState(false);

  function revelarMais() {
    if (respondido) return;
    setReveladas((r) => Math.min(r + 1, dicas.length));
  }

  function responder() {
    if (respondido || palpite.trim() === '') return;
    const certo = acertou(palpite, pergunta.payload.resposta);
    setFoiCerto(certo);
    setRespondido(true);
    // Pontuação decresce conforme dicas reveladas (seção 7).
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
      <Hud atual={indice + 1} total={total} />
      <div className="card">
        <div className="enunciado">Quem é o jogador?</div>
        <div className="dicas">
          {dicas.slice(0, reveladas).map((d, i) => (
            <div className="dica" key={i}>
              💡 {d}
            </div>
          ))}
        </div>

        {!respondido && (
          <>
            <p className="aviso" style={{ textAlign: 'left' }}>
              Vale <strong>{pontosQuemE(reveladas)}</strong> pontos com{' '}
              {reveladas} dica{reveladas > 1 ? 's' : ''}.
            </p>
            <input
              className="quem-input"
              placeholder="Digite o nome do jogador"
              value={palpite}
              onChange={(e) => setPalpite(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && responder()}
            />
            <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
              <button
                className="btn btn-primario"
                disabled={palpite.trim() === ''}
                onClick={responder}
              >
                Responder
              </button>
              {reveladas < dicas.length && (
                <button className="btn" onClick={revelarMais}>
                  Revelar próxima dica (vale menos)
                </button>
              )}
              <button className="btn" onClick={desistir}>
                Não sei / Passar
              </button>
            </div>
          </>
        )}

        {respondido && (
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
