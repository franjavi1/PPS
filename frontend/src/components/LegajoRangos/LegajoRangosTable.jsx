import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function LegajoRangosTable({
  registrosFiltrados,
  cargando,
  obtenerTextoLegajo,
  obtenerNivelRango,
  obtenerDescripcionRango,
  editarLegajoRangos,
  eliminarLegajoRangos,
}) {
  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            Cargando rangos de legajos...
          </div>
        ) : registrosFiltrados.length > 0 ? (
          registrosFiltrados.map((registro) => (
            <article
              key={registro.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Rango asignado
                  </p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                    {obtenerTextoLegajo(registro.legajo_id)}
                  </h2>
                </div>

                <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-sm font-bold">
                  Nivel {obtenerNivelRango(registro.rangos_institucionales_id)}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 font-bold">Rango</p>
                  <p className="text-slate-800 font-semibold">
                    {obtenerDescripcionRango(registro.rangos_institucionales_id)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => editarLegajoRangos(registro)}
                  className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  onClick={() => eliminarLegajoRangos(registro.id)}
                  className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            No hay rangos asignados a legajos.
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Rango</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Nivel jerarquico</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                  Cargando rangos de legajos...
                </td>
              </tr>
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {obtenerTextoLegajo(registro.legajo_id)}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {obtenerDescripcionRango(registro.rangos_institucionales_id)}
                  </td>
                  <td className="px-5 py-5 text-slate-700 font-bold">
                    {obtenerNivelRango(registro.rangos_institucionales_id)}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => editarLegajoRangos(registro)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                      >
                        <Pencil size={18} />
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarLegajoRangos(registro.id)}
                        className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800"
                      >
                        <Trash2 size={18} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                  No hay rangos asignados a legajos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
