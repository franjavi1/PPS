import { Navigate, Outlet } from "react-router";
import useAuth from "../auth/hooks/useAuth";

export default function RoleWrapper({ allowedRoles, children }) {
  const { roles, loading } = useAuth();

  // Esperar a que termine de cargar la sesion para no redirigir falsamente
  if (loading) {
    return null; // O puedes retornar un componente de Loading/Spinner
  }

  // Verificamos si los roles del usuario incluyen alguno de los permitidos
  const hasAllowedRole = roles.some((rol) => allowedRoles.includes(rol));

  if (!hasAllowedRole) {
    // Redireccion silenciosa a la ruta por defecto
    return <Navigate to="/inicio" replace />;
  }

  // Renderiza los hijos si los pasaron como prop, o el Outlet si se usa en rutas anidadas
  return children ? children : <Outlet />;
}
