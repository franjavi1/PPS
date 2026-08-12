import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Legajos asociados a Sedes.
 * Se conecta con el endpoint de Flask: /legajo-sedes
 */

const BASE_URL = "/legajo-sedes";

export const legajoSedesService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },
  
  obtenerPorLegajoId(legajoId) {
    return apiRequest(`/legajos/${legajoId}/sedes`);
  },

  crear(legajoSedes) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(legajoSedes),
    });
  },

  actualizar(id, legajoSedes) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(legajoSedes),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
