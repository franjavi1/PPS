import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TipoRangosTable({
  rangosFiltrados,
  cargando,
  editarRango,
  eliminarRango,
}) {
  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <EstadoVacio texto="Cargando tipos de rango..." />
        ) : rangosFiltrados.length > 0 ? (
          rangosFiltrados.map((rango) => (
            <TarjetaRango
              key={rango.id}
              rango={rango}
              onEdit={editarRango}
              onDelete={eliminarRango}
            />
          ))
        ) : (
          <EstadoVacio texto="No se encontraron tipos de rango." />
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Descripcion</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Nivel</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="3" className="px-5 py-8 text-center text-slate-500">
                  Cargando tipos de rango...
                </td>
              </tr>
            ) : rangosFiltrados.length > 0 ? (
              rangosFiltrados.map((rango) => (
                <tr key={rango.id} className="border-b border-slate-200 last:border-b-0">
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {rango.descripcion}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    Nivel {rango.nivel_jerarquia}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editarRango(rango)}
                        className="h-10 px-3 flex items-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarRango(rango.id)}
                        className="h-10 px-3 flex items-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-5 py-8 text-center text-slate-500">
                  No se encontraron tipos de rango.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function TarjetaRango({ rango, onEdit, onDelete }) {
  return (
    <article className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm">
      <p className="text-xs font-bold text-slate-400 uppercase">Tipo de rango</p>
      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
        {rango.descripcion}
      </h2>
      <p className="text-slate-500 font-semibold mt-1">
        Nivel {rango.nivel_jerarquia}
      </p>

      <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => onEdit(rango)}
          className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
        >
          <Pencil size={16} />
          Editar
        </button>

        <button
          type="button"
          onClick={() => onDelete(rango.id)}
          className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
        >
          <Trash2 size={16} />
          Eliminar
        </button>
      </div>
    </article>
  );
}

function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
      {texto}
    </div>
  );
}
