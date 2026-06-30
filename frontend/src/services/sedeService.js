/**
 * Servicio para la gestión de Sedes físicas.
 * Se conecta con el endpoint de Flask: /api/v1/sedes
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100) UNIQUE), direccion (TEXT).
 */

const BASE_URL = "/api/v1/sedes";

// Mock data inicial alineado con el esquema de base de datos
let mockSedes = [
  { id: 1, nombre: "Cuartel Central", direccion: "Av. Corrientes 1234" },
  { id: 2, nombre: "Destacamento N° 1", direccion: "Calle Belgrano 567" },
];

export const sedeService = {
  /**
   * Obtiene todos los registros de Sedes.
   * Representa un GET a /api/v1/sedes
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockSedes];
  },

  /**
   * Crea un nuevo registro de Sede.
   * Representa un POST a /api/v1/sedes
   * Payload esperado por Flask: { nombre, direccion }
   */
  async crear(sede) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nuevo = {
      ...sede,
      id: mockSedes.length > 0 ? Math.max(...mockSedes.map((s) => s.id)) + 1 : 1,
    };
    mockSedes.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza una Sede existente.
   * Representa un PUT a /api/v1/sedes/:id
   * Payload esperado por Flask: { nombre, direccion }
   */
  async actualizar(id, sede) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockSedes = mockSedes.map((s) => (s.id === id ? { ...s, ...sede } : s));
    return { id, ...sede };
  },

  /**
   * Elimina una Sede por su ID.
   * Representa un DELETE a /api/v1/sedes/:id
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockSedes = mockSedes.filter((s) => s.id !== id);
    return { success: true };
  },
};
