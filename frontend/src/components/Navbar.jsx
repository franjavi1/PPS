import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { Home, FolderOpen, FilePlus, FileText, LogOut, BookOpen, Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);

  function cerrarSesion() {
    navigate("/login");
  }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 pb-1 font-medium border-b-2 transition-colors ${
      isActive
        ? "border-white text-white"
        : "border-transparent text-red-100 hover:text-white"
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-lg font-medium transition-colors ${
      isActive
        ? "bg-red-800 text-white"
        : "text-red-100 hover:bg-red-600 hover:text-white"
    }`;

  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpeg"
            alt="Logo"
            className="h-10 w-10 rounded-full object-cover border border-red-500 shadow-sm"
          />
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-tight">
              Sistema de Legajos
            </h1>
            <p className="text-xs md:text-sm text-red-100">
              Bomberos Voluntarios
            </p>
          </div>
        </div>

        {/* Menú de Escritorio */}
        <nav className="hidden lg:flex items-center gap-8">
          <NavLink to="/inicio" className={linkClass}>
            <Home size={20} />
            Inicio
          </NavLink>

          <NavLink to="/legajos" className={linkClass}>
            <FolderOpen size={20} />
            Legajos
          </NavLink>

          <NavLink to="/crearLegajo" className={linkClass}>
            <FilePlus size={20} />
            Nuevo legajo
          </NavLink>

          <NavLink to="/config-documentos" className={linkClass}>
            <FileText size={20} />
            Documentos
          </NavLink>

          <NavLink to="/asignaturas" className={linkClass}>
            <BookOpen size={20} />
            Asignaturas
          </NavLink>

          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 text-red-100 hover:text-white font-medium cursor-pointer"
          >
            <LogOut size={20} />
            Cerrar sesion
          </button>
        </nav>

        {/* Botón menú móvil */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="p-2 text-red-100 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Abrir menú"
          >
            {menuAbierto ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {menuAbierto && (
        <nav className="lg:hidden bg-red-700 border-t border-red-600 px-6 py-4 flex flex-col gap-2 shadow-inner animate-in slide-in-from-top duration-200">
          <NavLink
            to="/inicio"
            onClick={() => setMenuAbierto(false)}
            className={mobileLinkClass}
          >
            <Home size={20} />
            Inicio
          </NavLink>

          <NavLink
            to="/legajos"
            onClick={() => setMenuAbierto(false)}
            className={mobileLinkClass}
          >
            <FolderOpen size={20} />
            Legajos
          </NavLink>

          <NavLink
            to="/crearLegajo"
            onClick={() => setMenuAbierto(false)}
            className={mobileLinkClass}
          >
            <FilePlus size={20} />
            Nuevo legajo
          </NavLink>

          <NavLink
            to="/config-documentos"
            onClick={() => setMenuAbierto(false)}
            className={mobileLinkClass}
          >
            <FileText size={20} />
            Documentos
          </NavLink>

          <NavLink
            to="/asignaturas"
            onClick={() => setMenuAbierto(false)}
            className={mobileLinkClass}
          >
            <BookOpen size={20} />
            Asignaturas
          </NavLink>

          <button
            onClick={() => {
              setMenuAbierto(false);
              cerrarSesion();
            }}
            className="flex items-center gap-3 py-3 px-4 rounded-lg font-medium text-red-100 hover:bg-red-600 hover:text-white w-full text-left cursor-pointer"
          >
            <LogOut size={20} />
            Cerrar sesion
          </button>
        </nav>
      )}
    </header>
  );
}

export default Navbar;
