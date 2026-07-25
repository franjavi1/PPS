import { ShieldUser, UserRound, PlusCircle, Trash2 } from "lucide-react";
import { CampoSelect } from "../FormHelpers";

const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;

export default function SeccionAutoridades({
  nuevaAutoridad,
  cambiarNuevaAutoridad,
  tiposAutoridad,
  legajos,
  comisionesAsignaturas,
  agregarAutoridad,
  autoridades,
  eliminarAutoridad,
  mapas,
  guardando,
}) {
  const nombreComisionAsig = (cId) => comisionesAsignaturas.find((x) => Number(x.id_comision_asignatura) === Number(cId))?.nombre || `Comisión asignatura #${cId}`;

  return (
    <>
      <div className="md:col-span-2">
        <h3 className="text-lg font-extrabold text-slate-800 mb-4">Agregar autoridad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampoSelect
            label="Tipo autoridad"
            name="tipo_autoridad_id"
            value={nuevaAutoridad.tipo_autoridad_id}
            onChange={cambiarNuevaAutoridad}
            opciones={tiposAutoridad}
            getLabel={(item) => item.descripcion}
          />
          <CampoSelect
            label="Legajo"
            name="legajo_id"
            value={nuevaAutoridad.legajo_id}
            onChange={cambiarNuevaAutoridad}
            opciones={legajos}
            getLabel={(item) => (item.numero ? `Nro. ${item.numero}` : `Legajo #${item.id}`)}
          />
          <CampoSelect
            label="Comision asignatura"
            name="comision_id"
            value={nuevaAutoridad.comision_id}
            onChange={cambiarNuevaAutoridad}
            opciones={comisionesAsignaturas}
            getLabel={(item) => item.nombre}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={agregarAutoridad}
            disabled={guardando}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
          >
            <PlusCircle size={22} />
            Agregar autoridad
          </button>
        </div>
      </div>

      <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
        <h3 className="text-lg font-extrabold text-slate-800">Autoridades asociadas</h3>
        {autoridades.length > 0 ? (
          autoridades.map((item) => (
            <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-lg font-extrabold text-slate-800">
                    <ShieldUser size={22} />
                    {mapas.tiposAutoridad[item.tipo_autoridad_id] || "-"}
                  </p>
                  <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1">
                    <UserRound size={18} />
                    {mapas.legajos[item.legajo_id] || "-"}
                  </p>
                  <p className="text-slate-600 font-semibold mt-1">
                    {nombreComisionAsig(item.comision_id)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => eliminarAutoridad(item.id)}
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
          <EstadoVacio texto="Esta comisión todavía no tiene autoridades asociadas." />
        )}
      </div>
    </>
  );
}
