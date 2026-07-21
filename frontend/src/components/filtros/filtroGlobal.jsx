// frontend/src/components/filtros/filtroGlobal.jsx
import { Search } from 'lucide-react';

function FiltroGlobal({ valor, onChange, placeholder = "Buscar..." }) {
    return (
        <div className="relative w-full max-w-md">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <Search size={18} />
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="w-full h-11 pl-12 pr-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-700 dark:focus:ring-red-600 shadow-xs transition"
                value={valor}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

export default FiltroGlobal;