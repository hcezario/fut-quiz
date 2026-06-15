import { useGameStore } from '../store/gameStore';
import { IconBolt } from './Icons';

// Cabeçalho de jogo: progresso, pontuação e streak (seção 8 da spec).
// No solo mostra um jogador; no duelo mostra os dois com o da vez destacado.
export function Hud() {
  const modoPartida = useGameStore((s) => s.modoPartida);
  const jogador = useGameStore((s) => s.jogador);
  const jogadores = useGameStore((s) => s.jogadores);
  const placares = useGameStore((s) => s.placares);
  const vez = useGameStore((s) => s.vez);
  const indice = useGameStore((s) => s.indice);
  const rodadas = useGameStore((s) => s.rodadasPorJogador);
  const pontos = useGameStore((s) => s.pontos);
  const streak = useGameStore((s) => s.streak);

  // Progresso local do jogador da vez.
  const localAtual = (modoPartida === 'duelo' && vez === 1 ? indice - rodadas : indice) + 1;
  const pct = rodadas > 0 ? (localAtual / rodadas) * 100 : 0;

  if (modoPartida === 'duelo') {
    const pontosDe = (i: number) => (i === vez ? pontos : placares[i]?.pontos ?? 0);
    return (
      <div className="hud">
        <div className="hud-duelo">
          {jogadores.map((nome, i) => (
            <div key={i} className={`duelo-jog ${i === vez ? 'ativo' : ''}`}>
              <span className="nome">{nome}</span>
              <span className="pts">{pontosDe(i)}</span>
            </div>
          ))}
        </div>
        <div className="hud-linha" style={{ marginTop: 10 }}>
          <span className="pill pill-amber">Vez de {jogadores[vez]}</span>
          <span className="pill pill-line" style={{ marginLeft: 'auto' }}>
            {localAtual}/{rodadas}
          </span>
          {streak >= 2 && (
            <span className="pill pill-amber">
              <IconBolt size={11} />
              {streak}
            </span>
          )}
        </div>
        <div className="progresso">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  }

  return (
    <div className="hud">
      <div className="hud-linha">
        <span className="pill pill-ink">{jogador || 'Jogador'}</span>
        <span className="pill pill-line">
          {localAtual}/{rodadas}
        </span>
        <span className="pill pill-ink" style={{ marginLeft: 'auto' }}>
          <span className="dot dot-amber" />
          {pontos}
        </span>
        {streak >= 2 && (
          <span className="pill pill-amber">
            <IconBolt size={11} />
            {streak}
          </span>
        )}
      </div>
      <div className="progresso">
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
