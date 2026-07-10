import { useEffect, useMemo, useState } from "react";
import {
  BookMarked,
  FileText,
  GitBranch,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";

const formularioInicial = {
  pa_id: "",
  asignatura_id: "",
};

function PACorrelativas() {
  const [registros, setRegistros] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
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

      const [
        resRegistros,
        resPlanesAsignaturas,
        resAsignaturas,
        resPlanes,
        resSedes,
      ] = await Promise.all([
        paCorrelativaService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);

      setRegistros(resRegistros.data || []);
      setPlanesAsignaturas(resPlanesAsignaturas.data || []);
      setAsignaturas(resAsignaturas.data || []);
      setPlanes(resPlanes.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las correlativas");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      planesAsignaturas: planesAsignaturas.reduce((acc, planAsignatura) => {
        acc[planAsignatura.id] = obtenerEtiquetaPlanAsignatura(
          planAsignatura,
          asignaturas,
          planes,
          sedes
        );
        return acc;
      }, {}),
      asignaturas: asignaturas.reduce((acc, asignatura) => {
        acc[asignatura.id] = asignatura.nombre;
        return acc;
      }, {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes]);

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
      pa_id: String(registro.pa_id || ""),
      asignatura_id: String(registro.asignatura_id || ""),
    });
    setEditandoId(registro.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarRegistro(e) {
    e.preventDefault();

    const payload = {
      pa_id: Number(formulario.pa_id),
      asignatura_id: Number(formulario.asignatura_id),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarPayload(payload, planesAsignaturas);

    if (mensajeValidacion) {
      setErrorFormulario(mensajeValidacion);
      return;
    }

    try {
      setErrorFormulario("");

      if (editandoId) {
        await paCorrelativaService.actualizar(editandoId, payload);
      } else {
        await paCorrelativaService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRegistro(id) {
    const confirmar = confirm("Seguro que queres eliminar esta correlativa?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await paCorrelativaService.eliminar(id);
      alert(respuesta.message || "Correlativa eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la correlativa");
    }
  }

  const registrosFiltrados = registros.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const planAsignatura = mapas.planesAsignaturas[registro.pa_id] || "";
    const correlativa = mapas.asignaturas[registro.asignatura_id] || "";

    return (
      planAsignatura.toLowerCase().includes(textoBusqueda) ||
      correlativa.toLowerCase().includes(textoBusqueda)
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
                <GitBranch size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Plan asignaturas correlativas
                </h1>
                <p className="text-slate-500 mt-2">
                  Define que asignaturas previas requiere cada plan asignatura.
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
                Nueva correlativa
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
              placeholder="Buscar por plan asignatura o correlativa"
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
              <EstadoVacio texto="Cargando correlativas..." />
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <article
                  key={registro.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Plan asignatura
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                      {mapas.planesAsignaturas[registro.pa_id] || "-"}
                    </h2>
                  </div>

                  <Dato
                    label="Correlativa"
                    value={mapas.asignaturas[registro.asignatura_id]}
                  />

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" />
                    <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="eliminar" />
                  </div>
                </article>
              ))
            ) : (
              <EstadoVacio texto="No se encontraron correlativas." />
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th>Plan asignatura</Th>
                  <Th>Correlativa</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="3" className="text-center px-5 py-10 text-slate-500">
                      Cargando correlativas...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <Td destacado>{mapas.planesAsignaturas[registro.pa_id] || "-"}</Td>
                      <Td>{mapas.asignaturas[registro.asignatura_id] || "-"}</Td>
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
                    <td colSpan="3" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron correlativas.
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
                  {editandoId ? "Editar correlativa" : "Nueva correlativa"}
                </h2>

                <form onSubmit={guardarRegistro} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CampoSelect
                      label="Plan asignatura"
                      name="pa_id"
                      value={formulario.pa_id}
                      onChange={manejarCambio}
                      icon={<BookMarked size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {planesAsignaturas.map((planAsignatura) => (
                        <option key={planAsignatura.id} value={planAsignatura.id}>
                          {mapas.planesAsignaturas[planAsignatura.id]}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Asignatura correlativa"
                      name="asignatura_id"
                      value={formulario.asignatura_id}
                      onChange={manejarCambio}
                      icon={<FileText size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {asignaturas.map((asignatura) => (
                        <option key={asignatura.id} value={asignatura.id}>
                          {asignatura.nombre}
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

function obtenerEtiquetaPlanAsignatura(planAsignatura, asignaturas, planes, sedes) {
  const asignatura = asignaturas.find(
    (item) => item.id === planAsignatura.asignatura_id
  );
  const plan = planes.find((item) => item.id === planAsignatura.plan_id);
  const sede = sedes.find((item) => item.id === planAsignatura.sedes_id);

  const partes = [asignatura?.nombre, plan?.nombre, sede?.nombre].filter(Boolean);

  if (partes.length === 0) {
    return `Plan asignatura #${planAsignatura.id}`;
  }

  return partes.join(" - ");
}

function validarPayload(payload, planesAsignaturas) {
  if (!payload.pa_id) {
    return "Debe seleccionar un plan asignatura";
  }

  if (!payload.asignatura_id) {
    return "Debe seleccionar una asignatura correlativa";
  }

  const planAsignatura = planesAsignaturas.find((item) => item.id === payload.pa_id);

  if (planAsignatura?.asignatura_id === payload.asignatura_id) {
    return "Una asignatura no puede ser correlativa de si misma";
  }

  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar la correlativa";
}

export default PACorrelativas;
