import React from "react";
import { BookMarked, Save } from "lucide-react";

export default function PasoAsignaturaPlan({
  asignaturaPlan,
  asignaturas,
  rangos,
  sedes,
  cambiarAsignaturaPlan,
  guardarDatosAsignatura,
  setPasoActual,
}) {
  return (
    <form onSubmit={guardarDatosAsignatura} className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <BookMarked size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Seleccionar Asignatura</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Asignatura</label>
          <select
            name="asignatura_id"
            value={asignaturaPlan.asignatura_id}
            onChange={cambiarAsignaturaPlan}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione asignatura</option>
            {asignaturas.map((asig) => (
              <option key={asig.id} value={asig.id}>
                {asig.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Rango Minimo Requerido</label>
          <select
            name="rango_minimo_id"
            value={asignaturaPlan.rango_minimo_id}
            onChange={cambiarAsignaturaPlan}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione rango</option>
            {rangos.map((rango) => (
              <option key={rango.id} value={rango.id}>
                {rango.descripcion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Sede</label>
          <select
            name="sedes_id"
            value={asignaturaPlan.sedes_id}
            onChange={cambiarAsignaturaPlan}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione sede</option>
            {sedes.map((sede) => (
              <option key={sede.id} value={sede.id}>
                {sede.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setPasoActual(1)}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver
        </button>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
        >
          <Save size={22} />
          Siguiente paso
        </button>
      </div>
    </form>
  );
}
