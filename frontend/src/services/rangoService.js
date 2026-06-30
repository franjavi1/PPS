/**
 * Servicio para la gestión de Rangos Institucionales.
 * Se conecta con el endpoint de Flask: /api/v1/rangos
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), descripcion (VARCHAR(100) UNIQUE), nivel_prioridad (INTEGER).
 */

const BASE_URL = "/api/v1/rangos";

// Mock data inicial alineado con el esquema de base de datos
let mockRangos = [
  { id: 1, descripcion: "Aspirante", nivelPrioridad: 1 },
  { id: 2, descripcion: "Bombero", nivelPrioridad: 2 },
  { id: 3, descripcion: "Cabo", nivelPrioridad: 3 },
  { id: 4, descripcion: "Sargento Primero", nivelPrioridad: 4 },
  { id: 5, descripcion: "Suboficial Mayor", nivelPrioridad: 5 },
  { id: 6, descripcion: "Oficial Inspector", nivelPrioridad: 6 },
];

export const rangoService = {
  /**
   * Obtiene todos los registros de Rangos.
   * Representa un GET a /api/v1/rangos
   */
  async obtenerTodos() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockRangos];
  },

  /**
   * Crea un nuevo registro de Rango.
   * Representa un POST a /api/v1/rangos
   * Payload esperado por Flask: { descripcion, nivelPrioridad }
   */
  async crear(rango) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nuevo = {
      ...rango,
      id: mockRangos.length > 0 ? Math.max(...mockRangos.map((r) => r.id)) + 1 : 1,
    };
    mockRangos.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza un Rango existente.
   * Representa un PUT a /api/v1/rangos/:id
   * Payload esperado por Flask: { descripcion, nivelPrioridad }
   */
  async actualizar(id, rango) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockRangos = mockRangos.map((r) => (r.id === id ? { ...r, ...rango } : r));
    return { id, ...rango };
  },

  /**
   * Elimina un Rango por su ID.
   * Representa un DELETE a /api/v1/rangos/:id
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockRangos = mockRangos.filter((r) => r.id !== id);
    return { success: true };
  },
};
