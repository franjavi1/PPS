import { apiRequest } from "../api";

const BASE_URL = "/pa-correlativas";

export const paCorrelativaService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(paCorrelativa) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(paCorrelativa),
    });
  },

  actualizar(id, paCorrelativa) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(paCorrelativa),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
