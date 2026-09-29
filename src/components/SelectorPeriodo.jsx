import { IconoDerecha, IconoIzquierda } from './Iconos.jsx';

const VISTAS = [
  { id: 'semana', texto: 'Semana' },
  { id: 'mes', texto: 'Mes' },
  { id: 'anio', texto: 'Año' },
];

export default function SelectorPeriodo({ vista, etiqueta, onVista, onAnterior, onSiguiente }) {
  return (
    <header className="periodo">
      <div className="periodo-barra">
        <div className="segmentado" role="tablist" aria-label="Ver actividades por">
          {VISTAS.map((v) => (
            <button
              key={v.id}
              role="tab"
              aria-selected={vista === v.id}
              className={vista === v.id ? 'activo' : ''}
              onClick={() => onVista(v.id)}
            >
              {v.texto}
            </button>
          ))}
        </div>
      </div>

      <div className="periodo-navegacion">
        <button className="btn-icono" onClick={onAnterior} aria-label="Periodo anterior">
          <IconoIzquierda />
        </button>
        <h1 className="periodo-titulo" aria-live="polite">
          {etiqueta}
        </h1>
        <button className="btn-icono" onClick={onSiguiente} aria-label="Periodo siguiente">
          <IconoDerecha />
        </button>
      </div>
    </header>
  );
}