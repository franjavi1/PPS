import React from "react";
import { GitBranch, Pencil, Trash2, PlusCircle, Save } from "lucide-react";
import { Seccion, CampoSelect, EstadoVacio } from "./SharedPlanComponents";

export default function SeccionCorrelativasPlan({
  nuevaCorrelativa,
  planAsignaturas,
  correlativas,
  correlativaEditandoId,
  mapas,
  guardando,
  seccionAbierta,
  setSeccionAbierta,
  cambiarNuevaCorrelativa,
  guardarCorrelativa,
  editarCorrelativa,
  cancelarEdicionCorrelativa,
  eliminarCorrelativa,
}) {
  return (
    <Seccion
      id="correlativas"
      icono={<GitBranch size={23} />}
      titulo="Correlativas"
      abierta={seccionAbierta === "correlativas"}
      onToggle={setSeccionAbierta}
    >
      <div className="md:col-span-2">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4">
          {correlativaEditandoId ? "Editar correlativa" : "Agregar correlativa"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CampoSelect
            label="Asignatura que requiere"
            name="pa_id"
            value={nuevaCorrelativa.pa_id}
            onChange={cambiarNuevaCorrelativa}
            opciones={planAsignaturas}
            getValue={(item) => item.id}
            getLabel={(item) => mapas.asignaturas[item.asignatura_id] || `Plan asignatura #${item.id}`}
          />
          <CampoSelect
            label="Asignatura requerida"
            name="asignatura_id"
            value={nuevaCorrelativa.asignatura_id}
            onChange={cambiarNuevaCorrelativa}
            opciones={planAsignaturas}
            getValue={(item) => item.asignatura_id}
            getLabel={(item) => mapas.asignaturas[item.asignatura_id] || `Asignatura #${item.asignatura_id}`}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
          {correlativaEditandoId && (
            <button
              type="button"
              onClick={cancelarEdicionCorrelativa}
              disabled={guardando}
              className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60 transition"
            >
              Cancelar edicion
            </button>
          )}
          <button
            type="button"
            onClick={guardarCorrelativa}
            disabled={guardando}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition"
          >
            {correlativaEditandoId ? <Save size={22} /> : <PlusCircle size={22} />}
            {correlativaEditandoId ? "Guardar correlativa" : "Agregar correlativa"}
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-extrabold text-slate-800">Correlativas cargadas</h3>

        {correlativas.length > 0 ? (
          correlativas.map((item) => {
            const planAsignatura = planAsignaturas.find((pa) => Number(pa.id) === Number(item.pa_id));

            return (
              <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-4 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Para cursar</p>
                    <h3 className="text-lg font-extrabold text-slate-800 mt-1">
                      {mapas.asignaturas[planAsignatura?.asignatura_id] || "-"}
                    </h3>
                    <p className="text-slate-600 font-semibold mt-1">
                      Requiere: {mapas.asignaturas[item.asignatura_id] || "-"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => editarCorrelativa(item)}
                      disabled={guardando}
                      className="flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-900 disabled:opacity-60 transition"
                    >
                      <Pencil size={18} />
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => eliminarCorrelativa(item.id)}
                      disabled={guardando}
                      className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60 transition"
                    >
                      <Trash2 size={18} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <EstadoVacio texto="Este plan todavia no tiene correlativas cargadas." />
        )}
      </div>
    </Seccion>
  );
}
