/**
 * Servicio para la gestion de Sedes.
 * Se conecta con el endpoint de Flask: /sedes
 */

import { apiRequest } from "../api";

const BASE_URL = "/sedes";

export const sedeService = {
  /**
   * Obtiene todos los registros de Sedes desde la base de datos.
   */
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene una Sede por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo registro de Sede.
   */
  crear(sede) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(sede),
    });
  },

  /**
   * Actualiza una Sede existente.
   */
  actualizar(id, sede) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(sede),
    });
  },

  /**
   * Elimina una Sede por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
