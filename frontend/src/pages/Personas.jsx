import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
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
import { apiRequest } from "../api";
import { personasService } from "../services/personasService";

const formularioInicial = {
  td_id: "",
  nombre: "",
  apellido: "",
  numero_doc: "",
};

function Personas() {
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaPersonas, respuestaTiposDocumento] = await Promise.all([
        personasService.obtenerTodas(),
        apiRequest("/tipos-documentos"),
      ]);

      setPersonas(respuestaPersonas.data || []);
      setTiposDocumento(respuestaTiposDocumento.data || []);
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

  async function eliminarPersona(id) {
    const confirmar = confirm("Seguro que queres eliminar esta persona?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await personasService.eliminar(id);
      alert(respuesta.message || "Persona eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la persona");
    }
  }

  function obtenerTipoDocumento(tipoDocumentoId) {
    return tiposDocumento.find((tipo) => tipo.id === tipoDocumentoId);
  }

  function obtenerNombreTipoDocumento(tipoDocumentoId) {
    const tipo = obtenerTipoDocumento(tipoDocumentoId);
    return tipo ? tipo.descripcion : "Tipo no definido";
  }

  const personasFiltradas = personas.filter((persona) => {
    const textoBusqueda = busqueda.toLowerCase();
    const tipoDocumento = obtenerTipoDocumento(persona.td_id);
    const tipo = tipoDocumento ? tipoDocumento.descripcion.toLowerCase() : "";
    const nombreCompleto = `${persona.nombre || ""} ${persona.apellido || ""}`.toLowerCase();
    const documento = String(persona.numero_doc || "");

    return (
      nombreCompleto.includes(textoBusqueda) ||
      documento.includes(textoBusqueda) ||
      tipo.includes(textoBusqueda)
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
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={abrirNuevaPersona}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nueva persona
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
              placeholder="Buscar por persona, documento o tipo"
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
                      <p className="text-slate-400 font-bold">Tipo doc.</p>
                      <p className="text-slate-800 font-semibold">
                        {obtenerNombreTipoDocumento(persona.td_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Documento</p>
                      <p className="text-slate-700">
                        {persona.numero_doc}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => navigate(`/personas/${persona.id}/editar`)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarPersona(persona.id)}
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
                No hay personas cargadas.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Apellido</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo doc.</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                      Cargando personas...
                    </td>
                  </tr>
                ) : personasFiltradas.length > 0 ? (
                  personasFiltradas.map((persona) => (
                    <tr key={persona.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {persona.apellido}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {persona.nombre}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {obtenerNombreTipoDocumento(persona.td_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {persona.numero_doc}
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={persona.estado} />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => navigate(`/personas/${persona.id}/editar`)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarPersona(persona.id)}
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
                    <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                      No hay personas cargadas.
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
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
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
                    <p className="text-red-600 font-semibold">
                      {error}
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
