// frontend\src\components\botones\btnAccion.jsx
import useAuth from '../../auth/hooks/useAuth'; 
import { ChevronRight } from 'lucide-react';

export default function AccionBtn({
  texto,
  descripcion,
  icono: Icono,
  onClick,
  permission,
  variant = 'default',
  cargando = false,
  className = '',
  title
}) {
  // Obtenemos la función hasPermission directamente del contexto de autenticación
  const { hasPermission } = useAuth();

  // Verificamos si se requiere un permiso (soporta string único o array de strings)
  if (permission) {
    const permissionsList = Array.isArray(permission) ? permission : [permission];
    const hasAccess = permissionsList.some((p) => hasPermission(p));
    if (!hasAccess) return null;
  }

  const baseClasses = "flex items-center transition-all cursor-pointer";

  const variants = {
    default: "px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:border-red-300 dark:hover:border-red-800 hover:text-red-700 dark:hover:text-red-400 shadow-sm hover:shadow-md gap-2",
    primary: "px-5 py-2.5 bg-gradient-to-br from-red-600 to-red-800 text-white rounded-xl font-bold hover:from-red-700 hover:to-red-900 shadow-sm hover:shadow-lg hover:-translate-y-0.5 gap-2",
    secondary: "px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-semibold hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm hover:shadow-md gap-2",
    outlineRed: "px-4 py-2.5 bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-950/40 shadow-sm hover:shadow-md gap-2",
    ghostLink: "text-slate-500 hover:text-red-700 dark:text-slate-400 dark:hover:text-red-500 font-semibold mb-4 gap-2",
    navCard: "w-full border border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl p-5 text-left hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:border-red-300 dark:hover:border-red-900/50 group justify-between gap-4"
  };

  const tieneClasePersonalizada = className && className.trim() !== '';
  const estilosVisuales = tieneClasePersonalizada ? className : (variants[variant] || variants.default);

  if (variant === 'navCard') {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={cargando}
        title={title}
        className={`${baseClasses} ${estilosVisuales}`.trim()}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-inner shrink-0">
            {Icono && <Icono size={24} className={cargando ? 'animate-spin' : ''} />}
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
              {texto}
            </h3>
            {descripcion && (
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 leading-relaxed">
                {descripcion}
              </p>
            )}
          </div>
        </div>
        <ChevronRight className="text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-1 shrink-0 transition-all" size={20} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={cargando}
      title={title}
      className={`${baseClasses} ${estilosVisuales}`.trim()}
    >
      {Icono && <Icono size={18} className={cargando ? 'animate-spin' : ''} />}
      {texto}
    </button>
  );
}