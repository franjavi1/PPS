import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { sedeService } from "../services/sedeService";
import { tipoSedeService } from "../services/tipoSedeService";
import useAuth from "../auth/hooks/useAuth";

const formularioInicial = {
  tipo_sede_id: "",
  nombre: "",
  direccion: "",
};

function Sedes() {
  const { currentUserRole, hasPermission } = useAuth();
  const [sedes, setSedes] = useState([]);
  const [tiposSedes, setTiposSedes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaSedes, respuestaTiposSedes] = await Promise.all([
        sedeService.obtenerTodas(),
        tipoSedeService.obtenerTodas(),
      ]);

      setSedes(respuestaSedes.data || []);
      setTiposSedes(respuestaTiposSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las sedes");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevaSede() {
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

  function editarSede(sede) {
    setFormulario({
      tipo_sede_id: sede.tipo_sede_id || "",
      nombre: sede.nombre || "",
      direccion: sede.direccion || "",
    });
    setEditandoId(sede.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarSede(e) {
    e.preventDefault();

    if (!formulario.tipo_sede_id) {
      setErrorFormulario("El tipo de sede es obligatorio");
      return;
    }

    if (!formulario.nombre.trim()) {
      setErrorFormulario("El nombre de la sede es obligatorio");
      return;
    }

    if (!formulario.direccion.trim()) {
      setErrorFormulario("La direccion es obligatoria");
      return;
    }

    const payload = {
      tipo_sede_id: Number(formulario.tipo_sede_id),
      nombre: formulario.nombre.trim(),
      direccion: formulario.direccion.trim(),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await sedeService.actualizar(editandoId, payload);
      } else {
        await sedeService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarSede(id) {
    const confirmar = confirm("Seguro que queres eliminar esta sede?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await sedeService.eliminar(id);
      alert(respuesta.message || "Sede eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la sede");
    }
  }

  function obtenerTipoSede(tipoSedeId) {
    return tiposSedes.find((tipo) => tipo.id === tipoSedeId);
  }

  function obtenerDescripcionTipoSede(tipoSedeId) {
    const tipoSede = obtenerTipoSede(tipoSedeId);
    return tipoSede ? tipoSede.descripcion : "Tipo no definido";
  }

  const sedesFiltradas = sedes.filter((sede) => {
    const textoBusqueda = busqueda.toLowerCase();
    const tipoSede = obtenerDescripcionTipoSede(sede.tipo_sede_id).toLowerCase();

    return (
      String(sede.nombre || "").toLowerCase().includes(textoBusqueda) ||
      String(sede.direccion || "").toLowerCase().includes(textoBusqueda) ||
      tipoSede.includes(textoBusqueda)
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
                <Building2 size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Sedes
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona las sedes institucionales.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cargarDatos}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={abrirNuevaSede}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                <PlusCircle size={22} />
                Nueva sede
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
              placeholder="Buscar por sede, tipo o direccion"
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
                Cargando sedes...
              </div>
            ) : sedesFiltradas.length > 0 ? (
              sedesFiltradas.map((sede) => (
                <article
                  key={sede.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Sede
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {sede.nombre}
                      </h2>
                    </div>

                    <EstadoBadge estado={sede.estado} />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Tipo de sede</p>
                      <p className="text-slate-800 font-semibold">
                        {obtenerDescripcionTipoSede(sede.tipo_sede_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Direccion</p>
                      <p className="text-slate-700">
                        {sede.direccion}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => editarSede(sede)}
                      disabled={!hasPermission("planes.sedes.editar")}
                      title={
                        hasPermission("planes.sedes.editar")
                          ? "Editar sede"
                          : "No tenés permiso para editar sedes"
                      }
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarSede(sede.id)}
                      disabled={!hasPermission("planes.sedes.eliminar")}
                      title={
                        hasPermission("planes.sedes.eliminar")
                          ? "Eliminar sede"
                          : "No tenés permiso para eliminar sedes"
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
                No se encontraron sedes.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Sede</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo de sede</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Direccion</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="5" className="text-center px-5 py-10 text-slate-500">
                      Cargando sedes...
                    </td>
                  </tr>
                ) : sedesFiltradas.length > 0 ? (
                  sedesFiltradas.map((sede) => (
                    <tr key={sede.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {sede.nombre}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {obtenerDescripcionTipoSede(sede.tipo_sede_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {sede.direccion}
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={sede.estado} />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarSede(sede)}
                            disabled={!hasPermission("planes.sedes.editar")}
                            title={
                              hasPermission("planes.sedes.editar")
                                ? "Editar sede"
                                : "No tenés permiso para editar sedes"
                            }
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarSede(sede.id)}
                            disabled={!hasPermission("planes.sedes.eliminar")}
                            title={
                              hasPermission("planes.sedes.eliminar")
                                ? "Eliminar sede"
                                : "No tenés permiso para eliminar sedes"
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
                    <td colSpan="5" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron sedes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mostrarModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-2xl relative">
                <button
                  onClick={cerrarModal}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar sede" : "Nueva sede"}
                </h2>

                <form onSubmit={guardarSede} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Tipo de sede
                    </label>
                    <select
                      name="tipo_sede_id"
                      value={formulario.tipo_sede_id}
                      onChange={manejarCambio}
                      className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Seleccione un tipo de sede</option>
                      {tiposSedes.map((tipoSede) => (
                        <option key={tipoSede.id} value={tipoSede.id}>
                          {tipoSede.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Nombre
                    </label>
                    <div className="relative">
                      <Building2
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        placeholder="Ej: Sede Central"
                        className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Direccion
                    </label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        size={20}
                      />
                      <input
                        type="text"
                        name="direccion"
                        value={formulario.direccion}
                        onChange={manejarCambio}
                        placeholder="Ej: Av. Corrientes 1234"
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

function EstadoBadge({ estado }) {
  if (estado === 1) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Activo
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      Inactivo
    </span>
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar la sede";
}

export default Sedes;
