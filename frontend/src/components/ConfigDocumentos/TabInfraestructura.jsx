import React, { useState } from "react";
import { Building2 } from "lucide-react";
import TabTiposSedes from "./TabTiposSedes";
import TabSedes from "./TabSedes";
import TabAulas from "./TabAulas";
import TabComisiones from "./TabComisiones";

export default function TabInfraestructura({
  sedes,
  tiposSedes,
  aulas,
  comisiones,
  asignaturas,
  onRefreshSedes,
  onRefreshTiposSedes,
  onRefreshAulas,
  onRefreshComisiones,
}) {
  const [subPestanaActiva, setSubPestanaActiva] = useState("sedes");

  return (
    <>
      <div className="lg:col-span-3 mb-2 bg-white border border-slate-200 p-2.5 rounded-2xl shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubPestanaActiva("tipos_sedes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
              subPestanaActiva === "tipos_sedes"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={18} />
            Tipos de Sede
          </button>
          <button
            onClick={() => setSubPestanaActiva("sedes")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
              subPestanaActiva === "sedes"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={18} />
            Sedes
          </button>
          <button
            onClick={() => setSubPestanaActiva("aulas")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
              subPestanaActiva === "aulas"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={18} />
            Aulas
          </button>
          <button
            onClick={() => setSubPestanaActiva("comisiones")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all text-sm ${
              subPestanaActiva === "comisiones"
                ? "bg-red-700 text-white shadow"
                : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={18} />
            Comisiones
          </button>
        </div>
      </div>

      {subPestanaActiva === "tipos_sedes" && (
        <TabTiposSedes
          tiposSedes={tiposSedes}
          sedes={sedes}
          onRefresh={onRefreshTiposSedes}
        />
      )}

      {subPestanaActiva === "sedes" && (
        <TabSedes
          sedes={sedes}
          tiposSedes={tiposSedes}
          aulas={aulas}
          onRefresh={onRefreshSedes}
        />
      )}

      {subPestanaActiva === "aulas" && (
        <TabAulas
          aulas={aulas}
          sedes={sedes}
          comisiones={comisiones}
          onRefresh={onRefreshAulas}
        />
      )}

      {subPestanaActiva === "comisiones" && (
        <TabComisiones
          comisiones={comisiones}
          asignaturas={asignaturas}
          aulas={aulas}
          onRefresh={onRefreshComisiones}
        />
      )}
    </>
  );
}
