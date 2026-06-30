/**
 * Servicio para la gestión de Aulas.
 * Se conecta con el endpoint de Flask: /api/v1/aulas
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100)), sede_id (FK), capacidad (INTEGER).
 */

const BASE_URL = "/api/v1/aulas";

// Mock data inicial alineado con el esquema de base de datos
let mockAulas = [
  { id: 1, nombre: "Aula Magna", sede_id: 1, capacidad: 40 },
  { id: 2, nombre: "Laboratorio de Simulación", sede_id: 1, capacidad: 15 },
  { id: 3, nombre: "Aula Técnica", sede_id: 2, capacidad: 25 },
];

export const aulaService = {
  /**
   * Obtiene todos los registros de Aulas.
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      status: "success",
      data: [...mockAulas],
      message: "Colección de aulas recuperada con éxito",
      total: mockAulas.length,
    };
  },

  /**
   * Crea un nuevo registro de Aula.
   */
  async crear(aula) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!aula.nombre || !aula.sede_id || !aula.capacidad) {
      return {
        status: "error",
        message: "Error al crear aula. Faltan campos requeridos.",
        errors: {
          nombre: !aula.nombre ? "El nombre del aula es requerido." : null,
          sede_id: !aula.sede_id ? "La sede es requerida." : null,
          capacidad: !aula.capacidad ? "La capacidad es requerida." : null,
        },
      };
    }
    const nuevo = {
      ...aula,
      id: mockAulas.length > 0 ? Math.max(...mockAulas.map((a) => a.id)) + 1 : 1,
    };
    mockAulas.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Aula creada exitosamente.",
    };
  },

  /**
   * Actualiza un Aula existente.
   */
  async actualizar(id, aula) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!aula.nombre || !aula.sede_id || !aula.capacidad) {
      return {
        status: "error",
        message: "Error al actualizar aula. Faltan campos requeridos.",
        errors: {
          nombre: !aula.nombre ? "El nombre del aula es requerido." : null,
          sede_id: !aula.sede_id ? "La sede es requerida." : null,
          capacidad: !aula.capacidad ? "La capacidad es requerida." : null,
        },
      };
    }
    mockAulas = mockAulas.map((a) => (a.id === id ? { ...a, ...aula } : a));
    return {
      status: "success",
      data: { id, ...aula },
      message: "Aula actualizada exitosamente.",
    };
  },

  /**
   * Elimina un Aula por su ID.
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockAulas = mockAulas.filter((a) => a.id !== id);
    return {
      status: "success",
      data: { id },
      message: "Aula eliminada exitosamente.",
    };
  },
};
