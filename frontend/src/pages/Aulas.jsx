import { useEffect, useMemo, useState } from "react";
import BotonVolver from "../components/BotonVolver";
import ModalConfirmar from "../components/ModalConfirmar";
import {
  Building2,
  DoorOpen,
  Monitor,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { aulaService } from "../services/aulaService";
import { sedeService } from "../services/sedeService";
import useAuth from "../auth/hooks/useAuth";

const formularioInicial = {
  sedes_id: "",
  aula: "",
  es_virtual: "0",
};

function Aulas() {
  const { currentUserRole, hasPermission } = useAuth();
  const [aulas, setAulas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  // Estado para el modal de borrado
  const [idAEliminar, setIdAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaAulas, respuestaSedes] = await Promise.all([
        aulaService.obtenerTodas(),
        sedeService.obtenerTodas(),
      ]);

      setAulas(respuestaAulas.data || []);
      setSedes(respuestaSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las aulas");
    } finally {
      setCargando(false);
    }
  }

  const sedesPorId = useMemo(() => {
    return sedes.reduce((acc, sede) => {
      acc[sede.id] = sede.nombre;
      return acc;
    }, {});
  }, [sedes]);

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function abrirNuevaAula() {
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

  function editarAula(aula) {
    setFormulario({
      sedes_id: String(aula.sedes_id || ""),
      aula: aula.aula || "",
      es_virtual: String(aula.es_virtual ?? 0),
    });
    setEditandoId(aula.id_aula);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarAula(e) {
    e.preventDefault();

    const sedesId = Number(formulario.sedes_id);
    const nombreAula = formulario.aula.trim();
    const esVirtual = Number(formulario.es_virtual);

    if (!sedesId) {
      setErrorFormulario("Debe seleccionar una sede");
      return;
    }

    if (!nombreAula) {
      setErrorFormulario("El nombre del aula es obligatorio");
      return;
    }

    if (nombreAula.length > 45) {
      setErrorFormulario("El nombre del aula debe tener hasta 45 caracteres");
      return;
    }

    const payload = {
      sedes_id: sedesId,
      aula: nombreAula,
      es_virtual: esVirtual,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await aulaService.actualizar(editandoId, payload);
      } else {
        await aulaService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  function solicitarEliminacion(id) {
    setIdAEliminar(id);
  }

  async function confirmarEliminacion() {
    if (!idAEliminar) return;

    try {
      setEliminando(true);
      setError("");
      await aulaService.eliminar(idAEliminar);
      setIdAEliminar(null);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el aula");
    } finally {
      setEliminando(false);
    }
  }

  const aulasFiltradas = aulas.filter((aula) => {
    const textoBusqueda = busqueda.toLowerCase();
    const sede = sedesPorId[aula.sedes_id] || "";

    return (
      String(aula.aula || "").toLowerCase().includes(textoBusqueda) ||
      sede.toLowerCase().includes(textoBusqueda)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* BOTÓN VOLVER INCLUIDO AQUÍ */}
        <BotonVolver ruta="/planes" />

        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <DoorOpen size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Aulas
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona aulas fisicas o virtuales por sede.
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
                onClick={abrirNuevaAula}
                disabled={!hasPermission("planes.aulas.crear")}
                title={
                  hasPermission("planes.aulas.crear")
                    ? "Crear aula"
                    : "No tenés permiso para crear aulas"
                }
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
              >
                <PlusCircle size={22} />
                Nueva aula
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
              placeholder="Buscar por aula o sede"
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
              <EstadoVacio texto="Cargando aulas..." />
            ) : aulasFiltradas.length > 0 ? (
              aulasFiltradas.map((aula) => (
                <article
                  key={aula.id_aula}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Aula
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {aula.aula}
                      </h2>
                    </div>

                    <TipoBadge esVirtual={aula.es_virtual} />
                  </div>

                  <Dato label="Sede" value={sedesPorId[aula.sedes_id]} />

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <BotonAccion
                      onClick={() => editarAula(aula)}
                      tipo="editar"
                      disabled={!hasPermission("planes.aulas.editar")}
                      mensajeSinPermiso="No tenés permiso para editar aulas"
                    />
                    <BotonAccion
                      onClick={() => solicitarEliminacion(aula.id_aula)}
                      tipo="eliminar"
                      disabled={!hasPermission("planes.aulas.eliminar")}
                      mensajeSinPermiso="No tenés permiso para eliminar aulas"
                    />
                  </div>
                </article>
              ))
            ) : (
              <EstadoVacio texto="No se encontraron aulas." />
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th>Aula</Th>
                  <Th>Sede</Th>
                  <Th>Tipo</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="5" className="text-center px-5 py-10 text-slate-500">
                      Cargando aulas...
                    </td>
                  </tr>
                ) : aulasFiltradas.length > 0 ? (
                  aulasFiltradas.map((aula) => (
                    <tr key={aula.id_aula}>
                      <Td destacado className="border-b border-slate-200 hover:bg-slate-50">{aula.aula}</Td>
                      <Td className="truncate max-w-full block">{sedesPorId[aula.sedes_id] || "-"}</Td>
                      <Td><TipoBadge esVirtual={aula.es_virtual} /></Td>
                      <Td><EstadoBadge estado={aula.estado} /></Td>
                      <Td>
                        <div className="flex items-center gap-4">
                          <BotonAccion
                            onClick={() => editarAula(aula)}
                            tipo="editar"
                            disabled={!hasPermission("planes.aulas.editar")}
                            mensajeSinPermiso="No tenés permiso para editar aulas"
                          />
                          <BotonAccion
                            onClick={() => solicitarEliminacion(aula.id_aula)}
                            tipo="eliminar"
                            disabled={!hasPermission("planes.aulas.eliminar")}
                            mensajeSinPermiso="No tenés permiso para eliminar aulas"
                          />
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron aulas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mostrarModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-xl relative">
                <button
                  onClick={cerrarModal}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar aula" : "Nueva aula"}
                </h2>

                <form onSubmit={guardarAula} className="space-y-5">
                  <CampoSelect
                    label="Sede"
                    name="sedes_id"
                    value={formulario.sedes_id}
                    onChange={manejarCambio}
                    icon={<Building2 size={20} />}
                  >
                    <option value="">Seleccione una sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.id} value={sede.id}>
                        {sede.nombre}
                      </option>
                    ))}
                  </CampoSelect>

                  <CampoInput
                    label="Nombre del aula"
                    name="aula"
                    value={formulario.aula}
                    pattern=".*[a-zA-ZáéíóúÁÉÍÓÚñÑ].*"
                    onChange={manejarCambio}
                    placeholder="Ej: Aula 1"
                    maxLength={45}
                    icon={<DoorOpen size={20} />}
                  />

                  <CampoSelect
                    label="Tipo de aula"
                    name="es_virtual"
                    value={formulario.es_virtual}
                    onChange={manejarCambio}
                    icon={<Monitor size={20} />}
                  >
                    <option value="0">Fisica</option>
                    <option value="1">Virtual</option>
                  </CampoSelect>

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

      {/* MODAL DE CONFIRMACIÓN DE BORRADO */}
      <ModalConfirmar
        isOpen={Boolean(idAEliminar)}
        titulo="Eliminar aula"
        mensaje="¿Estás seguro de que querés eliminar esta aula? Esta acción no se puede deshacer."
        onConfirm={confirmarEliminacion}
        onCancel={() => setIdAEliminar(null)}
        cargando={eliminando}
      />
    </div>
  );
}

function CampoInput({ label, icon, ...props }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>
        <input
          {...props}
          className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
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

function BotonAccion({ 
  onClick, 
  tipo, 
  disabled = false, 
  title, 
  mensajeSinPermiso 
}) {
  const esEditar = tipo === "editar";

  const tituloFinal = title || (
    disabled 
      ? (mensajeSinPermiso || `No tenés permiso para ${esEditar ? "editar" : "eliminar"}`) 
      : (esEditar ? "Editar" : "Eliminar")
  );

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tituloFinal}
      className={`h-10 flex items-center justify-center gap-1 font-semibold border rounded-lg transition ${
        esEditar
          ? "text-blue-600 border-blue-100 hover:bg-blue-50"
          : "text-red-600 border-red-100 hover:bg-red-50"
      } disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white cursor-pointer`}
    >
      {esEditar ? <Pencil size={16} /> : <Trash2 size={16} />}
      {esEditar ? "Editar" : "Eliminar"}
    </button>
  );
}

function Dato({ label, value }) {
  return (
    <div className="text-sm">
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

function TipoBadge({ esVirtual }) {
  const virtual = esVirtual === 1 || esVirtual === true;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${
      virtual
        ? "bg-blue-100 text-blue-700 border-blue-300"
        : "bg-slate-100 text-slate-700 border-slate-300"
    }`}>
      {virtual ? "Virtual" : "Fisica"}
    </span>
  );
}

function EstadoBadge({ estado }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${
      estado === 1 || estado === true
        ? "bg-green-100 text-green-700 border-green-300"
        : "bg-red-100 text-red-700 border-red-300"
    }`}>
      {estado === 1 || estado === true ? "Activa" : "Inactiva"}
    </span>
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

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar el aula";
}

export default Aulas;