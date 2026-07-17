/**
 * Utilidades para decodificar JWT localmente y gestionar permisos (RBAC).
 */

// Decodificamos el token JWT de manera local y manual.
// De esta forma evitamos añadir dependencias externas pesadas (como jwt-decode) en nuestro bundle.
// El JWT consta de tres partes separadas por puntos: Header, Payload y Signature.
// Nos enfocamos en el Payload (segunda sección), que contiene la data de sesión del usuario.
export function parseJWT(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null; // Validamos que el formato cumpla con la especificación JWT estándar.
    
    const base64Url = parts[1];
    // Reemplazamos caracteres especiales de la variante Base64Url a Base64 clásica para que sea compatible con atob().
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    // Deserializamos el payload decodificado a un objeto JSON útil para el resto de la app,
    // manejando correctamente los caracteres especiales mediante codificación URI.
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

// Obtenemos el token almacenado en el almacenamiento de sesión del navegador (sessionStorage).
// Optamos por sessionStorage en lugar de localStorage para que la sesión expire automáticamente
// en cuanto el usuario cierre la pestaña o el navegador, aportando mayor seguridad.
export function obtenerUsuarioActual() {
  const token = sessionStorage.getItem("token");
  return parseJWT(token);
}

// Normalizamos el rol que viene en el token JWT. Dado que diferentes backends de Spring Boot o Node
// pueden estructurar las claims de manera distinta (claims como 'role', 'rol', o el array de 'authorities'),
// recorremos las alternativas para mapearlas limpiamente a nuestros roles normalizados internos.
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

// Extraemos el rol del usuario actual decodificando el token almacenado en la sesión.
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

