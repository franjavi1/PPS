// frontend\src\components\permisos\PublicRoute.jsx
import { useNavigate } from "react-router-dom";
import useAuth from "../../auth/hooks/useAuth"; // Ajusta la ruta relativa
import { HOME_ROUTE } from "../../auth/config"; // Ajusta la ruta relativa

// Componente que protege las rutas publicas.
// Impide que un usuario autenticado acceda, por ejemplo, a la pantalla de inicio de sesion.
export default function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log(isAuthenticated)
    navigate('/');
  }

  return children;
}