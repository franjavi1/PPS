// frontend\src\components\permisos\usePermisosHook.jsx
import useAuth from '../../auth/hooks/useAuth';

export function usePermisosHook() {
    const { hasPermission } = useAuth();

    const verificarPermiso = (permission) => {
        if (!permission) return true; // Si no requiere permiso, pasa directo
        const permissionsList = Array.isArray(permission) ? permission : [permission];
        return permissionsList.some((p) => hasPermission(p));
    };

    return { verificarPermiso };
}