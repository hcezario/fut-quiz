import { useGameStore } from './store/gameStore';
import { Home } from './screens/Home';
import { Config } from './screens/Config';
import { Handoff } from './screens/Handoff';
import { Resultado } from './screens/Resultado';
import { MultiplaEscolha } from './modes/MultiplaEscolha';
import { VerdadeMito } from './modes/VerdadeMito';
import { Placar } from './modes/Placar';
import { QuemE } from './modes/QuemE';
import { CacaPalavras } from './modes/CacaPalavras';
import { Cruzadinha } from './modes/Cruzadinha';
import type { ModoJogo } from './data/types';
import type { JSX } from 'react';

const MODO_COMPONENTE: Record<ModoJogo, () => JSX.Element> = {
  multipla_escolha: MultiplaEscolha,
  verdade_mito: VerdadeMito,
  placar: Placar,
  quem_e: QuemE,
  caca_palavras: CacaPalavras,
  cruzadinha: Cruzadinha,
};

function Jogo() {
  const modo = useGameStore((s) => s.modo);
  const indice = useGameStore((s) => s.indice);
  if (!modo) return null;
  const Componente = MODO_COMPONENTE[modo];
  // key={indice} reinicia o estado local do modo a cada pergunta de quiz.
  return <Componente key={indice} />;
}

export default function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <div className="app">
      {screen === 'home' && <Home />}
      {screen === 'config' && <Config />}
      {screen === 'jogo' && <Jogo />}
      {screen === 'handoff' && <Handoff />}
      {screen === 'resultado' && <Resultado />}
    </div>
  );
}
