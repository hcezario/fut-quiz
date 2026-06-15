import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { filtrarPalavras } from '../data/content';
import { gerarCruzadinha } from '../generators/crossword';
import { IconCruzadinha } from '../components/Icons';

const PONTOS_POR_PALAVRA = 25;
const key = (r: number, c: number) => `${r},${c}`;

export function Cruzadinha() {
  const categorias = useGameStore((s) => s.categorias);
  const jogador = useGameStore((s) => s.jogador);
  const finalizar = useGameStore((s) => s.finalizarComResultado);

  const cruz = useMemo(
    () => gerarCruzadinha(filtrarPalavras(categorias)),
    [categorias],
  );

  const [valores, setValores] = useState<Record<string, string>>({});

  const numeros = useMemo(() => {
    const m = new Map<string, number>();
    for (const e of cruz.entradas) {
      const k = key(e.row, e.col);
      m.set(k, Math.min(m.get(k) ?? Infinity, e.numero));
    }
    return m;
  }, [cruz]);

  function celulasDaEntrada(e: (typeof cruz.entradas)[number]) {
    const out: string[] = [];
    for (let i = 0; i < e.word.palavra.length; i++) {
      const r = e.orientacao === 'horizontal' ? e.row : e.row + i;
      const c = e.orientacao === 'horizontal' ? e.col + i : e.col;
      out.push(key(r, c));
    }
    return out;
  }

  const entradaCorreta = (e: (typeof cruz.entradas)[number]) =>
    celulasDaEntrada(e).every(
      (k) => (valores[k] ?? '') === (cruz.solucao.get(k) ?? ''),
    );

  const corretas = cruz.entradas.filter(entradaCorreta).length;
  const total = cruz.entradas.length;
  const completou = corretas === total && total > 0;

  function setLetra(k: string, v: string) {
    const ch = v.toUpperCase().replace(/[^A-Z]/g, '').slice(-1);
    setValores((prev) => ({ ...prev, [k]: ch }));
  }

  function terminar() {
    finalizar(corretas * PONTOS_POR_PALAVRA, corretas, total);
  }

  const horizontais = cruz.entradas.filter((e) => e.orientacao === 'horizontal');
  const verticais = cruz.entradas.filter((e) => e.orientacao === 'vertical');

  return (
    <>
      <div className="hud">
        <div className="hud-linha">
          <span className="pill pill-ink">{jogador || 'Jogador'}</span>
          <span className="pill pill-ink" style={{ marginLeft: 'auto' }}>
            <span className="dot dot-amber" />
            {corretas * PONTOS_POR_PALAVRA}
          </span>
          <span className="pill pill-line">
            {corretas}/{total}
          </span>
        </div>
      </div>

      <div className="tela">
        <div className="modo-cabecalho">
          <span className="icon-tile sm bg-amber">
            <IconCruzadinha size={19} />
          </span>
          <div className="titulo">CRUZADINHA</div>
        </div>

        <div className="sticker pad grade-wrap">
          <div
            className="cruz-grade"
            style={{
              gridTemplateColumns: `repeat(${cruz.cols}, 34px)`,
              gridTemplateRows: `repeat(${cruz.rows}, 34px)`,
            }}
          >
            {Array.from({ length: cruz.rows }).map((_, r) =>
              Array.from({ length: cruz.cols }).map((__, c) => {
                const k = key(r, c);
                const temLetra = cruz.solucao.has(k);
                if (!temLetra) {
                  return <div key={k} className="cruz-cel vazia" />;
                }
                const valor = valores[k] ?? '';
                const ok = valor !== '' && valor === cruz.solucao.get(k);
                const num = numeros.get(k);
                return (
                  <div key={k} className="cruz-cel">
                    {num !== undefined && <span className="num">{num}</span>}
                    <input
                      className={ok ? 'ok' : ''}
                      maxLength={1}
                      value={valor}
                      onChange={(e) => setLetra(k, e.target.value)}
                      aria-label={`célula ${r},${c}`}
                    />
                  </div>
                );
              }),
            )}
          </div>
        </div>

        <div className="dicas-cruz">
          {verticais.length > 0 && (
            <div>
              <div className="grupo-titulo">Verticais</div>
              {verticais.map((e) => (
                <div className="dica-cruz" key={`v${e.numero}`}>
                  <span className="num">{e.numero}</span>
                  <span className="txt">
                    {e.word.definicao} ({e.word.palavra.length})
                  </span>
                </div>
              ))}
            </div>
          )}
          {horizontais.length > 0 && (
            <div>
              <div className="grupo-titulo">Horizontais</div>
              {horizontais.map((e) => (
                <div className="dica-cruz" key={`h${e.numero}`}>
                  <span className="num">{e.numero}</span>
                  <span className="txt">
                    {e.word.definicao} ({e.word.palavra.length})
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          className="btn btn-lime btn-press"
          onClick={terminar}
          style={{ marginTop: 'auto' }}
        >
          {completou ? 'Cruzadinha completa! Ver resultado' : 'Verificar'}
        </button>
      </div>
    </>
  );
}
