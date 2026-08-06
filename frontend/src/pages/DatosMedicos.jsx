import { useEffect, useState } from "react";
import {
  ClipboardPlus,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import {personasService} from "../services/personasService";
import { datosMedicosService } from "../services/datosMedicosService";

const gruposSanguineos = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formularioInicial = {
  persona_id: "",
  grupo_sanguineo: "",
  alergias: "",
  aptitud_fisica: false,
  seguro: "",
};

function DatosMedicos() {
  const [datosMedicos, setDatosMedicos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaDatosMedicos, respuestaPersonas] = await Promise.all([
        datosMedicosService.obtenerTodos(),
        personasService.obtenerTodas(),
      ]);

      setDatosMedicos(respuestaDatosMedicos.data || []);
      setPersonas(respuestaPersonas.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los datos medicos");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setError("");
  }

  function abrirNuevosDatosMedicos() {
    limpiarFormulario();
    setMostrarModal(true);
  }

  function cerrarModal() {
    limpiarFormulario();
    setMostrarModal(false);
  }

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function editarDatosMedicos(registro) {
    setFormulario({
      persona_id: registro.persona_id,
      grupo_sanguineo: registro.grupo_sanguineo,
      alergias: registro.alergias || "",
      aptitud_fisica: Boolean(registro.aptitud_fisica),
      seguro: registro.seguro,
    });
    setEditandoId(registro.id);
    setError("");
    setMostrarModal(true);
  }

  async function guardarDatosMedicos(e) {
    e.preventDefault();

    if (!formulario.persona_id) {
      setError("La persona es obligatoria");
      return;
    }

    if (!formulario.grupo_sanguineo) {
      setError("El grupo sanguineo es obligatorio");
      return;
    }

    if (formulario.seguro.trim() === "") {
      setError("El seguro es obligatorio");
      return;
    }

    const payload = {
      persona_id: Number(formulario.persona_id),
      grupo_sanguineo: formulario.grupo_sanguineo,
      alergias: formulario.alergias.trim() || null,
      aptitud_fisica: formulario.aptitud_fisica,
      seguro: formulario.seguro,
    };

    try {
      setError("");

      if (editandoId) {
        await datosMedicosService.actualizar(editandoId, payload);
      } else {
        await datosMedicosService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  }

  async function eliminarDatosMedicos(id) {
    const confirmar = confirm("Seguro que queres eliminar estos datos medicos?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await datosMedicosService.eliminar(id);
      alert(respuesta.message || "Datos medicos eliminados correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudieron eliminar los datos medicos");
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

  const datosMedicosFiltrados = datosMedicos.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const persona = obtenerPersona(registro.persona_id);
    const nombreCompleto = persona ? `${persona.nombre} ${persona.apellido}`.toLowerCase() : "";
    const documento = persona ? String(persona.numero_doc || "") : "";

    return (
      nombreCompleto.includes(textoBusqueda) ||
      documento.includes(textoBusqueda) ||
      registro.grupo_sanguineo.toLowerCase().includes(textoBusqueda) ||
      registro.seguro.toLowerCase().includes(textoBusqueda)
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
                <ClipboardPlus size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Datos medicos
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona la informacion medica asociada a personas.
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
                onClick={abrirNuevosDatosMedicos}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                <PlusCircle size={22} />
                Nuevos datos
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
              placeholder="Buscar por persona, documento, grupo o seguro"
              className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="lg:hidden space-y-4">
            {cargando ? (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                Cargando datos medicos...
              </div>
            ) : datosMedicosFiltrados.length > 0 ? (
              datosMedicosFiltrados.map((registro) => (
                <article
                  key={registro.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Datos medicos
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {obtenerNombrePersona(registro.persona_id)}
                      </h2>
                    </div>

                    <AptitudBadge aptitud={registro.aptitud_fisica} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Documento</p>
                      <p className="text-slate-700">
                        {obtenerDocumentoPersona(registro.persona_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Grupo</p>
                      <p className="text-slate-800 font-bold">
                        {registro.grupo_sanguineo}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Alergias</p>
                      <p className="text-slate-700">
                        {registro.alergias || "Sin alergias"}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Seguro</p>
                      <p className="text-slate-700">
                        {registro.seguro}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => editarDatosMedicos(registro)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarDatosMedicos(registro.id)}
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
                No hay datos medicos cargados.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Persona</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Grupo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Alergias</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Aptitud</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Seguro</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                      Cargando datos medicos...
                    </td>
                  </tr>
                ) : datosMedicosFiltrados.length > 0 ? (
                  datosMedicosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {obtenerNombrePersona(registro.persona_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {obtenerDocumentoPersona(registro.persona_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700 font-bold">
                        {registro.grupo_sanguineo}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {registro.alergias || "Sin alergias"}
                      </td>
                      <td className="px-5 py-5">
                        <AptitudBadge aptitud={registro.aptitud_fisica} />
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {registro.seguro}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarDatosMedicos(registro)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarDatosMedicos(registro.id)}
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
                    <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                      No hay datos medicos cargados.
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
                  {editandoId ? "Editar datos medicos" : "Nuevos datos medicos"}
                </h2>

                <form onSubmit={guardarDatosMedicos} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        Grupo sanguineo
                      </label>
                      <select
                        name="grupo_sanguineo"
                        value={formulario.grupo_sanguineo}
                        onChange={manejarCambio}
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Seleccione un grupo</option>
                        {gruposSanguineos.map((grupo) => (
                          <option key={grupo} value={grupo}>
                            {grupo}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Seguro
                      </label>
                      <input
                        type="text"
                        name="seguro"
                        value={formulario.seguro}
                        onChange={manejarCambio}
                        placeholder="Ej: OSDE"
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Alergias
                      </label>
                      <input
                        type="text"
                        name="alergias"
                        value={formulario.alergias}
                        onChange={manejarCambio}
                        placeholder="Ej: Penicilina"
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <label className="h-14 flex items-center gap-3 border border-slate-300 rounded-xl px-4 text-slate-700 font-bold">
                      <input
                        type="checkbox"
                        name="aptitud_fisica"
                        checked={formulario.aptitud_fisica}
                        onChange={manejarCambio}
                        className="w-5 h-5 accent-red-700"
                      />
                      Aptitud fisica
                    </label>
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

function AptitudBadge({ aptitud }) {
  if (aptitud) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        Apto
      </span>
    );
  }

  return (
    <span className="bg-yellow-100 text-yellow-700 border border-yellow-300 px-3 py-1 rounded-md text-sm font-bold">
      No apto
    </span>
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudieron guardar los datos medicos";
}

export default DatosMedicos;
