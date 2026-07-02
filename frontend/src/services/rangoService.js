import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Rangos Institucionales.
 * Se conecta con el endpoint de Flask: /rangos-institucionales
 */

const BASE_URL = "/rangos-institucionales";

export const rangoService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(rango) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(rango),
    });
  },

  actualizar(id, rango) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(rango),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
