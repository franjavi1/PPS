import { apiRequest } from "../api";

const BASE_URL = "/alumnos-comision";

export const alumnoComisionService = {
  obtenerTodos() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(alumnoComision) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(alumnoComision),
    });
  },

  actualizar(id, alumnoComision) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(alumnoComision),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
