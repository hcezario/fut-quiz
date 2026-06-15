import { useGameStore } from '../store/gameStore';
import { MODOS } from '../modes';

const JOGADORES_RAPIDOS = ['Pai', 'Filho'];

export function Home() {
  const jogador = useGameStore((s) => s.jogador);
  const setJogador = useGameStore((s) => s.setJogador);
  const abrirConfig = useGameStore((s) => s.abrirConfig);

  return (
    <>
      <header>
        <h1 className="titulo-app">⚽ Fut Quiz</h1>
        <p className="subtitulo">
          Futebol brasileiro, Santos FC e Copa do Mundo
        </p>
      </header>

      <div className="card">
        <label className="label-grupo" htmlFor="nome">
          Quem vai jogar?
        </label>
        <input
          id="nome"
          className="quem-input"
          placeholder="Seu nome"
          value={jogador}
          onChange={(e) => setJogador(e.target.value)}
        />
        <div className="chips" style={{ marginTop: 10 }}>
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

      <div className="card">
        <label className="label-grupo">Escolha um modo de jogo</label>
        <div className="lista-modos">
          {MODOS.map((m) => (
            <button
              key={m.id}
              className="btn btn-bloco"
              onClick={() => abrirConfig(m.id)}
            >
              <span className="emoji">{m.emoji}</span>
              <span>
                <span className="modo-titulo">{m.titulo}</span>
                <br />
                <span className="modo-desc">{m.descricao}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <p className="aviso">
        100% offline • Conteúdo curado e verificado por humanos
      </p>
    </>
  );
}
