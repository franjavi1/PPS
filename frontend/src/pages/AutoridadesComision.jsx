import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  ShieldUser,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { autoridadComisionService } from "../services/autoridadComisionService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { tipoAutoridadService } from "../services/tipoAutoridadService";

const formularioInicial = {
  tipo_autoridad_id: "",
  legajo_id: "",
  comision_id: "",
};

function AutoridadesComision() {
  const [registros, setRegistros] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
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

      const [
        respuestaAutoridades,
        respuestaTipos,
        respuestaLegajos,
        respuestaComisiones,
      ] = await Promise.all([
        autoridadComisionService.obtenerTodos(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
        comisionAsignaturaService.obtenerTodos(),
      ]);

      setRegistros(respuestaAutoridades.data || []);
      setTiposAutoridad(respuestaTipos.data || []);
      setLegajos(respuestaLegajos.data || []);
      setComisionesAsignaturas(respuestaComisiones.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las autoridades de comision");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      tiposAutoridad: tiposAutoridad.reduce((acc, tipo) => {
        acc[tipo.id] = tipo.descripcion;
        return acc;
      }, {}),
      legajos: legajos.reduce((acc, legajo) => {
        acc[legajo.id] = obtenerEtiquetaLegajo(legajo);
        return acc;
      }, {}),
      comisiones: comisionesAsignaturas.reduce((acc, comision) => {
        acc[comision.id_comision_asignatura] = obtenerEtiquetaComision(comision);
        return acc;
      }, {}),
    };
  }, [tiposAutoridad, legajos, comisionesAsignaturas]);

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevoRegistro() {
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

  function editarRegistro(registro) {
    setFormulario({
      tipo_autoridad_id: String(registro.tipo_autoridad_id || ""),
      legajo_id: String(registro.legajo_id || ""),
      comision_id: String(registro.comision_id || ""),
    });
    setEditandoId(registro.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarRegistro(e) {
    e.preventDefault();

    const payload = {
      tipo_autoridad_id: Number(formulario.tipo_autoridad_id),
      legajo_id: Number(formulario.legajo_id),
      comision_id: Number(formulario.comision_id),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarPayload(payload);

    if (mensajeValidacion) {
      setErrorFormulario(mensajeValidacion);
      return;
    }

    try {
      setErrorFormulario("");

      if (editandoId) {
        await autoridadComisionService.actualizar(editandoId, payload);
      } else {
        await autoridadComisionService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRegistro(id) {
    const confirmar = confirm("Seguro que queres eliminar esta autoridad de comision?");

    if (!confirmar) {
      return;
    }

    try {
      await autoridadComisionService.eliminar(id);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la autoridad de comision");
    }
  }

  const registrosFiltrados = registros.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const tipoAutoridad = mapas.tiposAutoridad[registro.tipo_autoridad_id] || "";
    const legajo = mapas.legajos[registro.legajo_id] || "";
    const comision = mapas.comisiones[registro.comision_id] || "";

    return (
      tipoAutoridad.toLowerCase().includes(textoBusqueda) ||
      legajo.toLowerCase().includes(textoBusqueda) ||
      comision.toLowerCase().includes(textoBusqueda)
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
                <ShieldUser size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Autoridades de comision
                </h1>

                <p className="text-slate-500 mt-2">
                  Asigna legajos como autoridades dentro de cada comision asignatura.
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
                onClick={abrirNuevoRegistro}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nueva autoridad
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
              placeholder="Buscar por autoridad, legajo o comision"
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
              <EstadoVacio texto="Cargando autoridades de comision..." />
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <article
                  key={registro.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Autoridad
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                      {mapas.tiposAutoridad[registro.tipo_autoridad_id] || "-"}
                    </h2>
                  </div>

                  <div className="space-y-3 text-sm">
                    <Dato label="Legajo" value={mapas.legajos[registro.legajo_id]} />
                    <Dato label="Comision" value={mapas.comisiones[registro.comision_id]} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                    <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="eliminar" />
                  </div>
                </article>
              ))
            ) : (
              <EstadoVacio texto="No se encontraron autoridades de comision." />
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th>Tipo autoridad</Th>
                  <Th>Legajo</Th>
                  <Th>Comision asignatura</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                      Cargando autoridades de comision...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <tr
                      key={registro.id}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <Td destacado>{mapas.tiposAutoridad[registro.tipo_autoridad_id] || "-"}</Td>
                      <Td>{mapas.legajos[registro.legajo_id] || "-"}</Td>
                      <Td>{mapas.comisiones[registro.comision_id] || "-"}</Td>
                      <Td>
                        <div className="flex items-center gap-4">
                          <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                          <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="eliminar" />
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron autoridades de comision.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mostrarModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-3xl relative max-h-[92vh] overflow-y-auto">
                <button
                  onClick={cerrarModal}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar autoridad de comision" : "Nueva autoridad de comision"}
                </h2>

                <form onSubmit={guardarRegistro} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CampoSelect
                      label="Tipo autoridad"
                      name="tipo_autoridad_id"
                      value={formulario.tipo_autoridad_id}
                      onChange={manejarCambio}
                      icon={<ShieldUser size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {tiposAutoridad.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>
                          {tipo.descripcion}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Legajo"
                      name="legajo_id"
                      value={formulario.legajo_id}
                      onChange={manejarCambio}
                      icon={<UserRound size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {legajos.map((legajo) => (
                        <option key={legajo.id} value={legajo.id}>
                          {obtenerEtiquetaLegajo(legajo)}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Comision asignatura"
                      name="comision_id"
                      value={formulario.comision_id}
                      onChange={manejarCambio}
                      icon={<BookOpenCheck size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {comisionesAsignaturas.map((comision) => (
                        <option
                          key={comision.id_comision_asignatura}
                          value={comision.id_comision_asignatura}
                        >
                          {obtenerEtiquetaComision(comision)}
                        </option>
                      ))}
                    </CampoSelect>
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

function CampoSelect({ label, icon, children, ...props }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <select
          {...props}
          className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          {children}
        </select>
      </div>
    </div>
  );
}

function BotonAccion({ onClick, tipo }) {
  const esEditar = tipo === "editar";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 font-semibold ${
        esEditar
          ? "text-blue-600 hover:text-blue-800"
          : "text-red-600 hover:text-red-800"
      }`}
    >
      {esEditar ? <Pencil size={18} /> : <Trash2 size={18} />}
      {esEditar ? "Editar" : "Eliminar"}
    </button>
  );
}

function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
      {texto}
    </div>
  );
}

function Th({ children }) {
  return <th className="px-5 py-4 text-slate-700 font-bold">{children}</th>;
}

function Td({ children, destacado }) {
  return (
    <td className={`px-5 py-5 text-slate-700 ${destacado ? "font-semibold" : ""}`}>
      {children}
    </td>
  );
}

function obtenerEtiquetaLegajo(legajo) {
  if (!legajo) {
    return "Legajo no definido";
  }

  return legajo.numero ? `Nro. ${legajo.numero}` : `Legajo #${legajo.id}`;
}

function obtenerEtiquetaComision(comision) {
  if (!comision) {
    return "Comision no definida";
  }

  const partes = [comision.nombre, comision.modalidad].filter(Boolean);

  if (partes.length === 0) {
    return `Comision asignatura #${comision.id_comision_asignatura}`;
  }

  return partes.join(" - ");
}

function validarPayload(payload) {
  if (!payload.tipo_autoridad_id) {
    return "Debe seleccionar un tipo de autoridad";
  }

  if (!payload.legajo_id) {
    return "Debe seleccionar un legajo";
  }

  if (!payload.comision_id) {
    return "Debe seleccionar una comision asignatura";
  }

  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar la autoridad de comision";
}

export default AutoridadesComision;
