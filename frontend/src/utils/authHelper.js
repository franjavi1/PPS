// Permisos disponibles para cada rol.
export const PERMISSIONS_MAP = {
  ROLE_ADMIN: ["crear", "editar", "eliminar", "leer"],
  ROLE_INSTRUCTOR: ["editar_notas", "leer"],
  ROLE_USER: ["leer"],
};

export function hasPermission(role, action) {
  if (!role) return false;

  const permissions = PERMISSIONS_MAP[role] || [];

  return permissions.includes(action);
}