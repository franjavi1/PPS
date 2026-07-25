/**
 * Servicio para la gestion de Tipos de Legajo.
 * Se conecta con el endpoint de Flask: /tipos-legajo
 */

import { apiRequest } from "../api";

const BASE_URL = "/tipos-legajo";

export const tipoLegajoService = {
  /**
   * Obtiene todos los registros de Tipos de Legajo.
   */
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene un Tipo de Legajo por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo Tipo de Legajo.
   */
  crear(tipoLegajo) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoLegajo),
    });
  },

  /**
   * Actualiza un Tipo de Legajo existente.
   */
  actualizar(id, tipoLegajo) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoLegajo),
    });
  },

  /**
   * Elimina un Tipo de Legajo por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
