import { useEffect, useMemo, useState } from "react";
import {
  BookMarked,
  BookOpen,
  Building2,
  ChevronsUp,
  FileText,
  Hash,
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
import { planService } from "../services/planesService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { useAuth } from "../context/AuthContext";

const formularioInicial = {
  asignatura_id: "",
  plan_id: "",
  rango_minimo_id: "",
  sedes_id: "",
  presentismo_porc: "",
  regularizacion_prom: "",
  final_aprobacion: "",
  duracion: "",
  regimen: "",
  modalidad: "",
};

function PlanesAsignaturas() {
  const { currentUserRole } = useAuth();
  const esAdministrador = currentUserRole === "ROLE_ADMIN";
  const [registros, setRegistros] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [rangos, setRangos] = useState([]);
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
        resAsignaturas,
        resPlanes,
        resRangos,
        resSedes,
      ] = await Promise.all([
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);

      setRegistros(resRegistros.data || []);
      setAsignaturas(resAsignaturas.data || []);
      setPlanes(resPlanes.data || []);
      setRangos(resRangos.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los planes asignaturas");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      asignaturas: crearMapa(asignaturas, "id", "nombre"),
      planes: crearMapa(planes, "id", "nombre"),
      rangos: crearMapa(rangos, "id", "descripcion"),
      sedes: crearMapa(sedes, "id", "nombre"),
    };
  }, [asignaturas, planes, rangos, sedes]);

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
      asignatura_id: String(registro.asignatura_id || ""),
      plan_id: String(registro.plan_id || ""),
      rango_minimo_id: String(registro.rango_minimo_id || ""),
      sedes_id: String(registro.sedes_id || ""),
      presentismo_porc: String(registro.presentismo_porc ?? ""),
      regularizacion_prom: String(registro.regularizacion_prom ?? ""),
      final_aprobacion: String(registro.final_aprobacion ?? ""),
      duracion: String(registro.duracion ?? ""),
      regimen: registro.regimen || "",
      modalidad: registro.modalidad || "",
    });
    setEditandoId(registro.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarRegistro(e) {
    e.preventDefault();

    const payload = {
      asignatura_id: Number(formulario.asignatura_id),
      plan_id: Number(formulario.plan_id),
      rango_minimo_id: Number(formulario.rango_minimo_id),
      sedes_id: Number(formulario.sedes_id),
      presentismo_porc: Number(formulario.presentismo_porc),
      regularizacion_prom: Number(formulario.regularizacion_prom),
      final_aprobacion: Number(formulario.final_aprobacion),
      duracion: Number(formulario.duracion),
      regimen: formulario.regimen.trim(),
      modalidad: formulario.modalidad.trim(),
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
        await planAsignaturaService.actualizar(editandoId, payload);
      } else {
        await planAsignaturaService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRegistro(id) {
    const confirmar = confirm("Seguro que queres quitar esta asignatura del plan?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await planAsignaturaService.eliminar(id);
      alert(respuesta.message || "Asignatura quitada del plan correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo quitar la asignatura del plan");
    }
  }

  const registrosFiltrados = registros.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const asignatura = mapas.asignaturas[registro.asignatura_id] || "";
    const plan = mapas.planes[registro.plan_id] || "";
    const sede = mapas.sedes[registro.sedes_id] || "";

    return (
      asignatura.toLowerCase().includes(textoBusqueda) ||
      plan.toLowerCase().includes(textoBusqueda) ||
      sede.toLowerCase().includes(textoBusqueda) ||
      String(registro.regimen || "").toLowerCase().includes(textoBusqueda) ||
      String(registro.modalidad || "").toLowerCase().includes(textoBusqueda)
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
                <BookMarked size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Plan asignaturas
                </h1>

                <p className="text-slate-500 mt-2">
                  Vincula asignaturas, planes, rangos minimos y sedes.
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
                disabled={!esAdministrador}
                title={esAdministrador ? "Agregar una asignatura a un plan" : "Solo los administradores pueden agregar asignaturas"}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-700"
              >
                <PlusCircle size={22} />
                Nuevo registro
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
              placeholder="Buscar por asignatura, plan o sede"
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
              <EstadoVacio texto="Cargando planes asignaturas..." />
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <article
                  key={registro.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase">
                      Asignatura
                    </p>
                    <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                      {mapas.asignaturas[registro.asignatura_id] || "-"}
                    </h2>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Dato label="Plan" value={mapas.planes[registro.plan_id]} />
                    <Dato label="Sede" value={mapas.sedes[registro.sedes_id]} />
                    <Dato label="Rango minimo" value={mapas.rangos[registro.rango_minimo_id]} />
                    <Dato label="Modalidad" value={registro.modalidad} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" disabled={!esAdministrador} />
                    <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="quitar" disabled={!esAdministrador} />
                  </div>
                </article>
              ))
            ) : (
              <EstadoVacio texto="No se encontraron planes asignaturas." />
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th>Asignatura</Th>
                  <Th>Plan</Th>
                  <Th>Sede</Th>
                  <Th>Rango minimo</Th>
                  <Th>Regimen</Th>
                  <Th>Modalidad</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                      Cargando planes asignaturas...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <tr key={registro.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <Td destacado>{mapas.asignaturas[registro.asignatura_id] || "-"}</Td>
                      <Td>{mapas.planes[registro.plan_id] || "-"}</Td>
                      <Td>{mapas.sedes[registro.sedes_id] || "-"}</Td>
                      <Td>{mapas.rangos[registro.rango_minimo_id] || "-"}</Td>
                      <Td>{registro.regimen}</Td>
                      <Td>{registro.modalidad}</Td>
                      <Td>
                        <div className="flex items-center gap-4">
                          <BotonAccion onClick={() => editarRegistro(registro)} tipo="editar" disabled={!esAdministrador} />
                          <BotonAccion onClick={() => eliminarRegistro(registro.id)} tipo="quitar" disabled={!esAdministrador} />
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron planes asignaturas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {mostrarModal && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-4xl relative max-h-[92vh] overflow-y-auto">
                <button
                  onClick={cerrarModal}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar plan asignatura" : "Nuevo plan asignatura"}
                </h2>

                <form onSubmit={guardarRegistro} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CampoSelect
                      label="Asignatura"
                      name="asignatura_id"
                      value={formulario.asignatura_id}
                      onChange={manejarCambio}
                      icon={<FileText size={20} />}
                    >
                      <option value="">Seleccione una asignatura</option>
                      {asignaturas.map((asignatura) => (
                        <option key={asignatura.id} value={asignatura.id}>
                          {asignatura.nombre}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Plan"
                      name="plan_id"
                      value={formulario.plan_id}
                      onChange={manejarCambio}
                      icon={<BookOpen size={20} />}
                    >
                      <option value="">Seleccione un plan</option>
                      {planes.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.nombre}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Rango minimo"
                      name="rango_minimo_id"
                      value={formulario.rango_minimo_id}
                      onChange={manejarCambio}
                      icon={<ChevronsUp size={20} />}
                    >
                      <option value="">Seleccione un rango</option>
                      {rangos.map((rango) => (
                        <option key={rango.id} value={rango.id}>
                          {rango.descripcion}
                        </option>
                      ))}
                    </CampoSelect>

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
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <CampoInput
                      label="Presentismo %"
                      name="presentismo_porc"
                      type="number"
                      step="0.01"
                      value={formulario.presentismo_porc}
                      onChange={manejarCambio}
                      icon={<Hash size={20} />}
                    />
                    <CampoInput
                      label="Regularizacion prom."
                      name="regularizacion_prom"
                      type="number"
                      step="0.01"
                      value={formulario.regularizacion_prom}
                      onChange={manejarCambio}
                      icon={<Hash size={20} />}
                    />
                    <CampoInput
                      label="Final aprobacion"
                      name="final_aprobacion"
                      type="number"
                      value={formulario.final_aprobacion}
                      onChange={manejarCambio}
                      icon={<Hash size={20} />}
                    />
                    <CampoInput
                      label="Duracion"
                      name="duracion"
                      type="number"
                      step="0.01"
                      value={formulario.duracion}
                      onChange={manejarCambio}
                      icon={<Hash size={20} />}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CampoInput
                      label="Regimen"
                      name="regimen"
                      value={formulario.regimen}
                      onChange={manejarCambio}
                      placeholder="Ej: Anual"
                      icon={<BookMarked size={20} />}
                    />
                    <CampoInput
                      label="Modalidad"
                      name="modalidad"
                      value={formulario.modalidad}
                      onChange={manejarCambio}
                      placeholder="Ej: Presencial"
                      icon={<BookMarked size={20} />}
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

function BotonAccion({ onClick, tipo, disabled = false }) {
  const esEditar = tipo === "editar";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={
        disabled
          ? "Solo los administradores pueden realizar esta acción"
          : esEditar
          ? "Editar relación"
          : "Quitar asignatura del plan"
      }
      className={`flex items-center gap-1 font-semibold ${
        esEditar
          ? "text-blue-600 hover:text-blue-800"
          : "text-red-600 hover:text-red-800"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {esEditar ? <Pencil size={18} /> : <Trash2 size={18} />}
      {esEditar ? "Editar" : "Quitar del plan"}
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

function crearMapa(items, idKey, valueKey) {
  return items.reduce((acc, item) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

function validarPayload(payload) {
  const camposSelect = [
    ["asignatura_id", "Debe seleccionar una asignatura"],
    ["plan_id", "Debe seleccionar un plan"],
    ["rango_minimo_id", "Debe seleccionar un rango minimo"],
    ["sedes_id", "Debe seleccionar una sede"],
  ];

  for (const [campo, mensaje] of camposSelect) {
    if (!payload[campo]) {
      return mensaje;
    }
  }

  const camposNumericos = [
    ["presentismo_porc", "El presentismo debe ser un numero"],
    ["regularizacion_prom", "La regularizacion debe ser un numero"],
    ["final_aprobacion", "La nota final debe ser un numero"],
    ["duracion", "La duracion debe ser un numero"],
  ];

  for (const [campo, mensaje] of camposNumericos) {
    if (Number.isNaN(payload[campo])) {
      return mensaje;
    }
  }

  if (!payload.regimen) {
    return "El regimen es obligatorio";
  }

  if (!payload.modalidad) {
    return "La modalidad es obligatoria";
  }

  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar el plan asignatura";
}

export default PlanesAsignaturas;
