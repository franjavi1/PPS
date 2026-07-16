export const PERMISSIONS_MAP = {
  ROLE_ADMIN: ['crear', 'editar', 'eliminar', 'leer'],
  ROLE_INSTRUCTOR: ['editar_notas', 'leer'],
  ROLE_USER: ['leer']
};

export function hasPermission(userRole, action) {
  if (!userRole) return false;
  const permissions = PERMISSIONS_MAP[userRole] || [];
  return permissions.includes(action);
}
