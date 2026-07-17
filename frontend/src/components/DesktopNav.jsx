import React from "react";
import { Settings, ChevronDown, Users, GraduationCap, BookOpen, LogOut, FileText, UserPlus, FilePlus, CalendarPlus, BookPlus } from "lucide-react";
import { hasPermission } from "../utils/authHelper";

// Renderizamos la botonera de navegación para pantallas grandes (Desktop).
export default function DesktopNav({
  currentUserRole,
  dropdownAbierto,
  toggleDropdown,
  navigate,
  setDropdownAbierto,
  handleCerrarSesion
}) {
  const navItemClass = "flex items-center gap-1.5 text-sm font-bold text-red-100 hover:text-white transition-all cursor-pointer px-3.5 py-2.5 rounded-xl hover:bg-red-800/80 focus:outline-none select-none";
  const dropdownMenuClass = "absolute left-0 mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl py-3 border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200";
  const dropdownItemClass = "flex items-center gap-3 w-full px-5 py-2.5 text-sm font-semibold hover:bg-slate-50 text-slate-700 hover:text-red-700 transition-colors text-left cursor-pointer";

  return (
    <nav className="hidden md:flex items-center gap-4 relative z-50">
      {/* Botón directo a Configuración / Catálogos */}
      {hasPermission(currentUserRole, 'leer') && (
        <button
          onClick={() => {
            navigate("/config-documentos");
            setDropdownAbierto(null);
          }}
          className={`${navItemClass} ${dropdownAbierto === "general" ? "bg-red-800" : ""}`}
          type="button"
        >
          <Settings size={16} />
          <span>Configuración / Catálogos</span>
        </button>
      )}

      {/* Dropdown: Personas */}
      <div className="relative">
        <button
          onClick={() => toggleDropdown("personas")}
          className={`${navItemClass} ${dropdownAbierto === "personas" ? "bg-red-800" : ""}`}
          type="button"
        >
          <Users size={16} />
          <span>Personas</span>
          <ChevronDown size={14} className={`transform transition-transform duration-200 ${dropdownAbierto === "personas" ? "rotate-180" : ""}`} />
        </button>

        {dropdownAbierto === "personas" && (
          <div className={dropdownMenuClass}>
            <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Administración de Personal</div>
            <button
              type="button"
              onClick={() => {
                navigate("/legajos");
                setDropdownAbierto(null);
              }}
              className={dropdownItemClass}
            >
              <FolderOpenIconWrapper />
              <span>Personas (Legajos)</span>
            </button>
            {hasPermission(currentUserRole, 'crear') && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/config-documentos?tab=persona&action=nuevo");
                    setDropdownAbierto(null);
                  }}
                  className={dropdownItemClass}
                >
                  <UserPlus size={16} className="text-slate-400" />
                  <span>Registrar Persona</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/crearLegajo");
                    setDropdownAbierto(null);
                  }}
                  className={dropdownItemClass}
                >
                  <FilePlus size={16} className="text-slate-400" />
                  <span>Nuevo Legajo</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Dropdown: Planes */}
      {hasPermission(currentUserRole, 'leer') && (
        <div className="relative">
          <button
            onClick={() => toggleDropdown("planes")}
            className={`${navItemClass} ${dropdownAbierto === "planes" ? "bg-red-800" : ""}`}
            type="button"
          >
            <GraduationCap size={16} />
            <span>Planes</span>
            <ChevronDown size={14} className={`transform transition-transform duration-200 ${dropdownAbierto === "planes" ? "rotate-180" : ""}`} />
          </button>

          {dropdownAbierto === "planes" && (
            <div className={dropdownMenuClass}>
              <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gestión Académica</div>
              <button
                type="button"
                onClick={() => {
                  navigate("/planes");
                  setDropdownAbierto(null);
                }}
                className={dropdownItemClass}
              >
                <FileText size={16} className="text-slate-400" />
                <span>Planes de Estudio</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate("/asignaturas");
                  setDropdownAbierto(null);
                }}
                className={dropdownItemClass}
              >
                <BookOpen size={16} className="text-slate-400" />
                <span>Asignaturas</span>
              </button>
              {hasPermission(currentUserRole, 'crear') && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/planes/alta");
                      setDropdownAbierto(null);
                    }}
                    className={dropdownItemClass}
                  >
                    <CalendarPlus size={16} className="text-slate-400" />
                    <span>Nuevo Plan de Estudio</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/asignaturas?action=nuevo");
                      setDropdownAbierto(null);
                    }}
                    className={dropdownItemClass}
                  >
                    <BookPlus size={16} className="text-slate-400" />
                    <span>Registrar Asignatura</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Botón de Salida Segura */}
      <button
        onClick={handleCerrarSesion}
        className="flex items-center gap-1.5 text-sm font-bold text-red-100 hover:text-white hover:bg-red-800/80 transition-all cursor-pointer px-3.5 py-2.5 rounded-xl ml-4"
        title="Cerrar sesión"
        type="button"
      >
        <LogOut size={16} />
        <span className="hidden lg:inline">Cerrar Sesión</span>
      </button>
    </nav>
  );
}

function FolderOpenIconWrapper() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
