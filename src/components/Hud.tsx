import { useGameStore } from '../store/gameStore';

interface HudProps {
  atual: number; // índice 1-based da rodada atual
  total: number;
}

// Cabeçalho de jogo: progresso, pontuação e streak (seção 8 da spec).
export function Hud({ atual, total }: HudProps) {
  const pontos = useGameStore((s) => s.pontos);
  const streak = useGameStore((s) => s.streak);
  const jogador = useGameStore((s) => s.jogador);
  const pct = total > 0 ? (atual / total) * 100 : 0;

  return (
    <div className="card" style={{ padding: 14 }}>
      <div className="hud">
        <span className="pill">{jogador || 'Jogador'}</span>
        <span className="pill">
          {atual}/{total}
        </span>
        <span className="pill">⚽ {pontos}</span>
        {streak >= 2 && <span className="pill streak">🔥 {streak}</span>}
      </div>
      <div className="progresso" style={{ marginTop: 12 }}>
        <div style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
