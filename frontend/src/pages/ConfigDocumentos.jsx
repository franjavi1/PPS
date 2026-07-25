import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { FileText, Shield, Building2, Users, Layout, ChevronDown, ChevronRight, Settings } from "lucide-react";
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
import TipoLegajoPanel from "../components/ConfigDocumentos/TipoLegajoPanel";

export default function ConfigDocumentos() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Parámetro de solapa activa recibido de la URL
  const tabParam = searchParams.get("tab") || "tipo_documento";

  // Control de estado para la sección seleccionada
  const [pestanaActiva, setPestanaActiva] = useState("tipo_documento");

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

  // Sincroniza la pestaña activa si cambia el tabParam de la URL
  useEffect(() => {
    if (tabParam) {
      setPestanaActiva(tabParam);
    }
  }, [tabParam]);

  // Mapa de títulos dinámicos según el parámetro seleccionado
  const titulos = {
    tipo_documento: { titulo: "Tipos de Documento", subtitulo: "Administra los tipos de documentos de identidad que se usan al registrar personas." },
    rango_institucional: { titulo: "Rangos Jerárquicos", subtitulo: "Gestión de rangos y jerarquías institucionales del cuerpo de bomberos." },
    tipo_legajo: { titulo: "Tipos de Legajo", subtitulo: "Administra las tipologías de legajo de bomberos en el sistema." },
    tipo_sede: { titulo: "Tipos de Sedes", subtitulo: "Consulta y gestiona las categorías de sedes institucionales." },
    sedes: { titulo: "Sedes", subtitulo: "Administración de sedes y locaciones del sistema." },
    aulas: { titulo: "Aulas", subtitulo: "Gestión de aulas físicas asignadas para dictar clases." },
    comisiones: { titulo: "Comisiones", subtitulo: "Configuración de comisiones y divisiones del ciclo lectivo." },
    persona: { titulo: "Personas", subtitulo: "Catálogo y administración de personas y legajos registrados." }
  };

  const activeHeader = titulos[pestanaActiva] || { titulo: "Parámetros y Catálogos", subtitulo: "Mantenimiento del catálogo base del sistema." };

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{activeHeader.titulo}</h1>
          <p className="text-slate-500 mt-2 text-base md:text-lg">{activeHeader.subtitulo}</p>
        </section>

        <div className="space-y-6">
          {pestanaActiva === "tipo_documento" && <TipoDocumentoPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "persona" && <PersonasPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "rango_institucional" && <RangoPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "tipo_legajo" && <TipoLegajoPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "tipo_sede" && <TiposSedesPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "sedes" && <SedesPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "aulas" && <AulasPanel currentUserRole={currentUserRole} />}
          {pestanaActiva === "comisiones" && <ComisionesPanel currentUserRole={currentUserRole} />}
        </div>
      </main>
    </div>
  );
}
