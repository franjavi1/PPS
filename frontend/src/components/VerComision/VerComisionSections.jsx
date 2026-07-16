import React from "react";
import { BookOpenCheck, DoorOpen, ShieldUser, UserRound } from "lucide-react";

export function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

export function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">
      {texto}
    </div>
  );
}

export function AsignaturasSeccion({ comisionesAsignaturas, mapas }) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Asignaturas</h2>
      {comisionesAsignaturas.length > 0 ? (
        <div className="space-y-4">
          {comisionesAsignaturas.map((item) => (
            <article key={item.id_comision_asignatura} className="border border-slate-200 rounded-xl bg-slate-50 p-5">
              <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                <div>
                  <BookOpenCheck className="text-red-700 mb-3" size={24} />
                  <h3 className="text-xl font-extrabold text-slate-800">{item.nombre}</h3>
                  <p className="text-slate-600 font-semibold mt-1">{mapas.planesAsignaturas[item.plan_asignaturas_id] || "-"}</p>
                  <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1">
                    <DoorOpen size={18} />
                    {mapas.aulas[item.aula_id] || "-"}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                  <Dato label="Modalidad" value={item.modalidad} />
                  <Dato label="Cupo" value={item.cupo_maximo} />
                  <Dato label="Estado" value={item.estado} />
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EstadoVacio texto="Esta comision no tiene asignaturas asociadas." />
      )}
    </section>
  );
}

export function AutoridadesSeccion({ autoridades, comisionesAsignaturas, mapas }) {
  return (
    <section>
      <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Autoridades</h2>
      {autoridades.length > 0 ? (
        <div className="space-y-3">
          {autoridades.map((item) => (
            <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-5">
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
                </div>
                <Dato
                  label="Comision asignatura"
                  value={obtenerNombreComisionAsignatura(item.comision_id, comisionesAsignaturas)}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EstadoVacio texto="Esta comision no tiene autoridades asociadas." />
      )}
    </section>
  );
}

function obtenerNombreComisionAsignatura(id, items) {
  const item = items.find((registro) => Number(registro.id_comision_asignatura) === Number(id));
  return item?.nombre || `Comision asignatura #${id}`;
}
