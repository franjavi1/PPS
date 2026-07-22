import React from "react";
import { BookMarked, GitBranch, MapPinned } from "lucide-react";

export function InfoCard({ icono, titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
      <div className="text-red-700 mb-3">{icono}</div>
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

export function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

export function PlanAsignaturasList({ planAsignaturas, correlativas, mapas }) {
  if (planAsignaturas.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-slate-500 font-semibold">
        Este plan todavia no tiene asignaturas asociadas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {planAsignaturas.map((item) => (
        <article
          key={item.id}
          className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
            <div>
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
                <BookMarked size={24} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Asignatura
              </p>
              <h3 className="text-xl font-extrabold text-slate-800 mt-1">
                {mapas.asignaturas[item.asignatura_id] || "-"}
              </h3>
              <p className="flex items-center gap-2 text-slate-600 font-semibold mt-2">
                <MapPinned size={18} />
                {mapas.sedes[item.sedes_id] || "-"}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
              <Dato label="Rango minimo" value={mapas.rangos[item.rango_minimo_id]} />
              <Dato label="Regimen" value={item.regimen} />
              <Dato label="Modalidad" value={item.modalidad} />
              <Dato label="Presentismo" value={`${item.presentismo_porc}%`} />
              <Dato label="Regularizacion" value={item.regularizacion_prom} />
              <Dato label="Final" value={item.final_aprobacion} />
              <Dato label="Duracion" value={item.duracion} />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200">
            <p className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase mb-3">
              <GitBranch size={18} />
              Correlativas
            </p>
            {obtenerCorrelativasDeAsignatura(item.id, correlativas).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {obtenerCorrelativasDeAsignatura(item.id, correlativas).map(
                  (correlativa) => (
                    <span
                      key={correlativa.id}
                      className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-sm font-bold"
                    >
                      {mapas.asignaturas[correlativa.asignatura_id] || "-"}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-slate-500 font-semibold">
                Sin correlativas.
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function obtenerCorrelativasDeAsignatura(planAsignaturaId, correlativas) {
  return correlativas.filter(
    (item) => Number(item.pa_id) === Number(planAsignaturaId),
  );
}
