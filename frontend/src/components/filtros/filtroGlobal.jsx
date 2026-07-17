import React from 'react';
import { Search } from 'lucide-react';

// Filtro de búsqueda global con un diseño moderno
export default function FiltroGlobal({ valor, onChange, placeholder = "Buscar..." }) {
  return (
    <div className="relative flex-1 max-w-md">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        <Search size={18} />
      </span>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 pl-11 pr-4 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 shadow-xs transition"
      />
    </div>
  );
}
