/**
 * Utilidades para decodificar JWT localmente y gestionar permisos (RBAC).
 */

export function parseJWT(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error al decodificar el token JWT:", e);
    return null;
  }
}

export function obtenerUsuarioActual() {
  const token = sessionStorage.getItem("token");
  return parseJWT(token);
}

export function obtenerRolNormalizado(decoded) {
  if (!decoded) return null;
  
  let rawRole = null;
  
  const possibleFields = ['role', 'rol', 'authorities'];
  for (const field of possibleFields) {
    if (decoded[field] !== undefined && decoded[field] !== null) {
      const val = decoded[field];
      if (Array.isArray(val)) {
        for (const item of val) {
          if (typeof item === 'string') {
            rawRole = item;
            break;
          } else if (item && typeof item === 'object' && item.authority) {
            rawRole = item.authority;
            break;
          }
        }
      } else if (typeof val === 'string') {
        rawRole = val;
      } else if (val && typeof val === 'object' && val.authority) {
        rawRole = val.authority;
      }
      if (rawRole) break;
    }
  }
  
  if (!rawRole) return null;
  
  const roleStr = String(rawRole).toUpperCase();
  if (roleStr.includes('ADMIN')) {
    return 'ROLE_ADMIN';
  } else if (roleStr.includes('INSTRUCTOR')) {
    return 'ROLE_INSTRUCTOR';
  } else {
    return 'ROLE_USER';
  }
}

export function obtenerRolActual() {
  const usuario = obtenerUsuarioActual();
  return obtenerRolNormalizado(usuario);
}

export function esAdmin() {
  const rol = obtenerRolActual();
  return rol === "ROLE_ADMIN";
}

export function estaAutenticado() {
  const usuario = obtenerUsuarioActual();
  if (!usuario) return false;
  
  // Opcional: verificación de expiración básica
  if (usuario.exp) {
    const ahora = Math.floor(Date.now() / 1000);
    return usuario.exp > ahora;
  }
  return true;
}

export function cerrarSesion() {
  sessionStorage.removeItem("token");
}

