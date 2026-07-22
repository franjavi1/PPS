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

export default function ConfigDocumentos() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Parámetro de solapa activa recibido de la URL
  const tabParam = searchParams.get("tab") || "tipo_documento";

  // Control de estado para la sección seleccionada y visibilidad de secciones en Sidebar
  const [pestanaActiva, setPestanaActiva] = useState("tipo_documento");
  const [expandidos, setExpandidos] = useState({
    general: true,
    infraestructura: true,
    personal: true,
  });

  // Control para desplegar el selector de parámetros en móvil
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

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

  const cambiarPestana = (id) => {
    setPestanaActiva(id);
    setSearchParams({ tab: id });
    setMenuMovilAbierto(false);
  };

  const toggleSeccion = (sec) => {
    setExpandidos((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Configuración del mapa de navegación de la Sidebar interna
  const estructuraMenu = [
    {
      id: "general",
      titulo: "Configuración General",
      icon: Settings,
      items: [
        { id: "tipo_documento", label: "Tipos de Documento", icon: FileText },
        { id: "rango_institucional", label: "Rangos Jerárquicos", icon: Shield },
      ],
    },
    {
      id: "infraestructura",
      titulo: "Infraestructura",
      icon: Building2,
      items: [
        { id: "tipo_sede", label: "Tipos de Sedes", icon: Layout },
        { id: "sedes", label: "Sedes", icon: Building2 },
        { id: "aulas", label: "Aulas", icon: Shield },
        { id: "comisiones", label: "Comisiones", icon: Users },
      ],
    },
    {
      id: "personal",
      titulo: "Personal",
      icon: Users,
      items: [
        { id: "persona", label: "Personas", icon: Users },
      ],
    },
  ];

  // Busca el ícono y el título del parámetro activo para mostrarlo en cabeceras móviles
  const obtenerItemActivo = () => {
    for (const sec of estructuraMenu) {
      const item = sec.items.find((i) => i.id === pestanaActiva);
      if (item) return item;
    }
    return { label: "Seleccione parámetro", icon: Settings };
  };

  const itemActivo = obtenerItemActivo();
  const IconoActivo = itemActivo.icon;

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-800">Parámetros y Catálogos</h1>
          <p className="text-slate-500 mt-2 text-lg">Mantenimiento del catálogo base del sistema.</p>
        </section>

        {/* Selector responsivo tipo Acordeón para dispositivos móviles */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMenuMovilAbierto(!menuMovilAbierto)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 shadow-sm transition"
            type="button"
          >
            <div className="flex items-center gap-2.5">
              <IconoActivo size={20} className="text-red-700" />
              <span>{itemActivo.label}</span>
            </div>
            <ChevronDown size={18} className={`transform transition-transform ${menuMovilAbierto ? "rotate-180" : ""}`} />
          </button>

          {menuMovilAbierto && (
            <div className="mt-2 bg-white border border-slate-200 rounded-xl p-3 shadow-lg flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-150">
              {estructuraMenu.map((seccion) => (
                <div key={seccion.id} className="space-y-1">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50 rounded-md">
                    {seccion.titulo}
                  </div>
                  {seccion.items.map((subitem) => (
                    <button
                      key={subitem.id}
                      onClick={() => cambiarPestana(subitem.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                        pestanaActiva === subitem.id ? "bg-red-50 text-red-700 font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                      type="button"
                    >
                      <subitem.icon size={16} className={pestanaActiva === subitem.id ? "text-red-700" : "text-slate-400"} />
                      <span>{subitem.label}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Grid principal del Layout dividido */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar lateral minimalista para pantallas grandes (lg) */}
          <aside className="hidden lg:block lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs sticky top-24 self-start">
            <nav className="space-y-6">
              {estructuraMenu.map((seccion) => (
                <div key={seccion.id} className="space-y-2">
                  <button
                    onClick={() => toggleSeccion(seccion.id)}
                    className="w-full flex items-center justify-between text-left text-xs font-extrabold text-slate-400 hover:text-slate-600 uppercase tracking-wider select-none focus:outline-none"
                    type="button"
                  >
                    <span>{seccion.titulo}</span>
                    {expandidos[seccion.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  {expandidos[seccion.id] && (
                    <div className="flex flex-col gap-1 pl-1.5 border-l border-slate-100 animate-in fade-in duration-200">
                      {seccion.items.map((subitem) => (
                        <button
                          key={subitem.id}
                          onClick={() => cambiarPestana(subitem.id)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left ${
                            pestanaActiva === subitem.id
                              ? "bg-red-50 text-red-700 font-bold shadow-2xs"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                          }`}
                          type="button"
                        >
                          <subitem.icon size={16} className={pestanaActiva === subitem.id ? "text-red-700" : "text-slate-400"} />
                          <span>{subitem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </aside>

          {/* Panel de Contenido Dinámico a la derecha */}
          <section className="lg:col-span-3 space-y-6">
            {pestanaActiva === "tipo_documento" && <TipoDocumentoPanel currentUserRole={currentUserRole} />}
            {pestanaActiva === "persona" && <PersonasPanel currentUserRole={currentUserRole} />}
            {pestanaActiva === "rango_institucional" && <RangoPanel currentUserRole={currentUserRole} />}
            {pestanaActiva === "tipo_sede" && <TiposSedesPanel currentUserRole={currentUserRole} />}
            {pestanaActiva === "sedes" && <SedesPanel currentUserRole={currentUserRole} />}
            {pestanaActiva === "aulas" && <AulasPanel currentUserRole={currentUserRole} />}
            {pestanaActiva === "comisiones" && <ComisionesPanel currentUserRole={currentUserRole} />}
          </section>
        </div>
      </main>
    </div>
  );
}
