import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  GraduationCap,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import BotonVolver from "../components/BotonVolver";
import { comisionService } from "../services/comisionService";
import useAuth from "../auth/hooks/useAuth";

const formularioInicial = {
  descripcion: "",
};

function Comisiones() {
  const navigate = useNavigate();
  const { currentUserRole, hasPermission } = useAuth();
  const esAdministrador = currentUserRole === "ROLE_ADMIN";
  const [comisiones, setComisiones] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarComisiones();
  }, []);

  async function cargarComisiones() {
    try {
      setCargando(true);
      setError("");

      const respuesta = await comisionService.obtenerTodas();
      setComisiones(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las comisiones");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevaComision() {
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

  function editarComision(comision) {
    setFormulario({
      descripcion: comision.descripcion || "",
    });
    setEditandoId(comision.id_comision);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarComision(e) {
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

    const payload = {
      descripcion,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await comisionService.actualizar(editandoId, payload);
      } else {
        await comisionService.crear(payload);
      }

      cerrarModal();
      await cargarComisiones();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarComision(id) {
    const confirmar = confirm("Seguro que queres eliminar esta comision?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await comisionService.eliminar(id);
      alert(respuesta.message || "Comision eliminada correctamente");
      await cargarComisiones();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la comision");
    }
  }

  const comisionesFiltradas = comisiones.filter((comision) => {
    const textoBusqueda = busqueda.toLowerCase();

    return String(comision.descripcion || "")
      .toLowerCase()
      .includes(textoBusqueda);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <BotonVolver ruta="/planes" />
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <GraduationCap size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Comisiones
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona las comisiones educativas del sistema.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cargarComisiones}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={() => navigate("/comisiones/alta")}
                disabled={!hasPermission("planes.comisiones.crear")}
                title={
                  hasPermission("planes.comisiones.crear")
                    ? "Crear comision"
                    : "No tenés permiso para crear comisiones"
                }
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-700"
              >
                <PlusCircle size={22} />
                Nueva comision
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
                Cargando comisiones...
              </div>
            ) : comisionesFiltradas.length > 0 ? (
              comisionesFiltradas.map((comision) => (
                <article
                  key={comision.id_comision}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Comision
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                      {comision.descripcion}
                    </h2>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      disabled={!hasPermission("planes.comisiones.ver")}
                      title={
                        hasPermission("planes.comisiones.ver")
                          ? "Ver comision"
                          : "No tenés permiso para ver comisiones"
                      }
                      onClick={() =>
                        navigate(`/comisiones/${comision.id_comision}`)
                      }
                      className="h-10 flex items-center justify-center gap-1 text-slate-600 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer "
                    >
                      <Eye size={16} />
                      Ver
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/comisiones/${comision.id_comision}/editar`)
                      }
                      disabled={!hasPermission("planes.comisiones.editar")}
                      title={
                        hasPermission("planes.comisiones.editar")
                          ? "Editar comision"
                          : "No tenés permiso para editar comisiones"
                      }
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition cursor-pointer"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarComision(comision.id_comision)}
                      disabled={!hasPermission("planes.comisiones.eliminar")}
                      title={
                        hasPermission("planes.comisiones.eliminar")
                          ? "Eliminar comision"
                          : "No tenés permiso para eliminar comisiones"
                      }
                      className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition cursor-pointer"
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                No se encontraron comisiones.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">
                    Descripcion
                  </th>
                  <th className="px-5 py-4 text-slate-700 font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td
                      colSpan="2"
                      className="text-center px-5 py-10 text-slate-500"
                    >
                      Cargando comisiones...
                    </td>
                  </tr>
                ) : comisionesFiltradas.length > 0 ? (
                  comisionesFiltradas.map((comision) => (
                    <tr
                      key={comision.id_comision}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {comision.descripcion}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            disabled={!hasPermission("planes.comisiones.ver")}
                            title={
                              hasPermission("planes.comisiones.ver")
                                ? "Ver comision"
                                : "No tenés permiso para ver comisiones"
                            }
                            onClick={() =>
                              navigate(`/comisiones/${comision.id_comision}`)
                            }
                            className="flex items-center gap-1 text-slate-600 font-semibold hover:text-slate-800 transition cursor-pointer"
                          >
                            <Eye size={18} />
                            Ver
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/comisiones/${comision.id_comision}/editar`,
                              )
                            }
                            disabled={!hasPermission("planes.comisiones.editar")}
                            title={
                              hasPermission("planes.comisiones.editar")
                                ? "Editar comision"
                                : "No tenés permiso para editar comisiones"
                            }
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() =>
                              eliminarComision(comision.id_comision)
                            }
                            disabled={!hasPermission("planes.comisiones.eliminar")}
                            title={
                              hasPermission("planes.comisiones.eliminar")
                                ? "Eliminar comision"
                                : "No tenés permiso para edliminar comisiones"
                            }
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
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
                    <td
                      colSpan="2"
                      className="text-center px-5 py-10 text-slate-500"
                    >
                      No se encontraron comisiones.
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
                  {editandoId ? "Editar comision" : "Nueva comision"}
                </h2>

                <form onSubmit={guardarComision} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Descripcion
                    </label>
                    <div className="relative">
                      <GraduationCap
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="descripcion"
                        value={formulario.descripcion}
                        onChange={manejarCambio}
                        placeholder="Ej: Comision A"
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

  return err.message || "No se pudo guardar la comision";
}

export default Comisiones;
