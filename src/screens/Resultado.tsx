import { useGameStore } from '../store/gameStore';
import { modoInfo } from '../modes';
import type { Categoria } from '../data/types';
import { IconBolt, IconRefresh, IconStar } from '../components/Icons';

const NOME_CATEGORIA: Record<Categoria, string> = {
  'futebol-brasileiro': 'Futebol Brasileiro',
  santos: 'Santos',
  'copa-do-mundo': 'Copa do Mundo',
};

function rank(acertos: number, total: number, pontos: number) {
  const taxa = total > 0 ? acertos / total : 0;
  if (pontos >= 200 || taxa >= 0.8)
    return { titulo: 'CRAQUE DA RODADA', desc: 'Você mandou muito bem!' };
  if (taxa >= 0.5)
    return { titulo: 'BOA PARTIDA', desc: 'Tá no caminho certo!' };
  return { titulo: 'BORA TREINAR', desc: 'Cada jogo você fica melhor!' };
}

export function Resultado() {
  const pontos = useGameStore((s) => s.pontos);
  const acertos = useGameStore((s) => s.acertos);
  const total = useGameStore((s) => s.totalRodadas);
  const maxStreak = useGameStore((s) => s.maxStreak);
  const modo = useGameStore((s) => s.modo);
  const categorias = useGameStore((s) => s.categorias);
  const jogador = useGameStore((s) => s.jogador);
  const reiniciar = useGameStore((s) => s.reiniciar);
  const voltarHome = useGameStore((s) => s.voltarHome);

  const info = modo ? modoInfo(modo) : null;
  const cats = categorias.length
    ? categorias.map((c) => NOME_CATEGORIA[c]).join(', ')
    : 'Misto';
  const r = rank(acertos, total, pontos);

  return (
    <>
      <div className="hero result-hero">
        <span className="confete" style={{ top: 50, left: 26 }}>
          <span className="dot dot-coral" style={{ width: 8, height: 8 }} />
        </span>
        <span
          className="confete"
          style={{ top: 74, right: 34, transform: 'rotate(20deg)' }}
        >
          <span
            className="dot dot-lime"
            style={{ width: 10, height: 10, borderRadius: 2 }}
          />
        </span>
        <span className="confete" style={{ top: 120, left: 40 }}>
          <span className="dot dot-amber" style={{ width: 7, height: 7 }} />
        </span>
        <div style={{ color: 'var(--amber)' }}>
          <IconStar size={56} className="ball-badge float" />
        </div>
        <h1 className="result-titulo">FIM DE JOGO!</h1>
        {info && (
          <div className="result-sub">
            {info.titulo} · {cats}
          </div>
        )}
      </div>

      <div className="tela">
        <div className="sticker result-score">
          <div className="eyebrow">
            {jogador ? `${jogador}, mandou bem!` : 'Mandou bem!'}
          </div>
          <div className="pontos">{pontos}</div>
          <div className="label">pontos</div>
        </div>

        <div className="result-stats">
          <div className="sticker sticker-sm stat">
            <div className="valor">
              {acertos}
              <span className="sub">/{total}</span>
            </div>
            <div className="rotulo">Acertos</div>
          </div>
          <div className="sticker sticker-sm stat">
            <div className="valor">
              <span style={{ color: 'var(--coral)', display: 'flex' }}>
                <IconBolt size={20} />
              </span>
              {maxStreak}
            </div>
            <div className="rotulo">Maior sequência</div>
          </div>
        </div>

        <div className="selo-rank">
          <span style={{ color: 'var(--ink)', display: 'flex' }}>
            <IconStar size={30} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="titulo">{r.titulo}</div>
            <div className="desc">{r.desc}</div>
          </div>
        </div>

        <div className="acoes-rodape">
          <button className="btn btn-ink btn-press" onClick={reiniciar}>
            <span style={{ color: 'var(--lime)', display: 'flex' }}>
              <IconRefresh size={18} />
            </span>
            Jogar de novo
          </button>
          <button className="btn btn-ghost" onClick={voltarHome}>
            Voltar ao início
          </button>
        </div>
      </div>
    </>
  );
}
