import toast from "react-hot-toast";
import { STORAGE_KEY } from "./auth/config";

const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export const API_URL = isLocal
  ? "http://localhost:8480/api/planes"
  : "http://186.19.137.9:8480/api/planes";

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
  console.log(response);

  if (!response.ok) {
    const errores = data.errors || {};
    const primerCampo = Object.keys(errores)[0];
    const primerError = primerCampo && Array.isArray(errores[primerCampo])
      ? errores[primerCampo][0]
      : errores[primerCampo];

    data.message = primerError || data.message || "No se pudo completar la operacion";
    toast.error(data.message);
    throw data;
  }

  return data;
}


