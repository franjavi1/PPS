import { useEffect, useState } from "react";
import {
  Building,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { tipoSedeService } from "../services/tipoSedeService";
import useAuth from "../auth/hooks/useAuth";

const formularioInicial = {
  descripcion: "",
};

function TiposSedes() {
  const { currentUserRole, hasPermission } = useAuth();
  const [tiposSedes, setTiposSedes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarTiposSedes();
  }, []);

  async function cargarTiposSedes() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await tipoSedeService.obtenerTodas();
      setTiposSedes(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los tipos de sede");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevoTipoSede() {
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

  function editarTipoSede(tipoSede) {
    setFormulario({
      descripcion: tipoSede.descripcion || "",
    });
    setEditandoId(tipoSede.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarTipoSede(e) {
    e.preventDefault();

    const descripcion = formulario.descripcion.trim();

    if (!descripcion) {
      setErrorFormulario("La descripcion es obligatoria");
      return;
    }

    if (descripcion.length > 45) {
      setErrorFormulario("La descripcion debe tener hasta 45 caracteres");
      return;
    }

    if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(descripcion)) {
      setErrorFormulario("La descripcion solo puede contener letras");
      return;
    }

    const payload = {
      descripcion,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await tipoSedeService.actualizar(editandoId, payload);
      } else {
        await tipoSedeService.crear(payload);
      }

      cerrarModal();
      await cargarTiposSedes();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarTipoSede(id) {
    const confirmar = confirm("Seguro que queres eliminar este tipo de sede?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await tipoSedeService.eliminar(id);
      alert(respuesta.message || "Tipo de sede eliminado correctamente");
      await cargarTiposSedes();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el tipo de sede");
    }
  }

  const tiposSedesFiltrados = tiposSedes.filter((tipoSede) => {
    const textoBusqueda = busqueda.toLowerCase();

    return (
      String(tipoSede.descripcion || "").toLowerCase().includes(textoBusqueda)
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
                <Building size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Tipos de sedes
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona las categorias de sedes institucionales.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cargarTiposSedes}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={abrirNuevoTipoSede}
                disabled={!hasPermission("planes.tipos_sedes.crear")}
                title={
                  hasPermission("planes.tipos_sedes.crear")
                    ? "Editar tipo de sede"
                    : "No tenés permiso para editar tipos de sedes"
                }
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
                >
                <PlusCircle size={22} />
                Nuevo tipo
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
              placeholder="Buscar por descripcion"
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
                Cargando tipos de sede...
              </div>
            ) : tiposSedesFiltrados.length > 0 ? (
              tiposSedesFiltrados.map((tipoSede) => (
                <article
                  key={tipoSede.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Tipo de sede
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                      {tipoSede.descripcion}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => editarTipoSede(tipoSede)}
                      disabled={!hasPermission("planes.tipos_sedes.editar")}
                      title={
                        hasPermission("planes.tipos_sedes.editar")
                          ? "Editar tipo de sede"
                          : "No tenés permiso para editar tipos de sedes"
                      }
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarTipoSede(tipoSede.id)}
                      disabled={!hasPermission("planes.tipos_sedes.eliminar")}
                      title={
                        hasPermission("planes.tipos_sedes.eliminar")
                          ? "Eliminar tipo de sede"
                          : "No tenés permiso para eliminar tipos de sedes"
                      }
                      className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                No se encontraron tipos de sede.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Descripcion</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="2" className="text-center px-5 py-10 text-slate-500">
                      Cargando tipos de sede...
                    </td>
                  </tr>
                ) : tiposSedesFiltrados.length > 0 ? (
                  tiposSedesFiltrados.map((tipoSede) => (
                    <tr key={tipoSede.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {tipoSede.descripcion}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarTipoSede(tipoSede)}
                            disabled={!hasPermission("planes.tipos_sedes.editar")}
                            title={
                              hasPermission("planes.tipos_sedes.editar")
                                ? "Editar tipo de sede"
                                : "No tenés permiso para editar tipos de sedes"
                            }
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarTipoSede(tipoSede.id)}
                            disabled={!hasPermission("planes.tipos_sedes.eliminar")}
                            title={
                              hasPermission("planes.tipos_sedes.eliminar")
                                ? "Eliminar tipo de sede"
                                : "No tenés permiso para eliminar tipos de sedes"
                            }
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 transition cursor-pointer"
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
                    <td colSpan="2" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron tipos de sede.
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
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar tipo de sede" : "Nuevo tipo de sede"}
                </h2>

                <form onSubmit={guardarTipoSede} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Descripcion
                    </label>
                    <div className="relative">
                      <Building
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                        placeholder="Ej: Cuartel"
                        maxLength={45}
                        className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
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
                      className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    >
                      <X size={20} />
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
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

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar el tipo de sede";
}

export default TiposSedes;
