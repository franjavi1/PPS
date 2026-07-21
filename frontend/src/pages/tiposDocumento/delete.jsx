import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, User, AlertTriangle } from 'lucide-react';
import useTiposDocumento from '../../hooks/useTiposDocumento';
import { AlertComponent } from '../../components/alertas/alerts';

function DeleteTiposDocumentoPage() {
    const { id } = useParams();
    const { obtenerTipoDocumento, eliminarTiposDocumento } = useTiposDocumento();
    const navigate = useNavigate();

    const [tipoDocumento, setTipoDocumento] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    
    const { agregarAlerta } = AlertComponent();

    useEffect(() => {
        const cargarTipoDocumento = async () => {
            const res = await obtenerTipoDocumento(id);
            if (res.ok && res.data?.[0]) {
                setTipoDocumento(res.data[0]);
            }
            setCargando(false);
        };
        cargarTipoDocumento();
    }, [id]);

    const ejecutarEliminacion = async () => {
        setEnviando(true);
        const res = await eliminarTiposDocumento(id);
        setEnviando(false);

        if (res.ok) {
            let mensajeRespuesta = res.message || 'Tipo documento dado de baja correctamente.';
            agregarAlerta({ exito: true, mensaje: mensajeRespuesta });
            navigate('/tipos-documento');
        } else {
            let mensajeRespuesta = res.message || 'No se pudo eliminar el registro.';
            agregarAlerta({ exito: false, mensaje: mensajeRespuesta });
        }
    };

    if (cargando) {
        return (
            <div className="flex justify-center py-24">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-lg animate-pulse">Procesando solicitud de baja...</p>
            </div>
        );
    }

    if (!tipoDocumento) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <p className="text-red-600 dark:text-red-400 font-bold text-lg mb-4">No se encontro el registro a eliminar.</p>
                <button onClick={() => navigate('/tipos-documento')} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-xl font-bold text-slate-700 dark:text-slate-200">
                    Volver al listado tipos documentos
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">

            <div className="mb-8">
                <button 
                    onClick={() => navigate('/tipos-documento')} 
                    className="flex items-center gap-2 text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-500 font-semibold mb-4 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al listado
                </button>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Confirmar Baja</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Por favor, revisa los datos antes de proceder con la eliminacion del registro.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 transition-colors duration-300">
                {/* Alerta de peligro */}
                <div className="mb-6 flex gap-3 items-start bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 p-4 rounded-xl text-red-800 dark:text-red-400">
                    <AlertTriangle size={24} className="shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-sm uppercase tracking-wide">Atencion: Accion Irreversible</h3>
                        <p className="text-sm opacity-90 mt-1">Esta accion dara de baja el registro de forma permanente en el sistema. Asegurate de que no afecte dependencias de auditorias activas.</p>
                    </div>
                </div>

                {/* Vista previa de lo que se va a eliminar */}
                <div className="border border-slate-100 dark:border-slate-700/60 rounded-xl p-5 space-y-4 bg-slate-50/50 dark:bg-slate-900/30">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                        <User size={16} /> Registro Seleccionado
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs text-slate-400">Descripcion</span>
                            <span className="text-base font-bold text-slate-800 dark:text-slate-200">{tipoDocumento.descripcion}</span>
                        </div>
                    </div>
                </div>

                {/* Botones de accion */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100 dark:border-slate-700 pt-6 mt-8">
                    <button
                        type="button"
                        onClick={() => navigate('/tipos-documento')}
                        disabled={enviando}
                        className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer text-center transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={ejecutarEliminacion}
                        disabled={enviando}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        <Trash2 size={20} />
                        {enviando ? 'Eliminando...' : 'Confirmar Eliminacion'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteTiposDocumentoPage;