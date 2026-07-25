import React from "react";
import { X, Save, BookOpen, Hash, FileText, CalendarDays } from "lucide-react";

export default function PlanesModal({
  formulario,
  tiposPlanes,
  errorFormulario,
  editandoId,
  manejarCambio,
  guardarPlan,
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
          {editandoId ? "Editar plan" : "Nuevo plan"}
        </h2>

        <form onSubmit={guardarPlan} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoSelect
              label="Tipo de plan"
              name="tipo_planes_id_tipo_planes"
              value={formulario.tipo_planes_id_tipo_planes}
              onChange={manejarCambio}
              icon={<BookOpen size={20} />}
            >
              <option value="">Seleccione un tipo</option>
              {tiposPlanes.map((tipoPlan) => (
                <option
                  key={tipoPlan.id_tipo_planes}
                  value={tipoPlan.id_tipo_planes}
                >
                  {tipoPlan.descripcion}
                </option>
              ))}
            </CampoSelect>

            <CampoInput
              label="Resolucion ministerial"
              name="resolucion_ministerial"
              type="number"
              value={formulario.resolucion_ministerial}
              onChange={manejarCambio}
              placeholder="Ej: 2026001"
              icon={<Hash size={20} />}
            />
          </div>

          <CampoInput
            label="Nombre"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Plan de Formacion Inicial"
            icon={<FileText size={20} />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoInput
              label="Vigencia desde"
              name="vigencia_dde"
              type="date"
              value={formulario.vigencia_dde}
              onChange={manejarCambio}
              icon={<CalendarDays size={20} />}
            />

            <CampoInput
              label="Vigencia hasta"
              name="vigencia_hta"
              type="date"
              value={formulario.vigencia_hta}
              onChange={manejarCambio}
              icon={<CalendarDays size={20} />}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Descripcion
            </label>
            <textarea
              name="descrip"
              value={formulario.descrip}
              onChange={manejarCambio}
              placeholder="Breve descripcion del plan"
              className="w-full min-h-24 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
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

function CampoInput({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          {...props}
          className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
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
