import { useEffect, useMemo, useState } from "react";
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

const formularioInicial = {
  sedes_id: "",
  aula: "",
  es_virtual: "0",
};

function Aulas() {
  const [aulas, setAulas] = useState([]);
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

  async function eliminarAula(id) {
    const confirmar = confirm("Seguro que queres eliminar esta aula?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await aulaService.eliminar(id);
      alert(respuesta.message || "Aula eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el aula");
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
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <RefreshCcw size={22} />
                Actualizar
              </button>

              <button
                onClick={abrirNuevaAula}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
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
                    <BotonAccion onClick={() => editarAula(aula)} tipo="editar" />
                    <BotonAccion onClick={() => eliminarAula(aula.id_aula)} tipo="eliminar" />
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
                    <tr key={aula.id_aula} className="border-b border-slate-200 hover:bg-slate-50">
                      <Td destacado>{aula.aula}</Td>
                      <Td>{sedesPorId[aula.sedes_id] || "-"}</Td>
                      <Td><TipoBadge esVirtual={aula.es_virtual} /></Td>
                      <Td><EstadoBadge estado={aula.estado} /></Td>
                      <Td>
                        <div className="flex items-center gap-4">
                          <BotonAccion onClick={() => editarAula(aula)} tipo="editar" />
                          <BotonAccion onClick={() => eliminarAula(aula.id_aula)} tipo="eliminar" />
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
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
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
