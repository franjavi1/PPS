/**
 * Servicio para la gestión de Asignaturas.
 * Se conecta con el endpoint de Flask: /api/v1/asignaturas
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100)), codigo (VARCHAR(20) UNIQUE), departamento (VARCHAR(100)), estado (BOOLEAN).
 */

const BASE_URL = "/api/v1/asignaturas";

// Mock data inicial alineado con el esquema de base de datos
let mockAsignaturas = [
  { id: 1, nombre: "Combate de Incendios I", codigo: "INC-101", departamento: "Teórica", estado: true },
  { id: 2, nombre: "Primeros Auxilios y RCP", codigo: "PAU-102", departamento: "Práctica", estado: true },
  { id: 3, nombre: "Rescate Vehicular", codigo: "RES-201", departamento: "Taller", estado: true },
  { id: 4, nombre: "Materiales Peligrosos", codigo: "MAT-301", departamento: "Teórica", estado: false },
];

export const asignaturaService = {
  /**
   * Obtiene todos los registros de Asignaturas.
   */
  async obtenerTodas() {
    await new Promise((resolve) => setTimeout(resolve, 250));
    return {
      status: "success",
      data: [...mockAsignaturas],
      message: "Colección de asignaturas recuperada con éxito",
      total: mockAsignaturas.length,
    };
  },

  /**
   * Crea una nueva Asignatura en la base de datos.
   */
  async crear(asignatura) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (!asignatura.nombre || !asignatura.codigo || !asignatura.departamento) {
      return {
        status: "error",
        message: "Error al crear asignatura. Faltan campos requeridos.",
        errors: {
          nombre: !asignatura.nombre ? "El nombre de la asignatura es requerido." : null,
          codigo: !asignatura.codigo ? "El código es requerido." : null,
          departamento: !asignatura.departamento ? "El formato de asignatura es requerido." : null,
        },
      };
    }
    const nuevo = {
      ...asignatura,
      id: mockAsignaturas.length > 0 ? Math.max(...mockAsignaturas.map((a) => a.id)) + 1 : 1,
    };
    mockAsignaturas.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Asignatura creada exitosamente.",
    };
  },

  /**
   * Actualiza los datos de una Asignatura en PostgreSQL.
   */
  async actualizar(id, asignatura) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    if (!asignatura.nombre || !asignatura.codigo || !asignatura.departamento) {
      return {
        status: "error",
        message: "Error al actualizar asignatura. Faltan campos requeridos.",
        errors: {
          nombre: !asignatura.nombre ? "El nombre de la asignatura es requerido." : null,
          codigo: !asignatura.codigo ? "El código es requerido." : null,
          departamento: !asignatura.departamento ? "El formato de asignatura es requerido." : null,
        },
      };
    }
    mockAsignaturas = mockAsignaturas.map((a) => (a.id === id ? { ...a, ...asignatura } : a));
    return {
      status: "success",
      data: { id, ...asignatura },
      message: "Asignatura actualizada exitosamente.",
    };
  },

  /**
   * Realiza la baja lógica (cambio de estado booleano) de una Asignatura.
   */
  async cambiarEstado(id, nuevoEstado) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockAsignaturas = mockAsignaturas.map((a) => (a.id === id ? { ...a, estado: nuevoEstado } : a));
    return {
      status: "success",
      data: { id, estado: nuevoEstado },
      message: "Estado de la asignatura actualizado exitosamente.",
    };
  },
};
