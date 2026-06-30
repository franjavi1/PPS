/**
 * Servicio para la gestión de Asignaturas.
 * Se conecta con el endpoint de Flask: /api/v1/asignaturas
 * La base de datos PostgreSQL correspondiente almacena: id (SERIAL), nombre (VARCHAR(100)), codigo (VARCHAR(20) UNIQUE), departamento (VARCHAR(100)), estado (BOOLEAN).
 */

const BASE_URL = "/api/v1/asignaturas";

// Mock data inicial alineado con el esquema de base de datos
let mockAsignaturas = [
  { id: 1, nombre: "Combate de Incendios I", codigo: "INC-101", departamento: "Operaciones", estado: true },
  { id: 2, nombre: "Primeros Auxilios y RCP", codigo: "PAU-102", departamento: "Sanidad", estado: true },
  { id: 3, nombre: "Rescate Vehicular", codigo: "RES-201", departamento: "Operaciones", estado: true },
  { id: 4, nombre: "Materiales Peligrosos", codigo: "MAT-301", departamento: "Especialidades", estado: false },
];

export const asignaturaService = {
  /**
   * Obtiene todos los registros de Asignaturas.
   * Representa un GET a /api/v1/asignaturas
   */
  async obtenerTodas() {
    // Simula una petición asíncrona a través del gateway
    await new Promise((resolve) => setTimeout(resolve, 250));
    return [...mockAsignaturas];
  },

  /**
   * Crea una nueva Asignatura en la base de datos.
   * Representa un POST a /api/v1/asignaturas
   * Payload esperado por Flask: { nombre, codigo, departamento, estado }
   */
  async crear(asignatura) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    const nuevo = {
      ...asignatura,
      id: mockAsignaturas.length > 0 ? Math.max(...mockAsignaturas.map((a) => a.id)) + 1 : 1,
    };
    mockAsignaturas.push(nuevo);
    return nuevo;
  },

  /**
   * Actualiza los datos de una Asignatura en PostgreSQL.
   * Representa un PUT a /api/v1/asignaturas/:id
   * Payload esperado por Flask: { nombre, codigo, departamento, estado }
   */
  async actualizar(id, asignatura) {
    await new Promise((resolve) => setTimeout(resolve, 250));
    mockAsignaturas = mockAsignaturas.map((a) => (a.id === id ? { ...a, ...asignatura } : a));
    return { id, ...asignatura };
  },

  /**
   * Realiza la baja lógica (cambio de estado booleano) de una Asignatura.
   * Representa un PATCH a /api/v1/asignaturas/:id/estado
   * Payload esperado por Flask: { estado: boolean }
   */
  async cambiarEstado(id, nuevoEstado) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    mockAsignaturas = mockAsignaturas.map((a) => (a.id === id ? { ...a, estado: nuevoEstado } : a));
    return { id, estado: nuevoEstado };
  },
};
