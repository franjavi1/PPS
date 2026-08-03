/**
 * Servicio para la gestion de Tipos de Documento.
 * Se conecta con el endpoint de Flask: /tipos-documentos
 */

import { apiRequest } from "../api";

const BASE_URL = "/tipos-documentos";

export const tipoDocumentoService = {
 
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  
  crear(tipoDocumento) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoDocumento),
    });
  },


  
  actualizar(id, tipoDocumento) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoDocumento),
    });
  },


  
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
