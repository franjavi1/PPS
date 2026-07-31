// frontend\src\components\permisos\PublicRoute.jsx
import { Navigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth"; 
import { HOME_ROUTE } from "../../auth/config"; 

// Componente que protege las rutas publicas
// Impide que un usuario autenticado acceda, por ejemplo, a la pantalla de inicio de sesion.
export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  // Si ya esta autenticado, lo mandamos al inicio
  if (isAuthenticated) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  // Si no esta autenticado, le permitimos ver la ruta (el children)
  return children;
}