import { apiRequest } from "../api";


export const modalidadService = {
  obtenerTodas() {
    return apiRequest("/modalidades");
  },
};
