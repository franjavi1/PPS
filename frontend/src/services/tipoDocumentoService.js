/**
 * Servicio para la gestión de Tipos de Documento.
 * Se conecta con el endpoint de Flask: /api/v1/tipos-documentos
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(50)), descripcion (TEXT).
 */

const BASE_URL = "/api/v1/tipos-documentos";

// Mock data inicial alineado con el esquema de base de datos
let mockTipos = [
  { id: 1, nombre: "DNI", descripcion: "Documento Nacional de Identidad" },
  { id: 2, nombre: "PASAPORTE", descripcion: "Pasaporte Internacional" },
  { id: 3, nombre: "LC", descripcion: "Libreta Cívica" },
  { id: 4, nombre: "LE", descripcion: "Libreta de Enrolamiento" },
  { id: 5, nombre: "CI", descripcion: "Cédula de Identidad" },
];

export const tipoDocumentoService = {
  /**
   * Obtiene todos los registros de Tipos de Documento.
   */
  async obtenerTodos() {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      status: "success",
      data: [...mockTipos],
      message: "Colección de tipos de documento recuperada con éxito",
      total: mockTipos.length,
    };
  },

  /**
   * Crea un nuevo Tipo de Documento.
   */
  async crear(tipo) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!tipo.nombre || !tipo.descripcion) {
      return {
        status: "error",
        message: "Error al crear tipo de documento. Faltan campos requeridos.",
        errors: {
          nombre: !tipo.nombre ? "El nombre es requerido." : null,
          descripcion: !tipo.descripcion ? "La descripción es requerida." : null,
        },
      };
    }
    const nuevo = {
      ...tipo,
      id: mockTipos.length > 0 ? Math.max(...mockTipos.map((t) => t.id)) + 1 : 1,
    };
    mockTipos.push(nuevo);
    return {
      status: "success",
      data: nuevo,
      message: "Tipo de documento creado exitosamente.",
    };
  },

  /**
   * Actualiza un Tipo de Documento existente.
   */
  async actualizar(id, tipo) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    if (!tipo.nombre || !tipo.descripcion) {
      return {
        status: "error",
        message: "Error al actualizar tipo de documento. Faltan campos requeridos.",
        errors: {
          nombre: !tipo.nombre ? "El nombre es requerido." : null,
          descripcion: !tipo.descripcion ? "La descripción es requerida." : null,
        },
      };
    }
    mockTipos = mockTipos.map((t) => (t.id === id ? { ...t, ...tipo } : t));
    return {
      status: "success",
      data: { id, ...tipo },
      message: "Tipo de documento actualizado exitosamente.",
    };
  },

  /**
   * Elimina un Tipo de Documento por su ID.
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockTipos = mockTipos.filter((t) => t.id !== id);
    return {
      status: "success",
      data: { id },
      message: "Tipo de documento eliminado exitosamente.",
    };
  },
};
