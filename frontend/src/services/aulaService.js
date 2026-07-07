import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Aulas.
 * Se conecta con el endpoint de Flask: /aulas
 */

const BASE_URL = "/aulas";

export const aulaService = {
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(aula) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(aula),
    });
  },

  actualizar(id, aula) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(aula),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
