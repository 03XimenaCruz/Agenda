// Todas las fechas se guardan como texto "AAAA-MM-DD" (ej. "2026-09-28").
// Así se comparan y ordenan fácilmente y no hay problemas de zona horaria.

const pad = (n) => String(n).padStart(2, '0');
const capitalizar = (t) => t.charAt(0).toUpperCase() + t.slice(1);

export const aISO = (fecha) =>
  `${fecha.getFullYear()}-${pad(fecha.getMonth() + 1)}-${pad(fecha.getDate())}`;

export const deISO = (iso) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};

export const hoyISO = () => aISO(new Date());

// La semana empieza en lunes.
export function inicioSemana(fecha) {
  const x = new Date(fecha);
  const diasDesdeLunes = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - diasDesdeLunes);
  x.setHours(0, 0, 0, 0);
  return x;
}

// Devuelve el primer y último día (en texto ISO) del periodo que se está viendo.
export function rangoPeriodo(vista, ref) {
  let inicio, fin;
  if (vista === 'semana') {
    inicio = inicioSemana(ref);
    fin = new Date(inicio);
    fin.setDate(inicio.getDate() + 6);
  } else if (vista === 'mes') {
    inicio = new Date(ref.getFullYear(), ref.getMonth(), 1);
    fin = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  } else {
    inicio = new Date(ref.getFullYear(), 0, 1);
    fin = new Date(ref.getFullYear(), 11, 31);
  }
  return { desde: aISO(inicio), hasta: aISO(fin) };
}

// Avanza (+1) o retrocede (-1) un periodo.
export function moverPeriodo(vista, ref, delta) {
  if (vista === 'semana') {
    const x = new Date(ref);
    x.setDate(x.getDate() + 7 * delta);
    return x;
  }
  if (vista === 'mes') return new Date(ref.getFullYear(), ref.getMonth() + delta, 1);
  return new Date(ref.getFullYear() + delta, 0, 1);
}

const corto = (fecha) =>
  fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).replace('.', '');

// Texto grande del encabezado: "28 sep – 4 oct 2026", "Septiembre 2026", "2026".
export function etiquetaPeriodo(vista, ref) {
  if (vista === 'semana') {
    const { desde, hasta } = rangoPeriodo(vista, ref);
    return `${corto(deISO(desde))} – ${corto(deISO(hasta))} ${deISO(hasta).getFullYear()}`;
  }
  if (vista === 'mes') {
    return capitalizar(ref.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' }));
  }
  return String(ref.getFullYear());
}

// ---- Agrupación dentro del periodo ----
// Año -> agrupa por mes | Mes -> agrupa por semana | Semana -> agrupa por día.
export function claveGrupo(vista, iso) {
  const d = deISO(iso);
  if (vista === 'semana') return iso;
  if (vista === 'mes') return aISO(inicioSemana(d));
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}

export function etiquetaGrupo(vista, clave) {
  if (vista === 'semana') {
    return capitalizar(
      deISO(clave).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })
    );
  }
  if (vista === 'mes') {
    const ini = deISO(clave);
    const fin = new Date(ini);
    fin.setDate(ini.getDate() + 6);
    return `Semana del ${corto(ini)} al ${corto(fin)}`;
  }
  const [a, m] = clave.split('-').map(Number);
  return capitalizar(new Date(a, m - 1, 1).toLocaleDateString('es-MX', { month: 'long' }));
}

export function formatoFecha(iso) {
  return deISO(iso)
    .toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' })
    .replace(/\./g, '');
}
