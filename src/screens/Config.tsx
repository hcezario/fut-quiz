import { useGameStore } from '../store/gameStore';
import { modoInfo } from '../modes';
import type { Categoria, Dificuldade } from '../data/types';
import { IconBack, IconBolt } from '../components/Icons';

const CATEGORIAS: { id: Categoria; rotulo: string }[] = [
  { id: 'futebol-brasileiro', rotulo: 'Futebol Brasileiro' },
  { id: 'santos', rotulo: 'Santos FC' },
  { id: 'copa-do-mundo', rotulo: 'Copa do Mundo' },
];

const DIFICULDADES: { id: Dificuldade; rotulo: string; dot: string }[] = [
  { id: 'facil', rotulo: 'Fácil', dot: 'dot-lime' },
  { id: 'medio', rotulo: 'Médio', dot: 'dot-amber' },
  { id: 'dificil', rotulo: 'Difícil', dot: 'dot-coral' },
];

export function Config() {
  const modo = useGameStore((s) => s.modo);
  const categorias = useGameStore((s) => s.categorias);
  const dificuldades = useGameStore((s) => s.dificuldades);
  const toggleCategoria = useGameStore((s) => s.toggleCategoria);
  const toggleDificuldade = useGameStore((s) => s.toggleDificuldade);
  const voltarHome = useGameStore((s) => s.voltarHome);
  const iniciarPartida = useGameStore((s) => s.iniciarPartida);
  const disponiveis = useGameStore((s) => s.perguntasDisponiveis());

  if (!modo) return null;
  const info = modoInfo(modo);
  const semConteudo = disponiveis === 0;

  return (
    <>
      <div className="topbar">
        <button className="btn-back" onClick={voltarHome} aria-label="Voltar">
          <IconBack size={20} />
        </button>
        <span className={`icon-tile sm bg-${info.acento}`}>
          <info.Icon size={20} />
        </span>
        <div>
          <div className="topbar-titulo anton">{info.titulo}</div>
          <div className="topbar-sub">Configurar partida</div>
        </div>
      </div>

      <div className="tela">
        <div className="sticker pad">
          <div className="eyebrow" style={{ marginBottom: 4 }}>
            Categorias
          </div>
          <div
            style={{
              fontWeight: 500,
              fontSize: 11,
              color: 'var(--muted)',
              marginBottom: 12,
            }}
          >
            Nenhuma marcada = Misto (todas).
          </div>
          <div className="chips">
            {CATEGORIAS.map((c) => {
              const ativo = categorias.includes(c.id);
              return (
                <button
                  key={c.id}
                  className={`chip ${ativo ? 'ativo' : ''}`}
                  onClick={() => toggleCategoria(c.id)}
                >
                  {ativo && <span className="dot dot-lime" />}
                  {c.rotulo}
                </button>
              );
            })}
          </div>
        </div>

        {info.usaDificuldade && (
          <div className="sticker pad">
            <div className="eyebrow" style={{ marginBottom: 4 }}>
              Dificuldade
            </div>
            <div
              style={{
                fontWeight: 500,
                fontSize: 11,
                color: 'var(--muted)',
                marginBottom: 12,
              }}
            >
              Vale mais ponto quanto mais difícil.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {DIFICULDADES.map((d) => {
                const ativo = dificuldades.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDificuldade(d.id)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: 13,
                      padding: '11px 0',
                      borderRadius: 13,
                      background: ativo ? 'var(--inkgreen)' : 'var(--card)',
                      color: ativo ? '#fff' : 'var(--muted)',
                      border: ativo
                        ? '2px solid var(--inkgreen)'
                        : '2px solid var(--soft)',
                      boxShadow: ativo ? '3px 3px 0 var(--ink)' : 'none',
                    }}
                  >
                    <span
                      className={`dot ${d.dot}`}
                      style={{ display: 'block', margin: '0 auto 6px' }}
                    />
                    {d.rotulo}
                  </button>
                );
              })}
            </div>
            <div className="disponiveis">
              <span className="num">{disponiveis}</span>
              <span className="txt">
                pergunta{disponiveis === 1 ? '' : 's'} disponíve
                {disponiveis === 1 ? 'l' : 'is'} com essa seleção
              </span>
            </div>
          </div>
        )}

        <div className="acoes-rodape">
          <button
            className="btn btn-lime btn-press"
            disabled={semConteudo}
            onClick={iniciarPartida}
          >
            {semConteudo ? (
              'Sem perguntas para essa seleção'
            ) : (
              <>
                <IconBolt size={20} /> COMEÇAR
              </>
            )}
          </button>
          <button className="btn btn-ghost" onClick={voltarHome}>
            Voltar
          </button>
        </div>
      </div>
    </>
  );
}
