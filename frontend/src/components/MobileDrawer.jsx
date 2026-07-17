import React from "react";
import { X, Settings, ChevronDown, Users, GraduationCap, BookOpen, LogOut, FileText, UserPlus, FilePlus, CalendarPlus, BookPlus } from "lucide-react";
import { hasPermission } from "../utils/authHelper";

// Renderizamos el Drawer colapsable para pantallas pequeñas (móvil).
export default function MobileDrawer({
  drawerAbierto,
  setDrawerAbierto,
  currentUserRole,
  mobilePersonasAbierto,
  setMobilePersonasAbierto,
  mobilePlanesAbierto,
  setMobilePlanesAbierto,
  navigate,
  handleCerrarSesion
}) {
  return (
    <div className={`fixed top-0 right-0 h-full bg-slate-50 text-slate-800 shadow-2xl z-50 transition-transform duration-300 ease-in-out w-full sm:w-80 flex flex-col md:hidden ${drawerAbierto ? "translate-x-0" : "translate-x-full"}`}>
      {/* Drawer Header */}
      <div className="p-5 border-b border-slate-200 bg-red-700 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo.jpeg" alt="Logo" className="h-9 w-9 rounded-full object-cover border border-red-500 shadow-sm" />
          <div>
            <h2 className="font-bold text-base leading-tight">Navegación</h2>
            <span className="text-xs text-red-100 font-medium font-sans">Bomberos Voluntarios</span>
          </div>
        </div>
        <button onClick={() => setDrawerAbierto(false)} className="p-1.5 hover:bg-red-800 rounded-lg text-white transition-colors cursor-pointer" aria-label="Cerrar menú"><X size={22} /></button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Enlace directo a Configuración */}
        {hasPermission(currentUserRole, 'leer') && (
          <button
            onClick={() => {
              navigate("/config-documentos");
              setDrawerAbierto(false);
            }}
            className="w-full flex items-center justify-between p-4 font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm transition-colors"
            type="button"
          >
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-red-700" />
              <span>Configuración / Catálogos</span>
            </div>
          </button>
        )}

        {/* Acordeón: PERSONAS */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <button onClick={() => setMobilePersonasAbierto(!mobilePersonasAbierto)} className="w-full flex items-center justify-between p-4 font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors" type="button">
            <div className="flex items-center gap-2"><Users size={18} className="text-red-700" /><span>Personas</span></div>
            <ChevronDown size={16} className={`transform transition-transform ${mobilePersonasAbierto ? "rotate-180" : ""}`} />
          </button>
          {mobilePersonasAbierto && (
            <div className="p-2 bg-white border-t border-slate-100 flex flex-col gap-1">
              <button onClick={() => { navigate("/legajos"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                <FolderOpenIconWrapper />Personas (Legajos)
              </button>
              {hasPermission(currentUserRole, 'crear') && (
                <>
                  <button onClick={() => { navigate("/config-documentos?tab=persona&action=nuevo"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                    <UserPlus size={16} className="text-slate-400" />Registrar Persona
                  </button>
                  <button onClick={() => { navigate("/crearLegajo"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                    <FilePlus size={16} className="text-slate-400" />Nuevo Legajo
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Acordeón: PLANES ACADÉMICOS */}
        {hasPermission(currentUserRole, 'leer') && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <button onClick={() => setMobilePlanesAbierto(!mobilePlanesAbierto)} className="w-full flex items-center justify-between p-4 font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors" type="button">
              <div className="flex items-center gap-2"><GraduationCap size={18} className="text-red-700" /><span>Planes</span></div>
              <ChevronDown size={16} className={`transform transition-transform ${mobilePlanesAbierto ? "rotate-180" : ""}`} />
            </button>
            {mobilePlanesAbierto && (
              <div className="p-2 bg-white border-t border-slate-100 flex flex-col gap-1">
                <button onClick={() => { navigate("/planes"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                  <FileText size={16} className="text-slate-400" />Planes de Estudio
                </button>
                <button onClick={() => { navigate("/asignaturas"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                  <BookOpen size={16} className="text-slate-400" />Asignaturas
                </button>
                {hasPermission(currentUserRole, 'crear') && (
                  <>
                    <button onClick={() => { navigate("/planes/alta"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                      <CalendarPlus size={16} className="text-slate-400" />Nuevo Plan de Estudio
                    </button>
                    <button onClick={() => { navigate("/asignaturas?action=nuevo"); setDrawerAbierto(false); }} className="flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-red-700 transition w-full text-left" type="button">
                      <BookPlus size={16} className="text-slate-400" />Registrar Asignatura
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-5 border-t border-slate-200 bg-white">
        <button onClick={() => { setDrawerAbierto(false); handleCerrarSesion(); }} className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-red-200 hover:border-red-300 text-red-600 bg-red-50/50 hover:bg-red-50 transition-all font-bold cursor-pointer text-sm" type="button">
          <LogOut size={18} />Cerrar sesión
        </button>
      </div>
    </div>
  );
}

function FolderOpenIconWrapper() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"/></svg>
  );
}
