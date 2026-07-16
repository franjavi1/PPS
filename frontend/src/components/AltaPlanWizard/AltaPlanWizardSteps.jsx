import { BookOpen, BookMarked, ClipboardList, GitBranch, CheckCircle2, Hash, Building2, PlusCircle, Trash2, Save } from "lucide-react";
import { CampoTexto, CampoSelect, CampoSelectSimple, Acciones, TituloPaso } from "../FormHelpers";

const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;

export function StepPlan({ plan, cambiarPlan, tiposPlanes, guardando, guardarPlan }) {
  return (
    <form onSubmit={guardarPlan} className="space-y-6">
      <TituloPaso icono={<BookOpen size={26} />} titulo="Datos del plan de estudio" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoSelect
          label="Tipo de plan"
          name="tipo_planes_id_tipo_planes"
          value={plan.tipo_planes_id_tipo_planes}
          onChange={cambiarPlan}
          opciones={tiposPlanes}
          getLabel={(t) => t.descripcion}
        />
        <CampoTexto
          label="Nombre del plan"
          name="nombre"
          value={plan.nombre}
          onChange={cambiarPlan}
          placeholder="Ej: Plan Bomberos 2026"
        />
        <CampoTexto
          label="Resolución ministerial (Nro.)"
          name="resolucion_ministerial"
          type="number"
          value={plan.resolucion_ministerial}
          onChange={cambiarPlan}
          placeholder="Ej: 1250"
        />
        <div className="grid grid-cols-2 gap-4">
          <CampoTexto
            label="Vigencia desde"
            name="vigencia_dde"
            type="date"
            value={plan.vigencia_dde}
            onChange={cambiarPlan}
          />
          <CampoTexto
            label="Vigencia hasta"
            name="vigencia_hta"
            type="date"
            value={plan.vigencia_hta}
            onChange={cambiarPlan}
          />
        </div>
      </div>
      <CampoTexto
        label="Descripción del plan"
        name="descrip"
        value={plan.descrip}
        onChange={cambiarPlan}
        placeholder="Ej: Plan orientado a..."
      />
      <Acciones guardando={guardando} texto="Crear plan y seguir" />
    </form>
  );
}

export function StepAsignatura({
  asignaturaPlan,
  cambiarAsignaturaPlan,
  asignaturas,
  rangos,
  sedes,
  guardando,
  guardarAsignatura,
  asignaturasCargadas,
  onBack,
}) {
  return (
    <form onSubmit={guardarAsignatura} className="space-y-6">
      <TituloPaso icono={<BookMarked size={26} />} titulo="Asociar asignatura al plan" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CampoSelect
          label="Asignatura"
          name="asignatura_id"
          value={asignaturaPlan.asignatura_id}
          onChange={cambiarAsignaturaPlan}
          opciones={asignaturas}
          getLabel={(item) => item.nombre}
        />
        <CampoSelect
          label="Rango mínimo"
          name="rango_minimo_id"
          value={asignaturaPlan.rango_minimo_id}
          onChange={cambiarAsignaturaPlan}
          opciones={rangos}
          getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
        />
        <CampoSelect
          label="Sede de dictado"
          name="sedes_id"
          value={asignaturaPlan.sedes_id}
          onChange={cambiarAsignaturaPlan}
          opciones={sedes}
          getLabel={(item) => item.nombre}
        />
      </div>

      <div className="space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-xl font-extrabold text-slate-800">Asignaturas asociadas en este plan</h3>
        {asignaturasCargadas.length > 0 ? (
          <div className="space-y-2">
            {asignaturasCargadas.map((item, index) => (
              <div key={item.id || index} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
                <p className="text-slate-800 font-extrabold">{item.asignatura}</p>
                <p className="text-slate-500 font-semibold mt-1">Sede: {item.sede || "-"} | Rango: {item.rango || "-"}</p>
              </div>
            ))}
          </div>
        ) : (
          <EstadoVacio texto="Todavía no agregaste asignaturas a este plan." />
        )}
      </div>

      <Acciones
        guardando={guardando}
        texto="Guardar y seguir a condiciones"
        onBack={onBack}
        deshabilitado={asignaturasCargadas.length === 0 && !asignaturaPlan.asignatura_id}
      />
    </form>
  );
}

export function StepCondiciones({
  asignaturaPlan,
  cambiarAsignaturaPlan,
  guardando,
  guardarCondiciones,
  onBack,
}) {
  return (
    <form onSubmit={guardarCondiciones} className="space-y-6">
      <TituloPaso icono={<ClipboardList size={26} />} titulo="Condiciones de la asignatura" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CampoTexto
          label="Porcentaje presentismo (%)"
          name="presentismo_porc"
          type="number"
          value={asignaturaPlan.presentismo_porc}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 80"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Regularizacion prom."
          name="regularizacion_prom"
          type="number"
          step="0.01"
          value={asignaturaPlan.regularizacion_prom}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 6"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Final aprobacion"
          name="final_aprobacion"
          type="number"
          value={asignaturaPlan.final_aprobacion}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 7"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Duracion"
          name="duracion"
          type="number"
          step="0.01"
          value={asignaturaPlan.duracion}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 120"
          icon={<Hash size={20} />}
        />
        <CampoTexto
          label="Regimen"
          name="regimen"
          value={asignaturaPlan.regimen}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: Anual"
          icon={<BookMarked size={20} />}
        />
        <CampoTexto
          label="Modalidad"
          name="modalidad"
          value={asignaturaPlan.modalidad}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: Presencial"
          icon={<Building2 size={20} />}
        />
      </div>
      <Acciones guardando={guardando} texto="Guardar condiciones y seguir" onBack={onBack} />
    </form>
  );
}

export function StepCorrelativas({
  asignaturasCargadas,
  nuevaCorrelativa,
  cambiarCorrelativa,
  agregarCorrelativa,
  correlativasCargadas,
  eliminarCorrelativa,
  guardando,
  onBack,
  onNext,
}) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<GitBranch size={26} />} titulo="Correlativas del plan" />
      {asignaturasCargadas.length < 2 ? (
        <EstadoVacio texto="Necesitas al menos dos asignaturas cargadas para crear correlativas." />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            agregarCorrelativa();
          }}
          className="space-y-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CampoSelect
              label="Asignatura que requiere"
              name="pa_id"
              value={nuevaCorrelativa.pa_id}
              onChange={cambiarCorrelativa}
              opciones={asignaturasCargadas}
              getLabel={(item) => item.asignatura}
            />
            <CampoSelect
              label="Asignatura requerida"
              name="asignatura_id"
              value={nuevaCorrelativa.asignatura_id}
              onChange={cambiarCorrelativa}
              opciones={asignaturasCargadas}
              getLabel={(item) => item.asignatura}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={guardando}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
            >
              <PlusCircle size={22} />
              Agregar correlativa
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="text-xl font-extrabold text-slate-800">Correlativas cargadas</h3>
        {correlativasCargadas.length > 0 ? (
          correlativasCargadas.map((item) => (
            <article key={item.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Para cursar</p>
                  <h4 className="text-lg font-extrabold text-slate-800 mt-1">{item.asignaturaQueRequiere}</h4>
                  <p className="text-slate-600 font-semibold mt-1">Requiere: {item.asignaturaRequerida}</p>
                </div>
                <button
                  type="button"
                  onClick={() => eliminarCorrelativa(item.id)}
                  disabled={guardando}
                  className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60"
                >
                  <Trash2 size={18} />
                  Eliminar
                </button>
              </div>
            </article>
          ))
        ) : (
          <EstadoVacio texto="Todavía no cargaste correlativas para este plan." />
        )}
      </div>

      <Acciones guardando={false} texto="Finalizar alta" onBack={onBack} onSubmit={onNext} />
    </section>
  );
}

export function StepResumen({ plan, asignaturasCargadas, correlativasCargadas, volverPlanes, cargarOtroPlan }) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<CheckCircle2 size={26} />} titulo="Resumen del alta del plan" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-400 uppercase">Plan de estudio</p>
          <p className="text-slate-800 font-extrabold mt-1">{plan.nombre || "-"}</p>
        </div>
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-400 uppercase">Asignaturas cargadas</p>
          <p className="text-slate-800 font-extrabold mt-1">{asignaturasCargadas.length}</p>
        </div>
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-400 uppercase">Correlativas creadas</p>
          <p className="text-slate-800 font-extrabold mt-1">{correlativasCargadas.length}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={volverPlanes}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
        >
          Volver a planes
        </button>
        <button
          type="button"
          onClick={cargarOtroPlan}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
        >
          <Save size={22} />
          Cargar otro plan
        </button>
      </div>
    </section>
  );
}
