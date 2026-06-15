import { useGameStore } from '../store/gameStore';
import { modoInfo } from '../modes';
import type { Categoria, Dificuldade } from '../data/types';

const CATEGORIAS: { id: Categoria; rotulo: string }[] = [
  { id: 'futebol-brasileiro', rotulo: 'Futebol Brasileiro' },
  { id: 'santos', rotulo: 'Santos FC' },
  { id: 'copa-do-mundo', rotulo: 'Copa do Mundo' },
];

const DIFICULDADES: { id: Dificuldade; rotulo: string }[] = [
  { id: 'facil', rotulo: 'Fácil' },
  { id: 'medio', rotulo: 'Médio' },
  { id: 'dificil', rotulo: 'Difícil' },
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
      <header>
        <h1 className="titulo-app" style={{ fontSize: '1.6rem' }}>
          {info.emoji} {info.titulo}
        </h1>
        <p className="subtitulo">{info.descricao}</p>
      </header>

      <div className="card">
        <label className="label-grupo">Categorias</label>
        <p className="modo-desc" style={{ marginBottom: 10 }}>
          Nenhuma selecionada = Misto (todas).
        </p>
        <div className="chips">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              className={`chip ${categorias.includes(c.id) ? 'ativo' : ''}`}
              onClick={() => toggleCategoria(c.id)}
            >
              {c.rotulo}
            </button>
          ))}
        </div>
      </div>

      {info.usaDificuldade && (
        <div className="card">
          <label className="label-grupo">Dificuldade</label>
          <p className="modo-desc" style={{ marginBottom: 10 }}>
            Nenhuma selecionada = todas.
          </p>
          <div className="chips">
            {DIFICULDADES.map((d) => (
              <button
                key={d.id}
                className={`chip ${dificuldades.includes(d.id) ? 'ativo' : ''}`}
                onClick={() => toggleDificuldade(d.id)}
              >
                {d.rotulo}
              </button>
            ))}
          </div>
          <p className="aviso" style={{ textAlign: 'left', marginTop: 12 }}>
            {disponiveis} pergunta{disponiveis === 1 ? '' : 's'} disponíve
            {disponiveis === 1 ? 'l' : 'is'} com essa seleção.
          </p>
        </div>
      )}

      <div className="acoes-rodape">
        <button
          className="btn btn-primario"
          disabled={semConteudo}
          onClick={iniciarPartida}
        >
          {semConteudo ? 'Sem perguntas para essa seleção' : 'Começar'}
        </button>
        <button className="btn btn-secundario" onClick={voltarHome}>
          Voltar
        </button>
      </div>
    </>
  );
}
