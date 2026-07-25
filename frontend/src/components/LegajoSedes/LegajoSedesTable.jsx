import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function LegajoSedesTable({
  registrosFiltrados,
  cargando,
  obtenerTextoLegajo,
  obtenerNombreSede,
  obtenerDireccionSede,
  editarLegajoSedes,
  eliminarLegajoSedes,
}) {
  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            Cargando legajos por sede...
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
                    Asociacion
                  </p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                    {obtenerTextoLegajo(registro.legajo_id)}
                  </h2>
                </div>

                <EstadoBadge
                  activo={registro.es_sede_base}
                  textoActivo="Base"
                  textoInactivo="No base"
                />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 font-bold">Sede</p>
                  <p className="text-slate-800 font-semibold">
                    {obtenerNombreSede(registro.sede_id)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold">Direccion</p>
                  <p className="text-slate-700">
                    {obtenerDireccionSede(registro.sede_id)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold">Autoridad</p>
                  <EstadoBadge
                    activo={registro.es_autoridad}
                    textoActivo="Si"
                    textoInactivo="No"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => editarLegajoSedes(registro)}
                  className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  onClick={() => eliminarLegajoSedes(registro.id)}
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
            No hay sedes asignadas a legajos.
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Sede</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Direccion</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Autoridad</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Base</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                  Cargando legajos por sede...
                </td>
              </tr>
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {obtenerTextoLegajo(registro.legajo_id)}
                  </td>
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {obtenerNombreSede(registro.sede_id)}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {obtenerDireccionSede(registro.sede_id)}
                  </td>
                  <td className="px-5 py-5">
                    <EstadoBadge activo={registro.es_autoridad} textoActivo="Si" textoInactivo="No" />
                  </td>
                  <td className="px-5 py-5">
                    <EstadoBadge activo={registro.es_sede_base} textoActivo="Base" textoInactivo="No" />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => editarLegajoSedes(registro)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                      >
                        <Pencil size={18} />
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarLegajoSedes(registro.id)}
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
                <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                  No hay sedes asignadas a legajos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EstadoBadge({ activo, textoActivo, textoInactivo }) {
  if (activo) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        {textoActivo}
      </span>
    );
  }

  return (
    <span className="bg-slate-100 text-slate-600 border border-slate-300 px-3 py-1 rounded-md text-sm font-bold">
      {textoInactivo}
    </span>
  );
}
