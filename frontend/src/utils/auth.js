// Decodifica los datos del JWT. La firma se valida en el backend.
export function parseJWT(token) {
  if (!token) return null;

  try {
    const parts = token.split(".");

    if (parts.length !== 3) return null;

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const payload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(
          (character) =>
            `%${`00${character
              .charCodeAt(0)
              .toString(16)}`.slice(-2)}`
        )
        .join("")
    );

    return JSON.parse(payload);
  } catch (error) {
    console.error("No se pudo leer el token", error);
    return null;
  }
}

// Admite diferentes nombres para el rol recibido desde el backend.
export function normalizeRole(payload) {
  if (!payload) return null;

  const fields = [
    payload.role,
    payload.rol,
    payload.authorities,
  ];

  let role = fields.find(
    (value) => value !== undefined && value !== null
  );

  if (Array.isArray(role)) {
    role = role.find((value) => {
      return (
        typeof value === "string" ||
        value?.authority
      );
    });
  }

  if (role && typeof role === "object") {
    role = role.authority;
  }

  if (!role) return null;

  const normalized = String(role).toUpperCase();

  if (normalized.includes("ADMIN")) {
    return "ROLE_ADMIN";
  }

  if (normalized.includes("INSTRUCTOR")) {
    return "ROLE_INSTRUCTOR";
  }

  return "ROLE_USER";
}