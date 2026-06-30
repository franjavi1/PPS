import { NavLink, useNavigate } from "react-router";
import { Home, FolderOpen, FilePlus, FileText, LogOut, BookOpen } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  function cerrarSesion() {
    navigate("/login");
  }

  return (
    <header className="bg-red-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          

          <div>
            <h1 className="text-2xl font-bold leading-tight">
              Sistema de Legajos
            </h1>
            <p className="text-sm text-red-100">
              Bomberos Voluntarios
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <NavLink
            to="/inicio"
            className={({ isActive }) =>
              `flex items-center gap-2 pb-2 font-medium ${
                isActive
                  ? "border-b-2 border-white text-white"
                  : "text-red-100 hover:text-white"
              }`
            }
          >
            <Home size={20} />
            Inicio
          </NavLink>

          <NavLink
            to="/legajos"
            className={({ isActive }) =>
              `flex items-center gap-2 pb-2 font-medium ${
                isActive
                  ? "border-b-2 border-white text-white"
                  : "text-red-100 hover:text-white"
              }`
            }
          >
            <FolderOpen size={20} />
            Legajos
          </NavLink>

          <NavLink
            to="/crearLegajo"
            className={({ isActive }) =>
              `flex items-center gap-2 pb-2 font-medium ${
                isActive
                  ? "border-b-2 border-white text-white"
                  : "text-red-100 hover:text-white"
              }`
            }
          >
            <FilePlus size={20} />
            Nuevo legajo
          </NavLink>

          <NavLink
            to="/config-documentos"
            className={({ isActive }) =>
              `flex items-center gap-2 pb-2 font-medium ${
                isActive
                  ? "border-b-2 border-white text-white"
                  : "text-red-100 hover:text-white"
              }`
            }
          >
            <FileText size={20} />
            Documentos
          </NavLink>

          <NavLink
            to="/asignaturas"
            className={({ isActive }) =>
              `flex items-center gap-2 pb-2 font-medium ${
                isActive
                  ? "border-b-2 border-white text-white"
                  : "text-red-100 hover:text-white"
              }`
            }
          >
            <BookOpen size={20} />
            Asignaturas
          </NavLink>

          <button
            onClick={cerrarSesion}
            className="flex items-center gap-2 text-red-100 hover:text-white font-medium"
          >
            <LogOut size={20} />
            Cerrar sesion
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
