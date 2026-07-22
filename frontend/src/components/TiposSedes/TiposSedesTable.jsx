import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TiposSedesTable({
  tiposSedesFiltrados,
  cargando,
  editarTipoSede,
  eliminarTipoSede,
}) {
  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            Cargando tipos de sede...
          </div>
        ) : tiposSedesFiltrados.length > 0 ? (
          tiposSedesFiltrados.map((tipoSede) => (
            <article
              key={tipoSede.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Tipo de sede
                </p>
                <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                  {tipoSede.descripcion}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => editarTipoSede(tipoSede)}
                  className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  onClick={() => eliminarTipoSede(tipoSede.id)}
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
            No se encontraron tipos de sede.
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Descripcion</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="2" className="text-center px-5 py-10 text-slate-500">
                  Cargando tipos de sede...
                </td>
              </tr>
            ) : tiposSedesFiltrados.length > 0 ? (
              tiposSedesFiltrados.map((tipoSede) => (
                <tr key={tipoSede.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {tipoSede.descripcion}
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => editarTipoSede(tipoSede)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                      >
                        <Pencil size={18} />
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarTipoSede(tipoSede.id)}
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
                <td colSpan="2" className="text-center px-5 py-10 text-slate-500">
                  No se encontraron tipos de sede.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
