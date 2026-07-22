import { Save, X, Building2, MapPin } from "lucide-react";
import { CampoTexto, CampoSelect } from "../FormHelpers";

export default function SedeModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarSede,
  tiposSedes,
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
            {editandoId ? "Editar sede" : "Nueva sede"}
          </h2>
          <p className="text-slate-500 mt-1">
            Complete los campos para registrar la sede.
          </p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarSede} className="space-y-6">
          <CampoSelect
            label="Tipo de sede"
            name="tipo_sede_id"
            value={formulario.tipo_sede_id}
            onChange={manejarCambio}
            icon={<Building2 size={22} />}
            opciones={tiposSedes}
            getLabel={(t) => t.descripcion}
          />

          <CampoTexto
            label="Nombre de la sede"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Sede Central"
            icon={<Building2 size={22} />}
          />

          <CampoTexto
            label="Dirección"
            name="direccion"
            value={formulario.direccion}
            onChange={manejarCambio}
            placeholder="Ej: Av. Pellegrini 250"
            icon={<MapPin size={22} />}
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
