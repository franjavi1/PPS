/**
 * Servicio para la gestión de Rangos Institucionales.
 * Se conecta con el endpoint de Flask: /api/v1/rangos
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), descripcion (VARCHAR(100) UNIQUE), nivel_prioridad (INTEGER).
 */

const BASE_URL = "/api/v1/rangos";

// Mock data inicial alineado con el esquema de base de datos
let mockRangos = [
  { id: 1, descripcion: "Aspirante", nivel_prioridad: 1 },
  { id: 2, descripcion: "Bombero", nivel_prioridad: 2 },
  { id: 3, descripcion: "Cabo", nivel_prioridad: 3 },
  { id: 4, descripcion: "Sargento Primero", nivel_prioridad: 4 },
  { id: 5, descripcion: "Suboficial Mayor", nivel_prioridad: 5 },
  { id: 6, descripcion: "Oficial Inspector", nivel_prioridad: 6 },
];

export const rangoService = {
  /**
   * Obtiene todos los registros de Rangos.
   */
  async obtenerTodos() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      status: "success",
      data: [...mockRangos],
      message: "Colección de rangos recuperada con éxito",
      total: mockRangos.length,
    };
  },

  /**
   * Crea un nuevo registro de Rango.
   */
  async crear(rango) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!rango.descripcion || !rango.nivel_prioridad) {
      return {
        status: "error",
        message: "Error al crear rango. Faltan campos requeridos.",
        errors: {
          descripcion: !rango.descripcion ? "La descripción es requerida." : null,
          nivel_prioridad: !rango.nivel_prioridad ? "El nivel de prioridad es requerido." : null,
        },
      };
    }
    const nuevo = {
      ...rango,
      id: mockRangos.length > 0 ? Math.max(...mockRangos.map((r) => r.id)) + 1 : 1,
    };
    mockRangos.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Rango creado exitosamente.",
    };
  },

  /**
   * Actualiza un Rango existente.
   */
  async actualizar(id, rango) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!rango.descripcion || !rango.nivel_prioridad) {
      return {
        status: "error",
        message: "Error al actualizar rango. Faltan campos requeridos.",
        errors: {
          descripcion: !rango.descripcion ? "La descripción es requerida." : null,
          nivel_prioridad: !rango.nivel_prioridad ? "El nivel de prioridad es requerido." : null,
        },
      };
    }
    mockRangos = mockRangos.map((r) => (r.id === id ? { ...r, ...rango } : r));
    return {
      status: "success",
      data: { id, ...rango },
      message: "Rango actualizado exitosamente.",
    };
  },

  /**
   * Elimina un Rango por su ID.
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockRangos = mockRangos.filter((r) => r.id !== id);
    return {
      status: "success",
      data: { id },
      message: "Rango eliminado exitosamente.",
    };
  },
};
