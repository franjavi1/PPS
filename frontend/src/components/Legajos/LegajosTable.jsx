import React from "react";
import { useNavigate } from "react-router";
import { Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { hasPermission } from "../../utils/authHelper";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function LegajosTable({
  legajos,
  legajosFiltrados,
  cargando,
  obtenerNombrePersona,
  obtenerDocumentoPersona,
  legajoTienePersonaActiva,
  editarLegajo,
  eliminarLegajo,
  currentUserRole
}) {
  const navigate = useNavigate();

  const EstadoBadge = ({ estado }) => (
    estado === 1 ? (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">Activo</span>
    ) : (
      <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">Inactivo</span>
    )
  );

  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">Cargando legajos...</div>
        ) : legajosFiltrados.length > 0 ? (
          legajosFiltrados.map((legajo) => (
            <article key={legajo.id} className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Legajo</p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">Nro. {legajo.numero}</h2>
                </div>
                <EstadoBadge estado={legajo.estado} />
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-slate-400 font-bold">Persona</p>
                  <p className="text-slate-800 font-semibold">{obtenerNombrePersona(legajo.persona_id)}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-bold">Documento</p>
                  <p className="text-slate-700">{obtenerDocumentoPersona(legajo.persona_id)}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button onClick={() => navigate(`/legajos/${legajo.id}`)} className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"><Eye size={16} />Ver</button>
                {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                <button onClick={() => editarLegajo(legajo)} disabled={!hasPermission(currentUserRole, "editar")} className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 disabled:opacity-50"><Pencil size={16} />Editar</button>
                {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                <button
                  onClick={() => eliminarLegajo(legajo.id)}
                  // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
                  disabled={legajoTienePersonaActiva(legajo) || !hasPermission(currentUserRole, "eliminar")}
                  title={legajoTienePersonaActiva(legajo) ? "No se puede eliminar un legajo asociado a una persona" : "Eliminar legajo"}
                  className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                ><Trash2 size={16} />Borrar</button>
              </div>
            </article>
          ))
        ) : (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">No se encontraron legajos.</div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Numero</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Persona</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr><td colSpan="5" className="text-center px-5 py-10 text-slate-500">Cargando legajos...</td></tr>
            ) : legajosFiltrados.length > 0 ? (
              legajosFiltrados.map((legajo) => (
                <tr key={legajo.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">{legajo.numero}</td>
                  <td className="px-5 py-5 text-slate-700">{obtenerNombrePersona(legajo.persona_id)}</td>
                  <td className="px-5 py-5 text-slate-700">{obtenerDocumentoPersona(legajo.persona_id)}</td>
                  <td className="px-5 py-5"><EstadoBadge estado={legajo.estado} /></td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button onClick={() => navigate(`/legajos/${legajo.id}`)} className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"><Eye size={18} />Ver</button>
                      {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                      <button onClick={() => editarLegajo(legajo)} disabled={!hasPermission(currentUserRole, "editar")} className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 disabled:opacity-50"><Pencil size={18} />Editar</button>
                      {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                      <button
                        onClick={() => eliminarLegajo(legajo.id)}
                        // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
                        disabled={legajoTienePersonaActiva(legajo) || !hasPermission(currentUserRole, "eliminar")}
                        title={legajoTienePersonaActiva(legajo) ? "No se puede eliminar un legajo asociado a una persona" : "Eliminar legajo"}
                        className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
                      ><Trash2 size={18} />Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center px-5 py-10 text-slate-500">No se encontraron legajos.</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 bg-white">
          <p className="text-slate-500">Mostrando {legajosFiltrados.length} de {legajos.length} legajos</p>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400"><ChevronLeft size={20} /></button>
            <button className="w-10 h-10 bg-red-700 text-white rounded-lg font-bold">1</button>
            <button className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400"><ChevronRight size={20} /></button>
          </div>
        </div>
      </div>
    </>
  );
}
