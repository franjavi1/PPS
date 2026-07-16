import { BookOpenCheck, Tag, Hash, PlusCircle, DoorOpen, Trash2 } from "lucide-react";
import { CampoTexto, CampoSelect, CampoSelectSimple, Dato } from "../FormHelpers";

const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;

export default function SeccionAsignaturas({
  nuevaComisionAsignatura,
  cambiarNuevaComisionAsignatura,
  planesAsignaturas,
  aulas,
  agregarComisionAsignatura,
  comisionesAsignaturas,
  eliminarComisionAsignatura,
  mapas,
  guardando,
}) {
  return (
    <>
      <div className="md:col-span-2 space-y-4">
        <h3 className="text-lg font-extrabold text-slate-800">Agregar asignatura</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoSelect
            label="Plan asignatura"
            name="plan_asignaturas_id"
            value={nuevaComisionAsignatura.plan_asignaturas_id}
            onChange={cambiarNuevaComisionAsignatura}
            opciones={planesAsignaturas}
            getLabel={(item) => mapas.planesAsignaturas[item.id] || `Plan asignatura #${item.id}`}
          />
          <CampoSelect
            label="Aula"
            name="aula_id"
            value={nuevaComisionAsignatura.aula_id}
            onChange={cambiarNuevaComisionAsignatura}
            opciones={aulas}
            getLabel={(item) => item.aula}
          />
          <CampoSelectSimple
            label="Estado"
            name="estado"
            value={nuevaComisionAsignatura.estado}
            onChange={cambiarNuevaComisionAsignatura}
            opciones={["Activo", "Inactivo"]}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoTexto
            label="Nombre"
            name="nombre"
            value={nuevaComisionAsignatura.nombre}
            onChange={cambiarNuevaComisionAsignatura}
            placeholder="Ej: Comisión A - Incendios"
            icon={<Tag size={20} />}
          />
          <CampoTexto
            label="Modalidad"
            name="modalidad"
            value={nuevaComisionAsignatura.modalidad}
            onChange={cambiarNuevaComisionAsignatura}
            placeholder="Ej: Presencial"
            icon={<BookOpenCheck size={20} />}
          />
          <CampoTexto
            label="Cupo máximo"
            name="cupo_maximo"
            type="number"
            value={nuevaComisionAsignatura.cupo_maximo}
            onChange={cambiarNuevaComisionAsignatura}
            placeholder="Ej: 30"
            icon={<Hash size={20} />}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={agregarComisionAsignatura}
            disabled={guardando}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
          >
            <PlusCircle size={22} />
            Agregar asignatura
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-extrabold text-slate-800">Asignaturas asociadas</h3>
        {comisionesAsignaturas.length > 0 ? (
          comisionesAsignaturas.map((item) => (
            <article key={item.id_comision_asignatura} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Comisión asignatura</p>
                  <h3 className="text-lg font-extrabold text-slate-800 mt-1">{item.nombre}</h3>
                  <p className="text-slate-600 font-semibold mt-1">{mapas.planesAsignaturas[item.plan_asignaturas_id] || "-"}</p>
                  <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1">
                    <DoorOpen size={18} />
                    {mapas.aulas[item.aula_id] || "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 text-sm">
                  <Dato label="Modalidad" value={item.modalidad} />
                  <Dato label="Cupo" value={item.cupo_maximo} />
                  <Dato label="Estado" value={item.estado} />
                </div>
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => eliminarComisionAsignatura(item.id_comision_asignatura)}
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
          <EstadoVacio texto="Esta comisión todavía no tiene asignaturas asociadas." />
        )}
      </div>
    </>
  );
}
