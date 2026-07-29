// frontend\src\components\permisos\ProtectedRoute.jsx
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth"; // Ajusta la ruta relativa hacia tu hook useAuth
import { LOGIN_ROUTE, HOME_ROUTE } from "../../auth/config"; // Ajusta la ruta relativa hacia config


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
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(isAuthenticated)
    navigate('/');
  }

  if (
    permissions.length > 0 &&
    !permissions.some((permiso) => hasPermission(permiso))
  ) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  if (
    roles.length > 0 &&
    !roles.some((rol) => hasRole(rol))
  ) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  return children;
}