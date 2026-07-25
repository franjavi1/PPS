import { Save, X } from "lucide-react";
import { CampoSelect } from "../FormHelpers";

export default function AutoridadesComisionModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarRegistro,
  tiposAutoridad,
  legajos,
  comisionesAsignaturas,
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
            {editandoId ? "Editar autoridad de comisión" : "Nueva autoridad de comisión"}
          </h2>
          <p className="text-slate-500 mt-1">Complete los campos de asignación.</p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarRegistro} className="space-y-6">
          <CampoSelect
            label="Tipo Autoridad"
            name="tipo_autoridad_id"
            value={formulario.tipo_autoridad_id}
            onChange={manejarCambio}
            opciones={tiposAutoridad}
            getLabel={(item) => item.descripcion}
          />

          <CampoSelect
            label="Legajo"
            name="legajo_id"
            value={formulario.legajo_id}
            onChange={manejarCambio}
            opciones={legajos}
            getLabel={(item) => (item.numero ? `Nro: ${item.numero} - ID: ${item.id}` : `ID: ${item.id}`)}
          />

          <CampoSelect
            label="Comisión asignatura"
            name="comision_id"
            value={formulario.comision_id}
            onChange={manejarCambio}
            opciones={comisionesAsignaturas}
            getLabel={(item) => item.nombre || `Asignatura #${item.id_comision_asignatura}`}
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
