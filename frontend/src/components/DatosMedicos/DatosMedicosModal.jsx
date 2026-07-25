import { Save, X } from "lucide-react";
import { CampoTexto, CampoSelect, CampoSelectSimple, CampoCheckbox } from "../FormHelpers";

export default function DatosMedicosModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  error,
  guardarDatosMedicos,
  personas,
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
            {editandoId ? "Editar datos médicos" : "Nuevos datos médicos"}
          </h2>
          <p className="text-slate-500 mt-1">Complete la ficha médica.</p>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={guardarDatosMedicos} className="space-y-6">
          <CampoSelect
            label="Persona"
            name="persona_id"
            value={formulario.persona_id}
            onChange={manejarCambio}
            opciones={personas}
            getLabel={(p) => `${p.apellido}, ${p.nombre} - DNI ${p.numero_doc}`}
          />

          <CampoSelectSimple
            label="Grupo sanguíneo"
            name="grupo_sanguineo"
            value={formulario.grupo_sanguineo}
            onChange={manejarCambio}
            opciones={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
          />

          <CampoTexto
            label="Seguro médico / Obra Social"
            name="seguro"
            value={formulario.seguro}
            onChange={manejarCambio}
            placeholder="Ej: OSDE, IAPOS"
          />

          <CampoTexto
            label="Alergias conocidas"
            name="alergias"
            value={formulario.alergias}
            onChange={manejarCambio}
            placeholder="Ej: Penicilina, Ninguna"
          />

          <CampoCheckbox
            label="Aptitud física reglamentaria"
            name="aptitud_fisica"
            checked={formulario.aptitud_fisica}
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
