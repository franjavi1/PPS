import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

// Cabecera clicable de columnas para control del ordenamiento
export default function FiltroTablas({ columna, orden, onManejarOrden, children }) {
  const estaActivo = orden.columna === columna;
  const esAscendente = orden.direccion === 'asc';

  function manejarClick() {
    if (estaActivo) {
      onManejarOrden({
        columna,
        direccion: esAscendente ? 'desc' : 'asc'
      });
    } else {
      onManejarOrden({
        columna,
        direccion: 'asc'
      });
    }
  }

  return (
    <th
      onClick={manejarClick}
      className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors select-none"
    >
      <div className="flex items-center gap-1.5">
        <span>{children}</span>
        {estaActivo ? (
          esAscendente ? (
            <ArrowUp size={14} className="text-red-700 dark:text-red-500" />
          ) : (
            <ArrowDown size={14} className="text-red-700 dark:text-red-500" />
          )
        ) : (
          <ArrowUpDown size={14} className="text-slate-300 dark:text-slate-600 hover:text-slate-400" />
        )}
      </div>
    </th>
  );
}
