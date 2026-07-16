import React from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function AutoridadesComisionTable({
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
          <EstadoVacio texto="Cargando autoridades de comision..." />
        ) : registrosFiltrados.length > 0 ? (
          registrosFiltrados.map((registro) => (
            <article
              key={registro.id}
              className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
            >
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase">Autoridad</p>
                <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                  {mapas.tiposAutoridad[registro.tipo_autoridad_id] || "-"}
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <Dato label="Legajo" value={mapas.legajos[registro.legajo_id]} />
                <Dato label="Comision" value={mapas.comisiones[registro.comision_id]} />
              </div>

              <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="eliminar" />
              </div>
            </article>
          ))
        ) : (
          <EstadoVacio texto="No se encontraron autoridades de comision." />
        )}
      </div>

      {/* VISTA ESCRITORIO */}
      <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <Th>Tipo autoridad</Th>
              <Th>Legajo</Th>
              <Th>Comision asignatura</Th>
              <Th>Acciones</Th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                  Cargando autoridades de comision...
                </td>
              </tr>
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <tr
                  key={registro.id}
                  className="border-b border-slate-200 hover:bg-slate-50"
                >
                  <Td destacado>{mapas.tiposAutoridad[registro.tipo_autoridad_id] || "-"}</Td>
                  <Td>{mapas.legajos[registro.legajo_id] || "-"}</Td>
                  <Td>{mapas.comisiones[registro.comision_id] || "-"}</Td>
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
                <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                  No se encontraron autoridades de comision.
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
        esEditar ? "text-blue-600 hover:text-blue-800" : "text-red-600 hover:text-red-800"
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
