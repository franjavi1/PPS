import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Planes Asignaturas.
 * Se conecta con el endpoint de Flask: /planes-asignaturas
 */

const BASE_URL = "/planes-asignaturas";

export const planAsignaturaService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(planAsignatura) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(planAsignatura),
    });
  },

  actualizar(id, planAsignatura) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(planAsignatura),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
