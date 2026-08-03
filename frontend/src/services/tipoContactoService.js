/**
 * Servicio para la gestion de Tipos de Contacto.
 * Se conecta con el endpoint de Flask: /tipos-contacto
 */

import { apiRequest } from "../api";

const BASE_URL = "/tipos-contacto";

export const tipoContactoService = {
 
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  
  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  
  crear(tipoContacto) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoContacto),
    });
  },


  
  actualizar(id, tipoContacto) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoContacto),
    });
  },


  
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
