// Solo dos estados: PENDIENTE y FINALIZADO.
export const ORDEN_ESTADOS = ['PENDIENTE', 'FINALIZADO'];

export const ESTADOS = {
  PENDIENTE: { clase: 'pendiente', ayuda: 'Por hacer' },
  FINALIZADO: { clase: 'finalizado', ayuda: 'Ya realizada' },
};

// La palomita alterna entre los dos estados.
export function siguienteEstado(actual) {
  return actual === 'PENDIENTE' ? 'FINALIZADO' : 'PENDIENTE';
}