import React from "react";
import { X, Save, BookMarked, FileText } from "lucide-react";

export default function PACorrelativasModal({
  formulario,
  planesAsignaturas,
  asignaturas,
  mapas,
  errorFormulario,
  editandoId,
  manejarCambio,
  guardarRegistro,
  cerrarModal,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-3xl relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={cerrarModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
          {editandoId ? "Editar correlativa" : "Nueva correlativa"}
        </h2>

        <form onSubmit={guardarRegistro} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CampoSelect
              label="Plan asignatura"
              name="pa_id"
              value={formulario.pa_id}
              onChange={manejarCambio}
              icon={<BookMarked size={20} />}
            >
              <option value="">Seleccione</option>
              {planesAsignaturas.map((planAsignatura) => (
                <option key={planAsignatura.id} value={planAsignatura.id}>
                  {mapas.planesAsignaturas[planAsignatura.id]}
                </option>
              ))}
            </CampoSelect>

            <CampoSelect
              label="Asignatura correlativa"
              name="asignatura_id"
              value={formulario.asignatura_id}
              onChange={manejarCambio}
              icon={<FileText size={20} />}
            >
              <option value="">Seleccione</option>
              {asignaturas.map((asignatura) => (
                <option key={asignatura.id} value={asignatura.id}>
                  {asignatura.nombre}
                </option>
              ))}
            </CampoSelect>
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

function CampoSelect({ label, icon, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <select
          {...props}
          className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          {children}
        </select>
      </div>
    </div>
  );
}
