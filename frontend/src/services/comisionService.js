import { apiRequest } from "../api";

/**
 * Servicio para la gestion de Comisiones.
 * Se conecta con el endpoint de Flask: /comisiones
 */

const BASE_URL = "/comisiones";

export const comisionService = {
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },
  obtenerCount() {
    return apiRequest(`${BASE_URL}/count`);
  },


  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(comision) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(comision),
    });
  },

  actualizar(id, comision) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(comision),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
