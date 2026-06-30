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
    asignatura_id: 1,
    aula_id: 1,
    cupo_maximo: 30,
    inscritos: 18,
  },
  {
    id: 2,
    nombre: "Comisión B - Sábados",
    asignatura_id: 2,
    aula_id: 2,
    cupo_maximo: 15,
    inscritos: 12,
  },
];

export const comisionService = {
  /**
   * Obtiene todos los registros de Comisiones.
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      status: "success",
      data: [...mockComisiones],
      message: "Colección de comisiones recuperada con éxito",
      total: mockComisiones.length,
    };
  },

  /**
   * Crea un nuevo registro de Comisión.
   */
  async crear(comision) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!comision.nombre || !comision.asignatura_id || !comision.aula_id || !comision.cupo_maximo) {
      return {
        status: "error",
        message: "Error al crear comisión. Faltan campos requeridos.",
        errors: {
          nombre: !comision.nombre ? "El nombre de la comisión es requerido." : null,
          asignatura_id: !comision.asignatura_id ? "La asignatura es requerida." : null,
          aula_id: !comision.aula_id ? "El aula es requerida." : null,
          cupo_maximo: !comision.cupo_maximo ? "El cupo máximo es requerido." : null,
        },
      };
    }
    const nuevo = {
      ...comision,
      id: mockComisiones.length > 0 ? Math.max(...mockComisiones.map((c) => c.id)) + 1 : 1,
    };
    mockComisiones.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Comisión creada exitosamente.",
    };
  },

  /**
   * Actualiza una Comisión existente.
   */
  async actualizar(id, comision) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!comision.nombre || !comision.asignatura_id || !comision.aula_id || !comision.cupo_maximo) {
      return {
        status: "error",
        message: "Error al actualizar comisión. Faltan campos requeridos.",
        errors: {
          nombre: !comision.nombre ? "El nombre de la comisión es requerido." : null,
          asignatura_id: !comision.asignatura_id ? "La asignatura es requerida." : null,
          aula_id: !comision.aula_id ? "El aula es requerida." : null,
          cupo_maximo: !comision.cupo_maximo ? "El cupo máximo es requerido." : null,
        },
      };
    }
    mockComisiones = mockComisiones.map((c) => (c.id === id ? { ...c, ...comision } : c));
    return {
      status: "success",
      data: { id, ...comision },
      message: "Comisión actualizada exitosamente.",
    };
  },

  /**
   * Elimina una Comisión por su ID.
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockComisiones = mockComisiones.filter((c) => c.id !== id);
    return {
      status: "success",
      data: { id },
      message: "Comisión eliminada exitosamente.",
    };
  },
};
