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
    tipo_documento_id: 1,
    documento: "32456789",
    email: "jpgonzalez@bomberos.org",
  },
  {
    id: 2,
    nombre: "María Belén",
    apellido: "López",
    tipo_documento_id: 1,
    documento: "28765432",
    email: "mblopez@bomberos.org",
  },
  {
    id: 3,
    nombre: "Carlos Alberto",
    apellido: "Ramírez",
    tipo_documento_id: 2,
    documento: "31112223",
    email: "caramirez@bomberos.org",
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
   * Crea un nuevo registro de Persona.
   */
  async crear(persona) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!persona.nombre || !persona.apellido || !persona.documento || !persona.tipo_documento_id) {
      return {
        status: "error",
        message: "Error al crear persona. Faltan campos requeridos.",
        errors: {
          nombre: !persona.nombre ? "El nombre es requerido." : null,
          apellido: !persona.apellido ? "El apellido es requerido." : null,
          documento: !persona.documento ? "El documento es requerido." : null,
          tipo_documento_id: !persona.tipo_documento_id ? "El tipo de documento es requerido." : null,
        },
      };
    }
    const nuevo = {
      ...persona,
      id: mockPersonas.length > 0 ? Math.max(...mockPersonas.map((p) => p.id)) + 1 : 1,
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
    if (!persona.nombre || !persona.apellido || !persona.documento || !persona.tipo_documento_id) {
      return {
        status: "error",
        message: "Error al actualizar persona. Faltan campos requeridos.",
        errors: {
          nombre: !persona.nombre ? "El nombre es requerido." : null,
          apellido: !persona.apellido ? "El apellido es requerido." : null,
          documento: !persona.documento ? "El documento es requerido." : null,
          tipo_documento_id: !persona.tipo_documento_id ? "El tipo de documento es requerido." : null,
        },
      };
    }
    mockPersonas = mockPersonas.map((p) => (p.id === id ? { ...p, ...persona } : p));
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
    mockPersonas = mockPersonas.filter((p) => p.id !== id);
    return {
      status: "success",
      data: { id },
      message: "Persona eliminada exitosamente.",
    };
  },
};
