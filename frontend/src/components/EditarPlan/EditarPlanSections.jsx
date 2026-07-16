import { BookMarked, GitBranch, PlusCircle, Trash2 } from "lucide-react";
import { CampoTexto, CampoSelect, CampoSelectSimple, Dato } from "../FormHelpers";

const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;

export function SeccionPlanBase({ plan, cambiarPlan, tiposPlanes }) {
  return (
    <>
      <CampoSelect
        label="Tipo de plan"
        name="tipo_planes_id_tipo_planes"
        value={plan.tipo_planes_id_tipo_planes}
        onChange={cambiarPlan}
        opciones={tiposPlanes}
        getLabel={(t) => t.descripcion}
      />
      <CampoTexto
        label="Resolución ministerial (Nro.)"
        name="resolucion_ministerial"
        type="number"
        value={plan.resolucion_ministerial}
        onChange={cambiarPlan}
      />
      <CampoTexto
        label="Nombre del plan"
        name="nombre"
        value={plan.nombre}
        onChange={cambiarPlan}
        placeholder="Ej: Plan Bomberos 2026"
      />
      <div className="grid grid-cols-2 gap-4">
        <CampoTexto
          label="Vigencia desde"
          name="vigencia_dde"
          type="date"
          value={plan.vigencia_dde ? String(plan.vigencia_dde).slice(0, 10) : ""}
          onChange={cambiarPlan}
        />
        <CampoTexto
          label="Vigencia hasta"
          name="vigencia_hta"
          type="date"
          value={plan.vigencia_hta ? String(plan.vigencia_hta).slice(0, 10) : ""}
          onChange={cambiarPlan}
        />
      </div>
      <div className="md:col-span-2">
        <CampoTexto
          label="Descripción del plan"
          name="descrip"
          value={plan.descrip}
          onChange={cambiarPlan}
        />
      </div>
    </>
  );
}

export function SeccionAsignaturasPlan({
  nuevaAsignatura,
  cambiarNuevaAsignatura,
  asignaturas,
  rangos,
  sedes,
  agregarAsignatura,
  planAsignaturas,
  eliminarAsignatura,
  mapas,
  guardando,
}) {
  return (
    <>
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800">Agregar asignatura</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CampoSelect
            label="Asignatura"
            name="asignatura_id"
            value={nuevaAsignatura.asignatura_id}
            onChange={cambiarNuevaAsignatura}
            opciones={asignaturas}
            getLabel={(item) => item.nombre}
          />
          <CampoSelect
            label="Rango mínimo"
            name="rango_minimo_id"
            value={nuevaAsignatura.rango_minimo_id}
            onChange={cambiarNuevaAsignatura}
            opciones={rangos}
            getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
          />
          <CampoSelect
            label="Sede"
            name="sedes_id"
            value={nuevaAsignatura.sedes_id}
            onChange={cambiarNuevaAsignatura}
            opciones={sedes}
            getLabel={(item) => item.nombre}
          />
          <CampoTexto
            label="Presentismo (%)"
            name="presentismo_porc"
            type="number"
            value={nuevaAsignatura.presentismo_porc}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 80"
          />
          <CampoTexto
            label="Regularización prom."
            name="regularizacion_prom"
            type="number"
            value={nuevaAsignatura.regularizacion_prom}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 6"
          />
          <CampoTexto
            label="Final aprobación"
            name="final_aprobacion"
            type="number"
            value={nuevaAsignatura.final_aprobacion}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 7"
          />
          <CampoTexto
            label="Duración"
            name="duracion"
            type="number"
            value={nuevaAsignatura.duracion}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 120"
          />
          <CampoTexto
            label="Régimen"
            name="regimen"
            value={nuevaAsignatura.regimen}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: Anual"
          />
          <CampoTexto
            label="Modalidad"
            name="modalidad"
            value={nuevaAsignatura.modalidad}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: Presencial"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={agregarAsignatura}
            disabled={guardando}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
          >
            <PlusCircle size={22} />
            Agregar asignatura
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-extrabold text-slate-800">Asignaturas en este plan</h3>
        {planAsignaturas.length > 0 ? (
          planAsignaturas.map((item) => (
            <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-800">
                    {mapas.asignaturas[item.asignatura_id] || "-"}
                  </h4>
                  <p className="text-slate-600 font-semibold mt-1">Sede: {mapas.sedes[item.sedes_id] || "-"}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 text-sm">
                  <Dato label="Rango mínimo" value={mapas.rangos[item.rango_minimo_id]} />
                  <Dato label="Regimen" value={item.regimen} />
                  <Dato label="Modalidad" value={item.modalidad} />
                </div>
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => eliminarAsignatura(item.id)}
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
          <EstadoVacio texto="Este plan todavía no tiene asignaturas asociadas." />
        )}
      </div>
    </>
  );
}

export function SeccionCorrelativasPlan({
  planAsignaturas,
  nuevaCorrelativa,
  cambiarCorrelativa,
  agregarCorrelativa,
  correlativas,
  eliminarCorrelativa,
  mapas,
  guardando,
}) {
  return (
    <>
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800">Agregar correlativa</h3>
        {planAsignaturas.length < 2 ? (
          <EstadoVacio texto="Necesitas al menos dos asignaturas cargadas para crear correlativas." />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CampoSelect
                label="Asignatura que requiere"
                name="pa_id"
                value={nuevaCorrelativa.pa_id}
                onChange={cambiarCorrelativa}
                opciones={planAsignaturas}
                getLabel={(item) => mapas.asignaturas[item.asignatura_id] || `Materia #${item.id}`}
              />
              <CampoSelect
                label="Asignatura requerida"
                name="asignatura_id"
                value={nuevaCorrelativa.asignatura_id}
                onChange={cambiarCorrelativa}
                opciones={planAsignaturas}
                getLabel={(item) => mapas.asignaturas[item.asignatura_id] || `Materia #${item.id}`}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={agregarCorrelativa}
                disabled={guardando}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
              >
                <PlusCircle size={22} />
                Agregar correlativa
              </button>
            </div>
          </>
        )}
      </div>

      <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-extrabold text-slate-800">Correlativas asociadas</h3>
        {correlativas.length > 0 ? (
          correlativas.map((item) => {
            const origen = planAsignaturas.find((x) => x.id === item.pa_id);
            const req = planAsignaturas.find((x) => x.id === item.asignatura_id);
            return (
              <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-extrabold text-slate-800">
                      {mapas.asignaturas[origen?.asignatura_id] || `Materia #${item.pa_id}`}
                    </h4>
                    <p className="text-slate-600 font-semibold mt-1">
                      Requiere: {mapas.asignaturas[req?.asignatura_id] || `Materia #${item.asignatura_id}`}
                    </p>
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
            );
          })
        ) : (
          <EstadoVacio texto="Este plan todavía no tiene correlativas asociadas." />
        )}
      </div>
    </>
  );
}
