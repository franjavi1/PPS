/**
 * Servicio para la gestion de Datos Medicos.
 * Se conecta con el endpoint de Flask: /datos-medicos
 */

import { apiRequest } from "../api";

const BASE_URL = "/datos-medicos";

export const datosMedicosService = {
  /**
   * Obtiene todos los registros de Datos Medicos desde la base de datos.
   */
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene un registro de Datos Medicos por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo registro de Datos Medicos.
   */
  crear(datosMedicos) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(datosMedicos),
    });
  },

  /**
   * Actualiza un registro de Datos Medicos existente.
   */
  actualizar(id, datosMedicos) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(datosMedicos),
    });
  },

  /**
   * Elimina un registro de Datos Medicos por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
