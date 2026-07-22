import { Save, X, Building2, DoorOpen, Monitor } from "lucide-react";
import { CampoTexto, CampoSelect } from "../FormHelpers";

// Recibimos de la vista padre:
// - mostrarModal: bandera boolean para pintar o no el modal.
// - cerrarModal: callback para ocultar el modal.
// - editandoId: ID del aula en edición (null si es nueva).
// - formulario: objeto local con los campos sedes_id, aula y es_virtual.
// - manejarCambio: callback para registrar cambios en los inputs.
// - errorFormulario: mensaje de error de validación para la cabecera.
// - guardarAula: callback onSubmit para enviar y guardar los datos.
// - sedes: colección global de sedes disponibles para asociar el aula.
export default function AulaModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarAula,
  sedes,
}) {
  // Si la bandera está en false, evitamos pintar el modal en la pantalla
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-xl relative">
        {/* Botón superior de cierre rápido */}
        <button
          onClick={cerrarModal}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {editandoId ? "Editar aula" : "Nueva aula"}
          </h2>
          <p className="text-slate-500 mt-1">
            Complete los campos para registrar el aula.
          </p>
        </div>

        {/* Mostramos alertas de error detectadas por el formulario */}
        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarAula} className="space-y-6">
          <CampoSelect
            label="Sede"
            name="sedes_id"
            value={formulario.sedes_id}
            onChange={manejarCambio}
            icon={<Building2 size={22} />}
            opciones={sedes}
            getLabel={(s) => s.nombre}
          />

          <CampoTexto
            label="Nombre del aula"
            name="aula"
            value={formulario.aula}
            onChange={manejarCambio}
            placeholder="Ej: Aula 102"
            icon={<DoorOpen size={22} />}
          />

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Tipo de aula
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Monitor size={22} />
              </span>
              <select
                name="es_virtual"
                value={formulario.es_virtual}
                onChange={manejarCambio}
                className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="0">Presencial</option>
                <option value="1">Virtual</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            {/* Propagamos la acción de cancelar cerrando el modal */}
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

