import React from "react";
import { X, Save } from "lucide-react";

export default function LegajoRangosModal({
  formulario,
  legajos,
  rangos,
  errorFormulario,
  editandoId,
  manejarCambio,
  guardarLegajoRangos,
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
          {editandoId ? "Editar rango de legajo" : "Nuevo rango de legajo"}
        </h2>

        <form onSubmit={guardarLegajoRangos} className="space-y-5">
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
                Rango jerarquico
              </label>
              <select
                name="rangos_institucionales_id"
                value={formulario.rangos_institucionales_id}
                onChange={manejarCambio}
                className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccione un rango</option>
                {rangos.map((rango) => (
                  <option key={rango.id} value={rango.id}>
                    {rango.descripcion} - Nivel {rango.nivel_jerarquia}
                  </option>
                ))}
              </select>
            </div>
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
