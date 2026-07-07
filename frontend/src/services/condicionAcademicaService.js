import { apiRequest } from "../api";

const BASE_URL = "/condiciones-academicas";

export const condicionAcademicaService = {
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  obtenerPorId(id) {
    return apiRequest(`${BASE_URL}/${id}`);
  },

  crear(condicionAcademica) {
    return apiRequest(BASE_URL, {
      method: "POST",
      body: JSON.stringify(condicionAcademica),
    });
  },

  actualizar(id, condicionAcademica) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(condicionAcademica),
    });
  },

  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
