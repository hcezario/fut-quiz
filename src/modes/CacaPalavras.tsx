import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { filtrarPalavras } from '../data/content';
import { gerarCacaPalavras } from '../generators/wordsearch';
import { IconCaca, IconCheck } from '../components/Icons';

const PONTOS_POR_PALAVRA = 20;

interface Cel {
  row: number;
  col: number;
}

const key = (r: number, c: number) => `${r},${c}`;

// Calcula as células de uma linha reta entre dois pontos (h/v/diagonal).
function linha(a: Cel, b: Cel): Cel[] | null {
  const dr = b.row - a.row;
  const dc = b.col - a.col;
  const passos = Math.max(Math.abs(dr), Math.abs(dc));
  if (passos === 0) return [a];
  const okReta = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
  if (!okReta) return null;
  const sr = Math.sign(dr);
  const sc = Math.sign(dc);
  const cells: Cel[] = [];
  for (let i = 0; i <= passos; i++) {
    cells.push({ row: a.row + sr * i, col: a.col + sc * i });
  }
  return cells;
}

export function CacaPalavras() {
  const categorias = useGameStore((s) => s.categorias);
  const jogador = useGameStore((s) => s.jogador);
  const finalizar = useGameStore((s) => s.finalizarComResultado);

  const puzzle = useMemo(
    () => gerarCacaPalavras(filtrarPalavras(categorias)),
    [categorias],
  );

  const palavrasCells = useMemo(
    () =>
      puzzle.colocadas.map((p) => ({
        word: p.word,
        set: new Set(p.celulas.map((c) => key(c.row, c.col))),
      })),
    [puzzle],
  );

  const [anchor, setAnchor] = useState<Cel | null>(null);
  const [hover, setHover] = useState<Cel | null>(null);
  const [achadas, setAchadas] = useState<Set<number>>(new Set());
  const [celulasAchadas, setCelulasAchadas] = useState<Set<string>>(new Set());

  const selecao = useMemo(() => {
    if (!anchor) return [] as Cel[];
    const alvo = hover ?? anchor;
    return linha(anchor, alvo) ?? [anchor];
  }, [anchor, hover]);
  const selSet = new Set(selecao.map((c) => key(c.row, c.col)));

  function clicar(row: number, col: number) {
    if (!anchor) {
      setAnchor({ row, col });
      setHover({ row, col });
      return;
    }
    const cells = linha(anchor, { row, col });
    if (cells) {
      const sel = new Set(cells.map((c) => key(c.row, c.col)));
      const match = palavrasCells.find(
        (p, i) =>
          !achadas.has(i) &&
          p.set.size === sel.size &&
          [...p.set].every((k) => sel.has(k)),
      );
      if (match) {
        const idx = palavrasCells.indexOf(match);
        setAchadas((prev) => new Set(prev).add(idx));
        setCelulasAchadas((prev) => {
          const next = new Set(prev);
          sel.forEach((k) => next.add(k));
          return next;
        });
      }
    }
    setAnchor(null);
    setHover(null);
  }

  const total = puzzle.colocadas.length;
  const encontradas = achadas.size;
  const completou = encontradas === total;

  function terminar() {
    finalizar(encontradas * PONTOS_POR_PALAVRA, encontradas, total);
  }

  return (
    <>
      <div className="hud">
        <div className="hud-linha">
          <span className="pill pill-ink">{jogador || 'Jogador'}</span>
          <span className="pill pill-ink" style={{ marginLeft: 'auto' }}>
            <span className="dot dot-amber" />
            {encontradas * PONTOS_POR_PALAVRA}
          </span>
          <span className="pill pill-line">
            {encontradas}/{total}
          </span>
        </div>
      </div>

      <div className="tela">
        <div className="modo-cabecalho">
          <span className="icon-tile sm bg-coral">
            <IconCaca size={19} />
          </span>
          <div className="titulo">CAÇA-PALAVRAS</div>
        </div>

        <div className="sticker pad grade-wrap">
          <div
            className="grade"
            style={{ gridTemplateColumns: `repeat(${puzzle.size}, 28px)` }}
          >
            {puzzle.grade.map((linhaArr, r) =>
              linhaArr.map((letra, c) => {
                const k = key(r, c);
                let cls = 'celula';
                if (celulasAchadas.has(k)) cls += ' achou';
                else if (selSet.has(k)) cls += ' sel';
                return (
                  <div
                    key={k}
                    className={cls}
                    onMouseEnter={() => anchor && setHover({ row: r, col: c })}
                    onClick={() => clicar(r, c)}
                  >
                    {letra}
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className="lista-palavras">
          {palavrasCells.map((p, i) => (
            <span
              key={p.word.id}
              className={`palavra-tag ${achadas.has(i) ? 'achou' : ''}`}
            >
              {achadas.has(i) && <IconCheck size={12} />}
              {p.word.exibicao}
            </span>
          ))}
        </div>

        <button
          className="btn btn-lime btn-press"
          onClick={terminar}
          style={{ marginTop: 'auto' }}
        >
          {completou ? 'Achou todas! Ver resultado' : 'Terminar'}
        </button>
      </div>
    </>
  );
}
