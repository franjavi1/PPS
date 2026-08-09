import { Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth"; 
import { HOME_ROUTE } from "../../auth/config"; 
import { LOGIN_ROUTE } from "../../auth/config"; 

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

  // Si está cargando, mostramos texto visible
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-100 text-slate-700 font-bold">
        Cargando...
      </div>
    );
  }

  // Validamos directamente con el estado del contexto (evitamos lecturas inconsistentes de sessionStorage)
  if (!isAuthenticated) {
    return <Navigate to={LOGIN_ROUTE} replace />;
  }

  // Validación de permisos (permite el acceso si AL MENOS UNO coincide)
  if (permissions.length > 0 && !permissions.some((permiso) => hasPermission(permiso))) {
    console.warn("Acceso denegado por permisos. Redirigiendo a:", HOME_ROUTE);
    return <Navigate to={HOME_ROUTE} replace />;
  }

  // Validación de roles (permite el acceso si AL MENOS UNO coincide)
  if (roles.length > 0 && !roles.some((rol) => hasRole(rol))) {
    console.warn("Acceso denegado por roles. Redirigiendo a:", HOME_ROUTE);
    return <Navigate to={HOME_ROUTE} replace />;
  }

  // Si todo está OK, muestra la vista
  return children;
}