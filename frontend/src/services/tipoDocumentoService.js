/**
 * Servicio para la gestion de Tipos de Documento.
 * Se conecta con el endpoint de Flask: /tipos-documentos
 */

import { apiRequest } from "../api";

const BASE_URL = "/tipos-documentos";

export const tipoDocumentoService = {
  /**
   * Obtiene todos los registros de Tipos de Documento desde la base de datos.
   */
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene un Tipo de Documento por su ID.
   */
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  /**
   * Crea un nuevo Tipo de Documento.
   */
  crear(tipoDocumento) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoDocumento),
    });
  },

  /**
   * Actualiza un Tipo de Documento existente.
   */
  actualizar(id, tipoDocumento) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoDocumento),
    });
  },

  /**
   * Elimina un Tipo de Documento por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
