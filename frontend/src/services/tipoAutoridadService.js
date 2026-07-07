import { apiRequest } from "../api";

const BASE_URL = "/tipos-autoridad";

export const tipoAutoridadService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(tipoAutoridad) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(tipoAutoridad),
    });
  },

  actualizar(id, tipoAutoridad) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(tipoAutoridad),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
