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

  obtenerTodosEstado(estado = null) {
    const url = `${BASE_URL}?estado=${estado}`;
    return apiRequest(url);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  obtenerPorIdPersona(personaId) {
    return apiRequest(`${BASE_URL}/GetPersonaFromPersonaId?id=${personaId}`);
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
