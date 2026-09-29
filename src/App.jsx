import { useEffect, useMemo, useState } from 'react';
import useLocalStorage from './hooks/useLocalStorage.js';
import { ORDEN_ESTADOS, siguienteEstado } from './utils/estados.js';
import {
  claveGrupo,
  deISO,
  etiquetaGrupo,
  etiquetaPeriodo,
  moverPeriodo,
  rangoPeriodo,
} from './utils/fechas.js';
import SelectorPeriodo from './components/SelectorPeriodo.jsx';
import FormularioActividad from './components/FormularioActividad.jsx';
import ListaActividades from './components/ListaActividades.jsx';

const nuevoId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// "Realizadas" muestra las actividades ya hechas (estado FINALIZADO).
const FILTROS = [
  { id: 'TODAS', texto: 'Todas' },
  { id: 'PENDIENTE', texto: 'Pendientes' },
  { id: 'FINALIZADO', texto: 'Realizadas' },
];

export default function App() {
  const [actividades, setActividades] = useLocalStorage('actividades-v1', []);
  const [vista, setVista] = useState('semana');
  const [referencia, setReferencia] = useState(new Date());
  const [filtro, setFiltro] = useState('TODAS');

  // Migración: las actividades guardadas antes como REALIZADO pasan a FINALIZADO.
  useEffect(() => {
    setActividades((prev) =>
      prev.some((a) => a.estado === 'REALIZADO')
        ? prev.map((a) => (a.estado === 'REALIZADO' ? { ...a, estado: 'FINALIZADO' } : a))
        : prev
    );
  }, [setActividades]);

  // ---------- Acciones ----------
  const agregar = ({ titulo, fecha, prioridad }) => {
    setActividades((prev) => [
      { id: nuevoId(), titulo, fecha, prioridad, estado: 'PENDIENTE', creada: Date.now() },
      ...prev,
    ]);
    setReferencia(deISO(fecha));
  };

  const cambiarEstado = (id) =>
    setActividades((prev) =>
      prev.map((a) => (a.id === id ? { ...a, estado: siguienteEstado(a.estado) } : a))
    );

  

  // NUEVO: actualiza título y/o fecha de una actividad.
  const editar = (id, cambios) => {
    setActividades((prev) => prev.map((a) => (a.id === id ? { ...a, ...cambios } : a)));
    if (cambios.fecha) setReferencia(deISO(cambios.fecha)); // salta al periodo de la nueva fecha
  };

  const eliminar = (id) => setActividades((prev) => prev.filter((a) => a.id !== id));

  // ---------- Datos derivados ----------
  const delPeriodo = useMemo(() => {
    const { desde, hasta } = rangoPeriodo(vista, referencia);
    return actividades.filter((a) => a.fecha >= desde && a.fecha <= hasta);
  }, [actividades, vista, referencia]);

  const conteo = useMemo(() => {
    const c = { TODAS: delPeriodo.length, PENDIENTE: 0, FINALIZADO: 0 };
    delPeriodo.forEach((a) => (c[a.estado] += 1));
    return c;
  }, [delPeriodo]);

  const grupos = useMemo(() => {
  const visibles = delPeriodo.filter((a) => filtro === 'TODAS' || a.estado === filtro);

  // Prioritarias que siguen pendientes: van hasta arriba, en su propia sección.
  const esDestacada = (a) => a.prioridad && a.estado === 'PENDIENTE';
  const prioritarias = visibles
    .filter(esDestacada)
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || b.creada - a.creada);

  // El resto se ordena por estado y se agrupa por día, semana o mes.
  const resto = visibles
    .filter((a) => !esDestacada(a))
    .sort(
      (a, b) =>
        ORDEN_ESTADOS.indexOf(a.estado) - ORDEN_ESTADOS.indexOf(b.estado) ||
        b.creada - a.creada
    );

  const mapa = new Map();
  resto.forEach((a) => {
    const clave = claveGrupo(vista, a.fecha);
    if (!mapa.has(clave)) mapa.set(clave, []);
    mapa.get(clave).push(a);
  });

  const normales = [...mapa.keys()]
    .sort()
    .map((clave) => ({ clave, etiqueta: etiquetaGrupo(vista, clave), items: mapa.get(clave) }));

  return prioritarias.length > 0
    ? [
        { clave: 'prioridades', etiqueta: 'Prioridades', esPrioridad: true, items: prioritarias },
        ...normales,
      ]
    : normales;
}, [delPeriodo, filtro, vista]);

  return (
    <main className="app">
      <SelectorPeriodo
        vista={vista}
        etiqueta={etiquetaPeriodo(vista, referencia)}
        onVista={setVista}
        onAnterior={() => setReferencia(moverPeriodo(vista, referencia, -1))}
        onSiguiente={() => setReferencia(moverPeriodo(vista, referencia, 1))}
      />

      <FormularioActividad onAgregar={agregar} />

      <nav className="filtros" aria-label="Filtrar por estado">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            className={`filtro filtro-${f.id.toLowerCase()} ${filtro === f.id ? 'activo' : ''}`}
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
          >
            {f.texto}
            <span className="filtro-cuenta">{conteo[f.id]}</span>
          </button>
        ))}
      </nav>

      <ListaActividades
        grupos={grupos}
        onCambiarEstado={cambiarEstado}
        onEditar={editar}
        onEliminar={eliminar}
      />
    </main>
  );
}