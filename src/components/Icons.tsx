// Conjunto de ícones geométricos do redesign "Matchday" (substituem os emojis).
// Todos em viewBox 0 0 24 24. A cor padrão do traço é a tinta (--ink),
// para os ícones ficarem legíveis sobre os ladrilhos coloridos (limão/coral/âmbar).

import type { SVGProps } from 'react';

const INK = '#14201A';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size = 24, props: IconProps) {
  const { size: _omit, ...rest } = props;
  void _omit;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    ...rest,
  };
}

/** Bola de futebol estilizada — logotipo do app. */
export function IconBall({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
      <path
        d="M12 5l2.4 3.6 4.1.7-2.6 3 0 4.2L12 18.4 8.1 16.5l0-4.2-2.6-3 4.1-.7z"
        fill={INK}
        stroke="none"
      />
    </svg>
  );
}

/** Múltipla escolha — quatro quadrados (um preenchido). */
export function IconMultipla({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2.2}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" fill={INK} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  );
}

/** Verdade ou mito — círculo dividido. */
export function IconVerdadeMito({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2.2}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5v17" />
    </svg>
  );
}

/** Complete o placar — placar com dois marcadores. */
export function IconPlacar({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2.2}>
      <rect x="3" y="6" width="18" height="12" rx="2.5" />
      <path d="M12 6v12" />
      <circle cx="7.5" cy="12" r="1.3" fill={INK} stroke="none" />
      <circle cx="16.5" cy="12" r="1.3" fill={INK} stroke="none" />
    </svg>
  );
}

/** Quem é o jogador — lupa. */
export function IconQuemE({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2.2}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="M15 15l5 5" />
    </svg>
  );
}

/** Caça-palavras — grade 4x4. */
export function IconCaca({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2.2}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M4 9.3h16M4 14.6h16M9.3 4v16M14.6 4v16" />
    </svg>
  );
}

/** Cruzadinha — cruz. */
export function IconCruzadinha({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="none" stroke={INK} strokeWidth={2.2}>
      <rect x="9" y="3.5" width="6" height="17" rx="1" />
      <rect x="3.5" y="9" width="17" height="6" rx="1" />
    </svg>
  );
}

/** Check (acerto, conclusão). Herda a cor via `stroke="currentColor"`. */
export function IconCheck({ size = 24, ...p }: IconProps) {
  return (
    <svg
      {...base(size, p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 13l4 4 10-11" />
    </svg>
  );
}

/** X (mito, erro). */
export function IconX({ size = 24, ...p }: IconProps) {
  return (
    <svg
      {...base(size, p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/** Seta para a direita (próxima). */
export function IconArrow({ size = 24, ...p }: IconProps) {
  return (
    <svg
      {...base(size, p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Chevron para a esquerda (voltar). */
export function IconBack({ size = 24, ...p }: IconProps) {
  return (
    <svg
      {...base(size, p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

/** Raio (streak, começar). Preenchido. */
export function IconBolt({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="currentColor">
      <path d="M13 2L4.5 13.5H11L9.5 22 19 9.5h-6.5z" />
    </svg>
  );
}

/** Estrela (resultado, selo). Preenchida. */
export function IconStar({ size = 24, ...p }: IconProps) {
  return (
    <svg {...base(size, p)} fill="currentColor">
      <path d="M12 2.5l2.7 6 6.5.6-4.9 4.3 1.5 6.4L12 16.9 6.2 20.3l1.5-6.4L2.8 9.6l6.5-.6z" />
    </svg>
  );
}

/** Lâmpada (dica). */
export function IconBulb({ size = 24, ...p }: IconProps) {
  return (
    <svg
      {...base(size, p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3z" />
    </svg>
  );
}

/** Recomeçar (jogar de novo). */
export function IconRefresh({ size = 24, ...p }: IconProps) {
  return (
    <svg
      {...base(size, p)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
    </svg>
  );
}
