import { apiRequestAuth } from "../api";

/**
 * Peticiones del alta de persona hacia el microservicio AUTH.
 *
 * API_URL_AUTH ya termina en /api/auth, por eso los paths de este
 * servicio no deben volver a comenzar con /auth.
 */
export const datosAuthService = {
  obtenerRoles() {
    return apiRequestAuth("/roles");
  },

  exportarDatosPersona(personaConRoles) {
    return apiRequestAuth("/usuarios/completo-con-roles", {
      method: "POST",
      body: JSON.stringify(personaConRoles),
    });
  },
};
