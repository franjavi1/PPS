import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  PlusCircle,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Save,
  ClipboardList,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";

function Legajos() {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [legajos, setLegajos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({
    persona_id: "",
    numero: "",
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  useEffect(() => {
    cargarLegajos();
  }, []);

  async function cargarLegajos() {
    try {
      setCargando(true);
      setError("");
      const [respuestaLegajos, respuestaPersonas] = await Promise.all([
        apiRequest("/legajos"),
        apiRequest("/personas"),
      ]);
      setLegajos(respuestaLegajos.data || []);
      setPersonas(respuestaPersonas.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los legajos");
    } finally {
      setCargando(false);
    }
  }

  async function eliminarLegajo(id) {
    const confirmar = confirm("Seguro que queres eliminar este legajo?");

    if (!confirmar) {
      return;
    }

    try {
      await apiRequest(`/legajos/${id}`, {
        method: "DELETE",
      });
      await cargarLegajos();
    } catch (err) {
      alert(err.message || "No se pudo eliminar el legajo");
    }
  }

  function abrirNuevoLegajo() {
    setFormulario({
      persona_id: "",
      numero: "",
    });
    setEditandoId(null);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  function editarLegajo(legajo) {
    setFormulario({
      persona_id: legajo.persona_id,
      numero: legajo.numero || "",
    });
    setEditandoId(legajo.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setEditandoId(null);
    setFormulario({
      persona_id: "",
      numero: "",
    });
    setErrorFormulario("");
  }

  function manejarCambio(e) {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  }

  async function guardarLegajo(e) {
    e.preventDefault();

    if (!formulario.persona_id) {
      setErrorFormulario("La persona es obligatoria");
      return;
    }

    if (String(formulario.numero).trim() === "") {
      setErrorFormulario("El numero de legajo es obligatorio");
      return;
    }

    const payload = {
      persona_id: Number(formulario.persona_id),
      numero: String(formulario.numero).trim(),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await apiRequest(`/legajos/${editandoId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/legajos", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }

      cerrarModal();
      await cargarLegajos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  function obtenerPersona(personaId) {
    return personas.find((persona) => persona.id === personaId);
  }

  function obtenerNombrePersona(personaId) {
    const persona = obtenerPersona(personaId);
    return persona ? `${persona.apellido}, ${persona.nombre}` : "Persona no definida";
  }

  function obtenerDocumentoPersona(personaId) {
    const persona = obtenerPersona(personaId);
    return persona ? persona.numero_doc : "No definido";
  }

  const legajosFiltrados = legajos.filter((legajo) => {
    const textoBusqueda = busqueda.toLowerCase();
    const persona = obtenerPersona(legajo.persona_id);
    const nombreCompleto = persona ? `${persona.nombre} ${persona.apellido}`.toLowerCase() : "";
    const documento = persona ? String(persona.numero_doc || "") : "";

    return (
      legajo.numero.toLowerCase().includes(textoBusqueda) ||
      nombreCompleto.includes(textoBusqueda) ||
      documento.includes(textoBusqueda)
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
                <ClipboardList size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Legajos
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta, busca y gestiona los legajos cargados.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={cargarLegajos}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={abrirNuevoLegajo}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nuevo legajo
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
              placeholder="Buscar por numero, persona o documento"
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
                Cargando legajos...
              </div>
            ) : legajosFiltrados.length > 0 ? (
              legajosFiltrados.map((legajo) => (
                <article
                  key={legajo.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Legajo
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        Nro. {legajo.numero}
                      </h2>
                    </div>

                    <EstadoBadge estado={legajo.estado} />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Persona</p>
                      <p className="text-slate-800 font-semibold">
                        {obtenerNombrePersona(legajo.persona_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Documento</p>
                      <p className="text-slate-700">
                        {obtenerDocumentoPersona(legajo.persona_id)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => navigate(`/legajos/${legajo.id}`)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                    >
                      <Eye size={16} />
                      Ver
                    </button>

                    <button
                      onClick={() => editarLegajo(legajo)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarLegajo(legajo.id)}
                      className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                      Borrar
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                No se encontraron legajos.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Numero</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Persona</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="5" className="text-center px-5 py-10 text-slate-500">
                      Cargando legajos...
                    </td>
                  </tr>
                ) : legajosFiltrados.length > 0 ? (
                  legajosFiltrados.map((legajo) => (
                    <tr
                      key={legajo.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <td className="px-5 py-5 text-slate-700 font-semibold">{legajo.numero}</td>
                      <td className="px-5 py-5 text-slate-700">{obtenerNombrePersona(legajo.persona_id)}</td>
                      <td className="px-5 py-5 text-slate-700">{obtenerDocumentoPersona(legajo.persona_id)}</td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={legajo.estado} />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => navigate(`/legajos/${legajo.id}`)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Eye size={18} />
                            Ver
                          </button>

                          <button
                            onClick={() => editarLegajo(legajo)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarLegajo(legajo.id)}
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
                    <td colSpan="5" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron legajos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 bg-white">
              <p className="text-slate-500">
                Mostrando {legajosFiltrados.length} de {legajos.length} legajos
              </p>

              <div className="flex items-center gap-2">
                <button className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                  <ChevronLeft size={20} />
                </button>

                <button className="w-10 h-10 bg-red-700 text-white rounded-lg font-bold">
                  1
                </button>

                <button className="w-10 h-10 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
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
                  {editandoId ? "Editar legajo" : "Nuevo legajo"}
                </h2>

                <form onSubmit={guardarLegajo} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Persona
                    </label>
                    <select
                      name="persona_id"
                      value={formulario.persona_id}
                      onChange={manejarCambio}
                      className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">Seleccione una persona</option>
                      {personas.map((persona) => (
                        <option key={persona.id} value={persona.id}>
                          {persona.apellido}, {persona.nombre} - {persona.numero_doc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Numero
                    </label>
                    <input
                      type="text"
                      name="numero"
                      value={formulario.numero}
                      onChange={manejarCambio}
                      placeholder="Ej: 1001"
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

  return err.message || "No se pudo guardar el legajo";
}

export default Legajos;
