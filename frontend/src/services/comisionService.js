/**
 * Servicio para la gestión de Comisiones de Cursada.
 * Se conecta con el endpoint de Flask: /api/v1/comisiones
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100)), asignatura_id (FK), aula_id (FK), cupo_maximo (INTEGER), inscritos (INTEGER).
 */

const BASE_URL = "/api/v1/comisiones";

// Mock data inicial alineado con el esquema de base de datos
let mockComisiones = [
  {
    id: 1,
    nombre: "Comisión A - Turno Noche",
    asignaturaId: 1,
    aulaId: 1,
    cupoMaximo: 30,
    inscritos: 18,
  },
  {
    id: 2,
    nombre: "Comisión B - Sábados",
    asignaturaId: 2,
    aulaId: 2,
    cupoMaximo: 15,
    inscritos: 12,
  },
];

export const comisionService = {
  /**
   * Obtiene todos los registros de Comisiones.
   * Representa un GET a /api/v1/comisiones
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockComisiones];
  },

  /**
   * Crea un nuevo registro de Comisión.
   * Representa un POST a /api/v1/comisiones
   * Payload esperado por Flask: { nombre, asignaturaId, aulaId, cupoMaximo, inscritos }
   */
  async crear(comision) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nuevo = {
      ...comision,
      id: mockComisiones.length > 0 ? Math.max(...mockComisiones.map((c) => c.id)) + 1 : 1,
    };
    mockComisiones.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza una Comisión existente.
   * Representa un PUT a /api/v1/comisiones/:id
   * Payload esperado por Flask: { nombre, asignaturaId, aulaId, cupoMaximo, inscritos }
   */
  async actualizar(id, comision) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockComisiones = mockComisiones.map((c) => (c.id === id ? { ...c, ...comision } : c));
    return { id, ...comision };
  },

  /**
   * Elimina una Comisión por su ID.
   * Representa un DELETE a /api/v1/comisiones/:id
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockComisiones = mockComisiones.filter((c) => c.id !== id);
    return { success: true };
  },
};
