/**
 * Servicio para la gestión de Personas.
 * Se conecta con el endpoint de Flask: /api/v1/personas
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100)), apellido (VARCHAR(100)), tipo_documento_id (FK), documento (VARCHAR(20) UNIQUE), email (VARCHAR(150) UNIQUE).
 */

const BASE_URL = "/api/v1/personas";

// Mock data inicial alineado con el esquema de base de datos
let mockPersonas = [
  {
    id: 1,
    nombre: "Juan Pablo",
    apellido: "González",
    td_id: 1,
    numero_doc: 32456789,
    estado: 1,
    usuario_accion: 1,
  },
  {
    id: 2,
    nombre: "María Belén",
    apellido: "López",
    td_id: 1,
    numero_doc: 28765432,
    estado: 1,
    usuario_accion: 1,
  },
  {
    id: 3,
    nombre: "Carlos Alberto",
    apellido: "Ramírez",
    td_id: 2,
    numero_doc: 31112223,
    estado: 1,
    usuario_accion: 1,
  },
];

export const personaService = {
  /**
   * Obtiene todos los registros de Personas.
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      status: "success",
      data: [...mockPersonas],
      message: "Colección de personas recuperada con éxito",
      total: mockPersonas.length,
    };
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
  async crear(persona) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!persona.nombre || !persona.apellido || !persona.numero_doc || !persona.td_id) {
      return {
        status: "error",
        message: "Error al crear persona. Faltan campos requeridos.",
        errors: {
          nombre: !persona.nombre ? "El nombre es requerido." : null,
          apellido: !persona.apellido ? "El apellido es requerido." : null,
          numero_doc: !persona.numero_doc ? "El documento es requerido." : null,
          td_id: !persona.td_id ? "El tipo de documento es requerido." : null,
        },
      };
    }
    const nuevo = {
      ...persona,
      id: mockPersonas.length > 0 ? Math.max(...mockPersonas.map((p) => p.id)) + 1 : 1,
      estado: 1,
    };
    mockPersonas.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Persona creada exitosamente.",
    };
  },

  /**
   * Actualiza una Persona existente.
   */
  async actualizar(id, persona) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!persona.nombre || !persona.apellido || !persona.numero_doc || !persona.td_id) {
      return {
        status: "error",
        message: "Error al actualizar persona. Faltan campos requeridos.",
        errors: {
          nombre: !persona.nombre ? "El nombre es requerido." : null,
          apellido: !persona.apellido ? "El apellido es requerido." : null,
          numero_doc: !persona.numero_doc ? "El documento es requerido." : null,
          td_id: !persona.td_id ? "El tipo de documento es requerido." : null,
        },
      };
    }
    mockPersonas = mockPersonas.map((p) => (p.id === parseInt(id, 10) ? { ...p, ...persona } : p));
    return {
      status: "success",
      data: { id, ...persona },
      message: "Persona actualizada exitosamente.",
    };
  },

  /**
   * Elimina una Persona por su ID.
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockPersonas = mockPersonas.filter((p) => p.id !== parseInt(id, 10));
    return {
      status: "success",
      data: { id },
      message: "Persona eliminada exitosamente.",
    };
  },
};
