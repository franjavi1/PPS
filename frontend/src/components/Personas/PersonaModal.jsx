import { Save, X } from "lucide-react";
import { CampoTexto, CampoSelect } from "../FormHelpers";

export default function PersonaModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  error,
  guardarPersona,
  tiposDocumento,
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-xl relative">
        <button
          onClick={cerrarModal}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {editandoId ? "Editar persona" : "Nueva persona"}
          </h2>
          <p className="text-slate-500 mt-1">Complete los campos para guardar.</p>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={guardarPersona} className="space-y-6">
          <CampoSelect
            label="Tipo de documento"
            name="td_id"
            value={formulario.td_id}
            onChange={manejarCambio}
            opciones={tiposDocumento}
            getLabel={(t) => t.descripcion}
          />

          <CampoTexto
            label="Número de documento"
            name="numero_doc"
            type="number"
            value={formulario.numero_doc}
            onChange={manejarCambio}
            placeholder="Ej: 35123456"
          />

          <CampoTexto
            label="Nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Juan"
          />

          <CampoTexto
            label="Apellido"
            name="apellido"
            value={formulario.apellido}
            onChange={manejarCambio}
            placeholder="Ej: Pérez"
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
            >
              <X size={20} />
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
            >
              <Save size={22} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
