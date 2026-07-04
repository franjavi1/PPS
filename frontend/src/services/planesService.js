// Service para manejar los planes de estudio

// Esta url queda preparada para cuando exista el endpoint real del backend
const BASE_URL = "/api/v1/planes";

// Datos falsos para poder probar el front sin depender del backend
let mockPlanes = [
  {
    // Id unico del plan
    id: 1,

    // Nombre del plan
    nombre: "Plan de Formacion Inicial Bombero",

    // Descripcion corta del plan
    descripcion: "Plan basico para aspirantes a bombero.",

    // Modalidad de cursada
    modalidad: "Presencial",

    // Regimen del plan
    regimen: "Anual",

    // Duracion aproximada
    duracion: "12 meses",

    // Rango minimo necesario
    rango_minimo: "Aspirante",

    // Estado activo o inactivo
    estado: true,
  },
  {
    // Id unico del plan
    id: 2,

    // Nombre del plan
    nombre: "Plan de Capacitacion Operativa",

    // Descripcion corta del plan
    descripcion: "Plan orientado a personal operativo activo.",

    // Modalidad de cursada
    modalidad: "Mixta",

    // Regimen del plan
    regimen: "Cuatrimestral",

    // Duracion aproximada
    duracion: "6 meses",

    // Rango minimo necesario
    rango_minimo: "Bombero",

    // Estado activo o inactivo
    estado: true,
  },
  {
    // Id unico del plan
    id: 3,

    // Nombre del plan
    nombre: "Plan de Especializacion Tecnica",

    // Descripcion corta del plan
    descripcion: "Plan para formacion tecnica avanzada.",

    // Modalidad de cursada
    modalidad: "Virtual",

    // Regimen del plan
    regimen: "Modular",

    // Duracion aproximada
    duracion: "4 meses",

    // Rango minimo necesario
    rango_minimo: "Cabo",

    // Estado activo o inactivo
    estado: false,
  },
];

// Exportamos el service para usarlo desde las pantallas
export const planService = {
  // Trae todos los planes
  async obtenerTodos() {
    // Simula una demora como si consultara al backend
    await new Promise((resolve) => setTimeout(resolve, 250));

    return {
      status: "success",
      data: [...mockPlanes],
      message: "Planes recuperados correctamente.",
      total: mockPlanes.length,
    };
  },

  // Busca un plan por id
  async obtenerPorId(id) {
    // Simula una demora de consulta
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Busca el plan dentro del array
    const planEncontrado = mockPlanes.find((plan) => plan.id === Number(id));

    // Si no existe, devuelve error
    if (!planEncontrado) {
      return {
        status: "error",
        data: null,
        message: "No se encontro el plan.",
      };
    }

    return {
      status: "success",
      data: planEncontrado,
      message: "Plan recuperado correctamente.",
    };
  },

  // Crea un plan nuevo
  async crear(plan) {
    // Simula una demora de guardado
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Valida que venga el nombre
    if (!plan.nombre) {
      return {
        status: "error",
        message: "Faltan campos requeridos.",
        errors: {
          nombre: "El nombre del plan es requerido.",
        },
      };
    }

    // Arma el nuevo plan con un id nuevo
    const nuevoPlan = {
      ...plan,
      id: mockPlanes.length > 0 ? Math.max(...mockPlanes.map((p) => p.id)) + 1 : 1,
      estado: plan.estado ?? true,
    };

    // Agrega el nuevo plan al array
    mockPlanes.push(nuevoPlan);

    return {
      status: "success",
      data: nuevoPlan,
      message: "Plan creado correctamente.",
    };
  },

  // Actualiza un plan existente
  async actualizar(id, plan) {
    // Simula una demora de actualizacion
    await new Promise((resolve) => setTimeout(resolve, 250));

    // Valida que venga el nombre
    if (!plan.nombre) {
      return {
        status: "error",
        message: "Faltan campos requeridos.",
        errors: {
          nombre: "El nombre del plan es requerido.",
        },
      };
    }

    // Recorre los planes y reemplaza el que coincide con el id
    mockPlanes = mockPlanes.map((p) =>
      p.id === Number(id) ? { ...p, ...plan, id: Number(id) } : p
    );

    return {
      status: "success",
      data: { ...plan, id: Number(id) },
      message: "Plan actualizado correctamente.",
    };
  },

  // Cambia el estado activo/inactivo de un plan
  async cambiarEstado(id, nuevoEstado) {
    // Simula una demora de actualizacion
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Busca el plan y cambia solo el estado
    mockPlanes = mockPlanes.map((p) =>
      p.id === Number(id) ? { ...p, estado: nuevoEstado } : p
    );

    return {
      status: "success",
      data: { id: Number(id), estado: nuevoEstado },
      message: "Estado actualizado correctamente.",
    };
  },

  // Elimina un plan
  async eliminar(id) {
    // Simula una demora de eliminacion
    await new Promise((resolve) => setTimeout(resolve, 200));

    // Deja todos los planes menos el que tiene ese id
    mockPlanes = mockPlanes.filter((p) => p.id !== Number(id));

    return {
      status: "success",
      data: { id: Number(id) },
      message: "Plan eliminado correctamente.",
    };
  },
};