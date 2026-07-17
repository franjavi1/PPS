// Definimos la matriz de permisos por rol para nuestra política de seguridad basada en roles (RBAC).
// De esta manera centralizamos qué puede hacer cada tipo de usuario en la aplicación.
export const PERMISSIONS_MAP = {
  // El administrador tiene control total sobre el catálogo de datos y las configuraciones.
  ROLE_ADMIN: ['crear', 'editar', 'eliminar', 'leer'],
  // El instructor solo puede ver los listados y calificar a los alumnos (editar notas) para cuidar la integridad.
  ROLE_INSTRUCTOR: ['editar_notas', 'leer'],
  // El usuario estándar (por ejemplo, bomberos o personal de consulta) únicamente lee información.
  // Evitamos que puedan realizar cualquier tipo de alteración en legajos o configuraciones críticas.
  ROLE_USER: ['leer']
};

// Validamos aquí si el rol de un usuario determinado cuenta con la acción que intenta ejecutar.
export function hasPermission(userRole, action) {
  if (!userRole) return false;
  const permissions = PERMISSIONS_MAP[userRole] || [];
  return permissions.includes(action);
}
