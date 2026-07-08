import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Comisiones Asignaturas.
 * Se conecta con el endpoint de Flask: /comisiones-asignaturas
 */

const BASE_URL = "/comisiones-asignaturas";

export const comisionAsignaturaService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(comisionAsignatura) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(comisionAsignatura),
    });
  },

  actualizar(id, comisionAsignatura) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(comisionAsignatura),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
