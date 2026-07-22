import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function ComisionAsignaturaTable({
  registrosFiltrados,
  cargando,
  mapas,
  editarRegistro,
  eliminarRegistro,
}) {
  return (
    <>
      {/* VISTA MÓVIL */}
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <EstadoVacio texto="Cargando comisiones asignaturas..." />
        ) : registrosFiltrados.length > 0 ? (
          registrosFiltrados.map((registro) => (
            <article
              key={registro.id_comision_asignatura}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Comision asignatura
                  </p>
                  <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                    {registro.nombre}
                  </h2>
                </div>
                <EstadoBadge estado={registro.estado} />
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Dato label="Comision" value={mapas.comisiones[registro.comision_id]} />
                <Dato label="Aula" value={mapas.aulas[registro.aula_id]} />
                <Dato label="Modalidad" value={registro.modalidad} />
                <Dato label="Cupo" value={registro.cupo_maximo} />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                <BotonAccion onClick={() => eliminarRegistro(registro.id_comision_asignatura)} tipo="eliminar" />
              </div>
            </article>
          ))
        ) : (
          <EstadoVacio texto="No se encontraron comisiones asignaturas." />
        )}
      </div>

      {/* VISTA ESCRITORIO */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <Th>Nombre</Th>
              <Th>Comision</Th>
              <Th>Plan asignatura</Th>
              <Th>Aula</Th>
              <Th>Modalidad</Th>
              <Th>Cupo</Th>
              <Th>Estado</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="8" className="text-center px-5 py-10 text-slate-500">
                  Cargando comisiones asignaturas...
                </td>
              </tr>
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <tr
                  key={registro.id_comision_asignatura}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <Td destacado>{registro.nombre}</Td>
                  <Td>{mapas.comisiones[registro.comision_id] || "-"}</Td>
                  <Td>{mapas.planesAsignaturas[registro.plan_asignaturas_id] || "-"}</Td>
                  <Td>{mapas.aulas[registro.aula_id] || "-"}</Td>
                  <Td>{registro.modalidad}</Td>
                  <Td>{registro.cupo_maximo}</Td>
                  <Td><EstadoBadge estado={registro.estado} /></Td>
                  <Td>
                    <div className="flex items-center gap-4">
                      <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                      <BotonAccion onClick={() => eliminarRegistro(registro.id_comision_asignatura)} tipo="eliminar" />
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center px-5 py-10 text-slate-500">
                  No se encontraron comisiones asignaturas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Th({ children }) {
  return <th className="px-5 py-4 text-slate-700 font-bold">{children}</th>;
}

function Td({ children, destacado }) {
  return (
    <td className={`px-5 py-5 text-slate-700 ${destacado ? "font-semibold" : ""}`}>
      {children}
    </td>
  );
}

function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
      {texto}
    </div>
  );
}

function BotonAccion({ onClick, tipo }) {
  const esEditar = tipo === "editar";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 font-semibold ${
        esEditar
          ? "text-blue-600 hover:text-blue-800"
          : "text-red-600 hover:text-red-800"
      }`}
    >
      {esEditar ? <Pencil size={18} /> : <Trash2 size={18} />}
      {esEditar ? "Editar" : "Eliminar"}
    </button>
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
  const activo = String(estado || "").toLowerCase() === "activo";

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${
        activo
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
}
