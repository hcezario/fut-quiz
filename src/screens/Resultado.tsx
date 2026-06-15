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
  if (taxa >= 0.5) return { titulo: 'BOA PARTIDA', desc: 'Tá no caminho certo!' };
  return { titulo: 'BORA TREINAR', desc: 'Cada jogo você fica melhor!' };
}

export function Resultado() {
  const resultados = useGameStore((s) => s.resultados);
  const modo = useGameStore((s) => s.modo);
  const categorias = useGameStore((s) => s.categorias);
  const reiniciar = useGameStore((s) => s.reiniciar);
  const voltarHome = useGameStore((s) => s.voltarHome);

  const info = modo ? modoInfo(modo) : null;
  const cats = categorias.length
    ? categorias.map((c) => NOME_CATEGORIA[c]).join(', ')
    : 'Misto';

  const duelo = resultados.length > 1;

  const acoes = (
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
  );

  // ---------- DUELO ----------
  if (duelo) {
    const [a, b] = resultados;
    const vencedorIdx = a.pontos === b.pontos ? -1 : a.pontos > b.pontos ? 0 : 1;
    const empate = vencedorIdx === -1;
    const vencedor = empate ? null : resultados[vencedorIdx];

    return (
      <>
        <div className="hero result-hero">
          <div style={{ color: 'var(--amber)' }}>
            <IconStar size={56} className="ball-badge float" />
          </div>
          <h1 className="result-titulo">FIM DE JOGO!</h1>
          <div className="result-sub">
            {empate ? 'Empate! 🤝' : `🏆 ${vencedor!.nome} venceu!`}
          </div>
        </div>

        <div className="tela">
          <div className="duelo-placar">
            {resultados.map((r, i) => (
              <div
                key={i}
                className={`sticker duelo-card ${i === vencedorIdx ? 'vencedor' : ''}`}
              >
                {i === vencedorIdx && (
                  <span className="coroa">
                    <IconStar size={22} />
                  </span>
                )}
                <div className="duelo-nome">{r.nome}</div>
                <div className="duelo-pontos">{r.pontos}</div>
                <div className="duelo-detalhe">
                  {r.acertos}/{r.total} acertos
                </div>
                <div className="duelo-detalhe">
                  <span style={{ color: 'var(--coral)', display: 'inline-flex', verticalAlign: 'middle' }}>
                    <IconBolt size={13} />
                  </span>{' '}
                  {r.maxStreak} de sequência
                </div>
              </div>
            ))}
          </div>
          {info && (
            <div className="aviso" style={{ textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
              {info.titulo} · {cats}
            </div>
          )}
          {acoes}
        </div>
      </>
    );
  }

  // ---------- SOLO ----------
  const r = resultados[0] ?? {
    nome: 'Jogador',
    pontos: 0,
    acertos: 0,
    total: 0,
    maxStreak: 0,
    novoRecorde: false,
  };
  const rk = rank(r.acertos, r.total, r.pontos);

  return (
    <>
      <div className="hero result-hero">
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
            {r.nome ? `${r.nome}, mandou bem!` : 'Mandou bem!'}
          </div>
          <div className="pontos">{r.pontos}</div>
          <div className="label">pontos</div>
        </div>

        <div className="result-stats">
          <div className="sticker sticker-sm stat">
            <div className="valor">
              {r.acertos}
              <span className="sub">/{r.total}</span>
            </div>
            <div className="rotulo">Acertos</div>
          </div>
          <div className="sticker sticker-sm stat">
            <div className="valor">
              <span style={{ color: 'var(--coral)', display: 'flex' }}>
                <IconBolt size={20} />
              </span>
              {r.maxStreak}
            </div>
            <div className="rotulo">Maior sequência</div>
          </div>
        </div>

        <div className="selo-rank">
          <span style={{ color: 'var(--ink)', display: 'flex' }}>
            <IconStar size={30} />
          </span>
          <div style={{ minWidth: 0 }}>
            <div className="titulo">
              {r.novoRecorde ? 'NOVO RECORDE!' : rk.titulo}
            </div>
            <div className="desc">
              {r.novoRecorde ? 'Sua melhor pontuação nesse modo!' : rk.desc}
            </div>
          </div>
        </div>

        {acoes}
      </div>
    </>
  );
}
