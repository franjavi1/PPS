import { useEffect, useState } from "react";
import {
  MapPinned,
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
import { sedeService } from "../services/sedeService";
import { legajoSedesService } from "../services/legajoSedesService";

const formularioInicial = {
  legajo_id: "",
  sede_id: "",
  es_autoridad: false,
  es_sede_base: false,
};

function LegajoSedes() {
  const [legajoSedes, setLegajoSedes] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [sedes, setSedes] = useState([]);
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

      const [respuestaLegajoSedes, respuestaLegajos, respuestaSedes] = await Promise.all([
        legajoSedesService.obtenerTodos(),
        apiRequest("/legajos"),
        sedeService.obtenerTodas(),
      ]);

      setLegajoSedes(respuestaLegajoSedes.data || []);
      setLegajos(respuestaLegajos.data || []);
      setSedes(respuestaSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los legajos por sede");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevoLegajoSedes() {
    limpiarFormulario();
    setMostrarModal(true);
  }

  function cerrarModal() {
    limpiarFormulario();
    setMostrarModal(false);
  }

  function manejarCambio(e) {
    const { name, type, checked, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function editarLegajoSedes(registro) {
    setFormulario({
      legajo_id: registro.legajo_id,
      sede_id: registro.sede_id,
      es_autoridad: Boolean(registro.es_autoridad),
      es_sede_base: Boolean(registro.es_sede_base),
    });
    setEditandoId(registro.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarLegajoSedes(e) {
    e.preventDefault();

    if (!formulario.legajo_id) {
      setErrorFormulario("El legajo es obligatorio");
      return;
    }

    if (!formulario.sede_id) {
      setErrorFormulario("La sede es obligatoria");
      return;
    }

    const payload = {
      legajo_id: Number(formulario.legajo_id),
      sede_id: Number(formulario.sede_id),
      es_autoridad: Boolean(formulario.es_autoridad),
      es_sede_base: Boolean(formulario.es_sede_base),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await legajoSedesService.actualizar(editandoId, payload);
      } else {
        await legajoSedesService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarLegajoSedes(id) {
    const confirmar = confirm("Seguro que queres eliminar esta sede del legajo?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await legajoSedesService.eliminar(id);
      alert(respuesta.message || "Sede del legajo eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la sede del legajo");
    }
  }

  function obtenerLegajo(legajoId) {
    return legajos.find((legajo) => legajo.id === legajoId);
  }

  function obtenerSede(sedeId) {
    return sedes.find((sede) => sede.id === sedeId);
  }

  function obtenerTextoLegajo(legajoId) {
    const legajo = obtenerLegajo(legajoId);
    return legajo ? `Nro. ${legajo.numero}` : "Legajo no definido";
  }

  function obtenerNombreSede(sedeId) {
    const sede = obtenerSede(sedeId);
    return sede ? sede.nombre : "Sede no definida";
  }

  function obtenerDireccionSede(sedeId) {
    const sede = obtenerSede(sedeId);
    return sede ? sede.direccion : "No definida";
  }

  const registrosFiltrados = legajoSedes.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const legajo = obtenerLegajo(registro.legajo_id);
    const sede = obtenerSede(registro.sede_id);
    const numeroLegajo = legajo ? String(legajo.numero || "") : "";
    const nombreSede = sede ? String(sede.nombre || "").toLowerCase() : "";
    const direccionSede = sede ? String(sede.direccion || "").toLowerCase() : "";

    return (
      numeroLegajo.toLowerCase().includes(textoBusqueda) ||
      nombreSede.includes(textoBusqueda) ||
      direccionSede.includes(textoBusqueda)
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
                <MapPinned size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Legajos por sede
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona las sedes asociadas a cada legajo.
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
                onClick={abrirNuevoLegajoSedes}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                <PlusCircle size={22} />
                Nueva asociacion
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
              placeholder="Buscar por legajo, sede o direccion"
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
                Cargando legajos por sede...
              </div>
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <article
                  key={registro.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Asociacion
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {obtenerTextoLegajo(registro.legajo_id)}
                      </h2>
                    </div>

                    <EstadoBadge
                      activo={registro.es_sede_base}
                      textoActivo="Base"
                      textoInactivo="No base"
                    />
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Sede</p>
                      <p className="text-slate-800 font-semibold">
                        {obtenerNombreSede(registro.sede_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Direccion</p>
                      <p className="text-slate-700">
                        {obtenerDireccionSede(registro.sede_id)}
                      </p>
                    </div>

                    <div>
                      <p className="text-slate-400 font-bold">Autoridad</p>
                      <EstadoBadge
                        activo={registro.es_autoridad}
                        textoActivo="Si"
                        textoInactivo="No"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => editarLegajoSedes(registro)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarLegajoSedes(registro.id)}
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
                No hay sedes asignadas a legajos.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Sede</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Direccion</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Autoridad</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Base</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                      Cargando legajos por sede...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {obtenerTextoLegajo(registro.legajo_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {obtenerNombreSede(registro.sede_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {obtenerDireccionSede(registro.sede_id)}
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge activo={registro.es_autoridad} textoActivo="Si" textoInactivo="No" />
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge activo={registro.es_sede_base} textoActivo="Base" textoInactivo="No" />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarLegajoSedes(registro)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarLegajoSedes(registro.id)}
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
                    <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                      No hay sedes asignadas a legajos.
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
                  {editandoId ? "Editar legajo por sede" : "Nuevo legajo por sede"}
                </h2>

                <form onSubmit={guardarLegajoSedes} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Legajo
                      </label>
                      <select
                        name="legajo_id"
                        value={formulario.legajo_id}
                        onChange={manejarCambio}
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Seleccione un legajo</option>
                        {legajos.map((legajo) => (
                          <option key={legajo.id} value={legajo.id}>
                            Nro. {legajo.numero}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Sede
                      </label>
                      <select
                        name="sede_id"
                        value={formulario.sede_id}
                        onChange={manejarCambio}
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Seleccione una sede</option>
                        {sedes.map((sede) => (
                          <option key={sede.id} value={sede.id}>
                            {sede.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 font-bold">
                      <input
                        type="checkbox"
                        name="es_autoridad"
                        checked={formulario.es_autoridad}
                        onChange={manejarCambio}
                        className="w-5 h-5 accent-red-700"
                      />
                      Es autoridad
                    </label>

                    <label className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-4 text-slate-700 font-bold">
                      <input
                        type="checkbox"
                        name="es_sede_base"
                        checked={formulario.es_sede_base}
                        onChange={manejarCambio}
                        className="w-5 h-5 accent-red-700"
                      />
                      Es sede base
                    </label>
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

function EstadoBadge({ activo, textoActivo, textoInactivo }) {
  if (activo) {
    return (
      <span className="bg-green-100 text-green-700 border border-green-300 px-3 py-1 rounded-md text-sm font-bold">
        {textoActivo}
      </span>
    );
  }

  return (
    <span className="bg-slate-100 text-slate-600 border border-slate-300 px-3 py-1 rounded-md text-sm font-bold">
      {textoInactivo}
    </span>
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar la sede del legajo";
}

export default LegajoSedes;
