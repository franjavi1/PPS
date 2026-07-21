// frontend/src/components/filtros/filtroTablas.jsx
import { ArrowUpDown } from 'lucide-react';

function FiltroTablas({ columna, orden, onManejarOrden, children, icono: Icono }) {
    
    const ejecutarOrden = () => {
        onManejarOrden({
            columna,
            direccion: orden.columna === columna && orden.direccion === 'asc' ? 'desc' : 'asc'
        });
    };

    return (
        <th 
            onClick={ejecutarOrden} 
            className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider cursor-pointer hover:text-red-700 dark:hover:text-red-400 select-none transition"
        >
            <div className="flex items-center gap-1.5">
                {Icono && <Icono size={14} />}
                {children} 
                <ArrowUpDown size={14} className={orden.columna === columna ? "text-red-700 dark:text-red-500" : "opacity-40"} />
            </div>
        </th>
    );
}

export default FiltroTablas;