import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import DesktopNav from "./DesktopNav";
import MobileDrawer from "./MobileDrawer";

// Definimos la cabecera principal de la aplicación.
// Limpiamos los estados de acordeón móvil obsoletos.
function Navbar() {
  const navigate = useNavigate();
  const { currentUserRole, logout } = useAuth();
  
  const [drawerAbierto, setDrawerAbierto] = useState(false);
  const [dropdownAbierto, setDropdownAbierto] = useState(null); // 'general' | 'personas' | 'planes' | null
  
  // Controles de estados locales de los colapsables del Drawer móvil
  const [mobileGeneralAbierto, setMobileGeneralAbierto] = useState(false);
  const [mobilePersonasAbierto, setMobilePersonasAbierto] = useState(false);
  const [mobilePlanesAbierto, setMobilePlanesAbierto] = useState(false);

  function handleCerrarSesion() {
    logout();
    navigate("/login");
  }

  const toggleDropdown = (name) => {
    setDropdownAbierto(dropdownAbierto === name ? null : name);
  };

  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      {/* Cierra los dropdowns al hacer clic fuera */}
      {dropdownAbierto && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setDropdownAbierto(null)} />
      )}

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Isotipo institucional */}
        <Link to="/inicio" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/logo.jpeg" alt="Logo" className="h-10 w-10 rounded-full object-cover border border-red-500 shadow-sm" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-tight">Sistema de Legajos</h1>
            <p className="text-xs md:text-sm text-red-100 font-medium font-sans">Bomberos Voluntarios</p>
          </div>
        </Link>

        {/* Menú de Escritorio */}
        <DesktopNav
          currentUserRole={currentUserRole}
          dropdownAbierto={dropdownAbierto}
          toggleDropdown={toggleDropdown}
          navigate={navigate}
          setDropdownAbierto={setDropdownAbierto}
          handleCerrarSesion={handleCerrarSesion}
        />

        {/* Botón hamburguesa móvil */}
        <div className="flex items-center md:hidden">
          <button onClick={() => setDrawerAbierto(true)} className="p-2 text-red-100 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-red-800" aria-label="Abrir menú de navegación"><Menu size={28} /></button>
        </div>
      </div>

      {/* Backdrop overlay para Drawer móvil */}
      {drawerAbierto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 animate-in fade-in duration-300 md:hidden" onClick={() => setDrawerAbierto(false)} />
      )}

      {/* Drawer móvil simplificado */}
      <MobileDrawer
        drawerAbierto={drawerAbierto}
        setDrawerAbierto={setDrawerAbierto}
        currentUserRole={currentUserRole}
        mobileGeneralAbierto={mobileGeneralAbierto}
        setMobileGeneralAbierto={setMobileGeneralAbierto}
        mobilePersonasAbierto={mobilePersonasAbierto}
        setMobilePersonasAbierto={setMobilePersonasAbierto}
        mobilePlanesAbierto={mobilePlanesAbierto}
        setMobilePlanesAbierto={setMobilePlanesAbierto}
        navigate={navigate}
        handleCerrarSesion={handleCerrarSesion}
      />
    </header>
  );
}

export default Navbar;
