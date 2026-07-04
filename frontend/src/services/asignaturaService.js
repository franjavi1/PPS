import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Asignaturas.
 * Se conecta con el endpoint de Flask: /asignaturas
 */

const BASE_URL = "/asignaturas";

export const asignaturaService = {
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(asignatura) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(asignatura),
    });
  },

  actualizar(id, asignatura) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(asignatura),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
