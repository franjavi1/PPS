// frontend/src/services/api.jsx
import toast from "react-hot-toast";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/g1";

// compatible para js
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

// compatible para jsx
export const api = {
  get: (path) => apiRequest(path, { method: "GET" }),
  
  post: (path, body) => apiRequest(path, { 
    method: "POST", 
    body: JSON.stringify(body) 
  }),
  
  put: (path, body) => apiRequest(path, { 
    method: "PUT", 
    body: JSON.stringify(body) 
  }),
  
  delete: (path) => apiRequest(path, { method: "DELETE" }),
};

export default api;