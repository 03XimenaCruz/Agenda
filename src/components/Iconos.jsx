// Iconos SVG pequeños para no depender de librerías externas.
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export const IconoBandera = ({ relleno }) => (
  <svg {...base} fill={relleno ? 'currentColor' : 'none'}>
    <path d="M5 21V4" />
    <path d="M5 4h12l-2 4 2 4H5" />
  </svg>
);

export const IconoBasura = () => (
  <svg {...base}>
    <path d="M4 7h16" />
    <path d="M10 11v6M14 11v6" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M9 7V4h6v3" />
  </svg>
);

export const IconoIzquierda = () => (
  <svg {...base}>
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconoDerecha = () => (
  <svg {...base}>
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconoPalomita = () => (
  <svg {...base} strokeWidth={2.5}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconoLapiz = () => (
  <svg {...base}>
    <path d="M4 20h4L19 9l-4-4L4 16v4z" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);
