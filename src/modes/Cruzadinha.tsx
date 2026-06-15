import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { filtrarPalavras } from '../data/content';
import { gerarCruzadinha } from '../generators/crossword';

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

  // Número exibido na célula inicial de cada entrada.
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
      <div className="card" style={{ padding: 14 }}>
        <div className="hud">
          <span className="pill">{jogador || 'Jogador'}</span>
          <span className="pill">
            ✏️ {corretas}/{total}
          </span>
          <span className="pill">⚽ {corretas * PONTOS_POR_PALAVRA}</span>
        </div>
      </div>

      <div className="card">
        <div className="enunciado" style={{ fontSize: '1.1rem' }}>
          Preencha a cruzadinha
        </div>
        <div className="grade-wrap">
          <div
            className="cruz-grade"
            style={{ gridTemplateColumns: `repeat(${cruz.cols}, 30px)` }}
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
          {horizontais.length > 0 && (
            <>
              <h3>Horizontais ➡️</h3>
              <ol>
                {horizontais.map((e) => (
                  <li key={`h${e.numero}`}>
                    <strong>{e.numero}.</strong> {e.word.definicao}
                  </li>
                ))}
              </ol>
            </>
          )}
          {verticais.length > 0 && (
            <>
              <h3>Verticais ⬇️</h3>
              <ol>
                {verticais.map((e) => (
                  <li key={`v${e.numero}`}>
                    <strong>{e.numero}.</strong> {e.word.definicao}
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </div>

      <div className="acoes-rodape">
        <button className="btn btn-primario" onClick={terminar}>
          {completou ? 'Cruzadinha completa! Ver resultado' : 'Terminar'}
        </button>
      </div>
    </>
  );
}
