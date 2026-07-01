/**
 * Servicio para la gestion de Personas.
 * Se conecta con el endpoint de Flask: /personas
 */

import { apiRequest } from "../api";

const BASE_URL = "/personas";

export const personaService = {
  /**
   * Obtiene todos los registros de Personas desde la base de datos.
   */
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene una Persona por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo registro de Persona.
   */
  crear(persona) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(persona),
    });
  },

  /**
   * Actualiza una Persona existente.
   */
  actualizar(id, persona) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(persona),
    });
  },

  /**
   * Elimina una Persona por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
