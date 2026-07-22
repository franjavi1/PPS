import React from "react";
import { useNavigate } from "react-router";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function PlanesTable({
  planesFiltrados,
  cargando,
  tiposPorId,
  editarPlan,
  eliminarPlan,
}) {
  const navigate = useNavigate();

  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
            Cargando planes...
          </div>
        ) : planesFiltrados.length > 0 ? (
          planesFiltrados.map((plan) => (
            <article
              key={plan.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Plan
                  </p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                    {plan.nombre}
                  </h2>
                </div>

                <EstadoBadge estado={plan.estado} />
              </div>

              <div className="space-y-3 text-sm">
                <Dato label="Tipo" value={tiposPorId[plan.tipo_planes_id_tipo_planes]} />
                <Dato label="Resolucion" value={plan.resolucion_ministerial} />
                <Dato label="Vigencia" value={`${formatearFecha(plan.vigencia_dde)} - ${formatearFecha(plan.vigencia_hta)}`} />
              </div>

              {plan.descrip && (
                <p className="text-slate-600 text-sm mt-3">
                  {plan.descrip}
                </p>
              )}

              <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200">
                <button
                  onClick={() => navigate(`/planes/${plan.id}`)}
                  className="h-10 flex items-center justify-center gap-1 text-slate-600 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  <Eye size={16} />
                  Ver
                </button>

                <button
                  onClick={() => editarPlan(plan)}
                  className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                >
                  <Pencil size={16} />
                  Editar
                </button>

                <button
                  onClick={() => eliminarPlan(plan.id)}
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
            No se encontraron planes.
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Tipo</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Resolucion</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Vigencia</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                  Cargando planes...
                </td>
              </tr>
            ) : planesFiltrados.length > 0 ? (
              planesFiltrados.map((plan) => (
                <tr key={plan.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-5 text-slate-700 font-semibold">
                    {plan.nombre}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {tiposPorId[plan.tipo_planes_id_tipo_planes] || "-"}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {plan.resolucion_ministerial}
                  </td>
                  <td className="px-5 py-5 text-slate-700">
                    {formatearFecha(plan.vigencia_dde)} - {formatearFecha(plan.vigencia_hta)}
                  </td>
                  <td className="px-5 py-5">
                    <EstadoBadge estado={plan.estado} />
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => navigate(`/planes/${plan.id}`)}
                        className="flex items-center gap-1 text-slate-600 font-semibold hover:text-slate-800"
                      >
                        <Eye size={18} />
                        Ver
                      </button>

                      <button
                        onClick={() => editarPlan(plan)}
                        className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                      >
                        <Pencil size={18} />
                        Editar
                      </button>

                      <button
                        onClick={() => eliminarPlan(plan.id)}
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
                  No se encontraron planes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

function EstadoBadge({ estado }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${
        estado === 1 || estado === true
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      {estado === 1 || estado === true ? "Activo" : "Inactivo"}
    </span>
  );
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "-";
  }
  return String(fecha).slice(0, 10);
}
