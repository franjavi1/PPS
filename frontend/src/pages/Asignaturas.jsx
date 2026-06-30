import { useState, useEffect } from "react";
import { PlusCircle, Pencil, ToggleLeft, ToggleRight, X, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";

/**
 * Componente para la administración completa de Asignaturas (ABM).
 * Consume los servicios asíncronamente utilizando rutas relativas.
 * Diseñado con estética premium en Tailwind CSS.
 */
function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Estado para el control del formulario
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    codigo: "",
    departamento: "",
    estado: true,
  });

  const [errores, setErrores] = useState({});

  // Carga inicial de datos desde PostgreSQL a través de Flask
  useEffect(() => {
    cargarAsignaturas();
  }, []);

  async function cargarAsignaturas() {
    try {
      const datos = await asignaturaService.obtenerTodas();
      setAsignaturas(datos);
    } catch (error) {
      console.error("Error al cargar asignaturas:", error);
    }
  }

  // Manejo de cambios en el formulario
  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  // Validación estricta que refleja las restricciones de base de datos relacional
  function validarFormulario() {
    const errs = {};
    const regexCodigo = /^[A-Z]{3}-\d{3}$/;

    if (!form.nombre.trim()) {
      errs.nombre = "El nombre de la asignatura es requerido.";
    } else if (form.nombre.length > 100) {
      errs.nombre = "El nombre no puede superar los 100 caracteres (límite VARCHAR).";
    }

    if (!form.codigo.trim()) {
      errs.codigo = "El código es requerido.";
    } else if (!regexCodigo.test(form.codigo)) {
      errs.codigo = "Formato de código inválido. Debe ser de tipo ABC-123 (ej: RES-201).";
    } else {
      // Verificación de unicidad en el estado local (PostgreSQL arrojará UNIQUE constraint violation si se duplica)
      const codigoDuplicado = asignaturas.some(
        (a) => a.codigo.toUpperCase() === form.codigo.toUpperCase() && a.id !== form.id
      );
      if (codigoDuplicado) {
        errs.codigo = "Este código de asignatura ya se encuentra registrado.";
      }
    }

    if (!form.departamento) {
      errs.departamento = "Debe seleccionar un formato de asignatura.";
    }

    setErrores(errs);
    return Object.keys(errs).length === 0;
  }

  // Maneja el envío del formulario de alta y modificación
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      if (modoEdicion) {
        // Simulación PUT a /api/v1/asignaturas/:id
        // Flask procesará el JSON, validará los campos e impactará en Postgres con un UPDATE
        await asignaturaService.actualizar(form.id, {
          nombre: form.nombre,
          codigo: form.codigo,
          departamento: form.departamento,
          estado: form.estado,
        });
      } else {
        // Simulación POST a /api/v1/asignaturas
        // Flask procesará el payload e insertará un nuevo registro (INSERT INTO asignaturas...)
        await asignaturaService.crear({
          nombre: form.nombre,
          codigo: form.codigo,
          departamento: form.departamento,
          estado: form.estado,
        });
      }
      cargarAsignaturas();
      cerrarModal();
    } catch (error) {
      console.error("Error al procesar formulario de asignatura:", error);
      alert("Ocurrió un error al intentar guardar los datos en la base de datos.");
    }
  }

  // Modifica el estado lógico de la asignatura (Activa/Inactiva)
  async function handleToggleStatus(id, estadoActual) {
    const nuevoEstado = !estadoActual;
    const confirmacion = confirm(
      `¿Desea ${nuevoEstado ? "Activar" : "Desactivar"} esta asignatura? (Baja Lógica)`
    );

    if (confirmacion) {
      try {
        // Simulación PATCH a /api/v1/asignaturas/:id/estado
        // Flask actualizará el campo BOOLEAN 'estado' en PostgreSQL (UPDATE asignaturas SET estado = ... WHERE id = ...)
        await asignaturaService.cambiarEstado(id, nuevoEstado);
        cargarAsignaturas();
      } catch (error) {
        console.error("Error al cambiar el estado de la asignatura:", error);
        alert("No se pudo cambiar el estado de la asignatura.");
      }
    }
  }

  function abrirCrear() {
    setForm({ id: null, nombre: "", codigo: "", departamento: "", estado: true });
    setErrores({});
    setModoEdicion(false);
    setMostrarModal(true);
  }

  function abrirEditar(asig) {
    setForm(asig);
    setErrores({});
    setModoEdicion(true);
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-red-700" size={26} />
              Administración de Asignaturas
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Configure la oferta académica, códigos de cátedra y departamentos institucionales.
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="h-11 bg-red-700 text-white font-bold px-5 rounded-lg hover:bg-red-800 transition flex items-center gap-2 shadow"
          >
            <PlusCircle size={20} />
            Nueva Asignatura
          </button>
        </div>

        {/* Listado / Tabla Responsiva */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-sm font-bold text-slate-700">Código</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700">Nombre / Cátedra</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700">Formato</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700 text-center">Estado</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaturas.length > 0 ? (
                  asignaturas.map((asig) => (
                    <tr
                      key={asig.id}
                      className="border-b border-slate-100 hover:bg-slate-50/55 transition"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-700 text-sm">
                        <span className="bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-200 font-mono">
                          {asig.codigo}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800 text-sm">
                        {asig.nombre}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">
                        {asig.departamento}
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            asig.estado
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {asig.estado ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-sm">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => abrirEditar(asig)}
                            className="h-9 px-3 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
                            title="Editar asignatura"
                          >
                            <Pencil size={15} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleStatus(asig.id, asig.estado)}
                            className={`h-9 px-3 border rounded-lg font-bold transition flex items-center gap-1.5 ${
                              asig.estado
                                ? "border-amber-200 text-amber-700 hover:bg-amber-50"
                                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            }`}
                            title={asig.estado ? "Desactivar asignatura" : "Activar asignatura"}
                          >
                            {asig.estado ? (
                              <>
                                <ToggleLeft size={16} />
                                Desactivar
                              </>
                            ) : (
                              <>
                                <ToggleRight size={16} />
                                Activar
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-400">
                      No se encontraron asignaturas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Ventana Modal de Alta / Modificación */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={cerrarModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="text-red-700" size={24} />
              <h2 className="text-xl font-bold text-slate-800">
                {modoEdicion ? "Modificar Asignatura" : "Nueva Asignatura"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre de la Asignatura / Cátedra *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Combate de Incendios II"
                  className={`w-full h-11 px-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errores.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errores.nombre && <p className="text-red-600 text-xs mt-1">{errores.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Código de Cátedra *
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={form.codigo}
                  onChange={manejarCambio}
                  placeholder="Ej: INC-101"
                  className={`w-full h-11 px-4 border rounded-lg text-slate-700 font-mono focus:outline-none focus:ring-2 ${
                    errores.codigo ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errores.codigo && <p className="text-red-600 text-xs mt-1">{errores.codigo}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Formato *
                </label>
                <select
                  name="departamento"
                  value={form.departamento}
                  onChange={manejarCambio}
                  className={`w-full h-11 px-4 border rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 ${
                    errores.departamento ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione un Formato</option>
                  <option value="Teórica">Teórica</option>
                  <option value="Práctica">Práctica</option>
                  <option value="Taller">Taller</option>
                </select>
                {errores.departamento && (
                  <p className="text-red-600 text-xs mt-1">{errores.departamento}</p>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  id="estado"
                  name="estado"
                  checked={form.estado}
                  onChange={manejarCambio}
                  className="w-4.5 h-4.5 accent-red-700 rounded cursor-pointer"
                />
                <label htmlFor="estado" className="text-sm font-bold text-slate-700 cursor-pointerSelect">
                  Asignatura Habilitada (Activa para Comisiones)
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
    </div>
  );
}

export default Asignaturas;
