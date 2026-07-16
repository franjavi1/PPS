import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TiposDocumentosTable({
  tipos,
  cargando,
  editarTipo,
  eliminarTipo,
}) {
  return (
    <div className="overflow-x-auto border border-slate-200 rounded-xl">
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
                Cargando tipos de documento...
              </td>
            </tr>
          ) : tipos.length > 0 ? (
            tipos.map((tipo) => (
              <tr key={tipo.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-5 py-5 text-slate-700 font-semibold">
                  {tipo.descripcion}
                </td>
                <td className="px-5 py-5">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => editarTipo(tipo)}
                      className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                    >
                      <Pencil size={18} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarTipo(tipo.id)}
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
                No hay tipos de documento cargados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
