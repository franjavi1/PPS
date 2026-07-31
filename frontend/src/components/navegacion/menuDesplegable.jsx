// frontend\src\components\navegacion\menuDesplegable.jsx
import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import useAuth from '../../auth/hooks/useAuth';

function MenuDesplegable({ icon: Icon, label, children, align = "left", width = "w-72", permission }) {
  // LLAMA SIEMPRE A LOS HOOKS EN EL MISMO ORDEN
  const { hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // LA VALIDACIÓN DE PERMISOS VA AQUÍ ABAJO
  if (permission) {
    const permissionsList = Array.isArray(permission) ? permission : [permission];
    const hasAccess = permissionsList.some((p) => hasPermission(p));
    if (!hasAccess) return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
          isOpen ? "border-white bg-white/10 font-semibold" : "border-transparent hover:bg-white/10"
        }`}
      >
        {Icon && <Icon size={16} />}
        <span>{label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute ${align === "right" ? "right-0" : "left-0"} mt-2 ${width} bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50 flex flex-col gap-1`}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default MenuDesplegable;