import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Tipos de Planes.
 * Se conecta con el endpoint de Flask: /tipos-planes
 */

const BASE_URL = "/tipos-planes";

export const tipoPlanesService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(tipoPlan) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoPlan),
    });
  },

  actualizar(id, tipoPlan) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoPlan),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
