import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit3, User, Calendar } from 'lucide-react';
import useTiposDocumento from '../../hooks/useTiposDocumento';

function DetailsTiposDocumentoPage() {
    const { id } = useParams();
    const { obtenerTipoDocumento } = useTiposDocumento();
    const navigate = useNavigate();

    const [tipoDocumento, setTipoDocumento] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarTipoDocumento = async () => {
            const res = await obtenerTipoDocumento(id);
            if (res.ok && res.data?.[0]) {
                setTipoDocumento(res.data[0]);
            } else {
                setError('No se pudo cargar la informacion del tipo de documento.');
            }
            setCargando(false);
        };
        cargarTipoDocumento();
    }, [id]);

    if (cargando) {
        return (
            <div className="flex justify-center py-24">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg animate-pulse">Cargando detalles...</p>
            </div>
        );
    }

    if (error || !tipoDocumento) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-4">{error || 'Tipo de documento no encontrado.'}</p>
                <button 
                    onClick={() => navigate('/tipos-documento')} 
                    className="px-6 py-2.5 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition cursor-pointer"
                >
                    Volver al listado
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <button 
                    onClick={() => navigate('/tipos-documento')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-500 font-semibold mb-4 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al listado tipos documentos
                </button>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Ficha del Tipo de Documento</h1>
                {/* <p className="text-slate-500 dark:text-slate-400 mt-2">Consulta el registro completo e historial de auditoria interna.</p> */}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700/80 overflow-hidden transition-colors duration-300">
                <div className="p-6 md:p-8 space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 mb-6 flex items-center gap-2">
                            <User size={24} className="text-red-700 dark:text-red-500" /> Datos de Identidad
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ItemDetalle label="Nombre" valor={tipoDocumento.descripcion} />
                            <div>
                                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">Estado de Registro</span>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                    tipoDocumento.tsBaja === null ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full ${tipoDocumento.tsBaja === null ? 'bg-green-600' : 'bg-red-600'}`}></span>
                                    {tipoDocumento.tsBaja === null ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-5 border border-slate-200/60 dark:border-slate-700/50 space-y-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mb-3">
                            <Calendar size={14} /> Trazabilidad y Auditoria
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                            <span className="text-slate-400 dark:text-slate-500">Alta en sistema:</span> {tipoDocumento.tsCreacion ? new Date(tipoDocumento.tsCreacion).toLocaleString() : 'N/D'}
                        </p>
                        {tipoDocumento.tsModificacion && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                                <span className="text-slate-400 dark:text-slate-500">Ultima modificacion:</span> {new Date(tipoDocumento.tsModificacion).toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/20 border-t border-slate-100 dark:border-slate-700 px-6 md:px-8 py-5 flex justify-end">
                    <button
                        onClick={() => navigate(`/tipos-documento/edit/${tipoDocumento.idTipoDocumento}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 transition-all shadow-sm cursor-pointer"
                    >
                        <Edit3 size={20} />
                        Modificar Registro
                    </button>
                </div>
            </div>
        </div>
    );
}

function ItemDetalle({ label, valor, icono }) {
    return (
        <div>
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                {icono} {label}
            </span>
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{valor || '—'}</span>
        </div>
    );
}

export default DetailsTiposDocumentoPage;