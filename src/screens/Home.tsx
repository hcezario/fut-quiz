import { useMemo } from 'react';
import { isModoQuiz, useGameStore } from '../store/gameStore';
import { MODOS } from '../modes';
import { IconBall, IconCheck } from '../components/Icons';
import { listarJogadores } from '../data/storage';

const DEFAULTS = ['Pai', 'Filho'];

export function Home() {
  const modoPartida = useGameStore((s) => s.modoPartida);
  const setModoPartida = useGameStore((s) => s.setModoPartida);
  const jogador = useGameStore((s) => s.jogador);
  const setJogador = useGameStore((s) => s.setJogador);
  const jogadores = useGameStore((s) => s.jogadores);
  const setJogadorDuelo = useGameStore((s) => s.setJogadorDuelo);
  const abrirConfig = useGameStore((s) => s.abrirConfig);

  const duelo = modoPartida === 'duelo';

  // Jogadores conhecidos (recordes salvos) + atalhos padrão, sem repetir.
  const sugestoes = useMemo(() => {
    const salvos = listarJogadores().map((j) => j.nome);
    const todos = [...DEFAULTS, ...salvos];
    return Array.from(new Set(todos.map((n) => n.trim()).filter(Boolean))).slice(0, 6);
  }, []);

  const inicial = (n: string) => n.trim().charAt(0).toUpperCase() || '+';

  return (
    <>
      <div className="hero">
        <div className="selo-offline">100% OFFLINE</div>
        <div className="hero-logo">
          <div className="ball-badge float">
            <IconBall size={28} />
          </div>
          <h1 className="hero-titulo">
            FUT
            <br />
            QUIZ
          </h1>
        </div>
        <p className="hero-sub">Futebol brasileiro · Santos · Copa do Mundo</p>
      </div>

      <div className="tela">
        {/* alternância solo / duelo, sobreposta ao hero */}
        <div className="seg" style={{ marginTop: -26, zIndex: 2 }}>
          <button
            className={`seg-opt ${!duelo ? 'ativo' : ''}`}
            onClick={() => setModoPartida('solo')}
          >
            👤 Solo
          </button>
          <button
            className={`seg-opt ${duelo ? 'ativo' : ''}`}
            onClick={() => setModoPartida('duelo')}
          >
            ⚔️ Duelo
          </button>
        </div>

        {!duelo ? (
          <div className="sticker pad">
            <div className="eyebrow" style={{ marginBottom: 9 }}>
              Quem vai jogar?
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="avatar">{inicial(jogador)}</div>
              <input
                className="input-nome"
                placeholder="Seu nome"
                value={jogador}
                onChange={(e) => setJogador(e.target.value)}
              />
            </div>
            <div className="chips" style={{ marginTop: 11 }}>
              {sugestoes.map((j) => (
                <button
                  key={j}
                  className={`chip ${jogador === j ? 'ativo' : ''}`}
                  onClick={() => setJogador(j)}
                >
                  {j}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="sticker pad">
            <div className="eyebrow" style={{ marginBottom: 9 }}>
              Quem se enfrenta?
            </div>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: i === 0 ? 12 : 0,
                }}
              >
                <div className="avatar">{inicial(jogadores[i])}</div>
                <input
                  className="input-nome"
                  placeholder={`Jogador ${i + 1}`}
                  value={jogadores[i]}
                  onChange={(e) => setJogadorDuelo(i, e.target.value)}
                />
              </div>
            ))}
            <div className="chips" style={{ marginTop: 11 }}>
              <button
                className="chip"
                onClick={() => {
                  setJogadorDuelo(0, 'Pai');
                  setJogadorDuelo(1, 'Filho');
                }}
              >
                Pai vs Filho
              </button>
            </div>
          </div>
        )}

        <div className="eyebrow">
          {duelo ? 'Escolha o modo do duelo' : 'Escolha um modo'}
        </div>

        <div className="modos-grid">
          {MODOS.map((m) => {
            const bloqueado = duelo && !isModoQuiz(m.id);
            return (
              <button
                key={m.id}
                className={`modo-card ${bloqueado ? 'locked' : ''}`}
                disabled={bloqueado}
                onClick={() => !bloqueado && abrirConfig(m.id)}
              >
                <span className={`icon-tile bg-${m.acento}`}>
                  <m.Icon size={22} />
                </span>
                <span className="nome">
                  {m.tituloCurto[0]}
                  <br />
                  {m.tituloCurto[1]}
                </span>
                {bloqueado && <span className="lock-tag">Só no solo</span>}
              </button>
            );
          })}
        </div>

        <div className="rodape-info">
          <IconCheck size={14} />
          Conteúdo curado e verificado por humanos
        </div>
      </div>
    </>
  );
}
