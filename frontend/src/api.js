
import toast from "react-hot-toast";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/g1";


export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();

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
