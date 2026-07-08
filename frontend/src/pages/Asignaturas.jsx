import { useEffect, useState } from "react";
import {
  FileText,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";

const formularioInicial = {
  nombre: "",
  formato: "",
};

function Asignaturas() {
  const [asignaturas, setAsignaturas] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarAsignaturas();
  }, []);

  async function cargarAsignaturas() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await asignaturaService.obtenerTodas();
      setAsignaturas(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las asignaturas");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevaAsignatura() {
    limpiarFormulario();
    setMostrarModal(true);
  }

  function cerrarModal() {
    limpiarFormulario();
    setMostrarModal(false);
  }

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  function editarAsignatura(asignatura) {
    setFormulario({
      nombre: asignatura.nombre || "",
      formato: asignatura.formato || "",
    });
    setEditandoId(asignatura.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarAsignatura(e) {
    e.preventDefault();

    const nombre = formulario.nombre.trim();
    const formato = formulario.formato.trim();

    if (!nombre) {
      setErrorFormulario("El nombre de la asignatura es obligatorio");
      return;
    }

    if (nombre.length > 105) {
      setErrorFormulario("El nombre no puede superar los 105 caracteres");
      return;
    }

    if (!formato) {
      setErrorFormulario("El formato es obligatorio");
      return;
    }

    if (formato.length > 45) {
      setErrorFormulario("El formato no puede superar los 45 caracteres");
      return;
    }

    const payload = {
      nombre,
      formato,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await asignaturaService.actualizar(editandoId, payload);
      } else {
        await asignaturaService.crear(payload);
      }

      cerrarModal();
      await cargarAsignaturas();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarAsignatura(id) {
    const confirmar = confirm("Seguro que queres eliminar esta asignatura?");

    if (!confirmar) {
      return;
    }

    try {
      await asignaturaService.eliminar(id);
      await cargarAsignaturas();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la asignatura");
    }
  }

  const asignaturasFiltradas = asignaturas.filter((asignatura) => {
    const textoBusqueda = busqueda.toLowerCase();

    return (
      String(asignatura.nombre || "").toLowerCase().includes(textoBusqueda) ||
      String(asignatura.formato || "").toLowerCase().includes(textoBusqueda)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <FileText size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Asignaturas
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona las materias asociadas a los planes de estudio.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cargarAsignaturas}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={abrirNuevaAsignatura}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nueva asignatura
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por asignatura o formato"
              className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          <div className="lg:hidden space-y-4">
            {cargando ? (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                Cargando asignaturas...
              </div>
            ) : asignaturasFiltradas.length > 0 ? (
              asignaturasFiltradas.map((asignatura) => (
                <article
                  key={asignatura.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Asignatura
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {asignatura.nombre}
                      </h2>
                    </div>

                    <EstadoBadge estado={asignatura.estado} />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Formato</p>
                      <p className="text-slate-800 font-semibold">
                        {asignatura.formato}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => editarAsignatura(asignatura)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
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
                No se encontraron asignaturas.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Formato</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                      Cargando asignaturas...
                    </td>
                  </tr>
                ) : asignaturasFiltradas.length > 0 ? (
                  asignaturasFiltradas.map((asignatura) => (
                    <tr key={asignatura.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {asignatura.nombre}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {asignatura.formato}
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={asignatura.estado} />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarAsignatura(asignatura)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarAsignatura(asignatura.id)}
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800"
                          >
                            <Trash2 size={18} />
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron asignaturas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mostrarModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-xl relative">
                <button
                  onClick={cerrarModal}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar asignatura" : "Nueva asignatura"}
                </h2>

                <form onSubmit={guardarAsignatura} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                      placeholder="Ej: Combate de Incendios"
                      maxLength={105}
                      className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Formato
                    </label>
                    <input
                      type="text"
                      name="formato"
                      value={formulario.formato}
                      onChange={manejarCambio}
                      placeholder="Ej: Teorica, Practica o Taller"
                      maxLength={45}
                      className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>

                  {errorFormulario && (
                    <p className="text-red-600 font-semibold">
                      {errorFormulario}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={cerrarModal}
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <X size={20} />
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
                    >
                      <Save size={22} />
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function EstadoBadge({ estado }) {
  if (estado === 1 || estado === undefined) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Activa
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      Inactiva
    </span>
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar la asignatura";
}

export default Asignaturas;
