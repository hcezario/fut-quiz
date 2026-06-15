import { useGameStore } from '../store/gameStore';
import { IconBolt } from './Icons';

interface HudProps {
  atual: number; // índice 1-based da rodada atual
  total: number;
}

// Cabeçalho de jogo: jogador, progresso, pontuação e streak (seção 8 da spec).
export function Hud({ atual, total }: HudProps) {
  const pontos = useGameStore((s) => s.pontos);
  const streak = useGameStore((s) => s.streak);
  const jogador = useGameStore((s) => s.jogador);
  const pct = total > 0 ? (atual / total) * 100 : 0;

  return (
    <div className="hud">
      <div className="hud-linha">
        <span className="pill pill-ink">{jogador || 'Jogador'}</span>
        <span className="pill pill-line">
          {atual}/{total}
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
