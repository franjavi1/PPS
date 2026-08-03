import toast from "react-hot-toast";
import { STORAGE_KEY, LOGIN_ROUTE } from "./auth/config";

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

let redirigiendoAlLogin = false;

function cerrarSesionYRedirigir() {
  sessionStorage.removeItem(STORAGE_KEY);

  if (!redirigiendoAlLogin) {
    redirigiendoAlLogin = true;
    window.location.replace(LOGIN_ROUTE);
  }
}

async function ejecutarRequest(url, options = {}) {
  const sesion = obtenerSesion();
  if (!sesion?.access_token) {
  cerrarSesionYRedirigir();
  throw new Error("La sesión no existe.");
}
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
  if (response.status === 401) {
  cerrarSesionYRedirigir();
  throw new Error("La sesión venció. Debe iniciar sesión nuevamente.");
}
  console.log(response);

  if (!response.ok) {    
    const mensajeErrorApi = obtenerMensajeApi(data);
    
    if (response.status === 403 || mensajeErrorApi === "No tenes permiso para realizar esta accion") {
      toast.error("No tenés permisos para realizar esta acción");
      
      if (!window.location.pathname.includes("/inicio")) {
        window.location.replace("/planes/inicio");
      }

      throw new Error("Redirigiendo por falta de permisos...");
    }

    /*if(response.status==401){
      window.location.assign("/auth/login")
    }*/

    const errores = data.errors || {};
    const primerCampo = Object.keys(errores)[0];
    const primerError = primerCampo && Array.isArray(errores[primerCampo])
      ? errores[primerCampo][0]
      : errores[primerCampo];
    
    data.message = primerError || data.message || "No se pudo completar la operacion";
    
    // Si no fue error 403 ni 401 (o falló el reintento), mostramos el toast por defecto
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
