import toast from "react-hot-toast";
import { AUTH_API, STORAGE_KEY, LOGIN_ROUTE } from "./auth/config";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_URL = isLocal
  ? "http://localhost:8480/api/planes"
  : "http://186.19.137.9:8480/api/planes";


export const MENU_ROUTE = isLocal
  ? "http://localhost:8480"
  : "http://186.19.137.9:8480";

//export const API_URL = "http://186.19.137.9:8480/api/planes";

function obtenerSesion() {
  const data = sessionStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}


export async function apiRequest(path, options = {}) {
  debugger;
  const sesion = obtenerSesion();
  const response = await fetch(`${API_URL}${path}`, {
  headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      Authorization: `Bearer ${sesion.access_token}`
    },
    ...options,
  });

  const data = await response.json();
  console.log(response.error);

  if(response.status==401){
      window.location.assign("/auth/login")
    }

  if (!response.ok) {
    const errores = data.errors || {};
    const primerCampo = Object.keys(errores)[0];
    const primerError = primerCampo && Array.isArray(errores[primerCampo])
      ? errores[primerCampo][0]
      : errores[primerCampo];
    
    if (response.status == 401 && sesion?.refresh_token) {
      try {
        const nuevoToken = await refrescarToken();

        res = await fetch(`${API_URL}/${path}`, {
          ...options,
          headers: construirHeaders(options, nuevoToken),
        });
      } catch (error) {
        // Si no fue posible renovar la sesión, elimina la información local y redirige al login
        authService.clearSession();
        window.location.assign(LOGIN_ROUTE);

        throw error;
      }
    }
    
    data.message = primerError || data.message || "No se pudo completar la operacion";
    toast.error(data.message);
    throw data;
  }

  return data;
}


