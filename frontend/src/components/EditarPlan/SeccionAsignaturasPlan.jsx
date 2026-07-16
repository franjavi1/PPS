import React from "react";
import { BookMarked, BookOpen, PlusCircle, Trash2, Hash } from "lucide-react";
import { Seccion, CampoSelect, CampoTexto, Dato, EstadoVacio } from "./SharedPlanComponents";

export default function SeccionAsignaturasPlan({
  nuevaAsignatura,
  asignaturas,
  rangos,
  sedes,
  planAsignaturas,
  mapas,
  guardando,
  seccionAbierta,
  setSeccionAbierta,
  cambiarNuevaAsignatura,
  agregarAsignatura,
  eliminarAsignatura,
}) {
  return (
    <Seccion
      id="asignaturas"
      icono={<BookMarked size={23} />}
      titulo="Asignaturas del plan"
      abierta={seccionAbierta === "asignaturas"}
      onToggle={setSeccionAbierta}
    >
      <div className="md:col-span-2">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4">Agregar asignatura</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoSelect
            label="Asignatura"
            name="asignatura_id"
            value={nuevaAsignatura.asignatura_id}
            onChange={cambiarNuevaAsignatura}
            opciones={asignaturas}
            getValue={(a) => a.id}
            getLabel={(a) => a.nombre}
          />
          <CampoSelect
            label="Rango minimo"
            name="rango_minimo_id"
            value={nuevaAsignatura.rango_minimo_id}
            onChange={cambiarNuevaAsignatura}
            opciones={rangos}
            getValue={(r) => r.id}
            getLabel={(r) => r.descripcion}
          />
          <CampoSelect
            label="Sede"
            name="sedes_id"
            value={nuevaAsignatura.sedes_id}
            onChange={cambiarNuevaAsignatura}
            opciones={sedes}
            getValue={(s) => s.id}
            getLabel={(s) => s.nombre}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <CampoTexto
            label="Presentismo %"
            name="presentismo_porc"
            type="number"
            value={nuevaAsignatura.presentismo_porc}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 75"
            icono={<Hash size={20} />}
          />
          <CampoTexto
            label="Regularizacion prom."
            name="regularizacion_prom"
            type="number"
            value={nuevaAsignatura.regularizacion_prom}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 6"
            icono={<Hash size={20} />}
          />
          <CampoTexto
            label="Final aprobacion"
            name="final_aprobacion"
            type="number"
            value={nuevaAsignatura.final_aprobacion}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 7"
            icono={<Hash size={20} />}
          />
          <CampoTexto
            label="Duracion"
            name="duracion"
            type="number"
            value={nuevaAsignatura.duracion}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: 120"
            icono={<Hash size={20} />}
          />
          <CampoTexto
            label="Regimen"
            name="regimen"
            value={nuevaAsignatura.regimen}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: Anual"
            icono={<BookMarked size={20} />}
          />
          <CampoTexto
            label="Modalidad"
            name="modalidad"
            value={nuevaAsignatura.modalidad}
            onChange={cambiarNuevaAsignatura}
            placeholder="Ej: Presencial"
            icono={<BookOpen size={20} />}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={agregarAsignatura}
            disabled={guardando}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition"
          >
            <PlusCircle size={22} />
            Agregar asignatura
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-extrabold text-slate-800">Asignaturas asociadas</h3>

        {planAsignaturas.length > 0 ? (
          planAsignaturas.map((item) => (
            <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-4 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Asignatura</p>
                  <h3 className="text-lg font-extrabold text-slate-800 mt-1">
                    {mapas.asignaturas[item.asignatura_id] || "-"}
                  </h3>
                  <p className="text-slate-600 font-semibold mt-1">
                    Sede: {mapas.sedes[item.sedes_id] || "-"}
                  </p>
                  <p className="text-slate-600 font-semibold mt-1">
                    Rango minimo: {mapas.rangos[item.rango_minimo_id] || "-"}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2 text-sm">
                  <Dato label="Regimen" value={item.regimen} />
                  <Dato label="Modalidad" value={item.modalidad} />
                  <Dato label="Presentismo" value={`${item.presentismo_porc}%`} />
                  <Dato label="Final" value={item.final_aprobacion} />
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => eliminarAsignatura(item.id)}
                  disabled={guardando}
                  className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60 transition"
                >
                  <Trash2 size={18} />
                  Eliminar
                </button>
              </div>
            </article>
          ))
        ) : (
          <EstadoVacio texto="Este plan todavia no tiene asignaturas asociadas." />
        )}
      </div>
    </Seccion>
  );
}
