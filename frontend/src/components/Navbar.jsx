import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
  BookOpen,
  Building,
  Building2,
  ChevronDown,
  ClipboardPlus,
  FileText,
  Folder,
  Home,
  LogOut,
  Menu,
  Phone,
  Plus,
  Settings,
  User,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const linkClass =
    "flex items-start gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700";

  return (
    <header className="bg-gradient-to-b from-red-700 to-red-900 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/inicio")}
          className="flex items-center gap-3 text-left"
        >
          <div className="w-11 h-11 rounded-full bg-white text-red-800 border-2 border-yellow-400 flex items-center justify-center text-[10px] font-black leading-tight">
            FEBO<br />CABA
          </div>

          <div>
            <h1 className="text-base font-bold leading-tight">
              Sistema de Legajos
            </h1>
            <p className="text-xs text-white/80">Bomberos Voluntarios</p>
          </div>
        </button>

        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center"
          aria-label="Abrir menu"
        >
          <Menu size={22} />
        </button>

        <nav ref={navRef} className="hidden md:flex items-center gap-1">
          <NavLink
            to="/inicio"
            className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2"
          >
            <Home size={17} />
            Inicio
          </NavLink>

          <Dropdown
            id="legajos"
            title="Legajos"
            icon={<Folder size={17} />}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          >
            <NavLink to="/legajos" className={linkClass} onClick={closeMenus}>
              <User size={18} />
              <span>
                <strong>Ver legajos</strong>
                <small className="block text-slate-500">
                  Buscar y consultar legajos
                </small>
              </span>
            </NavLink>

            <NavLink
              to="/crearLegajo"
              className={linkClass}
              onClick={closeMenus}
            >
              <Plus size={18} />
              <span>
                <strong>Nuevo legajo</strong>
                <small className="block text-slate-500">
                  Alta de persona y legajo
                </small>
              </span>
            </NavLink>

            <NavLink
              to="/crearLegajo"
              className={linkClass}
              onClick={closeMenus}
            >
              <Phone size={18} />
              <span>
                <strong>Contactos</strong>
                <small className="block text-slate-500">
                  Alta de persona y legajo
                </small>
              </span>
            </NavLink>

            <NavLink
              to="/crearLegajo"
              className={linkClass}
              onClick={closeMenus}
            >
              <ClipboardPlus size={18} />
              <span>
                <strong>Datos medicos</strong>
                <small className="block text-slate-500">
                  Alta de persona y legajo
                </small>
              </span>
            </NavLink>
          </Dropdown>

          <Dropdown
            id="planes"
            title="Planes de estudio"
            icon={<BookOpen size={17} />}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          >
            <NavLink to="/planes" className={linkClass} onClick={closeMenus}>
              <BookOpen size={18} />
              <span>
                <strong>Planes</strong>
                <small className="block text-slate-500">
                  Resolucion y vigencia
                </small>
              </span>
            </NavLink>

            <NavLink
              to="/asignaturas"
              className={linkClass}
              onClick={closeMenus}
            >
              <FileText size={18} />
              <span>
                <strong>Asignaturas</strong>
                <small className="block text-slate-500">
                  Materias del sistema
                </small>
              </span>
            </NavLink>
          </Dropdown>

          <Dropdown
            id="config"
            title="Configuracion"
            icon={<Settings size={17} />}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          >
            <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400 font-semibold opacity-70">
              SEDES E INFRAESTRUCTURA
            </p>

            <NavLink
              to="/config-documentos"
              className={linkClass}
              onClick={closeMenus}
            >
              <Building2 size={18} />
              <span>
                <strong>Sedes</strong>
                <small className="block text-slate-500">
                  Documentos, sedes, aulas y rangos
                </small>
              </span>
            </NavLink>

            <NavLink
              to="/config-documentos"
              className={linkClass}
              onClick={closeMenus}
            >
              <Building size={18} />
              <span>
                <strong>Tipo de Sedes</strong>
                <small className="block text-slate-500">
                  Documentos, sedes, aulas y rangos
                </small>
              </span>
            </NavLink>
          </Dropdown>

          <NavLink
            to="/login"
            className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2"
          >
            <LogOut size={17} />
            Cerrar sesion
          </NavLink>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-50 text-slate-800 z-[100] p-5 md:hidden overflow-y-auto">
          <button
            onClick={closeMenus}
            className="fixed top-4 right-4 w-11 h-11 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-red-700"
            aria-label="Cerrar menu"
          >
            <X size={22} />
          </button>

          <p className="text-xs font-bold uppercase text-slate-500 mb-4">
            Menu principal
          </p>

          <div className="space-y-3 pt-12">
            <MobileLink
              to="/inicio"
              icon={<Home size={20} />}
              onClick={closeMenus}
            >
              Inicio
            </MobileLink>

            <MobileLink
              to="/legajos"
              icon={<Folder size={20} />}
              onClick={closeMenus}
            >
              Ver legajos
            </MobileLink>

            <MobileLink
              to="/crearLegajo"
              icon={<Plus size={20} />}
              onClick={closeMenus}
            >
              Nuevo legajo
            </MobileLink>

            <MobileLink
              to="/planes"
              icon={<BookOpen size={20} />}
              onClick={closeMenus}
            >
              Planes
            </MobileLink>

            <MobileLink
              to="/asignaturas"
              icon={<FileText size={20} />}
              onClick={closeMenus}
            >
              Asignaturas
            </MobileLink>

            <MobileLink
              to="/config-documentos"
              icon={<Settings size={20} />}
              onClick={closeMenus}
            >
              Configuracion
            </MobileLink>

            <MobileLink
              to="/login"
              icon={<LogOut size={20} />}
              onClick={closeMenus}
            >
              Cerrar sesion
            </MobileLink>
          </div>
        </div>
      )}
    </header>
  );
}

function Dropdown({ id, title, icon, openMenu, toggleMenu, children }) {
  const open = openMenu === id;

  return (
    <div className="relative">
      <button
        onClick={() => toggleMenu(id)}
        className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2"
      >
        {icon}
        {title}
        <ChevronDown size={15} className={open ? "rotate-180" : ""} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-3 w-72 bg-white text-slate-800 border border-slate-200 rounded-xl shadow-xl p-2">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileLink({ to, icon, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200 px-4 py-4 font-bold text-slate-700 shadow-sm"
    >
      <span className="w-10 h-10 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
        {icon}
      </span>
      {children}
    </NavLink>
  );
}

export default Navbar;
