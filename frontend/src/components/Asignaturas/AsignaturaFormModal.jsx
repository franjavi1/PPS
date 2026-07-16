import { Save, X } from "lucide-react";

export default function AsignaturaFormModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarAsignatura,
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={cerrarModal}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {editandoId ? "Editar Asignatura" : "Nueva Asignatura"}
          </h2>
          <p className="text-slate-500 mt-1">
            Complete los campos para registrar la materia.
          </p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarAsignatura} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nombre de la Asignatura *
            </label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Matemática I"
              maxLength={105}
              className="w-full h-14 px-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Formato *
            </label>
            <select
              name="formato"
              value={formulario.formato}
              onChange={manejarCambio}
              className="w-full h-14 px-4 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Seleccione formato</option>
              <option value="Materia">Materia</option>
              <option value="Taller">Taller</option>
              <option value="Seminario">Seminario</option>
              <option value="Practica Profesional">Práctica Profesional</option>
            </select>
          </div>

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
