import { Save, X, Tag, BookOpenCheck, Hash } from "lucide-react";
import { CampoTexto, CampoSelect, CampoSelectSimple } from "../FormHelpers";

export default function ComisionAsignaturaModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarRegistro,
  planesAsignaturas,
  aulas,
  comisiones,
  mapas,
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
            {editandoId ? "Editar materia de comisión" : "Nueva materia de comisión"}
          </h2>
          <p className="text-slate-500 mt-1">Complete los campos de la materia.</p>
        </div>

        {errorFormulario && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarRegistro} className="space-y-6">
          <CampoSelect
            label="Comisión general"
            name="comision_id"
            value={formulario.comision_id}
            onChange={manejarCambio}
            opciones={comisiones}
            getLabel={(item) => item.descripcion}
          />

          <CampoSelect
            label="Plan asignatura"
            name="plan_asignaturas_id"
            value={formulario.plan_asignaturas_id}
            onChange={manejarCambio}
            opciones={planesAsignaturas}
            getLabel={(item) => mapas.planesAsignaturas[item.id] || `Plan asignatura #${item.id}`}
          />

          <CampoSelect
            label="Aula"
            name="aula_id"
            value={formulario.aula_id}
            onChange={manejarCambio}
            opciones={aulas}
            getLabel={(item) => item.aula}
          />

          <CampoTexto
            label="Nombre identificativo de cursado"
            name="nombre"
            value={formulario.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Cursado Comisión A"
            icon={<Tag size={20} />}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <CampoTexto
              label="Modalidad"
              name="modalidad"
              value={formulario.modalidad}
              onChange={manejarCambio}
              placeholder="Ej: Presencial"
              icon={<BookOpenCheck size={20} />}
            />
            <CampoTexto
              label="Cupo máximo"
              name="cupo_maximo"
              type="number"
              value={formulario.cupo_maximo}
              onChange={manejarCambio}
              placeholder="Ej: 30"
              icon={<Hash size={20} />}
            />
            <CampoSelectSimple
              label="Estado"
              name="estado"
              value={formulario.estado}
              onChange={manejarCambio}
              opciones={["Activo", "Inactivo"]}
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
