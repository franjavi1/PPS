// frontend\src\components\navegacion\itemMenuDesplegable.jsx
import useAuth from '../../auth/hooks/useAuth'; 

function ItemMenuDesplegable({ icon: Icon, label, subtitle, onClick, active = false, variant = "default", className = "", permission }) {
    const { hasPermission } = useAuth();
    // Verificación de permisos (soporta string o array)
    if (permission) {
        const permissionsList = Array.isArray(permission) ? permission : [permission];
        const hasAccess = permissionsList.some((p) => hasPermission(p));
        if (!hasAccess) return null;
    }

    if (variant === "menu") {
        return (
            <button
                onClick={onClick}
                className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50 ${className}`}
            >
                {Icon && <Icon size={18} className="text-slate-500 dark:text-slate-400 mt-0.5 shrink-0" />}
                <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm leading-snug">{label}</p>
                    {subtitle && <p className="text-[11px] text-slate-400 dark:text-slate-400">{subtitle}</p>}
                </div>
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? "bg-white/10 font-semibold" : "hover:bg-white/10"
                } ${className}`}
        >
            {Icon && <Icon size={16} />}
            <span>{label}</span>
        </button>
    );
}

export default ItemMenuDesplegable;