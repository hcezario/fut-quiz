import { IconArrow, IconCheck, IconX } from './Icons';

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
        <div className="feedback-topo">
          <span className={`feedback-icone ${acertou ? 'ok' : 'nok'}`}>
            {acertou ? <IconCheck size={15} /> : <IconX size={15} />}
          </span>
          <span className="feedback-titulo">
            {acertou ? 'Acertou!' : 'Quase!'}
          </span>
          {acertou && ganho > 0 && (
            <span className="feedback-ganho">+{ganho}</span>
          )}
        </div>
        {textoComplementar && (
          <div className="feedback-comp">{textoComplementar}</div>
        )}
        <p>{explicacao}</p>
        {fonte && <div className="fonte">Fonte: {fonte}</div>}
      </div>
      <button className="btn btn-lime btn-press" onClick={onProximo}>
        {rotuloBotao} <IconArrow size={18} />
      </button>
    </>
  );
}
