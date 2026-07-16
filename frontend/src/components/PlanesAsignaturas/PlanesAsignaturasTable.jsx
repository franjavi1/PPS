import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function PlanesAsignaturasTable({
  registrosFiltrados,
  cargando,
  mapas,
  editarRegistro,
  eliminarRegistro,
}) {
  return (
    <>
      <div className="lg:hidden space-y-4">
        {cargando ? (
          <EstadoVacio texto="Cargando planes asignaturas..." />
        ) : registrosFiltrados.length > 0 ? (
          registrosFiltrados.map((registro) => (
            <article
              key={registro.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Asignatura
                </p>
                <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                  {mapas.asignaturas[registro.asignatura_id] || "-"}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <Dato label="Plan" value={mapas.planes[registro.plan_id]} />
                <Dato label="Sede" value={mapas.sedes[registro.sedes_id]} />
                <Dato label="Rango minimo" value={mapas.rangos[registro.rango_minimo_id]} />
                <Dato label="Modalidad" value={registro.modalidad} />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="eliminar" />
              </div>
            </article>
          ))
        ) : (
          <EstadoVacio texto="No se encontraron planes asignaturas." />
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <Th>Asignatura</Th>
              <Th>Plan</Th>
              <Th>Sede</Th>
              <Th>Rango minimo</Th>
              <Th>Regimen</Th>
              <Th>Modalidad</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>

          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                  Cargando planes asignaturas...
                </td>
              </tr>
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <Td destacado>{mapas.asignaturas[registro.asignatura_id] || "-"}</Td>
                  <Td>{mapas.planes[registro.plan_id] || "-"}</Td>
                  <Td>{mapas.sedes[registro.sedes_id] || "-"}</Td>
                  <Td>{mapas.rangos[registro.rango_minimo_id] || "-"}</Td>
                  <Td>{registro.regimen}</Td>
                  <Td>{registro.modalidad}</Td>
                  <Td>
                    <div className="flex items-center gap-4">
                      <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                      <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="eliminar" />
                    </div>
                  </Td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                  No se encontraron planes asignaturas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
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

function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
      {texto}
    </div>
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
