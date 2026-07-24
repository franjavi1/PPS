import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  BookOpen,
  CalendarDays,
  FileText,
  Hash,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Trash2,
  Eye,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { planService } from "../services/planesService";
import { tipoPlanesService } from "../services/tipoPlanesService";
import { useAuth } from "../context/AuthContext";

const formularioInicial = {
  tipo_planes_id_tipo_planes: "",
  resolucion_ministerial: "",
  nombre: "",
  descrip: "",
  vigencia_dde: "",
  vigencia_hta: "",
};

function Planes() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();
  const esAdministrador = currentUserRole === "ROLE_ADMIN";
  const [planes, setPlanes] = useState([]);
  const [tiposPlanes, setTiposPlanes] = useState([]);
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

      const [respuestaPlanes, respuestaTipos] = await Promise.all([
        planService.obtenerTodos(),
        tipoPlanesService.obtenerTodos(),
      ]);

      setPlanes(respuestaPlanes.data || []);
      setTiposPlanes(respuestaTipos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los planes");
    } finally {
      setCargando(false);
    }
  }

  const tiposPorId = useMemo(() => {
    return tiposPlanes.reduce((acc, tipoPlan) => {
      acc[tipoPlan.id_tipo_planes] = tipoPlan.descripcion;
      return acc;
    }, {});
  }, [tiposPlanes]);

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
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

  function editarPlan(plan) {
    navigate(`/planes/${plan.id}/editar`);
  }

  async function guardarPlan(e) {
    e.preventDefault();

    const tipoPlanId = Number(formulario.tipo_planes_id_tipo_planes);
    const resolucionMinisterial = Number(formulario.resolucion_ministerial);
    const nombre = formulario.nombre.trim();
    const descrip = formulario.descrip.trim();

    if (!tipoPlanId) {
      setErrorFormulario("Debe seleccionar un tipo de plan");
      return;
    }

    if (!resolucionMinisterial || resolucionMinisterial <= 0) {
      setErrorFormulario("La resolucion ministerial debe ser un numero positivo");
      return;
    }

    if (!nombre) {
      setErrorFormulario("El nombre del plan es obligatorio");
      return;
    }

    if (!formulario.vigencia_dde || !formulario.vigencia_hta) {
      setErrorFormulario("Debe cargar las fechas de vigencia");
      return;
    }

    if (formulario.vigencia_hta < formulario.vigencia_dde) {
      setErrorFormulario("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    const payload = {
      tipo_planes_id_tipo_planes: tipoPlanId,
      resolucion_ministerial: resolucionMinisterial,
      nombre,
      descrip: descrip || null,
      vigencia_dde: `${formulario.vigencia_dde}T00:00:00`,
      vigencia_hta: `${formulario.vigencia_hta}T00:00:00`,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");

      if (editandoId) {
        await planService.actualizar(editandoId, payload);
      } else {
        await planService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarPlan(id) {
    const confirmar = confirm("Seguro que queres dar de baja este plan y quitar sus asignaturas asociadas?");

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await planService.eliminar(id);
      alert(respuesta.message || "Plan dado de baja correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo dar de baja el plan");
    }
  }

  const planesFiltrados = planes.filter((plan) => {
    const textoBusqueda = busqueda.toLowerCase();
    const tipoPlan = tiposPorId[plan.tipo_planes_id_tipo_planes] || "";

    return (
      String(plan.nombre || "").toLowerCase().includes(textoBusqueda) ||
      String(plan.resolucion_ministerial || "").includes(textoBusqueda) ||
      tipoPlan.toLowerCase().includes(textoBusqueda)
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
                <BookOpen size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Planes
                </h1>

                <p className="text-slate-500 mt-2">
                  Consulta y gestiona los planes de estudio de la institucion.
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
                onClick={() => navigate("/planes/alta")}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"
              >
                <PlusCircle size={22} />
                Nuevo plan
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
              placeholder="Buscar por nombre, resolucion o tipo"
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
                Cargando planes...
              </div>
            ) : planesFiltrados.length > 0 ? (
              planesFiltrados.map((plan) => (
                <article
                  key={plan.id}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Plan
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {plan.nombre}
                      </h2>
                    </div>

                    <EstadoBadge estado={plan.estado} />
                  </div>

                  <div className="space-y-3 text-sm">
                    <Dato label="Tipo" value={tiposPorId[plan.tipo_planes_id_tipo_planes]} />
                    <Dato label="Resolucion" value={plan.resolucion_ministerial} />
                    <Dato label="Vigencia" value={`${formatearFecha(plan.vigencia_dde)} - ${formatearFecha(plan.vigencia_hta)}`} />
                  </div>

                  {plan.descrip && (
                    <p className="text-slate-600 text-sm mt-3">
                      {plan.descrip}
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <button
                      onClick={() => navigate(`/planes/${plan.id}`)}
                      className="h-10 flex items-center justify-center gap-1 text-slate-600 font-semibold border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                      <Eye size={16} />
                      Ver
                    </button>

                    <button
                      onClick={() => editarPlan(plan)}
                      disabled={!esAdministrador}
                      title={esAdministrador ? "Editar plan" : "Solo los administradores pueden editar"}
                      className="h-10 flex items-center justify-center gap-1 text-blue-600 font-semibold border border-blue-100 rounded-lg hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarPlan(plan.id)}
                      disabled={!esAdministrador}
                      title={esAdministrador ? "Dar de baja el plan" : "Solo los administradores pueden dar de baja"}
                      className="h-10 flex items-center justify-center gap-1 text-red-600 font-semibold border border-red-100 rounded-lg hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
                    >
                      <Trash2 size={16} />
                      Dar de baja
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="border border-slate-200 rounded-xl bg-white p-5 text-center text-slate-500">
                No se encontraron planes.
              </div>
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Resolucion</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Vigencia</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                      Cargando planes...
                    </td>
                  </tr>
                ) : planesFiltrados.length > 0 ? (
                  planesFiltrados.map((plan) => (
                    <tr key={plan.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 text-slate-700 font-semibold">
                        {plan.nombre}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {tiposPorId[plan.tipo_planes_id_tipo_planes] || "-"}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {plan.resolucion_ministerial}
                      </td>
                      <td className="px-5 py-5 text-slate-700">
                        {formatearFecha(plan.vigencia_dde)} - {formatearFecha(plan.vigencia_hta)}
                      </td>
                      <td className="px-5 py-5">
                        <EstadoBadge estado={plan.estado} />
                      </td>
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => navigate(`/planes/${plan.id}`)}
                            className="flex items-center gap-1 text-slate-600 font-semibold hover:text-slate-800"
                          >
                            <Eye size={18} />
                            Ver
                          </button>

                          <button
                            onClick={() => editarPlan(plan)}
                            disabled={!esAdministrador}
                            title={esAdministrador ? "Editar plan" : "Solo los administradores pueden editar"}
                            className="flex items-center gap-1 text-blue-600 font-semibold hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Pencil size={18} />
                            Editar
                          </button>

                          <button
                            onClick={() => eliminarPlan(plan.id)}
                            disabled={!esAdministrador}
                            title={esAdministrador ? "Dar de baja el plan" : "Solo los administradores pueden dar de baja"}
                            className="flex items-center gap-1 text-red-600 font-semibold hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={18} />
                            Dar de baja
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center px-5 py-10 text-slate-500">
                      No se encontraron planes.
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
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId ? "Editar plan" : "Nuevo plan"}
                </h2>

                <form onSubmit={guardarPlan} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CampoSelect
                      label="Tipo de plan"
                      name="tipo_planes_id_tipo_planes"
                      value={formulario.tipo_planes_id_tipo_planes}
                      onChange={manejarCambio}
                      icon={<BookOpen size={20} />}
                    >
                      <option value="">Seleccione un tipo</option>
                      {tiposPlanes.map((tipoPlan) => (
                        <option
                          key={tipoPlan.id_tipo_planes}
                          value={tipoPlan.id_tipo_planes}
                        >
                          {tipoPlan.descripcion}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoInput
                      label="Resolucion ministerial"
                      name="resolucion_ministerial"
                      type="number"
                      value={formulario.resolucion_ministerial}
                      onChange={manejarCambio}
                      placeholder="Ej: 2026001"
                      icon={<Hash size={20} />}
                    />
                  </div>

                  <CampoInput
                    label="Nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejarCambio}
                    placeholder="Ej: Plan de Formacion Inicial"
                    icon={<FileText size={20} />}
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CampoInput
                      label="Vigencia desde"
                      name="vigencia_dde"
                      type="date"
                      value={formulario.vigencia_dde}
                      onChange={manejarCambio}
                      icon={<CalendarDays size={20} />}
                    />

                    <CampoInput
                      label="Vigencia hasta"
                      name="vigencia_hta"
                      type="date"
                      value={formulario.vigencia_hta}
                      onChange={manejarCambio}
                      icon={<CalendarDays size={20} />}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Descripcion
                    </label>
                    <textarea
                      name="descrip"
                      value={formulario.descrip}
                      onChange={manejarCambio}
                      placeholder="Breve descripcion del plan"
                      className="w-full min-h-24 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
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

function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

function EstadoBadge({ estado }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${
        estado === 1 || estado === true
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
      }`}
    >
      {estado === 1 || estado === true ? "Activo" : "Inactivo"}
    </span>
  );
}

function formatearFechaInput(fecha) {
  if (!fecha) {
    return "";
  }

  return String(fecha).slice(0, 10);
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "-";
  }

  return String(fecha).slice(0, 10);
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo guardar el plan";
}

export default Planes;
