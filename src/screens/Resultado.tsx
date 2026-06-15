import { useGameStore } from '../store/gameStore';
import { modoInfo } from '../modes';

export function Resultado() {
  const pontos = useGameStore((s) => s.pontos);
  const acertos = useGameStore((s) => s.acertos);
  const total = useGameStore((s) => s.totalRodadas);
  const maxStreak = useGameStore((s) => s.maxStreak);
  const modo = useGameStore((s) => s.modo);
  const jogador = useGameStore((s) => s.jogador);
  const reiniciar = useGameStore((s) => s.reiniciar);
  const voltarHome = useGameStore((s) => s.voltarHome);

  const info = modo ? modoInfo(modo) : null;

  return (
    <>
      <header>
        <h1 className="titulo-app" style={{ fontSize: '1.8rem' }}>
          🏆 Fim de jogo!
        </h1>
        {info && <p className="subtitulo">{info.titulo}</p>}
      </header>

      <div className="card resultado-grande">
        <div className="modo-desc">
          {jogador ? `${jogador}, sua pontuação` : 'Sua pontuação'}
        </div>
        <div className="resultado-pontos">{pontos}</div>
        <div className="resultado-stats">
          <div className="stat">
            <div className="valor">
              {acertos}
              <span style={{ fontSize: '1rem' }}>/{total}</span>
            </div>
            <div className="rotulo">Acertos</div>
          </div>
          <div className="stat">
            <div className="valor">🔥 {maxStreak}</div>
            <div className="rotulo">Maior sequência</div>
          </div>
        </div>
      </div>

      <div className="acoes-rodape">
        <button className="btn btn-primario" onClick={reiniciar}>
          Jogar de novo
        </button>
        <button className="btn btn-secundario" onClick={voltarHome}>
          Voltar ao início
        </button>
      </div>
    </>
  );
}
