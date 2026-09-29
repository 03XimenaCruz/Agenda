import { useState } from 'react';
import { hoyISO } from '../utils/fechas.js';

export default function FormularioActividad({ onAgregar }) {
  const [titulo, setTitulo] = useState('');
  const [fecha, setFecha] = useState(hoyISO());
  const [prioridad, setPrioridad] = useState(false);

  const enviar = (e) => {
    e.preventDefault();
    const limpio = titulo.trim();
    if (!limpio) return;

    onAgregar({ titulo: limpio, fecha: fecha || hoyISO(), prioridad });

    setTitulo('');
    setPrioridad(false);
  };

  return (
    <form className="formulario" onSubmit={enviar}>
      <label className="campo campo-titulo">
        <span>Nueva actividad</span>
        <input
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ej. Entregar reporte al cliente"
          maxLength={140}
        />
      </label>

      <label className="campo campo-fecha">
        <span>Fecha</span>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </label>

      {/* Casilla en lugar del botón con bandera */}
      <label className="check-prioridad">
        <input
          type="checkbox"
          checked={prioridad}
          onChange={(e) => setPrioridad(e.target.checked)}
        />
        Marcar como prioridad
      </label>

      <button type="submit" className="btn-principal" disabled={!titulo.trim()}>
        Agregar
      </button>
    </form>
  );
}