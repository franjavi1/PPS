import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Rangos asociados a Legajos.
 * Se conecta con el endpoint de Flask: /legajo-rangos
 */

const BASE_URL = "/legajo-rangos";

export const legajoRangosService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(legajoRangos) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(legajoRangos),
    });
  },

  actualizar(id, legajoRangos) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(legajoRangos),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
