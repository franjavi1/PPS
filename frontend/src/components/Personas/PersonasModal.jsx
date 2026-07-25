import React from "react";
import { X, Save } from "lucide-react";

export default function PersonasModal({
  formulario,
  tiposDocumento,
  error,
  editandoId,
  manejarCambio,
  guardarPersona,
  cerrarModal,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={cerrarModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
          {editandoId ? "Editar persona" : "Nueva persona"}
        </h2>

        <form onSubmit={guardarPersona} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tipo de documento
              </label>
              <select
                name="td_id"
                value={formulario.td_id}
                onChange={manejarCambio}
                className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccione un tipo</option>
                {tiposDocumento.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Numero de documento
              </label>
              <input
                type="number"
                name="numero_doc"
                value={formulario.numero_doc}
                onChange={manejarCambio}
                placeholder="Ej: 30123456"
                min="1"
                step="1"
                className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Ej: Juan"
                className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                value={formulario.apellido}
                onChange={manejarCambio}
                placeholder="Ej: Perez"
                className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 font-semibold">
              {error}
            </p>
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
