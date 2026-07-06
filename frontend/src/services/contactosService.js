/**
 * Servicio para la gestion de Contactos.
 * Se conecta con el endpoint de Flask: /contactos
 */

import { apiRequest } from "../api";

const BASE_URL = "/contactos";

export const contactosService = {
  /**
   * Obtiene todos los registros de Contactos desde la base de datos.
   */
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene un Contacto por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo registro de Contacto.
   */
  crear(contacto) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(contacto),
    });
  },

  /**
   * Actualiza un Contacto existente.
   */
  actualizar(id, contacto) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(contacto),
    });
  },

  /**
   * Elimina un Contacto por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
