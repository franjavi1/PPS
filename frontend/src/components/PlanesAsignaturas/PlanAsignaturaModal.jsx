import { Save, X, BookOpen, ChevronsUp, Building2, Hash, FileText } from "lucide-react";
import { CampoTexto, CampoSelect } from "../FormHelpers";

export default function PlanAsignaturaModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarRegistro,
  asignaturas,
  planes,
  rangos,
  sedes,
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={cerrarModal}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {editandoId ? "Editar materia de plan" : "Nueva materia de plan"}
          </h2>
          <p className="text-slate-500 mt-1">Complete los criterios de la materia en el plan de estudios.</p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarRegistro} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoSelect
              label="Plan de estudios"
              name="plan_id"
              value={formulario.plan_id}
              onChange={manejarCambio}
              icon={<BookOpen size={22} />}
              opciones={planes}
              getLabel={(item) => item.nombre}
            />

            <CampoSelect
              label="Asignatura / Materia"
              name="asignatura_id"
              value={formulario.asignatura_id}
              onChange={manejarCambio}
              icon={<FileText size={22} />}
              opciones={asignaturas}
              getLabel={(item) => item.nombre}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoSelect
              label="Rango mínimo requerido"
              name="rango_minimo_id"
              value={formulario.rango_minimo_id}
              onChange={manejarCambio}
              icon={<ChevronsUp size={22} />}
              opciones={rangos}
              getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
            />

            <CampoSelect
              label="Sede de dictado"
              name="sedes_id"
              value={formulario.sedes_id}
              onChange={manejarCambio}
              icon={<Building2 size={22} />}
              opciones={sedes}
              getLabel={(item) => item.nombre}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <CampoTexto
              label="Presentismo (%)"
              name="presentismo_porc"
              type="number"
              value={formulario.presentismo_porc}
              onChange={manejarCambio}
              placeholder="Ej: 80"
              icon={<Hash size={18} />}
            />
            <CampoTexto
              label="Prom. Regularizar"
              name="regularizacion_prom"
              type="number"
              value={formulario.regularizacion_prom}
              onChange={manejarCambio}
              placeholder="Ej: 6"
              icon={<Hash size={18} />}
            />
            <CampoTexto
              label="Nota Aprobación"
              name="final_aprobacion"
              type="number"
              value={formulario.final_aprobacion}
              onChange={manejarCambio}
              placeholder="Ej: 4"
              icon={<Hash size={18} />}
            />
            <CampoTexto
              label="Duración (hs)"
              name="duracion"
              type="number"
              value={formulario.duracion}
              onChange={manejarCambio}
              placeholder="Ej: 64"
              icon={<Hash size={18} />}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CampoTexto
              label="Régimen (Anual/Cuatrimestral)"
              name="regimen"
              value={formulario.regimen}
              onChange={manejarCambio}
              placeholder="Ej: Anual"
            />
            <CampoTexto
              label="Modalidad (Presencial/Distancia)"
              name="modalidad"
              value={formulario.modalidad}
              onChange={manejarCambio}
              placeholder="Ej: Presencial"
            />
          </div>

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
