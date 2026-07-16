import React from "react";
import { GitBranch, PlusCircle, Trash2, Save } from "lucide-react";

export default function PasoCorrelativas({
  nuevaCorrelativa,
  asignaturasCargadas,
  correlativasCargadas,
  guardando,
  cambiarCorrelativa,
  guardarCorrelativa,
  eliminarCorrelativa,
  setPasoActual,
}) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <GitBranch size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Materias Correlativas</h2>
      </div>

      <form onSubmit={guardarCorrelativa} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Asignatura que requiere correlativa</label>
          <select
            name="pa_id"
            value={nuevaCorrelativa.pa_id}
            onChange={cambiarCorrelativa}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione materia</option>
            {asignaturasCargadas.map((item) => (
              <option key={item.id} value={item.id}>
                {item.asignatura}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Asignatura requerida</label>
          <select
            name="asignatura_id"
            value={nuevaCorrelativa.asignatura_id}
            onChange={cambiarCorrelativa}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione materia</option>
            {asignaturasCargadas.map((item) => (
              <option key={item.id} value={item.asignatura_id}>
                {item.asignatura}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
          >
            <PlusCircle size={22} />
            Agregar correlativa
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-800">Correlativas Cargadas</h3>
        {correlativasCargadas.length === 0 ? (
          <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">
            No se cargaron correlativas aún. Podés finalizar sin correlativas.
          </div>
        ) : (
          correlativasCargadas.map((item) => (
            <div key={item.id} className="flex items-center justify-between border border-slate-200 rounded-xl bg-slate-50 p-4 shadow-sm">
              <div>
                <p className="text-slate-800 font-extrabold">{item.asignaturaQueRequiere}</p>
                <p className="text-slate-500 font-semibold mt-1">
                  Requiere regularizar/aprobar: {item.asignaturaRequerida}
                </p>
              </div>
              <button
                type="button"
                onClick={() => eliminarCorrelativa(item.id)}
                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setPasoActual(3)}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver
        </button>
        <button
          type="button"
          onClick={() => setPasoActual(5)}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
        >
          <Save size={22} />
          Ver Resumen
        </button>
      </div>
    </section>
  );
}
