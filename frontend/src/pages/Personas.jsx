import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import BotonVolver from "../components/BotonVolver";
import { apiRequest } from "../api";
import { personasService } from "../services/personasService";
import useAuth from "../auth/hooks/useAuth";  
//import { hasPermission } from "../auth/utils/permissions"; 
import { LOGIN_ROUTE } from "../auth/config";

const formularioInicial = {
  td_id: "",
  nombre: "",
  apellido: "",
  numero_doc: "",
};

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [personaAccion, setPersonaAccion] = useState(null);
  const [tipoAccion, setTipoAccion] = useState("baja");
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [estadoListado, setEstadoListado] = useState(1);
  const navigate = useNavigate();
  const { currentUserRole, hasPermission } = useAuth();

  useEffect(() => {
    cargarDatos();
  }, [estadoListado]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaPersonas, respuestaTiposDocumento, respuestaLegajos] = await Promise.all([
        personasService.obtenerTodas(estadoListado),
        apiRequest("/tipos-documentos"),
        apiRequest(`/legajos?estado=${estadoListado}`),
      ]);

      setPersonas(respuestaPersonas.data || []);
      setTiposDocumento(respuestaTiposDocumento.data || []);
      setLegajos(respuestaLegajos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las personas");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setError("");
  }

  function abrirNuevaPersona() {
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

  function editarPersona(persona) {
    setFormulario({
      td_id: persona.td_id,
      nombre: persona.nombre || "",
      apellido: persona.apellido || "",
      numero_doc: persona.numero_doc || "",
    });
    setEditandoId(persona.id);
    setError("");
    setMostrarModal(true);
  }

  async function guardarPersona(e) {
    e.preventDefault();

    if (!formulario.td_id) {
      setError("El tipo de documento es obligatorio");
      return;
    }

    if (formulario.nombre.trim() === "") {
      setError("El nombre es obligatorio");
      return;
    }

    if (formulario.apellido.trim() === "") {
      setError("El apellido es obligatorio");
      return;
    }

    if (!formulario.numero_doc) {
      setError("El numero de documento es obligatorio");
      return;
    }

    const payload = {
      td_id: Number(formulario.td_id),
      nombre: formulario.nombre,
      apellido: formulario.apellido,
      numero_doc: Number(formulario.numero_doc),
      usuario_accion: 1,
    };

    try {
      setError("");

      if (editandoId) {
        await personasService.actualizar(editandoId, payload);
      } else {
        await personasService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  }

  function solicitarConfirmacionPersona(persona, accion) {
    setPersonaAccion(persona);
    setTipoAccion(accion);
    setMostrarModalConfirmacion(true);
  }

  async function confirmarAccionPersona() {
    if (!personaAccion) return;

    try {
      const respuesta =
        tipoAccion === "reactivar"
          ? await personasService.reactivar(personaAccion.id)
          : await personasService.eliminar(personaAccion.id);
      setMostrarModalConfirmacion(false);
      setPersonaAccion(null);
      setTipoAccion("baja");
      window.alert?.(respuesta.message || (tipoAccion === "reactivar" ? "Persona reactivada correctamente" : "Persona dada de baja correctamente"));
      await cargarDatos();
    } catch (err) {
      setError(err.message || (tipoAccion === "reactivar" ? "No se pudo reactivar la persona" : "No se pudo eliminar la persona"));
      setMostrarModalConfirmacion(false);
      setPersonaAccion(null);
      setTipoAccion("baja");
    }
  }

  function obtenerTipoDocumento(tipoDocumentoId) {
    return tiposDocumento.find((tipo) => tipo.id === tipoDocumentoId);
  }

  function obtenerNombreTipoDocumento(tipoDocumentoId) {
    const tipo = obtenerTipoDocumento(tipoDocumentoId);
    return tipo ? tipo.descripcion : "Tipo no definido";
  }

  function obtenerNumeroLegajo(personaId) {
    const legajo = legajos.find((item) => item.persona_id === personaId);
    return legajo ? legajo.numero : "Sin legajo";
  }

  const personasFiltradas = personas.filter((persona) => {
    const textoBusqueda = busqueda.toLowerCase();
    const numeroLegajo = String(obtenerNumeroLegajo(persona.id)).toLowerCase();
    const nombreCompleto =
      `${persona.nombre || ""} ${persona.apellido || ""}`.toLowerCase();
    const documento = String(persona.numero_doc || "");

    return (
      nombreCompleto.includes(textoBusqueda) ||
      documento.includes(textoBusqueda) ||
      numeroLegajo.includes(textoBusqueda)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
          <BotonVolver ruta="/personas" />
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <User size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Personas
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona las personas cargadas en el sistema.
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
                type="button"
                onClick={() => navigate("/alta-persona")}
                disabled={!hasPermission("planes.personas.crear")}
                title={
                  hasPermission("planes.personas.crear", "crear")
                    ? "Registrar una persona"
                    : "No tenés permiso para crear personas"
                }
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-700"
              >
                <PlusCircle size={22} />
                Nueva persona
              </button>
            </div>
          </div>

          {currentUserRole === "ROLE_ADMIN" && (
            <div className="flex gap-2 mb-5">
              <button
                type="button"
                onClick={() => setEstadoListado(1)}
                className={`px-5 py-2 rounded-lg font-bold border transition ${
                  estadoListado === 1
                    ? "bg-red-700 text-white border-red-700 transition cursor-pointer"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                }`}
              >
                Activas
              </button>
              <button
                type="button"
                onClick={() => setEstadoListado(0)}
                className={`px-5 py-2 rounded-lg font-bold border transition ${
                  estadoListado === 0
                    ? "bg-red-700 text-white border-red-700 transition cursor-pointer"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition cursor-pointer"
                }`}
              >
                Inactivas
              </button>
            </div>
          )}

          <div className="relative w-full md:w-96 mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={22}
            />

            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por persona, documento o legajo"
              className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="lg:hidden space-y-4">
            {cargando ? (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                Cargando personas...
              </div>
            ) : personasFiltradas.length > 0 ? (
              personasFiltradas.map((persona) => (
                <article
                  key={persona.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Persona
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {persona.apellido}, {persona.nombre}
                      </h2>
                    </div>

                    <EstadoBadge estado={persona.estado} />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Nro. de legajo</p>
                      <p className="text-slate-800 font-semibold">
                        {obtenerNumeroLegajo(persona.id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Número de documento</p>
                      <p className="text-slate-700">{persona.numero_doc}</p>
                    </div>
                  </div>
                  {estadoListado === 0 ? (
                    <div className="grid grid-cols-1 gap-2 mt-5 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => reactivarPersona(persona.id)}
                        className="h-10 flex items-center justify-center gap-1 text-green-700 font-semibold border border-green-200 rounded-lg hover:bg-green-50 transition cursor-pointer"
                      >
                        <RefreshCcw size={16} />
                        Reactivar
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={() => navigate(`/personas/${persona.id}`)}
                        className="h-10 flex items-center justify-center gap-1 text-slate-600 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer"
                      >
                        <Eye size={16} />
                        Ver
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/personas/${persona.id}/editar`)}
                        disabled={!hasPermission("planes.personas.editar")}
                        className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        onClick={() => eliminarPersona(persona.id)}
                        disabled={!hasPermission("planes.personas.eliminar")}
                        className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                      >
                        <Trash2 size={16} />
                        Dar de baja
                      </button>
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                No hay personas {estadoListado === 0 ? "inactivas" : "activas"}.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">
                    Apellido
                  </th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">
                    Nro. de legajo
                  </th>
                  <th className="px-5 py-4 text-slate-700 font-bold">
                    Número de documento
                  </th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center px-5 py-10 text-slate-500"
                    >
                      Cargando personas...
                    </td>
                  </tr>
                ) : personasFiltradas.length > 0 ? (
                  personasFiltradas.map((persona) => (
                    <tr
                      key={persona.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {persona.apellido}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {persona.nombre}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {obtenerNumeroLegajo(persona.id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {persona.numero_doc}
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={persona.estado} />
                      </td>
                      <td className="px-5 py-5">
                        {estadoListado === 0 ? (
                          <button
                            type="button"
                            onClick={() => solicitarConfirmacionPersona(persona, "reactivar")}
                            className="flex items-center gap-1 text-green-700 font-semibold hover:text-green-900 transition cursor-pointer"
                          >
                            <RefreshCcw size={18} />
                            Reactivar
                          </button>
                        ) : (
                        <div className="flex items-center gap-4">
                          {/* Todos los roles pueden consultar */}
                          <button
                            type="button"
                            onClick={() => navigate(`/personas/${persona.id}`)}
                            className="flex items-center gap-1 text-slate-600 font-semibold hover:text-slate-800 transition cursor-pointer"
                          >
                            <Eye size={18} />
                            Ver
                          </button>

                          {/* Se habilita solamente con permiso de edición */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/personas/${persona.id}/editar`)
                            }
                            disabled={!hasPermission("planes.personas.editar")}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          {/* Se habilita solamente con permiso de eliminación */}
                          <button
                            type="button"
                            onClick={() => solicitarConfirmacionPersona(persona, "baja")}
                            disabled={
                              !hasPermission("planes.personas.eliminar")
                            }
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                            Dar de baja
                          </button>
                        </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center px-5 py-10 text-slate-500"
                    >
                      No hay personas {estadoListado === 0 ? "inactivas" : "activas"}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mostrarModalConfirmacion && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative">
                <button
                  onClick={() => {
                    setMostrarModalConfirmacion(false);
                    setPersonaAccion(null);
                    setTipoAccion("baja");
                  }}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-xl font-extrabold text-slate-800 mb-3">
                  {tipoAccion === "reactivar" ? "Reactivar persona" : "Dar de baja persona"}
                </h2>
                <p className="text-slate-600 mb-6">
                  {tipoAccion === "reactivar"
                    ? "¿Seguro que querés reactivar esta persona?"
                    : "¿Seguro que querés dar de baja esta persona?"}
                </p>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarModalConfirmacion(false);
                      setPersonaAccion(null);
                      setTipoAccion("baja");
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <X size={20} />
                    Cancelar
                  </button>

                  <button
                    type="button"
                    onClick={confirmarAccionPersona}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition cursor-pointer ${tipoAccion === "reactivar" ? "bg-green-700 text-white hover:bg-green-800" : "bg-red-700 text-white hover:bg-red-800"}`}
                  >
                    {tipoAccion === "reactivar" ? <RefreshCcw size={20} /> : <Trash2 size={20} />}
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}

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
                  {editandoId ? "Editar persona" : "Nueva persona"}
                </h2>

                <form onSubmit={guardarPersona} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Tipo de documento
                      </label>
                      <select
                        name="td_id"
                        value={formulario.td_id}
                        onChange={manejarCambio}
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Seleccione un tipo</option>
                        {tiposDocumento.map((tipo) => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.descripcion}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Numero de documento
                      </label>
                      <input
                        type="number"
                        name="numero_doc"
                        value={formulario.numero_doc}
                        onChange={manejarCambio}
                        placeholder="Ej: 30123456"
                        min="1"
                        step="1"
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        name="nombre"
                        value={formulario.nombre}
                        onChange={manejarCambio}
                        placeholder="Ej: Juan"
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Apellido
                      </label>
                      <input
                        type="text"
                        name="apellido"
                        value={formulario.apellido}
                        onChange={manejarCambio}
                        placeholder="Ej: Perez"
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-600 font-semibold">{error}</p>
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

  return err.message || "No se pudo guardar la persona";
}

export default Personas;
