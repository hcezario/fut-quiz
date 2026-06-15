import { useGameStore } from '../store/gameStore';
import { MODOS } from '../modes';
import { IconBall, IconCheck } from '../components/Icons';

const JOGADORES_RAPIDOS = ['Pai', 'Filho'];

export function Home() {
  const jogador = useGameStore((s) => s.jogador);
  const setJogador = useGameStore((s) => s.setJogador);
  const abrirConfig = useGameStore((s) => s.abrirConfig);

  const inicial = jogador.trim().charAt(0).toUpperCase() || '+';

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
        {/* player card sobreposto ao hero */}
        <div className="sticker pad" style={{ marginTop: -26, zIndex: 2 }}>
          <div className="eyebrow" style={{ marginBottom: 9 }}>
            Quem vai jogar?
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="avatar">{inicial}</div>
            <input
              className="input-nome"
              placeholder="Seu nome"
              value={jogador}
              onChange={(e) => setJogador(e.target.value)}
            />
          </div>
          <div className="chips" style={{ marginTop: 11 }}>
            {JOGADORES_RAPIDOS.map((j) => (
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

        <div className="eyebrow">Escolha um modo</div>

        <div className="modos-grid">
          {MODOS.map((m) => (
            <button
              key={m.id}
              className="modo-card"
              onClick={() => abrirConfig(m.id)}
            >
              <span className={`icon-tile bg-${m.acento}`}>
                <m.Icon size={22} />
              </span>
              <span className="nome">
                {m.tituloCurto[0]}
                <br />
                {m.tituloCurto[1]}
              </span>
            </button>
          ))}
        </div>

        <div className="rodape-info">
          <IconCheck size={14} />
          Conteúdo curado e verificado por humanos
        </div>
      </div>
    </>
  );
}
