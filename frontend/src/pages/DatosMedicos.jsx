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
import { apiRequest } from "../api";
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
        apiRequest("/personas"),
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
      usuario_accion: 1,
    };

    try {
      setError("");

      if (editandoId) {
        await datosMedicosService.actualizar(editandoId, payload);
      } else {
        await datosMedicosService.crear(payload);
      }

      limpiarFormulario();
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
      await datosMedicosService.eliminar(id);
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
      registro.seguro.toLowerCase().includes(textoBusqueda) ||
      String(registro.id).includes(textoBusqueda)
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

            <button
              onClick={cargarDatos}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
            >
              <RefreshCcw size={22} />
              Actualizar
            </button>
          </div>

          <form
            onSubmit={guardarDatosMedicos}
            className="border border-slate-200 rounded-xl p-5 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

              <div className="lg:col-span-2">
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

              <label className="h-14 mt-7 flex items-center gap-3 border border-slate-300 rounded-xl px-4 text-slate-700 font-bold">
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

            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              {editandoId && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
                >
                  <X size={20} />
                  Cancelar
                </button>
              )}

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
              >
                {editandoId ? <Save size={22} /> : <PlusCircle size={22} />}
                {editandoId ? "Guardar" : "Agregar"}
              </button>
            </div>

            {error && (
              <p className="text-red-600 font-semibold mt-3">
                {error}
              </p>
            )}
          </form>

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

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">ID</th>
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
                    <td colSpan="8" className="text-center px-5 py-10 text-slate-500">
                      Cargando datos medicos...
                    </td>
                  </tr>
                ) : datosMedicosFiltrados.length > 0 ? (
                  datosMedicosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700">{registro.id}</td>
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
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarDatosMedicos(registro.id)}
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
                    <td colSpan="8" className="text-center px-5 py-10 text-slate-500">
                      No hay datos medicos cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
