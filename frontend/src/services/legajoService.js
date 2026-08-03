import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Legajos.
 * Se conecta con el endpoint de Flask: /legajo
 */

const BASE_URL = "/legajos";

export const legajoService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(legajo) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(legajo),
    });
  },

  actualizar(id, legajo) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(legajo),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
