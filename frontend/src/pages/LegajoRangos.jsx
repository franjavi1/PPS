import { useEffect, useState } from "react";
import {
  ChevronsUp,
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
import { rangoService } from "../services/rangoService";
import { legajoRangosService } from "../services/legajoRangosService";

const formularioInicial = {
  legajo_id: "",
  rangos_institucionales_id: "",
};

function LegajoRangos() {
  const [legajoRangos, setLegajoRangos] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [rangos, setRangos] = useState([]);
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

      const [respuestaLegajoRangos, respuestaLegajos, respuestaRangos] = await Promise.all([
        legajoRangosService.obtenerTodos(),
        apiRequest("/legajos"),
        rangoService.obtenerTodos(),
      ]);

      setLegajoRangos(respuestaLegajoRangos.data || []);
      setLegajos(respuestaLegajos.data || []);
      setRangos(respuestaRangos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los rangos de legajos");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevoLegajoRangos() {
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

  function editarLegajoRangos(registro) {
    setFormulario({
      legajo_id: registro.legajo_id,
      rangos_institucionales_id: registro.rangos_institucionales_id || "",
    });
    setEditandoId(registro.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarLegajoRangos(e) {
    e.preventDefault();

    if (!formulario.legajo_id) {
      setErrorFormulario("El legajo es obligatorio");
      return;
    }

    if (!formulario.rangos_institucionales_id) {
      setErrorFormulario("El rango institucional es obligatorio");
      return;
    }

    const payload = {
      legajo_id: Number(formulario.legajo_id),
      rangos_institucionales_id: Number(formulario.rangos_institucionales_id),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await legajoRangosService.actualizar(editandoId, payload);
      } else {
        await legajoRangosService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarLegajoRangos(id) {
    const confirmar = confirm("Seguro que queres eliminar este rango del legajo?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await legajoRangosService.eliminar(id);
      alert(respuesta.message || "Rango del legajo eliminado correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el rango del legajo");
    }
  }

  function obtenerLegajo(legajoId) {
    return legajos.find((legajo) => legajo.id === legajoId);
  }

  function obtenerRango(rangoId) {
    return rangos.find((rango) => rango.id === rangoId);
  }

  function obtenerTextoLegajo(legajoId) {
    const legajo = obtenerLegajo(legajoId);

    if (!legajo) {
      return "Legajo no definido";
    }

    return `Nro. ${legajo.numero}`;
  }

  function obtenerDescripcionRango(rangoId) {
    const rango = obtenerRango(rangoId);
    return rango ? rango.descripcion : "Rango no definido";
  }

  function obtenerNivelRango(rangoId) {
    const rango = obtenerRango(rangoId);
    return rango ? rango.nivel_jerarquia : "No definido";
  }

  const registrosFiltrados = legajoRangos.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const legajo = obtenerLegajo(registro.legajo_id);
    const rango = obtenerRango(registro.rangos_institucionales_id);
    const numeroLegajo = legajo ? String(legajo.numero || "") : "";
    const descripcionRango = rango ? String(rango.descripcion || "").toLowerCase() : "";
    const nivelRango = rango ? String(rango.nivel_jerarquia || "") : "";

    return (
      numeroLegajo.toLowerCase().includes(textoBusqueda) ||
      descripcionRango.includes(textoBusqueda) ||
      nivelRango.includes(textoBusqueda)
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
                <ChevronsUp size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Rangos de legajos
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona los rangos institucionales asignados a cada legajo.
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
                onClick={abrirNuevoLegajoRangos}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                <PlusCircle size={22} />
                Nuevo rango
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
              placeholder="Buscar por legajo, rango o nivel"
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
                Cargando rangos de legajos...
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
                        Rango asignado
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {obtenerTextoLegajo(registro.legajo_id)}
                      </h2>
                    </div>

                    <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-sm font-bold">
                      Nivel {obtenerNivelRango(registro.rangos_institucionales_id)}
                    </span>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-400 font-bold">Rango</p>
                      <p className="text-slate-800 font-semibold">
                        {obtenerDescripcionRango(registro.rangos_institucionales_id)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => editarLegajoRangos(registro)}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 transition cursor-pointer"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarLegajoRangos(registro.id)}
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
                No hay rangos asignados a legajos.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Rango</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Nivel jerarquico</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                      Cargando rangos de legajos...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {obtenerTextoLegajo(registro.legajo_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {obtenerDescripcionRango(registro.rangos_institucionales_id)}
                      </td>
                      <td className="px-5 py-5 text-slate-700 font-bold">
                        {obtenerNivelRango(registro.rangos_institucionales_id)}
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => editarLegajoRangos(registro)}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 transition cursor-pointer"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarLegajoRangos(registro.id)}
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
                    <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                      No hay rangos asignados a legajos.
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
                  {editandoId ? "Editar rango de legajo" : "Nuevo rango de legajo"}
                </h2>

                <form onSubmit={guardarLegajoRangos} className="space-y-5">
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
                        Rango jerarquico
                      </label>
                      <select
                        name="rangos_institucionales_id"
                        value={formulario.rangos_institucionales_id}
                        onChange={manejarCambio}
                        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="">Seleccione un rango</option>
                        {rangos.map((rango) => (
                          <option key={rango.id} value={rango.id}>
                            {rango.descripcion} - Nivel {rango.nivel_jerarquia}
                          </option>
                        ))}
                      </select>
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

  return err.message || "No se pudo guardar el rango del legajo";
}

export default LegajoRangos;
