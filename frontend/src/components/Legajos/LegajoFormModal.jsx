import { Save, X } from "lucide-react";

export default function LegajoFormModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarLegajo,
  personas,
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-xl relative">
        <button
          onClick={cerrarModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
          {editandoId ? "Editar legajo" : "Nuevo legajo"}
        </h2>

        <form onSubmit={guardarLegajo} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Persona
            </label>
            <select
              name="persona_id"
              value={formulario.persona_id}
              onChange={manejarCambio}
              className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Seleccione una persona</option>
              {personas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.apellido}, {persona.nombre} - {persona.numero_doc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Número
            </label>
            <input
              type="text"
              name="numero"
              value={formulario.numero}
              onChange={manejarCambio}
              placeholder="Ej: 1001"
              className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {errorFormulario && (
            <p className="text-red-600 font-semibold">{errorFormulario}</p>
          )}

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
