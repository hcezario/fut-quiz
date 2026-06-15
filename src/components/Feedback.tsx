interface FeedbackProps {
  acertou: boolean;
  explicacao: string;
  fonte?: string;
  ganho: number; // pontos somados
  textoComplementar?: string; // ex.: resposta correta quando errou
  onProximo: () => void;
  rotuloBotao?: string;
}

// Feedback imediato após responder (seção 8): certo/errado + explicação + fonte.
export function Feedback({
  acertou,
  explicacao,
  fonte,
  ganho,
  textoComplementar,
  onProximo,
  rotuloBotao = 'Próxima',
}: FeedbackProps) {
  return (
    <>
      <div className={`feedback ${acertou ? 'ok' : 'nok'}`}>
        <div className="titulo-fb">
          {acertou ? `✅ Acertou! +${ganho} pontos` : '❌ Não foi dessa vez'}
        </div>
        {textoComplementar && (
          <div className="explicacao" style={{ marginBottom: 6 }}>
            {textoComplementar}
          </div>
        )}
        <div className="explicacao">{explicacao}</div>
        {fonte && <div className="fonte">Fonte: {fonte}</div>}
      </div>
      <button
        className="btn btn-primario"
        style={{ marginTop: 14 }}
        onClick={onProximo}
      >
        {rotuloBotao}
      </button>
    </>
  );
}
