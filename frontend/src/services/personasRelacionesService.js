/**
 * Servicio para la gestion de Personas.
 * Se conecta con el endpoint de Flask: /personas
 */

import { apiRequest } from "../api";

const BASE_URL = "/personas";

export const personaRelacionesService = {
  /**
   * Obtiene todos los registros de Personas desde la base de datos.
   */
  obtenerTodas() {
    return apiRequest(BASE_URL);
  },

  /**
   * Obtiene una persona específica por su ID.
   */
  async obtenerPorId(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const persona = mockPersonas.find((p) => p.id === parseInt(id, 10));
    if (!persona) {
      return {
        status: "error",
        message: "Persona no encontrada.",
      };
    }
    return {
      status: "success",
      data: persona,
      message: "Persona recuperada con éxito",
    };
  },

  /**
   * Crea un nuevo registro de Persona.
   */
  
  crear_datos_medicos_de_persona(datos_medicos, persona_id) {
    return apiRequest(`/personas/${persona_id}/datos-medicos`, {
      method: "POST",
      body: JSON.stringify(datos_medicos),
    });
  },
  
  crear_legajo_de_rango(datos_legajo, legajo_id) {
    debugger;
    return apiRequest(`/legajos/${legajo_id}/rangos`, {
      method: "POST",
      body: JSON.stringify(datos_legajo),
    });
  },
  
  crear_legajo_de_sedes(datos_legajo, legajo_id) {
    return apiRequest(`/legajos/${nuevoLegajoId}/sedes`, {
      method: "POST",
      body: JSON.stringify(datos_legajo),
    });
  },
  
  editar_persona_relacion_ususario(datos_persona, usuario_id, peronsa_id) {
    return apiRequest(`/personas/${peronsa_id}`, {
      method: "PUT",
      body: JSON.stringify(datos_persona, usuario_id),
    });
  },

  /**
   * Actualiza una Persona existente.
   */
  actualizar(id, persona) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: JSON.stringify(persona),
    });
  },

  /**
   * Elimina una Persona por su ID.
   */
  eliminar(id) {
    return apiRequest(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
  },
};
