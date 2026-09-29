import { useState } from 'react';
import { ESTADOS } from '../utils/estados.js';
import { formatoFecha } from '../utils/fechas.js';
import { IconoBasura, IconoLapiz, IconoPalomita } from './Iconos.jsx';

export default function TarjetaActividad({ actividad, onCambiarEstado, onEditar, onEliminar }) {
  const { id, titulo, fecha, prioridad, estado } = actividad;
  const info = ESTADOS[estado];
  const finalizada = estado === 'FINALIZADO';

  // ---- Modo edición ----
  const [editando, setEditando] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState(titulo);
  const [nuevaFecha, setNuevaFecha] = useState(fecha);
  const [nuevaPrioridad, setNuevaPrioridad] = useState(prioridad);

  const abrirEdicion = () => {
    setNuevoTitulo(titulo);
    setNuevaFecha(fecha);
    setNuevaPrioridad(prioridad);
    setEditando(true);
  };

  const cancelar = () => setEditando(false);

  const guardar = (e) => {
    e.preventDefault();
    const limpio = nuevoTitulo.trim();
    if (!limpio) return;
    onEditar(id, { titulo: limpio, fecha: nuevaFecha || fecha, prioridad: nuevaPrioridad });
    setEditando(false);
  };

  if (editando) {
    return (
      <li className={`tarjeta tarjeta-edicion estado-${info.clase}`}>
        <form
          className="form-edicion"
          onSubmit={guardar}
          onKeyDown={(e) => e.key === 'Escape' && cancelar()}
        >
          <input
            type="text"
            value={nuevoTitulo}
            onChange={(e) => setNuevoTitulo(e.target.value)}
            maxLength={140}
            autoFocus
            aria-label="Título de la actividad"
          />
          <input
            type="date"
            value={nuevaFecha}
            onChange={(e) => setNuevaFecha(e.target.value)}
            aria-label="Fecha de la actividad"
          />
          <div className="acciones-edicion">
            <label className="check-prioridad">
              <input
                type="checkbox"
                checked={nuevaPrioridad}
                onChange={(e) => setNuevaPrioridad(e.target.checked)}
              />
              Prioridad
            </label>
            <button type="submit" className="btn-guardar" disabled={!nuevoTitulo.trim()}>
              Guardar
            </button>
            <button type="button" className="btn-cancelar" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  // ---- Modo normal ----
  // Rojo solo si es prioridad y sigue pendiente.
  const destacada = prioridad && !finalizada;

  return (
    <li className={`tarjeta estado-${info.clase} ${destacada ? 'es-prioridad' : ''}`}>
      <span className={`insignia insignia-${info.clase}`}>{estado}</span>

      <div className="tarjeta-texto">
        <p className={`tarjeta-titulo ${finalizada ? 'tachado' : ''}`}>{titulo}</p>
        <span className="tarjeta-fecha">{formatoFecha(fecha)}</span>
      </div>

      <button
        className={`btn-icono btn-palomita ${finalizada ? 'activa' : ''}`}
        onClick={() => onCambiarEstado(id)}
        aria-pressed={finalizada}
        aria-label={finalizada ? 'Volver a pendiente' : 'Marcar como finalizada'}
        title={finalizada ? 'Volver a pendiente' : 'Marcar como finalizada'}
      >
        <IconoPalomita />
      </button>

      <button
        className="btn-icono"
        onClick={abrirEdicion}
        aria-label={`Editar ${titulo}`}
        title="Editar"
      >
        <IconoLapiz />
      </button>

      <button
        className="btn-icono btn-borrar"
        onClick={() => onEliminar(id)}
        aria-label={`Eliminar ${titulo}`}
        title="Eliminar"
      >
        <IconoBasura />
      </button>
    </li>
  );
}