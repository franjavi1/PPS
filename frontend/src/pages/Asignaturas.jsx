import { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, X, BookOpen } from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";

function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState("");

  const [form, setForm] = useState({
    id: null,
    nombre: "",
    formato: "",
    usuario_accion: 1,
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    cargarAsignaturas();
  }, []);

  async function cargarAsignaturas() {
    try {
      setCargando(true);
      setErrorGeneral("");
      const response = await asignaturaService.obtenerTodas();
      setAsignaturas(response.data || []);
    } catch (error) {
      setErrorGeneral(error.message || "No se pudieron cargar las asignaturas");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: value,
    });
  }

  function validarFormulario() {
    const nuevosErrores = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre de la asignatura es obligatorio";
    } else if (form.nombre.trim().length > 105) {
      nuevosErrores.nombre = "El nombre no puede superar los 105 caracteres";
    }

    if (!form.formato.trim()) {
      nuevosErrores.formato = "El formato es obligatorio";
    } else if (form.formato.trim().length > 45) {
      nuevosErrores.formato = "El formato no puede superar los 45 caracteres";
    }

    setErrores(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  }

  function mostrarErroresBackend(errors) {
    const nuevosErrores = {};

    Object.entries(errors || {}).forEach(([campo, mensajes]) => {
      nuevosErrores[campo] = Array.isArray(mensajes) ? mensajes[0] : mensajes;
    });

    setErrores(nuevosErrores);
  }

  async function guardarAsignatura(e) {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const payload = {
      nombre: form.nombre.trim(),
      formato: form.formato.trim(),
      usuario_accion: Number(form.usuario_accion) || 1,
    };

    try {
      if (modoEdicion) {
        await asignaturaService.actualizar(form.id, payload);
      } else {
        await asignaturaService.crear(payload);
      }

      await cargarAsignaturas();
      cerrarModal();
    } catch (error) {
      if (error.errors) {
        mostrarErroresBackend(error.errors);
      }

      setErrorGeneral(error.message || "No se pudo guardar la asignatura");
    }
  }

  async function eliminarAsignatura(id) {
    const confirma = confirm("Seguro que queres eliminar esta asignatura?");

    if (!confirma) {
      return;
    }

    try {
      await asignaturaService.eliminar(id);
      await cargarAsignaturas();
    } catch (error) {
      alert(error.message || "No se pudo eliminar la asignatura");
    }
  }

  function abrirCrear() {
    setForm({
      id: null,
      nombre: "",
      formato: "",
      usuario_accion: 1,
    });
    setErrores({});
    setErrorGeneral("");
    setModoEdicion(false);
    setMostrarModal(true);
  }

  function abrirEditar(asignatura) {
    setForm({
      id: asignatura.id,
      nombre: asignatura.nombre || "",
      formato: asignatura.formato || "",
      usuario_accion: asignatura.usuario_accion || 1,
    });
    setErrores({});
    setErrorGeneral("");
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-md mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <BookOpen className="text-red-700" size={26} />
              Administracion de Asignaturas
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Gestiona las asignaturas cargadas en la base de datos.
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

        {errorGeneral && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
            {errorGeneral}
          </div>
        )}

        <div className="md:hidden space-y-4">
          {cargando ? (
            <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
              Cargando asignaturas...
            </div>
          ) : asignaturas.length > 0 ? (
            asignaturas.map((asignatura) => (
              <article
                key={asignatura.id}
                className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Asignatura
                    </p>
                    <h2 className="text-lg font-extrabold text-slate-800 mt-1 break-words">
                      {asignatura.nombre}
                    </h2>
                  </div>

                  <span className="shrink-0 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                    Activa
                  </span>
                </div>

                <div>
                  <p className="text-slate-400 font-bold text-sm">Formato</p>
                  <p className="text-slate-700 font-semibold mt-1">
                    {asignatura.formato}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => abrirEditar(asignatura)}
                    className="h-10 flex items-center justify-center gap-1 text-slate-700 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>

                  <button
                    onClick={() => eliminarAsignatura(asignatura.id)}
                    className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
              No se encontraron asignaturas registradas.
            </div>
          )}
        </div>

        <div className="hidden md:block bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-sm font-bold text-slate-700">Nombre</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700">Formato</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700 text-center">Estado</th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-700 text-right">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-400">
                      Cargando asignaturas...
                    </td>
                  </tr>
                ) : asignaturas.length > 0 ? (
                  asignaturas.map((asignatura) => (
                    <tr
                      key={asignatura.id}
                      className="border-b border-slate-100 hover:bg-slate-50/55 transition"
                    >
                      <td className="py-4 px-6 font-medium text-slate-800 text-sm">
                        {asignatura.nombre}
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-sm">
                        {asignatura.formato}
                      </td>
                      <td className="py-4 px-6 text-sm text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                          Activa
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right text-sm">
                        <div className="inline-flex gap-2">
                          <button
                            onClick={() => abrirEditar(asignatura)}
                            className="h-9 px-3 border border-slate-200 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition flex items-center gap-1.5"
                            title="Editar asignatura"
                          >
                            <Pencil size={15} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarAsignatura(asignatura.id)}
                            className="h-9 px-3 border border-red-200 rounded-lg text-red-700 font-bold hover:bg-red-50 transition flex items-center gap-1.5"
                            title="Eliminar asignatura"
                          >
                            <Trash2 size={15} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-12 text-slate-400">
                      No se encontraron asignaturas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

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

            <form onSubmit={guardarAsignatura} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre *
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
                  Formato *
                </label>
                <input
                  type="text"
                  name="formato"
                  value={form.formato}
                  onChange={manejarCambio}
                  placeholder="Ej: Teorica, Practica, Taller"
                  className={`w-full h-11 px-4 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errores.formato ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errores.formato && <p className="text-red-600 text-xs mt-1">{errores.formato}</p>}
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
