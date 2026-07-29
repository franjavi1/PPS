import toast from "react-hot-toast";
import { STORAGE_KEY } from "./auth/config";

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

async function ejecutarRequest(url, options = {}) {
  const sesion = obtenerSesion();
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(sesion?.access_token
        ? { Authorization: `Bearer ${sesion.access_token}` }
        : {}),
    },
  });

  const data = await response.json();
  console.log(response);

  if (!response.ok || data?.ok === false) {
    const mensaje = obtenerMensajeApi(data);
    const errorNormalizado =
      data && typeof data === "object"
        ? { ...data, message: mensaje }
        : { message: mensaje };

    toast.error(mensaje);
    throw errorNormalizado;
  }

  return data;
}

export function apiRequest(path, options = {}) {
  return ejecutarRequest(`${API_URL}${path}`, options);
}

export function apiRequestAuth(path, options = {}) {
  return ejecutarRequest(`${API_URL_AUTH}${path}`, options);
}
