import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FileText, Shield, Building2, Users, Layout } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { estaAutenticado } from "../utils/auth";
import { hasPermission } from "../utils/authHelper";

import TipoDocumentoPanel from "../components/ConfigDocumentos/TipoDocumentoPanel";
import PersonasPanel from "../components/ConfigDocumentos/PersonasPanel";
import RangoPanel from "../components/ConfigDocumentos/RangoPanel";
import TiposSedesPanel from "../components/ConfigDocumentos/TiposSedesPanel";
import SedesPanel from "../components/ConfigDocumentos/SedesPanel";
import AulasPanel from "../components/ConfigDocumentos/AulasPanel";
import ComisionesPanel from "../components/ConfigDocumentos/ComisionesPanel";

export default function ConfigDocumentos() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") || "tipo_documento";

  const [pestanaActiva, setPestanaActiva] = useState("tipo_documento");
  const [subPestanaActiva, setSubPestanaActiva] = useState("sedes");

  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
      return;
    }
    if (!hasPermission(currentUserRole, "leer")) {
      navigate("/inicio");
      return;
    }
  }, [currentUserRole, navigate]);

  useEffect(() => {
    if (tabParam) {
      setPestanaActiva(tabParam);
    }
  }, [tabParam]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">
            Parámetros y Catálogos
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            Gestión y mantenimiento del catálogo de base del sistema (Tipos de documento, personas, rangos jerárquicos e infraestructura).
          </p>
        </section>

        {/* Tabs navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 mb-8 bg-white p-2 rounded-xl shadow-sm">
          <button
            onClick={() => setPestanaActiva("tipo_documento")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "tipo_documento" ? "bg-red-700 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <FileText size={20} />
            Tipos de Documento
          </button>
          <button
            onClick={() => setPestanaActiva("persona")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "persona" ? "bg-red-700 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Users size={20} />
            Personas
          </button>
          <button
            onClick={() => setPestanaActiva("rango_institucional")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "rango_institucional" ? "bg-red-700 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Shield size={20} />
            Rangos Jerárquicos
          </button>
          <button
            onClick={() => setPestanaActiva("infraestructura")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
              pestanaActiva === "infraestructura" ? "bg-red-700 text-white shadow" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Building2 size={20} />
            Infraestructura
          </button>
        </div>

        {/* Tab panels content */}
        <section className="grid grid-cols-1 gap-8">
          {pestanaActiva === "tipo_documento" && <TipoDocumentoPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "persona" && <PersonasPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "rango_institucional" && <RangoPanel currentUserRole={currentUserRole} />}

          {pestanaActiva === "infraestructura" && (
            <div className="space-y-6">
              {/* Sub-tabs Infrastructure */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-white p-2 rounded-xl shadow-sm">
                {[
                  { id: "tipos_sedes", label: "Tipos de Sedes", icon: Layout },
                  { id: "sedes", label: "Sedes", icon: Building2 },
                  { id: "aulas", label: "Aulas", icon: Shield },
                  { id: "comisiones", label: "Comisiones", icon: Users },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setSubPestanaActiva(id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                      subPestanaActiva === id ? "bg-slate-800 text-white shadow" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
              <div>
                {subPestanaActiva === "tipos_sedes" && <TiposSedesPanel currentUserRole={currentUserRole} />}
                {subPestanaActiva === "sedes" && <SedesPanel currentUserRole={currentUserRole} />}
                {subPestanaActiva === "aulas" && <AulasPanel currentUserRole={currentUserRole} />}
                {subPestanaActiva === "comisiones" && <ComisionesPanel currentUserRole={currentUserRole} />}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
