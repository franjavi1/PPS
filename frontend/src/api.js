import toast from "react-hot-toast";
import { AUTH_API, STORAGE_KEY, LOGIN_ROUTE } from "./auth/config";

const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const API_URL = isLocal
  ? "http://localhost:8480/api/planes"
  : "http://186.19.137.9:8480/api/planes";

export const API_URL_AUTH = isLocal
  ? "http://localhost:8480/api/auth"
  : "http://186.19.137.9:8480/api/auth";

export const MENU_ROUTE = isLocal
  ? "http://localhost:8480"
  : "http://186.19.137.9:8480";

function obtenerSesion() {
  const data = sessionStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function extraerPrimerMensaje(valor) {
  if (typeof valor === "string") {
    return valor.trim();
  }

  if (Array.isArray(valor)) {
    for (const elemento of valor) {
      const mensaje = extraerPrimerMensaje(elemento);

      if (mensaje) {
        return mensaje;
      }
    }

    return "";
  }

  if (valor && typeof valor === "object") {
    for (const elemento of Object.values(valor)) {
      const mensaje = extraerPrimerMensaje(elemento);

      if (mensaje) {
        return mensaje;
      }
    }
  }

  return "";
}

function obtenerMensajeApi(data) {
  return (
    extraerPrimerMensaje(data?.errors) ||
    extraerPrimerMensaje(data?.message) ||
    "No se pudo completar la operacion"
  );
}

function construirHeaders(options, token) {
  const esFormData = options.body instanceof FormData;

  return {
    ...(options.body && !esFormData
      ? { "Content-Type": "application/json" }
      : {}),
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function eliminarSesion() {
  sessionStorage.removeItem(STORAGE_KEY);
}

async function refrescarToken() {
  const sesion = obtenerSesion();

  if (!sesion || !sesion.refresh_token) {
    throw new Error("No hay refresh_token disponible");
  }

  const response = await fetch(`${API_URL_AUTH}/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${sesion.refresh_token}`,
    },
  });

  if (!response.ok) {
    throw new Error("No se pudo refrescar el token en el servidor");
  }

  const responseData = await response.json();
  const nuevoAccessToken = responseData.data?.access_token || responseData.access_token;

  if (!nuevoAccessToken) {
    throw new Error("El backend no devolvió el nuevo access_token");
  }

  sesion.access_token = nuevoAccessToken;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(sesion));

  return nuevoAccessToken;
}

async function ejecutarRequest(url, options = {}) {
  const sesion = obtenerSesion();
  let response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(sesion?.access_token
        ? { Authorization: `Bearer ${sesion.access_token}` }
        : {}),
    },
  });

  let data = await response.json();
  console.log(response);

  if (!response.ok) {
    const mensajeErrorApi = obtenerMensajeApi(data);

    if (
      response.status === 403 ||
      mensajeErrorApi === "No tenes permiso para realizar esta accion"
    ) {
      toast.error("No tenés permisos para realizar esta acción");

      if (!window.location.pathname.includes("/inicio")) {
        window.location.replace("/planes/inicio");
      }

      throw new Error("Redirigiendo por falta de permisos...");
    }

    if (response.status === 401) {
      if (sesion?.refresh_token) {
        try {
          const nuevoToken = await refrescarToken();

          let retryResponse = await fetch(url, {
            ...options,
            headers: construirHeaders(options, nuevoToken),
          });

          let retryData = await retryResponse.json();

          if (retryResponse.ok) {
            return retryData;
          } else {
            throw retryData;
          }
        } catch (error) {
          eliminarSesion();
          toast.error("Tu sesión expiró completamente. Redirigiendo al login...");
          window.location.replace(LOGIN_ROUTE);
          throw new Error("Sesión expirada tras intento de refresco");
        }
      } else {
        eliminarSesion();
        toast.error("Tu sesión expiró. Redirigiendo al login...");
        window.location.replace(LOGIN_ROUTE);
        throw new Error("Sesión expirada sin token de refresco");
      }
    }

    const errores = data.errors || {};
    const primerCampo = Object.keys(errores)[0];
    const primerError =
      primerCampo && Array.isArray(errores[primerCampo])
        ? errores[primerCampo][0]
        : errores[primerCampo];

    data.message =
      primerError || data.message || "No se pudo completar la operacion";

    toast.error(data.message);
    throw data;
  }

  return data;
}

export function apiRequest(path, options = {}) {
  return ejecutarRequest(`${API_URL}${path}`, options);
}

export function apiRequestAuth(path, options = {}) {
  return ejecutarRequest(`${API_URL_AUTH}${path}`, options);
}