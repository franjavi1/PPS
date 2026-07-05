import { useEffect, useState } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  ClipboardList,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { planService } from "../services/planesService";

function Planes() {
  // Guarda la lista de planes que se muestran en la tabla
  const [planes, setPlanes] = useState([]);

  // Controla si el modal esta abierto o cerrado
  const [mostrarModal, setMostrarModal] = useState(false);

  // Sirve para saber si estamos creando o editando
  const [modoEdicion, setModoEdicion] = useState(false);

  // Guarda los errores del formulario
  const [errores, setErrores] = useState({});

  // Guarda el mensaje que se muestra en el toast
  const [toast, setToast] = useState(null);
  const [toastVisible, setToastVisible] = useState(false)

  // Guarda los datos que escribe el usuario en el formulario
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    modalidad: "",
    regimen: "",
    duracion: "",
    rango_minimo: "",
    estado: true,
  });

  // Cuando se carga la pantalla, trae los planes
  useEffect(() => {
    cargarPlanes();
  }, []);

  // Trae todos los planes desde el service
  async function cargarPlanes() {
    try {
      const response = await planService.obtenerTodos();

      if (response.status === "error") {
        mostrarToast(
          response.message || "No se pudieron cargar los planes.",
          "error",
        );
        return;
      }

      setPlanes(response.data || []);
    } catch (error) {
      console.error("Error al cargar planes:", error);
      mostrarToast("Ocurrio un error al cargar los planes.", "error");
    }
  }

  // Muestra un mensaje tipo toast por unos segundos
  function mostrarToast(mensaje, tipo = "success") {
  setToast({ mensaje, tipo });
  setToastVisible(true);

  setTimeout(() => {
    setToastVisible(false);

    setTimeout(() => {
      setToast(null);
    }, 300);
  }, 2500);
}

  // Actualiza el formulario cuando el usuario escribe
  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  // Valida los campos antes de guardar
  function validarFormulario() {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre del plan es requerido.";
    }

    if (!form.modalidad) {
      nuevosErrores.modalidad = "Debe seleccionar una modalidad.";
    }

    if (!form.regimen) {
      nuevosErrores.regimen = "Debe seleccionar un regimen.";
    }

    if (!form.duracion.trim()) {
      nuevosErrores.duracion = "La duracion es requerida.";
    }

    if (!form.rango_minimo.trim()) {
      nuevosErrores.rango_minimo = "El rango minimo es requerido.";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  // Guarda un plan nuevo o actualiza uno existente
  async function handleSubmit(e) {
    e.preventDefault();

    if (!validarFormulario()) return;

    try {
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        modalidad: form.modalidad,
        regimen: form.regimen,
        duracion: form.duracion,
        rango_minimo: form.rango_minimo,
        estado: form.estado,
      };

      let response;

      if (modoEdicion) {
        response = await planService.actualizar(form.id, payload);
      } else {
        response = await planService.crear(payload);
      }

      if (response.status === "error") {
        setErrores(response.errors || {});
        mostrarToast(
          response.message || "No se pudo guardar el plan.",
          "error",
        );
        return;
      }

      mostrarToast(response.message || "Plan guardado correctamente.");
      cargarPlanes();
      cerrarModal();
    } catch (error) {
      console.error("Error al guardar plan:", error);
      mostrarToast("Ocurrio un error al guardar el plan.", "error");
    }
  }

  // Cambia el estado del plan entre activo e inactivo
  async function handleCambiarEstado(id, estadoActual) {
    const nuevoEstado = !estadoActual;

    const confirmacion = confirm(
      `Desea ${nuevoEstado ? "activar" : "desactivar"} este plan?`,
    );

    if (!confirmacion) return;

    try {
      const response = await planService.cambiarEstado(id, nuevoEstado);

      if (response.status === "error") {
        mostrarToast(
          response.message || "No se pudo cambiar el estado.",
          "error",
        );
        return;
      }
      mostrarToast(response.message || "Estado actualizado correctamente.");
      cargarPlanes();
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      mostrarToast("Ocurrio un error al cambiar el estado.", "error");
    }
  }

  // Elimina un plan
  async function handleEliminar(id) {
    const confirmacion = confirm("Desea eliminar este plan?");

    if (!confirmacion) return;

    try {
      const response = await planService.eliminar(id);

      if (response.status === "error") {
        mostrarToast(
          response.message || "No se pudo eliminar el plan.",
          "error",
        );
        return;
      }

      mostrarToast(response.message || "Plan eliminado correctamente.");
      cargarPlanes();
    } catch (error) {
      console.error("Error al eliminar plan:", error);
      mostrarToast("Ocurrio un error al eliminar el plan.", "error");
    }
  }

  // Abre el modal para crear un plan nuevo
  function abrirCrear() {
    setForm({
      id: null,
      nombre: "",
      descripcion: "",
      modalidad: "",
      regimen: "",
      duracion: "",
      rango_minimo: "",
      estado: true,
    });

    setErrores({});
    setModoEdicion(false);
    setMostrarModal(true);
  }

  // Abre el modal para editar un plan
  function abrirEditar(plan) {
    setForm(plan);
    setErrores({});
    setModoEdicion(true);
    setMostrarModal(true);
  }

  // Cierra el modal
  function cerrarModal() {
    setMostrarModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Encabezado de la pantalla */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <ClipboardList className="text-red-700" size={26} />
              Administracion de Planes
            </h1>

            <p className="text-slate-500 text-sm mt-1">
              Gestion de planes de estudio, modalidad, regimen y rango minimo.
            </p>
          </div>

          <button
            onClick={abrirCrear}
            className="h-11 bg-red-700 text-white font-bold px-5 rounded-lg hover:bg-red-800 transition flex items-center gap-2 shadow"
          >
            <PlusCircle size={20} />
            Nuevo Plan
          </button>
        </div>

        {/* Tabla principal */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-sm font-bold text-slate-700">
                    Nombre
                  </th>

                  <th className="py-4 px-6 text-sm font-bold text-slate-700">
                    Modalidad
                  </th>

                  <th className="py-4 px-6 text-sm font-bold text-slate-700">
                    Regimen
                  </th>

                  <th className="py-4 px-6 text-sm font-bold text-slate-700">
                    Duracion
                  </th>

                  <th className="py-4 px-6 text-sm font-bold text-slate-700">
                    Rango minimo
                  </th>

                  <th className="py-4 px-6 text-sm font-bold text-slate-700 text-center">
                    Estado
                  </th>

                  <th className="py-4 px-6 text-sm font-bold text-slate-700 text-right">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {planes.length > 0 ? (
                  planes.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-b border-slate-100 hover:bg-slate-50/55 transition"
                    >
                      <td className="py-4 px-6 text-sm font-semibold text-slate-800">
                        {plan.nombre}
                      </td>

                      <td className="py-4 px-6 text-sm text-slate-600">
                        {plan.modalidad}
                      </td>

                      <td className="py-4 px-6 text-sm text-slate-600">
                        {plan.regimen}
                      </td>

                      <td className="py-4 px-6 text-sm text-slate-600">
                        {plan.duracion}
                      </td>

                      <td className="py-4 px-6 text-sm text-slate-600">
                        {plan.rango_minimo}
                      </td>

                      <td className="py-4 px-6 text-sm text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            plan.estado
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {plan.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right text-sm">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => abrirEditar(plan)}
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm transition-colors"
                            title="Editar plan"
                          >
                            <Pencil size={16} />
                            Editar
                          </button>

                          <button
                            onClick={() => handleEliminar(plan.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm transition-colors"
                            title="Eliminar plan"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-12 text-slate-400"
                    >
                      No se encontraron planes registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal para crear o editar */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-lg relative">
            <button
              onClick={cerrarModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="text-red-700" size={24} />

              <h2 className="text-xl font-bold text-slate-800">
                {modoEdicion ? "Modificar Plan" : "Nuevo Plan"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre del plan *
                </label>

                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Plan de Formacion Inicial"
                  className={`w-full h-11 px-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errores.nombre
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:ring-red-500"
                  }`}
                />

                {errores.nombre && (
                  <p className="text-red-600 text-xs mt-1">{errores.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descripcion
                </label>

                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Breve descripcion del plan"
                  className="w-full min-h-20 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Modalidad *
                  </label>

                  <select
                    name="modalidad"
                    value={form.modalidad}
                    onChange={manejarCambio}
                    className={`w-full h-11 px-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                      errores.modalidad
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:ring-red-500"
                    }`}
                  >
                    <option value="">Seleccione</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Mixta">Mixta</option>
                  </select>

                  {errores.modalidad && (
                    <p className="text-red-600 text-xs mt-1">
                      {errores.modalidad}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Regimen *
                  </label>

                  <select
                    name="regimen"
                    value={form.regimen}
                    onChange={manejarCambio}
                    className={`w-full h-11 px-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                      errores.regimen
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:ring-red-500"
                    }`}
                  >
                    <option value="">Seleccione</option>
                    <option value="Anual">Anual</option>
                    <option value="Cuatrimestral">Cuatrimestral</option>
                    <option value="Modular">Modular</option>
                  </select>

                  {errores.regimen && (
                    <p className="text-red-600 text-xs mt-1">
                      {errores.regimen}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Duracion *
                  </label>

                  <input
                    type="text"
                    name="duracion"
                    value={form.duracion}
                    onChange={manejarCambio}
                    placeholder="Ej: 12 meses"
                    className={`w-full h-11 px-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                      errores.duracion
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:ring-red-500"
                    }`}
                  />

                  {errores.duracion && (
                    <p className="text-red-600 text-xs mt-1">
                      {errores.duracion}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Rango minimo *
                  </label>

                  <input
                    type="text"
                    name="rango_minimo"
                    value={form.rango_minimo}
                    onChange={manejarCambio}
                    placeholder="Ej: Aspirante"
                    className={`w-full h-11 px-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                      errores.rango_minimo
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:ring-red-500"
                    }`}
                  />

                  {errores.rango_minimo && (
                    <p className="text-red-600 text-xs mt-1">
                      {errores.rango_minimo}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="estado"
                  name="estado"
                  checked={form.estado}
                  onChange={manejarCambio}
                  className="w-4 h-4 accent-red-700 rounded cursor-pointer"
                />

                <label
                  htmlFor="estado"
                  className="text-sm font-bold text-slate-700 cursor-pointer"
                >
                  Plan activo
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  {modoEdicion ? "Guardar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast simple sin librerias */}
     {toast && (
  <div
    className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-xl shadow-lg text-sm font-bold border transition-all duration-300 ${
      toastVisible
        ? "opacity-100 translate-y-0 scale-100"
        : "opacity-0 translate-y-4 scale-95"
    } ${
      toast.tipo === "error"
        ? "bg-red-50 text-red-700 border-red-200"
        : "bg-green-50 text-green-700 border-green-200"
    }`}
  >
    {toast.mensaje}
  </div>
)}
    </div>
  );
}

export default Planes;
