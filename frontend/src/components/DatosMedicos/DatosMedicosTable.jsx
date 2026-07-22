import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function DatosMedicosTable({
  datosMedicosFiltrados,
  cargando,
  mapas,
  editarDatosMedicos,
  eliminarDatosMedicos,
}) {
  return (
    <>
      {/* VISTA MÓVIL */}
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            Cargando datos medicos...
          </div>
        ) : datosMedicosFiltrados.length > 0 ? (
          datosMedicosFiltrados.map((registro) => (
            <article
              key={registro.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Datos medicos</p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                    {mapas.personas[registro.persona_id] || "Persona no definida"}
                  </h2>
                </div>
                <AptitudBadge aptitud={registro.aptitud_fisica} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 font-bold">Documento</p>
                  <p className="text-slate-700">
                    {mapas.documentos[registro.persona_id] || "No definido"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold">Grupo</p>
                  <p className="text-slate-800 font-bold">{registro.grupo_sanguineo}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold">Alergias</p>
                  <p className="text-slate-700">{registro.alergias || "Sin alergias"}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold">Seguro</p>
                  <p className="text-slate-700">{registro.seguro}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => editarDatosMedicos(registro)}
                  className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Editar
                </button>
                <button
                  onClick={() => eliminarDatosMedicos(registro.id)}
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
            No hay datos medicos cargados.
          </div>
        )}
      </div>

      {/* VISTA ESCRITORIO */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Persona</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Grupo</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Alergias</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Aptitud</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Seguro</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                  Cargando datos medicos...
                </td>
              </tr>
            ) : datosMedicosFiltrados.length > 0 ? (
              datosMedicosFiltrados.map((registro) => (
                <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {mapas.personas[registro.persona_id] || "Persona no definida"}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {mapas.documentos[registro.persona_id] || "No definido"}
                  </td>
                  <td className="px-5 py-5 text-slate-700 font-bold">{registro.grupo_sanguineo}</td>
                  <td className="px-5 py-5 text-slate-700">{registro.alergias || "Sin alergias"}</td>
                  <td className="px-5 py-5">
                    <AptitudBadge aptitud={registro.aptitud_fisica} />
                  </td>
                  <td className="px-5 py-5 text-slate-700">{registro.seguro}</td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => editarDatosMedicos(registro)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                      >
                        <Pencil size={18} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarDatosMedicos(registro.id)}
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
                <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                  No hay datos medicos cargados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function AptitudBadge({ aptitud }) {
  if (aptitud) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Apto
      </span>
    );
  }
  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      No apto
    </span>
  );
}
