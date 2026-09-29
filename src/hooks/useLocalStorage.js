import { useEffect, useState } from 'react';

/**
 * Funciona igual que useState, pero el valor se guarda
 * y se recupera automáticamente del localStorage del navegador.
 */
export default function useLocalStorage(clave, valorInicial) {
  // 1) Al iniciar, intentamos leer lo que hubiera guardado.
  const [valor, setValor] = useState(() => {
    try {
      const guardado = window.localStorage.getItem(clave);
      return guardado ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial; // si el JSON está dañado, empezamos de cero
    }
  });

  // 2) Cada vez que "valor" cambia, lo escribimos en localStorage.
  useEffect(() => {
    try {
      window.localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      /* modo privado o almacenamiento lleno: no rompemos la app */
    }
  }, [clave, valor]);

  return [valor, setValor];
}
