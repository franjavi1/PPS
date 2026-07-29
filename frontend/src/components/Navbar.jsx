import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../auth/hooks/useAuth";
//import { hasPermission } from "../auth/utils/permissions";
import { MENU_ROUTE } from "../api";
import { LOGIN_ROUTE } from "../auth/config";
import {
  BookOpen,
  BookMarked,
  BookOpenCheck,
  Building,
  Building2,
  ChevronDown,
  ChevronsUp,
  ClipboardList,
  ClipboardPlus,
  DoorOpen,
  FileText,
  Folder,
  GitBranch,
  GraduationCap,
  Home,
  IdCard,
  LogOut,
  SendToBack,
  MapPinned,
  Menu,
  Phone,
  Plus,
  Settings,
  SquareUserRound,
  User,
  Users,
  X,
  ShieldUser,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const { currentUserRole, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  const { hasPermission, hasRole } = useAuth();
  useEffect(()=>{console.log(currentUserRole)},[currentUserRole])
  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const closeMenus = () => {
    setOpenMenu(null);
    setMobileOpen(false);
  };
  const handleLogout = () => {
    logout();
    window.location.replace(LOGIN_ROUTE);
    //closeMenus();
    
    //navigate(LOGIN_ROUTE);
  };

  const handleVolver = () => {
    window.location.href = MENU_ROUTE;
  }

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
    "flex items-start gap-3 rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-700 cursor-pointer";

  return (
    <header className="bg-gradient-to-b from-red-700 to-red-900 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate("/inicio")}
          className="flex items-center gap-3 text-left cursor-pointer"
        >
          <div className="w-20 h-20 rounded-xl bg-white/10 border border-white/25 flex items-center justify-center overflow-hidden shadow-sm">
            <img
              src={`${import.meta.env.BASE_URL}logo.jpeg`}
              alt="Logo bomberos"
              className="w-full h-full object-cover"
            />
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
          className="lg:hidden w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center cursor-pointer"
          aria-label="Abrir menú"
        >
          <Menu size={22} />
        </button>

        <nav ref={navRef} className="hidden lg:flex items-center gap-1">
          <NavLink
            to="/inicio"
            className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2 cursor-pointer"
          >
            <Home size={17} />
            Inicio
          </NavLink>

          <Dropdown
            id="personal"
            title="Personal"
            icon={<SquareUserRound size={17} />}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          >
            {hasPermission("planes.personas.crear") && (
              <NavLink
                to="/alta-persona"
                className={linkClass}
                onClick={closeMenus}
              >
                <Plus size={18} />

                <span>
                  <strong>Nueva persona</strong>

                  <small className="block text-slate-500">
                    Alta guiada de persona
                  </small>
                </span>
              </NavLink>
            )}
            {hasPermission("planes.personas.editar") && (
              <NavLink
                to="/personas"
                className={linkClass}
                onClick={closeMenus}
              >
                <User size={18} />
                <span>
                  <strong>Personas</strong>
                  <small className="block text-slate-500">
                    Buscar y editar personas
                  </small>
                </span>
              </NavLink>
            )}
            {hasPermission("planes.legajos.editar") && (
              <NavLink to="/legajos" className={linkClass} onClick={closeMenus}>
                <ClipboardList size={18} />
                <span>
                  <strong>Ver legajos</strong>
                  <small className="block text-slate-500">
                    Buscar y consultar legajos
                  </small>
                </span>
              </NavLink>
            )}
          </Dropdown>

          <Dropdown
            id="planes"
            title="Gestión educativa"
            icon={<GraduationCap size={17} />}
            openMenu={openMenu}
            toggleMenu={toggleMenu}
          >
            {hasPermission("planes.planes.crear") && (
              <NavLink
                to="/planes/alta"
                className={linkClass}
                onClick={closeMenus}
              >
                <Plus size={18} />
                <span>
                  <strong>Nuevo plan</strong>
                  <small className="block text-slate-500">
                    Alta guiada de plan
                  </small>
                </span>
              </NavLink>
            )}
            {hasPermission("planes.planes.ver") && (
              <NavLink to="/planes" className={linkClass} onClick={closeMenus}>
                <BookOpen size={18} />
                <span>
                  <strong>Planes</strong>
                  <small className="block text-slate-500">Ver planes</small>
                </span>
              </NavLink>
            )}
            {hasPermission("planes.asignaturas.ver") && (
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
            )}
            {hasPermission("planes.comisiones.crear") && (
              <NavLink
                to="/comisiones/alta"
                className={linkClass}
                onClick={closeMenus}
              >
                <Plus size={18} />
                <span>
                  <strong>Nueva comisión</strong>
                  <small className="block text-slate-500">
                    Alta guiada de comisión
                  </small>
                </span>
              </NavLink>
            )}
            {hasPermission("planes.comisiones.ver") && (
              <NavLink
                to="/comisiones"
                className={linkClass}
                onClick={closeMenus}
              >
                <Users size={18} />
                <span>
                  <strong>Comisiones</strong>
                  <small className="block text-slate-500">Ver comisiones</small>
                </span>
              </NavLink>
            )}
          </Dropdown>
          {hasPermission("planes.config.ver") && (
            <Dropdown
              id="config"
              title="Configuración"
              icon={<Settings size={17} />}
              openMenu={openMenu}
              toggleMenu={toggleMenu}
            >
              <p className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-wide text-slate-400 font-semibold opacity-70">
                SEDES E INFRAESTRUCTURA
              </p>

              <NavLink to="/sedes" className={linkClass} onClick={closeMenus}>
                <Building2 size={18} />
                <span>
                  <strong>Sedes</strong>
                  <small className="block text-slate-500">
                    Alta, edición y tipos de sede
                  </small>
                </span>
              </NavLink>

              <NavLink
                to="/tipos-sedes"
                className={linkClass}
                onClick={closeMenus}
              >
                <Building size={18} />
                <span>
                  <strong>Tipos de sedes</strong>
                  <small className="block text-slate-500">
                    Categorías para clasificar sedes
                  </small>
                </span>
              </NavLink>
              <NavLink to="/aulas" className={linkClass} onClick={closeMenus}>
                <DoorOpen size={18} />
                <span>
                  <strong>Aulas</strong>
                  <small className="block text-slate-500">Alta de aulas</small>
                </span>
              </NavLink>

              <p className="px-3 pt-4 pb-1 text-[11px] uppercase tracking-wide text-slate-400 font-semibold opacity-70">
                PERSONAL
              </p>
              <NavLink
                to="/tipos-documentos"
                className={linkClass}
                onClick={closeMenus}
              >
                <IdCard size={18} />
                <span>
                  <strong>Tipo de documentos</strong>
                  <small className="block text-slate-500">
                    Catálogo de documentos
                  </small>
                </span>
              </NavLink>

              <NavLink
                to="/tipo-rangos"
                className={linkClass}
                onClick={closeMenus}
              >
                <ChevronsUp size={18} />
                <span>
                  <strong>Tipo de rangos</strong>
                  <small className="block text-slate-500">
                    Catálogo de rangos
                  </small>
                </span>
              </NavLink>
            </Dropdown>
          )}
          <button
            type="button"
            onClick={handleVolver}
            className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2 cursor-pointer"
          >
            <SendToBack size={17} />
            Volver
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2 cursor-pointer"
          >
            <LogOut size={17} />
            Cerrar Sesion
          </button>
        </nav>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 bg-slate-50 text-slate-800 z-[100] p-5 lg:hidden overflow-y-auto">
          <button
            onClick={closeMenus}
            className="fixed top-4 right-4 w-11 h-11 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center text-red-700 cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>

          <p className="text-xs font-bold uppercase text-slate-500 mb-4">
            Menú principal
          </p>

          <div className="space-y-3 pt-12">
            <MobileLink
              to="/inicio"
              icon={<Home size={20} />}
              onClick={closeMenus}
            >
              Inicio
            </MobileLink>
            {hasPermission("planes.personas.crear") && (
              <MobileLink
                to="/alta-persona"
                icon={<Plus size={20} />}
                onClick={closeMenus}
              >
                Nueva persona
              </MobileLink>
            )}
            <MobileLink
              to="/personas"
              icon={<User size={20} />}
              onClick={closeMenus}
            >
              Personas
            </MobileLink>

            <MobileLink
              to="/legajos"
              icon={<Folder size={20} />}
              onClick={closeMenus}
              iconoSinFondo
            >
              Legajos
            </MobileLink>

            {hasPermission("planes.planes.crear") && (
              <MobileLink
                to="/planes/alta"
                icon={<Plus size={20} />}
                onClick={closeMenus}
              >
                Nuevo plan
              </MobileLink>
            )}
            <MobileLink
              to="/planes"
              icon={<BookOpen size={20} />}
              onClick={closeMenus}
              iconoSinFondo
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
            {hasPermission("planes.comisiones.crear") && (
              <MobileLink
                to="/comisiones/alta"
                icon={<Plus size={20} />}
                onClick={closeMenus}
              >
                Nueva comisión
              </MobileLink>
            )}

            <MobileLink
              to="/comisiones"
              icon={<Users size={20} />}
              onClick={closeMenus}
              iconoSinFondo
            >
              Comisiones
            </MobileLink>
            {hasPermission("planes.config.ver") (
              <>
                <MobileLink
                  to="/sedes"
                  icon={<Building2 size={20} />}
                  onClick={closeMenus}
                >
                  Sedes
                </MobileLink>

                <MobileLink
                  to="/tipos-sedes"
                  icon={<Building size={20} />}
                  onClick={closeMenus}
                >
                  Tipo de sedes
                </MobileLink>

                <MobileLink
                  to="/tipos-documentos"
                  icon={<IdCard size={20} />}
                  onClick={closeMenus}
                >
                  Tipo de documentos
                </MobileLink>

                <MobileLink
                  to="/tipo-rangos"
                  icon={<ChevronsUp size={20} />}
                  onClick={closeMenus}
                >
                  Tipo de rangos
                </MobileLink>
              </>
            )}
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
        className="px-3 py-2 rounded-md text-sm font-semibold hover:bg-white/15 flex items-center gap-2 cursor-pointer"
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

function MobileLink({ to, icon, children, onClick, iconoSinFondo = false }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl bg-white border border-slate-200 px-4 py-4 font-bold text-slate-700 shadow-sm cursor-pointer"
    >
      <span
        className={`w-10 h-10 text-red-700 flex items-center justify-center ${
          iconoSinFondo ? "" : "rounded-xl bg-red-50"
        }`}
      >
        {icon}
      </span>
      {children}
    </NavLink>
  );
}

export default Navbar;
