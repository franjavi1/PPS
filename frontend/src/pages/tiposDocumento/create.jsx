import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Mail, Fingerprint } from 'lucide-react';
import useTiposDocumento from '../../hooks/useTiposDocumento';
import CampoTexto from '../../components/textos/camposTexto';
import { AlertComponent } from '../../components/alertas/alerts';

function CreateTiposDocumentoPage() {
    const { crearTiposDocumento } = useTiposDocumento();
    const navigate = useNavigate();

    const [form, setForm] = useState({ descripcion: '' });
    const [enviando, setEnviando] = useState(false);
    const [errores, setErrores] = useState({});

    const { agregarAlerta } = AlertComponent();

    const manejarCambio = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validarFormulario = () => {
        const nuevosErrores = {};
        if (!form.descripcion.trim()) nuevosErrores.descripcion = "La descripcion es obligatoria.";

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();
        if (!validarFormulario()) return;

        setEnviando(true);
        const res = await crearTiposDocumento(form);
        setEnviando(false);

        if (res.ok) {
            let mensajeRespuesta = res.message || 'Tipo Documento creado correctamente.';
            agregarAlerta({ exito: true, mensaje: mensajeRespuesta });
            navigate('/tipos-documento');
        } else {
            let mensajeRespuesta = res.message || 'No se pudo crear el tipo documento.';
            agregarAlerta({ exito: false, mensaje: mensajeRespuesta });
        }
    };

    return (
        <div className="max-w-5xl mx-auto">

            <div className="mb-8">
                <button
                    onClick={() => navigate('/tipos-documento')}
                    className="flex items-center gap-2 text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-500 font-semibold mb-4 cursor-pointer transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver al listado Tipos Documento
                </button>
                <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">Nueva Tipo Documento</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Completa los datos para registrar un nuevo tipo de documento.</p>
            </div>

            <form onSubmit={manejarEnvio} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 transition-colors duration-300">
                <section className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Datos tipo documento</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CampoTexto
                            label="Descripcion"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={manejarCambio}
                            error={errores.descripcion}
                            placeholder="Ingresa descripcion"
                            icono={<User size={20} />}
                        />
                    </div>
                </section>

                <div className="flex flex-col sm:flex-row justify-end gap-4 border-t border-slate-100 dark:border-slate-700 pt-6">
                    <button
                        type="button"
                        onClick={() => navigate('/tipos-documento')}
                        className="px-6 py-3 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer text-center transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={enviando}
                        className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                        <Save size={20} />
                        {enviando ? 'Guardando...' : 'Guardar Tipo Documento'}
                    </button>
                </div>
            </form>
        </div>
    );
}


export default CreateTiposDocumentoPage;