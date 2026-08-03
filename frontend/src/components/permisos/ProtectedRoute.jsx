import { Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth"; 
import { HOME_ROUTE } from "../../auth/config"; 
import { LOGIN_ROUTE } from "../../auth/config"; 
import authService from "../../auth/services/authService";

export default function ProtectedRoute({
  children,
  roles = [],
  permissions = [],
}) {
  const {
    isAuthenticated,
    loading,
    hasRole,
    hasPermission,
  } = useAuth();

  // Si esta cargando, mostramos texto visible
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100 text-slate-700 font-bold">
        Cargando...
      </div>
    );
  }

 if (!isAuthenticated || !authService.isAuthenticated()) {
  authService.clearSession();
  window.location.replace(LOGIN_ROUTE);
  return null;
}

  // Validacion de permisos
  if (permissions.length > 0 && !permissions.some((permiso) => hasPermission(permiso))) {
    console.warn("Acceso denegado por permisos. Redirigiendo a:", HOME_ROUTE);
    return <Navigate to={HOME_ROUTE} replace />;
  }

  // Validacion de roles
  if (roles.length > 0 && !roles.some((rol) => hasRole(rol))) {
    console.warn("Acceso denegado por roles. Redirigiendo a:", HOME_ROUTE);
    return <Navigate to={HOME_ROUTE} replace />;
  }

  // Si todo esta OK, muestra la vista
  return children;
}