import { Save, X, FileText, Hash, CalendarDays } from "lucide-react";
import { CampoTexto, CampoSelect } from "../FormHelpers";

export default function PlanModal({
  mostrarModal,
  cerrarModal,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarPlan,
  tiposPlanes,
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
          <h2 className="text-2xl font-extrabold text-slate-800">Nuevo plan de estudio</h2>
          <p className="text-slate-500 mt-1">Complete los campos para registrar el plan de estudio.</p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarPlan} className="space-y-5">
          <CampoSelect
            label="Tipo de plan"
            name="tipo_planes_id_tipo_planes"
            value={formulario.tipo_planes_id_tipo_planes}
            onChange={manejarCambio}
            icon={<FileText size={22} />}
            opciones={tiposPlanes}
            getLabel={(t) => t.descripcion}
          />

          <CampoTexto
            label="Nombre del plan"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Plan Bomberos 2026"
            icon={<FileText size={22} />}
          />

          <CampoTexto
            label="Resolución ministerial (Nro.)"
            name="resolucion_ministerial"
            type="number"
            value={formulario.resolucion_ministerial}
            onChange={manejarCambio}
            placeholder="Ej: 1250"
            icon={<Hash size={22} />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoTexto
              label="Vigencia desde"
              name="vigencia_dde"
              type="date"
              value={formulario.vigencia_dde}
              onChange={manejarCambio}
              icon={<CalendarDays size={22} />}
            />
            <CampoTexto
              label="Vigencia hasta"
              name="vigencia_hta"
              type="date"
              value={formulario.vigencia_hta}
              onChange={manejarCambio}
              icon={<CalendarDays size={22} />}
            />
          </div>

          <CampoTexto
            label="Descripción del plan"
            name="descrip"
            value={formulario.descrip}
            onChange={manejarCambio}
            placeholder="Ej: Plan orientado a rescate..."
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
