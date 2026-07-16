import React from "react";
import { useNavigate } from "react-router";
import { Pencil, Trash2 } from "lucide-react";

export default function PersonasTable({
  personasFiltradas,
  cargando,
  obtenerNombreTipoDocumento,
  eliminarPersona,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            Cargando personas...
          </div>
        ) : personasFiltradas.length > 0 ? (
          personasFiltradas.map((persona) => (
            <article
              key={persona.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Persona
                  </p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                    {persona.apellido}, {persona.nombre}
                  </h2>
                </div>

                <EstadoBadge estado={persona.estado} />
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 font-bold">Tipo doc.</p>
                  <p className="text-slate-800 font-semibold">
                    {obtenerNombreTipoDocumento(persona.td_id)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 font-bold">Documento</p>
                  <p className="text-slate-700">
                    {persona.numero_doc}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => navigate(`/personas/${persona.id}/editar`)}
                  className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  onClick={() => eliminarPersona(persona.id)}
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
            No hay personas cargadas.
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Apellido</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Tipo doc.</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                  Cargando personas...
                </td>
              </tr>
            ) : personasFiltradas.length > 0 ? (
              personasFiltradas.map((persona) => (
                <tr key={persona.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {persona.apellido}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {persona.nombre}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {obtenerNombreTipoDocumento(persona.td_id)}
                  </td>
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {persona.numero_doc}
                  </td>
                  <td className="px-5 py-5">
                    <EstadoBadge estado={persona.estado} />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/personas/${persona.id}/editar`)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                      >
                        <Pencil size={18} />
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarPersona(persona.id)}
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
                  No hay personas cargadas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function EstadoBadge({ estado }) {
  if (estado === 1) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Activo
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      Inactivo
    </span>
  );
}
