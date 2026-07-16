import { Save, X } from "lucide-react";
import { CampoSelect, CampoCheckbox } from "../FormHelpers";

export default function LegajoSedeModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarLegajoSedes,
  legajos,
  sedes,
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
            {editandoId ? "Editar sede de legajo" : "Nueva sede de legajo"}
          </h2>
          <p className="text-slate-500 mt-1">Complete los campos de asignación.</p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarLegajoSedes} className="space-y-6">
          <CampoSelect
            label="Legajo"
            name="legajo_id"
            value={formulario.legajo_id}
            onChange={manejarCambio}
            opciones={legajos}
            getLabel={(l) => `Nro: ${l.numero} - ID: ${l.id}`}
          />

          <CampoSelect
            label="Sede"
            name="sede_id"
            value={formulario.sede_id}
            onChange={manejarCambio}
            opciones={sedes}
            getLabel={(s) => s.nombre}
          />

          <CampoCheckbox
            label="Es autoridad en esta sede"
            name="es_autoridad"
            checked={formulario.es_autoridad}
            onChange={manejarCambio}
          />

          <CampoCheckbox
            label="Es sede base operativa"
            name="es_sede_base"
            checked={formulario.es_sede_base}
            onChange={manejarCambio}
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
