import { PlusCircle, Trash2 } from "lucide-react";
import { CampoTexto, CampoSelect, Dato } from "../FormHelpers";

const EstadoVacio = ({ texto }) => (
  <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>
);

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function SeccionAsignaturasPlan({
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
