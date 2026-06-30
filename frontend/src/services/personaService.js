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
    tipoDocumentoId: 1,
    documento: "32456789",
    email: "jpgonzalez@bomberos.org",
  },
  {
    id: 2,
    nombre: "María Belén",
    apellido: "López",
    tipoDocumentoId: 1,
    documento: "28765432",
    email: "mblopez@bomberos.org",
  },
  {
    id: 3,
    nombre: "Carlos Alberto",
    apellido: "Ramírez",
    tipoDocumentoId: 2,
    documento: "31112223",
    email: "caramirez@bomberos.org",
  },
];

export const personaService = {
  /**
   * Obtiene todos los registros de Personas.
   * Representa un GET a /api/v1/personas
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockPersonas];
  },

  /**
   * Crea un nuevo registro de Persona.
   * Representa un POST a /api/v1/personas
   * Payload esperado por Flask: { nombre, apellido, tipoDocumentoId, documento, email }
   */
  async crear(persona) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nuevo = {
      ...persona,
      id: mockPersonas.length > 0 ? Math.max(...mockPersonas.map((p) => p.id)) + 1 : 1,
    };
    mockPersonas.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza una Persona existente.
   * Representa un PUT a /api/v1/personas/:id
   * Payload esperado por Flask: { nombre, apellido, tipoDocumentoId, documento, email }
   */
  async actualizar(id, persona) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockPersonas = mockPersonas.map((p) => (p.id === id ? { ...p, ...persona } : p));
    return { id, ...persona };
  },

  /**
   * Elimina una Persona por su ID.
   * Representa un DELETE a /api/v1/personas/:id
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockPersonas = mockPersonas.filter((p) => p.id !== id);
    return { success: true };
  },
};
