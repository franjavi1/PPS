import { Pencil, Trash2 } from "lucide-react";
import { hasPermission } from "../../utils/authHelper";

export function EstadoBadge({ estado }) {
  if (estado === 1 || estado === undefined) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Activa
      </span>
    );
  }
  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      Inactiva
    </span>
  );
}

export default function AsignaturaList({
  cargando,
  asignaturasFiltradas,
  currentUserRole,
  editarAsignatura,
  eliminarAsignatura,
  asignaturaEstaEnPlan,
}) {
  if (cargando) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white p-8 text-center text-slate-500 font-semibold">
        Cargando asignaturas...
      </div>
    );
  }

  if (asignaturasFiltradas.length === 0) {
    return (
      <div className="border border-slate-200 rounded-xl bg-white p-8 text-center text-slate-500 font-semibold">
        No se encontraron asignaturas.
      </div>
    );
  }

  return (
    <>
      {/* Vista Móvil */}
      <div className="lg:hidden space-y-4">
        {asignaturasFiltradas.map((asignatura) => (
          <article
            key={asignatura.id}
            className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Asignatura
                </p>
                <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                  {asignatura.nombre}
                </h2>
              </div>
              <EstadoBadge estado={asignatura.estado} />
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-slate-400 font-bold">Formato</p>
                <p className="text-slate-800 font-semibold">{asignatura.formato}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
              <button
                onClick={() => editarAsignatura(asignatura)}
                disabled={!hasPermission(currentUserRole, "editar")}
                className={`h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 ${
                  hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"
                }`}
              >
                <Pencil size={16} />
                Editar
              </button>

              <button
                onClick={() => eliminarAsignatura(asignatura.id)}
                disabled={!hasPermission(currentUserRole, "eliminar") || asignaturaEstaEnPlan(asignatura.id)}
                className={`h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50 ${
                  hasPermission(currentUserRole, "eliminar") && !asignaturaEstaEnPlan(asignatura.id)
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
                title={asignaturaEstaEnPlan(asignatura.id) ? "No se puede eliminar: está asociada a un plan activo" : "Eliminar"}
              >
                <Trash2 size={16} />
                Eliminar
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Vista Escritorio */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse bg-white">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-6 py-4 text-slate-700 font-bold">Asignatura</th>
              <th className="px-6 py-4 text-slate-700 font-bold">Formato</th>
              <th className="px-6 py-4 text-slate-700 font-bold">Estado</th>
              <th className="px-6 py-4 text-slate-700 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {asignaturasFiltradas.map((asignatura) => (
              <tr
                key={asignatura.id}
                className="border-b border-slate-200 hover:bg-slate-50 transition"
              >
                <td className="px-6 py-4 font-bold text-slate-800">{asignatura.nombre}</td>
                <td className="px-6 py-4 font-semibold text-slate-600">{asignatura.formato}</td>
                <td className="px-6 py-4">
                  <EstadoBadge estado={asignatura.estado} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => editarAsignatura(asignatura)}
                      disabled={!hasPermission(currentUserRole, "editar")}
                      className={`flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-800 ${
                        hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"
                      }`}
                    >
                      <Pencil size={18} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarAsignatura(asignatura.id)}
                      disabled={!hasPermission(currentUserRole, "eliminar") || asignaturaEstaEnPlan(asignatura.id)}
                      className={`flex items-center gap-1 font-semibold text-red-600 hover:text-red-800 ${
                        hasPermission(currentUserRole, "eliminar") && !asignaturaEstaEnPlan(asignatura.id)
                          ? ""
                          : "opacity-50 cursor-not-allowed"
                      }`}
                      title={asignaturaEstaEnPlan(asignatura.id) ? "No se puede eliminar: está asociada a un plan activo" : "Eliminar"}
                    >
                      <Trash2 size={18} />
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
