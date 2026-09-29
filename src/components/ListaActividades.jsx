import TarjetaActividad from './TarjetaActividad.jsx';

export default function ListaActividades({ grupos, ...acciones }) {
  if (grupos.length === 0) {
    return (
      <div className="vacio">
        <p className="vacio-titulo">No hay actividades en este periodo</p>
        <p>Escribe una arriba y presiona Agregar, o cambia el filtro.</p>
      </div>
    );
  }

  return (
    <div className="grupos">
      {grupos.map((grupo) => (
        <section
          key={grupo.clave}
          className={`grupo ${grupo.esPrioridad ? 'grupo-prioridad' : ''}`}
        >
          <h2 className="grupo-titulo">
            {grupo.etiqueta}
            <span className="grupo-cuenta">{grupo.items.length}</span>
          </h2>
          <ul className="lista">
            {grupo.items.map((actividad) => (
              <TarjetaActividad key={actividad.id} actividad={actividad} {...acciones} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}