/**
 * Servicio para la gestion de Tipos de Sede.
 * Se conecta con el endpoint de Flask: /tipos-sedes
 */

import { apiRequest } from "../api";

const BASE_URL = "/tipos-sedes";

export const tipoSedeService = {
  /**
   * Obtiene todos los registros de Tipos de Sede desde la base de datos.
   */
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene un Tipo de Sede por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo registro de Tipo de Sede.
   */
  crear(tipoSede) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoSede),
    });
  },

  /**
   * Actualiza un Tipo de Sede existente.
   */
  actualizar(id, tipoSede) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoSede),
    });
  },

  /**
   * Elimina un Tipo de Sede por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
