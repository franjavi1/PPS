import { PlusCircle, Trash2 } from "lucide-react";
import { CampoSelect } from "../FormHelpers";

const EstadoVacio = ({ texto }) => (
  <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>
);

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function SeccionCorrelativasPlan({
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
