/**
 * Servicio para la gestión de Aulas.
 * Se conecta con el endpoint de Flask: /api/v1/aulas
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100)), sede_id (FK), capacidad (INTEGER).
 */

const BASE_URL = "/api/v1/aulas";

// Mock data inicial alineado con el esquema de base de datos
let mockAulas = [
  { id: 1, nombre: "Aula Magna", sedeId: 1, capacidad: 40 },
  { id: 2, nombre: "Laboratorio de Simulación", sedeId: 1, capacidad: 15 },
  { id: 3, nombre: "Aula Técnica", sedeId: 2, capacidad: 25 },
];

export const aulaService = {
  /**
   * Obtiene todos los registros de Aulas.
   * Representa un GET a /api/v1/aulas
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockAulas];
  },

  /**
   * Crea un nuevo registro de Aula.
   * Representa un POST a /api/v1/aulas
   * Payload esperado por Flask: { nombre, sedeId, capacidad }
   */
  async crear(aula) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nuevo = {
      ...aula,
      id: mockAulas.length > 0 ? Math.max(...mockAulas.map((a) => a.id)) + 1 : 1,
    };
    mockAulas.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza un Aula existente.
   * Representa un PUT a /api/v1/aulas/:id
   * Payload esperado por Flask: { nombre, sedeId, capacidad }
   */
  async actualizar(id, aula) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockAulas = mockAulas.map((a) => (a.id === id ? { ...a, ...aula } : a));
    return { id, ...aula };
  },

  /**
   * Elimina un Aula por su ID.
   * Representa un DELETE a /api/v1/aulas/:id
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockAulas = mockAulas.filter((a) => a.id !== id);
    return { success: true };
  },
};
