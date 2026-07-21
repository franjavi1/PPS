import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, RefreshCw, Eye, Edit2, Trash2, MoreVertical } from 'lucide-react';
import useTiposDocumento from '../../hooks/useTiposDocumento';
import TablaPaginado from '../../components/tablas/tablaPaginacion';

function IndexTiposDocumentoPage() {
    const { listarTiposDocumento } = useTiposDocumento();
    const navigate = useNavigate();
    
    const [tiposDocumento, setTiposDocumento] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [menuAbiertoId, setMenuAbiertoId] = useState(null);

    useEffect(() => {
        const cargarDatos = async () => {
            const data = await listarTiposDocumento();
            if (data?.data) setTiposDocumento(data.data);
            setCargando(false);
        };
        if (cargando) cargarDatos();
    }, [cargando, listarTiposDocumento]);

    useEffect(() => {
        const cerrarMenuAfuera = () => setMenuAbiertoId(null);
        document.addEventListener('click', cerrarMenuAfuera);
        return () => document.removeEventListener('click', cerrarMenuAfuera);
    }, []);

    // define columnas
    const columnas = [
        {
            clave: 'descripcion',
            titulo: 'Descripcion',
            valorOrden: (p) => `${p.descripcion || ''}`,
            renderizar: (p) => `${p.descripcion}`
        }
    ];

    // campos de filtros
    const propiedadesFiltro = [
        (p) => p.descripcion
    ];

    return (
        <div className="max-w-7xl mx-auto py-4">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Tipos Documento</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Directorio unificado del padron general.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setCargando(true)}
                        className="flex items-center gap-2 px-4 py-2.5 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs cursor-pointer transition"
                    >
                        <RefreshCw size={16} className={cargando ? "animate-spin" : ""} />
                        Recargar
                    </button>
                    <button
                        onClick={() => navigate('/tipos-documento/create')}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 shadow-xs cursor-pointer transition"
                    >
                        <Plus size={18} />
                        Agregar tipo documento
                    </button>
                </div>
            </div>

            {cargando ? (
                <div className="flex justify-center py-24">
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-lg animate-pulse">Sincronizando registros...</p>
                </div>
            ) : (
                <TablaPaginado
                    data={tiposDocumento}
                    columnas={columnas}
                    propiedadesFiltro={propiedadesFiltro}
                    placeholderBusqueda="Buscar por descripcion..."
                    columnaOrdenInicial="descripcion"
                    accionesPorFila={(p) => (
                        <div className="relative inline-block text-left">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuAbiertoId(menuAbiertoId === p.idTipoDocumento ? null : p.idTipoDocumento);
                                }}
                                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl transition cursor-pointer"
                                title="Acciones"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {menuAbiertoId === p.idTipoDocumento && (
                                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg z-50 py-1 overflow-hidden">
                                    <button
                                        onClick={() => navigate(`/tipos-documento/details/${p.idTipoDocumento}`)}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
                                    >
                                        <Eye size={14} className="text-blue-500" /> Ver Detalle
                                    </button>
                                    <button
                                        onClick={() => navigate(`/tipos-documento/edit/${p.idTipoDocumento}`)}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-left"
                                    >
                                        <Edit2 size={14} className="text-indigo-500" /> Editar
                                    </button>
                                    <div className="border-t border-slate-100 dark:border-slate-700/60 my-1"></div>
                                    <button
                                        onClick={() => navigate(`/tipos-documento/delete/${p.idTipoDocumento}`)}
                                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left font-medium"
                                    >
                                        <Trash2 size={14} /> Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                />
            )}

        </div>
    );
}

export default IndexTiposDocumentoPage;