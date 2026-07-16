import React from "react";
import { X, Save } from "lucide-react";

export default function LegajoSedesModal({
  formulario,
  legajos,
  sedes,
  errorFormulario,
  editandoId,
  manejarCambio,
  guardarLegajoSedes,
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
          {editandoId ? "Editar legajo por sede" : "Nuevo legajo por sede"}
        </h2>

        <form onSubmit={guardarLegajoSedes} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Legajo
              </label>
              <select
                name="legajo_id"
                value={formulario.legajo_id}
                onChange={manejarCambio}
                className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccione un legajo</option>
                {legajos.map((legajo) => (
                  <option key={legajo.id} value={legajo.id}>
                    Nro. {legajo.numero}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Sede
              </label>
              <select
                name="sede_id"
                value={formulario.sede_id}
                onChange={manejarCambio}
                className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccione una sede</option>
                {sedes.map((sede) => (
                  <option key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 font-bold cursor-pointer">
              <input
                type="checkbox"
                name="es_autoridad"
                checked={formulario.es_autoridad}
                onChange={manejarCambio}
                className="w-5 h-5 accent-red-700"
              />
              Es autoridad
            </label>

            <label className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 font-bold cursor-pointer">
              <input
                type="checkbox"
                name="es_sede_base"
                checked={formulario.es_sede_base}
                onChange={manejarCambio}
                className="w-5 h-5 accent-red-700"
              />
              Es sede base
            </label>
          </div>

          {errorFormulario && (
            <p className="text-red-600 font-semibold">
              {errorFormulario}
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
