import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Planes.
 * Se conecta con el endpoint de Flask: /planes
 */

const BASE_URL = "/planes";

export const planService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },
  obtenerCount() {
    return apiRequest(`${BASE_URL}/count`);
  },
  
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(plan) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(plan),
    });
  },

  actualizar(id, plan) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(plan),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
