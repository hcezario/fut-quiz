import { useGameStore } from '../store/gameStore';
import { IconArrow } from '../components/Icons';

// Tela de passagem de turno no duelo: evita que um jogador veja o jogo do outro.
export function Handoff() {
  const jogadores = useGameStore((s) => s.jogadores);
  const vez = useGameStore((s) => s.vez);
  const continuar = useGameStore((s) => s.continuarHandoff);

  const nome = jogadores[vez] || `Jogador ${vez + 1}`;
  const inicial = nome.trim().charAt(0).toUpperCase() || '?';

  return (
    <div className="tela handoff">
      <div className="handoff-box">
        <div className="eyebrow">Passe o celular para</div>
        <div className="handoff-avatar">{inicial}</div>
        <div className="handoff-nome anton">{nome}</div>
        <p className="handoff-dica">Sua vez de jogar! O outro jogador não espia. 👀</p>
      </div>
      <button
        className="btn btn-lime btn-press"
        onClick={continuar}
        style={{ marginTop: 'auto' }}
      >
        Estou pronto! <IconArrow size={18} />
      </button>
    </div>
  );
}
