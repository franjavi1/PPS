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
   * Representa un GET a /api/v1/tipos-documentos
   */
  async obtenerTodos() {
    // Simulación de retraso de red de llamada asincrónica
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...mockTipos];
  },

  /**
   * Crea un nuevo Tipo de Documento.
   * Representa un POST a /api/v1/tipos-documentos
   * Payload esperado por Flask: { nombre, descripcion }
   */
  async crear(tipo) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const nuevo = {
      ...tipo,
      id: mockTipos.length > 0 ? Math.max(...mockTipos.map((t) => t.id)) + 1 : 1,
    };
    mockTipos.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza un Tipo de Documento existente.
   * Representa un PUT a /api/v1/tipos-documentos/:id
   * Payload esperado por Flask: { nombre, descripcion }
   */
  async actualizar(id, tipo) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockTipos = mockTipos.map((t) => (t.id === id ? { ...t, ...tipo } : t));
    return { id, ...tipo };
  },

  /**
   * Elimina un Tipo de Documento por su ID.
   * Representa un DELETE a /api/v1/tipos-documentos/:id
   */
  async eliminar(id) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockTipos = mockTipos.filter((t) => t.id !== id);
    return { success: true };
  },
};
