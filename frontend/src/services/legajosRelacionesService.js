import { apiRequest } from "../api";

/**
 * Servicio para la gestión de relaciones y operaciones agrupadas 
 * del alta guiada de personas, legajos, datos médicos, rangos, sedes y usuarios.
 */
export const legajosRelacionesService = {
  crearLegajoDePersona(personaId, datosLegajo) {
    return apiRequest(`/personas/${personaId}/legajo`, {
      method: "POST",
      body: JSON.stringify(datosLegajo),
    });
  },

  crearDatosMedicos(personaId, datosMedicos) {
    return apiRequest(`/personas/${personaId}/datos-medicos`, {
      method: "POST",
      body: JSON.stringify(datosMedicos),
    });
  },

  crearRangoLegajo(legajoId, datosRango) {
    return apiRequest(`/legajos/${legajoId}/rangos`, {
      method: "POST",
      body: JSON.stringify(datosRango),
    });
  },

  crearSedeLegajo(legajoId, datosSede) {
    return apiRequest(`/legajos/${legajoId}/sedes`, {
      method: "POST",
      body: JSON.stringify(datosSede),
    });
  },

  solicitarUsuario(personaId, payload) {
    return apiRequest(`/personas/${personaId}/usuario`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  actualizarPersona(personaId, datosPersona) {
    return apiRequest(`/personas/${personaId}`, {
      method: "PUT",
      body: JSON.stringify(datosPersona),
    });
  },
};