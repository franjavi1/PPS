// frontend\src\components\tablas\tablaPrincipal.jsx

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import FiltroGlobal from '../filtros/filtroGlobal';
import FiltroTablas from '../filtros/filtroTablas';

function TablaPaginado({
    data = [],
    columnas = [],
    placeholderBusqueda = "Buscar...",
    propiedadesFiltro = [],
    columnaOrdenInicial = '',
    direccionOrdenInicial = 'asc',
    accionesPorFila,
    propiedadKey = 'id'
}) {
    const [busqueda, setBusqueda] = useState('');
    const [orden, setOrden] = useState({ columna: columnaOrdenInicial, direccion: direccionOrdenInicial });
    const [paginaActual, setPaginaActual] = useState(1);
    const [filasPorPagina, setFilasPorPagina] = useState(10);

    // Resetear pagina al filtrar o cambiar tamaño
    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, filasPorPagina]);

    // FILTRADO Y ORDENAMIENTO DINIAMICO
    const datosProcesados = useMemo(() => {
        const termino = busqueda.toLowerCase().trim();

        // 1. Filtrar
        let resultado = data.filter(item => {
            if (!termino) return true;

            const camposAFiltrar = propiedadesFiltro.length > 0
                ? propiedadesFiltro.map(prop => typeof prop === 'function' ? prop(item) : item[prop])
                : columnas.map(col => item[col.clave]);

            return camposAFiltrar.some(campo =>
                String(campo || '').toLowerCase().includes(termino)
            );
        });

        // 2. Ordenar
        if (orden.columna) {
            const columnaActiva = columnas.find(c => c.clave === orden.columna);

            resultado.sort((a, b) => {
                let valorA, valorB;

                if (columnaActiva && typeof columnaActiva.valorOrden === 'function') {
                    valorA = columnaActiva.valorOrden(a);
                    valorB = columnaActiva.valorOrden(b);
                } else {
                    valorA = a[orden.columna] || '';
                    valorB = b[orden.columna] || '';
                }

                valorA = String(valorA).toLowerCase().trim();
                valorB = String(valorB).toLowerCase().trim();

                const comparacion = valorA.localeCompare(valorB, 'es', { sensitivity: 'base', numeric: true });
                return orden.direccion === 'asc' ? comparacion : -comparacion;
            });
        }

        return resultado;
    }, [data, busqueda, orden, columnas, propiedadesFiltro]);

    // CALCULOS PAGINACION
    const totalFilas = datosProcesados.length;
    const totalPaginas = Math.ceil(totalFilas / filasPorPagina) || 1;

    const datosPaginados = useMemo(() => {
        const inicio = (paginaActual - 1) * filasPorPagina;
        return datosProcesados.slice(inicio, inicio + filasPorPagina);
    }, [datosProcesados, paginaActual, filasPorPagina]);

    return (
        <div className="w-full">
            {/* BARRA DE BUSQUEDA Y SELECTOR */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <FiltroGlobal
                    valor={busqueda}
                    onChange={setBusqueda}
                    placeholder={placeholderBusqueda}
                />

                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-2 rounded-xl self-end sm:self-auto shadow-xs">
                    <span>Mostrar:</span>
                    <select
                        value={filasPorPagina}
                        onChange={(e) => setFilasPorPagina(Number(e.target.value))}
                        className="bg-transparent font-semibold border-none focus:outline-none cursor-pointer text-slate-800 dark:text-white"
                    >
                        <option value={10} className="dark:bg-slate-800">10 filas</option>
                        <option value={25} className="dark:bg-slate-800">25 filas</option>
                        <option value={50} className="dark:bg-slate-800">50 filas</option>
                    </select>
                </div>
            </div>

            {/* TABLA CONTENEDOR */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs overflow-hidden transition-colors duration-300">
                <div className="min-h-[300px] overflow-y-auto overflow-x-auto scrollbar-thin">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 sticky top-0 z-10 shadow-xs">
                            <tr>
                                {columnas.map((col) => (
                                    <FiltroTablas
                                        key={col.clave}
                                        columna={col.clave}
                                        orden={orden}
                                        onManejarOrden={setOrden}
                                    >
                                        {col.titulo}
                                    </FiltroTablas>
                                ))}
                                {accionesPorFila && (
                                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
                            {datosProcesados.length === 0 ? (
                                <tr>
                                    <td colSpan={columnas.length + (accionesPorFila ? 1 : 0)} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                                        No se encontraron registros.
                                    </td>
                                </tr>
                            ) : (
                                datosPaginados.map((item, index) => {
                                    const llaveUnica = item[propiedadKey] ?? `fila-${index}`;

                                    return (
                                        <tr key={llaveUnica} className="h-[53px] hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                                            {columnas.map((col) => (
                                                <td key={col.clave} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-200">
                                                    {col.renderizar ? col.renderizar(item) : (item[col.clave] || '—')}
                                                </td>
                                            ))}
                                            {accionesPorFila && (
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    {accionesPorFila(item)}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PIE DE PAGINA */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/30 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <div>
                        Mostrando <span className="font-semibold text-slate-700 dark:text-slate-300">{totalFilas === 0 ? 0 : (paginaActual - 1) * filasPorPagina + 1}</span> a <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.min(paginaActual * filasPorPagina, totalFilas)}</span> de <span className="font-semibold text-slate-700 dark:text-slate-300">{totalFilas}</span> registros
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPaginaActual(p => Math.max(p - 1, 1))}
                            disabled={paginaActual === 1}
                            className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 enabled:hover:bg-slate-50 dark:enabled:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronLeft size={16} />
                        </button>

                        <span className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-medium">
                            Pagina {paginaActual} de {totalPaginas}
                        </span>

                        <button
                            onClick={() => setPaginaActual(p => Math.min(p + 1, totalPaginas))}
                            disabled={paginaActual === totalPaginas}
                            className="p-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 enabled:hover:bg-slate-50 dark:enabled:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TablaPaginado;