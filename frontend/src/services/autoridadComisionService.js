import { apiRequest } from "../api";

const BASE_URL = "/autoridades-comision";

export const autoridadComisionService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(autoridadComision) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(autoridadComision),
    });
  },

  actualizar(id, autoridadComision) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(autoridadComision),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
