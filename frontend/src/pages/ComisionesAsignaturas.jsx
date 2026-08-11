import { useEffect, useMemo, useState } from "react";
import {
  BookOpenCheck,
  DoorOpen,
  Hash,
  Pencil,
  PlusCircle,
  RefreshCcw,
  Save,
  Search,
  Tag,
  Trash2,
  Users,
  X,
} from "lucide-react";
import Navbar from "../components/Navbar";
import BotonVolver from "../components/BotonVolver";
import { asignaturaService } from "../services/asignaturaService";
import { aulaService } from "../services/aulaService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { comisionService } from "../services/comisionService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";
import { modalidadService } from "../services/modalidadService";

const formularioInicial = {
  plan_asignaturas_id: "",
  aula_id: "",
  comision_id: "",
  nombre: "",
  modalidad: "",
  vigencia_desde: "",
  vigencia_hasta: "",
  modalidadesid: "",
  cupo_maximo: "",
  estado: "1",
};

function ComisionesAsignaturas() {
  const [registros, setRegistros] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [modalidades, setModalidades] = useState([]);
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
        resAulas,
        resComisiones,
        resSedes,
        resModalidades,
      ] = await Promise.all([
        comisionAsignaturaService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        aulaService.obtenerTodas(),
        comisionService.obtenerTodas(),
        sedeService.obtenerTodas(),
        modalidadService.obtenerTodas(),
      ]);

      setRegistros(resRegistros.data || []);
      setPlanesAsignaturas(resPlanesAsignaturas.data || []);
      setAsignaturas(resAsignaturas.data || []);
      setPlanes(resPlanes.data || []);
      setAulas(resAulas.data || []);
      setComisiones(resComisiones.data || []);
      setSedes(resSedes.data || []);
      setModalidades(resModalidades.data || []);
    } catch (err) {
      setError(
        err.message || "No se pudieron obtener las comisiones asignaturas",
      );
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      planesAsignaturas: planesAsignaturas.reduce((acc, item) => {
        acc[item.id] = obtenerEtiquetaPlanAsignatura(
          item,
          asignaturas,
          planes,
          sedes,
        );
        return acc;
      }, {}),
      aulas: aulas.reduce((acc, aula) => {
        acc[aula.id_aula] = aula.aula;
        return acc;
      }, {}),
      comisiones: comisiones.reduce((acc, comision) => {
        acc[comision.id_comision] = comision.descripcion;
        return acc;
      }, {}),
      modalidades: modalidades.reduce((acc, modalidad) => {
        acc[modalidad.modalidadesid] = modalidad.descripcion;
        return acc;
      }, {}),
    };
  }, [
    planesAsignaturas,
    asignaturas,
    planes,
    aulas,
    comisiones,
    sedes,
    modalidades,
  ]);

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
      plan_asignaturas_id: String(registro.plan_asignaturas_id || ""),
      aula_id: String(registro.aula_id || ""),
      comision_id: String(registro.comision_id || ""),
      nombre: registro.nombre || "",
      modalidad: registro.modalidad || "",
      vigencia_desde: registro.vigencia_desde || "",
      vigencia_hasta: registro.vigencia_hasta || "",
      modalidadesid: String(registro.modalidadesid || ""),
      cupo_maximo: String(registro.cupo_maximo || ""),
      estado: String(registro.estado ?? 1),
    });
    setEditandoId(registro.id_comision_asignatura);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarRegistro(e) {
    e.preventDefault();

    const payload = {
      plan_asignaturas_id: Number(formulario.plan_asignaturas_id),
      aula_id: Number(formulario.aula_id),
      comision_id: Number(formulario.comision_id),
      nombre: formulario.nombre.trim(),
      vigencia_desde: formulario.vigencia_desde,
      vigencia_hasta: formulario.vigencia_hasta,
      modalidadesid: Number(formulario.modalidadesid),
      cupo_maximo: Number(formulario.cupo_maximo),
      estado: Number(formulario.estado),
    };

    const mensajeValidacion = validarPayload(payload);

    if (mensajeValidacion) {
      setErrorFormulario(mensajeValidacion);
      return;
    }

    try {
      setErrorFormulario("");

      if (editandoId) {
        await comisionAsignaturaService.actualizar(editandoId, payload);
      } else {
        await comisionAsignaturaService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRegistro(id) {
    const confirmar = confirm(
      "Seguro que queres eliminar esta comision asignatura?",
    );

    if (!confirmar) {
      return;
    }

    try {
      const respuesta = await comisionAsignaturaService.eliminar(id);
      alert(respuesta.message || "Comision asignatura eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la comision asignatura");
    }
  }

  const registrosFiltrados = registros.filter((registro) => {
    const textoBusqueda = busqueda.toLowerCase();
    const planAsignatura =
      mapas.planesAsignaturas[registro.plan_asignaturas_id] || "";
    const aula = mapas.aulas[registro.aula_id] || "";
    const comision = mapas.comisiones[registro.comision_id] || "";

    return (
      String(registro.nombre || "")
        .toLowerCase()
        .includes(textoBusqueda) ||
      String(registro.vigencia_desde || "")
        .toLowerCase()
        .includes(textoBusqueda) ||
      String(registro.vigencia_hasta || "")
        .toLowerCase()
        .includes(textoBusqueda) ||
      String(registro.modalidad || "").toLowerCase().includes(textoBusqueda) ||
      planAsignatura.toLowerCase().includes(textoBusqueda) ||
      aula.toLowerCase().includes(textoBusqueda) ||
      comision.toLowerCase().includes(textoBusqueda)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <BotonVolver />
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <BookOpenCheck size={30} />
              </div>

              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  Comision asignaturas
                </h1>

                <p className="text-slate-500 mt-2">
                  Vincula comisiones con planes de asignatura y aulas.
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
                onClick={abrirNuevoRegistro}
                className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
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
              placeholder="Buscar por comision, aula o modalidad"
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
              <EstadoVacio texto="Cargando comisiones asignaturas..." />
            ) : registrosFiltrados.length > 0 ? (
              registrosFiltrados.map((registro) => (
                <article
                  key={registro.id_comision_asignatura}
                  className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">
                        Comision asignatura
                      </p>
                      <h2 className="text-xl font-extrabold text-slate-800 mt-1">
                        {registro.nombre}
                      </h2>
                    </div>

                    <EstadoBadge estado={registro.estado} />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <Dato
                      label="Comision"
                      value={mapas.comisiones[registro.comision_id]}
                    />
                    <Dato label="Aula" value={mapas.aulas[registro.aula_id]} />
                    <Dato
                      label="Modalidad"
                      value={mapas.modalidades[registro.modalidadesid]}
                    />
                    <Dato label="Vigencia desde" value={registro.vigencia_desde} />
                    <Dato label="Vigencia hasta" value={registro.vigencia_hasta} />
                    <Dato label="Horario" value={registro.modalidad} />
                    <Dato label="Cupo" value={registro.cupo_maximo} />
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-slate-200">
                    <BotonAccion
                      onClick={() => editarRegistro(registro)}
                      tipo="editar"
                    />
                    <BotonAccion
                      onClick={() =>
                        eliminarRegistro(registro.id_comision_asignatura)
                      }
                      tipo="eliminar"
                    />
                  </div>
                </article>
              ))
            ) : (
              <EstadoVacio texto="No se encontraron comisiones asignaturas." />
            )}
          </div>

          <div className="hidden lg:block overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th>Nombre</Th>
                  <Th>Comision</Th>
                  <Th>Asignatura del plan</Th>
                  <Th>Aula</Th>
                  <Th>Modalidad</Th>
                  <Th>Horario</Th>
                  <Th>Vigencia desde</Th>
                  <Th>Vigencia hasta</Th>
                  <Th>Cupo</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </tr>
              </thead>

              <tbody>
                {cargando ? (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center px-5 py-10 text-slate-500"
                    >
                      Cargando comisiones asignaturas...
                    </td>
                  </tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((registro) => (
                    <tr
                      key={registro.id_comision_asignatura}
                      className="border-b border-slate-200 hover:bg-slate-50"
                    >
                      <Td destacado>{registro.nombre}</Td>
                      <Td>{mapas.comisiones[registro.comision_id] || "-"}</Td>
                      <Td>
                        {mapas.planesAsignaturas[
                          registro.plan_asignaturas_id
                        ] || "-"}
                      </Td>
                      <Td>{mapas.aulas[registro.aula_id] || "-"}</Td>
                      <Td>
                        {mapas.modalidades[registro.modalidadesid] || "-"}
                      </Td>
                      <Td>{registro.modalidad || "-"}</Td>
                      <Td>{registro.vigencia_desde || "-"}</Td>
                      <Td>{registro.vigencia_hasta || "-"}</Td>
                      <Td>{registro.cupo_maximo}</Td>
                      <Td>
                        <EstadoBadge estado={registro.estado} />
                      </Td>
                      <Td>
                        <div className="flex items-center gap-4">
                          <BotonAccion
                            onClick={() => editarRegistro(registro)}
                            tipo="editar"
                          />
                          <BotonAccion
                            onClick={() =>
                              eliminarRegistro(registro.id_comision_asignatura)
                            }
                            tipo="eliminar"
                          />
                        </div>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="text-center px-5 py-10 text-slate-500"
                    >
                      No se encontraron comisiones asignaturas.
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
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  title="Cerrar modal"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
                  {editandoId
                    ? "Editar comision asignatura"
                    : "Nueva comision asignatura"}
                </h2>

                <form onSubmit={guardarRegistro} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CampoSelect
                      label="Asignatura del plan"
                      name="plan_asignaturas_id"
                      value={formulario.plan_asignaturas_id}
                      onChange={manejarCambio}
                      icon={<BookOpenCheck size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {planesAsignaturas.map((planAsignatura) => (
                        <option
                          key={planAsignatura.id}
                          value={planAsignatura.id}
                        >
                          {mapas.planesAsignaturas[planAsignatura.id]}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Aula"
                      name="aula_id"
                      value={formulario.aula_id}
                      onChange={manejarCambio}
                      icon={<DoorOpen size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {aulas.map((aula) => (
                        <option key={aula.id_aula} value={aula.id_aula}>
                          {aula.aula}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoSelect
                      label="Comision"
                      name="comision_id"
                      value={formulario.comision_id}
                      onChange={manejarCambio}
                      icon={<Users size={20} />}
                    >
                      <option value="">Seleccione</option>
                      {comisiones.map((comision) => (
                        <option
                          key={comision.id_comision}
                          value={comision.id_comision}
                        >
                          {comision.descripcion}
                        </option>
                      ))}
                    </CampoSelect>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CampoInput
                      label="Nombre"
                      name="nombre"
                      value={formulario.nombre}
                      onChange={manejarCambio}
                      placeholder="Ej: Comision A - Incendios I"
                      maxLength={45}
                      icon={<Tag size={20} />}
                    />

                    <CampoSelect
                      label="Modalidad"
                      name="modalidadesid"
                      value={formulario.modalidadesid}
                      onChange={manejarCambio}
                      icon={<BookOpenCheck size={20} />}
                    >
                      <option value="">Seleccione</option>

                      {modalidades.map((modalidad) => (
                        <option
                          key={modalidad.modalidadesid}
                          value={modalidad.modalidadesid}
                        >
                          {modalidad.descripcion}
                        </option>
                      ))}
                    </CampoSelect>

                    <CampoInput
                      label="Horario"
                      name="modalidad"
                      value={formulario.modalidad}
                      onChange={manejarCambio}
                      placeholder="Ej: 18:00 a 20:00"
                      maxLength={45}
                      icon={<BookOpenCheck size={20} />}
                    />

                    <CampoInput
                      label="Vigencia desde"
                      name="vigencia_desde"
                      type="date"
                      value={formulario.vigencia_desde}
                      onChange={manejarCambio}
                      icon={<Calendar size={20} />}
                    />

                    <CampoInput
                      label="Vigencia hasta"
                      name="vigencia_hasta"
                      type="date"
                      value={formulario.vigencia_hasta}
                      onChange={manejarCambio}
                      icon={<Calendar size={20} />}
                    />

                    <CampoInput
                      label="Cupo maximo"
                      name="cupo_maximo"
                      type="number"
                      value={formulario.cupo_maximo}
                      onChange={manejarCambio}
                      placeholder="Ej: 30"
                      icon={<Hash size={20} />}
                    />

                    <CampoSelect
                      label="Estado"
                      name="estado"
                      value={formulario.estado}
                      onChange={manejarCambio}
                      icon={<Tag size={20} />}
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
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
      className={`flex items-center gap-1 font-semibold ${esEditar
          ? "text-blue-600 hover:text-blue-800"
          : "text-red-600 hover:text-red-800"
        } transition cursor-pointer`}
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

function EstadoBadge({ estado }) {
  const activo = Number(estado) === 1;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${activo
          ? "bg-green-100 text-green-700 border-green-300"
          : "bg-red-100 text-red-700 border-red-300"
        }`}
    >
      {activo ? "Activo" : "Inactivo"}
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
    <td
      className={`px-5 py-5 text-slate-700 ${destacado ? "font-semibold" : ""}`}
    >
      {children}
    </td>
  );
}

function obtenerEtiquetaPlanAsignatura(
  planAsignatura,
  asignaturas,
  planes,
  sedes,
) {
  const asignatura = asignaturas.find(
    (item) => item.id === planAsignatura.asignatura_id,
  );
  const plan = planes.find((item) => item.id === planAsignatura.plan_id);
  const sede = sedes.find((item) => item.id === planAsignatura.sedes_id);

  const partes = [asignatura?.nombre, plan?.nombre, sede?.nombre].filter(
    Boolean,
  );

  if (partes.length === 0) {
    return `Asignatura del plan #${planAsignatura.id}`;
  }

  return partes.join(" - ");
}

function validarPayload(payload) {
  if (!payload.plan_asignaturas_id) {
    return "Debe seleccionar un plan asignatura";
  }

  if (!payload.aula_id) {
    return "Debe seleccionar un aula";
  }

  if (!payload.comision_id) {
    return "Debe seleccionar una comision";
  }

  if (!payload.nombre) {
    return "El nombre es obligatorio";
  }

  if (!payload.modalidadesid) {
    return "La modalidad es obligatoria";
  }

  if (!payload.modalidad) {
    return "El horario es obligatorio";
  }

  if (!payload.vigencia_desde) {
    return "La vigencia desde es obligatoria";
  }

  if (!payload.vigencia_hasta) {
    return "La vigencia hasta es obligatoria";
  }


  if (!payload.cupo_maximo || payload.cupo_maximo <= 0) {
    return "El cupo maximo debe ser mayor a cero";
  }

  if (!payload.estado) {
    return "El estado es obligatorio";
  }

  return "";
}

function obtenerMensajeError(err) {
  if (typeof err?.message === "string" && err.message.trim()) {
    return err.message;
  }

  const errores = err?.errors;

  if (typeof errores === "string" && errores.trim()) {
    return errores;
  }

  if (errores && typeof errores === "object") {
    const primerError = Object.values(errores)[0];

    if (Array.isArray(primerError)) {
      const mensaje = primerError.find(
        (item) => typeof item === "string" && item.trim(),
      );

      if (mensaje) {
        return mensaje;
      }
    }

    if (typeof primerError === "string" && primerError.trim()) {
      return primerError;
    }
  }

  return "No se pudo completar la operación";
}

export default ComisionesAsignaturas;
