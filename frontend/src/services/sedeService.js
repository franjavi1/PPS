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
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      status: "success",
      data: [...mockSedes],
      message: "Colección de sedes recuperada con éxito",
      total: mockSedes.length,
    };
  },

  /**
   * Crea un nuevo registro de Sede.
   */
  async crear(sede) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!sede.nombre || !sede.direccion) {
      return {
        status: "error",
        message: "Error al crear sede. Faltan campos requeridos.",
        errors: {
          nombre: !sede.nombre ? "El nombre de la sede es requerido." : null,
          direccion: !sede.direccion ? "La dirección es requerida." : null,
        },
      };
    }
    const nuevo = {
      ...sede,
      id: mockSedes.length > 0 ? Math.max(...mockSedes.map((s) => s.id)) + 1 : 1,
    };
    mockSedes.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Sede creada exitosamente.",
    };
  },

  /**
   * Actualiza una Sede existente.
   */
  async actualizar(id, sede) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!sede.nombre || !sede.direccion) {
      return {
        status: "error",
        message: "Error al actualizar sede. Faltan campos requeridos.",
        errors: {
          nombre: !sede.nombre ? "El nombre de la sede es requerido." : null,
          direccion: !sede.direccion ? "La dirección es requerida." : null,
        },
      };
    }
    mockSedes = mockSedes.map((s) => (s.id === id ? { ...s, ...sede } : s));
    return {
      status: "success",
      data: { id, ...sede },
      message: "Sede actualizada exitosamente.",
    };
  },

  /**
   * Elimina una Sede por su ID.
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockSedes = mockSedes.filter((s) => s.id !== id);
    return {
      status: "success",
      data: { id },
      message: "Sede eliminada exitosamente.",
    };
  },
};
