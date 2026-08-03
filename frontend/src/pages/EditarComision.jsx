import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpenCheck,
  ChevronDown,
  DoorOpen,
  GraduationCap,
  Hash,
  PlusCircle,
  Save,
  ShieldUser,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { asignaturaService } from "../services/asignaturaService";
import { aulaService } from "../services/aulaService";
import { autoridadComisionService } from "../services/autoridadComisionService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { comisionService } from "../services/comisionService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";
import { tipoAutoridadService } from "../services/tipoAutoridadService";
import { modalidadService } from "../services/modalidadService";

const comisionInicial = {
  descripcion: "",
};

const nuevaComisionAsignaturaInicial = {
  plan_asignaturas_id: "",
  aula_id: "",
  nombre: "",
  modalidad: "",
  modalidadesid: "",
  cupo_maximo: "",
  estado: "1",
};

const nuevaAutoridadInicial = {
  tipo_autoridad_id: "",
  legajo_id: "",
  comision_id: "",
};

function EditarComision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comision, setComision] = useState(comisionInicial);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
  const [nuevaComisionAsignatura, setNuevaComisionAsignatura] = useState(
    nuevaComisionAsignaturaInicial,
  );
  const [autoridades, setAutoridades] = useState([]);
  const [nuevaAutoridad, setNuevaAutoridad] = useState(nuevaAutoridadInicial);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState("datos");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [
        resComision,
        resComisionesAsignaturas,
        resAutoridades,
        resPlanesAsignaturas,
        resAsignaturas,
        resPlanes,
        resSedes,
        resAulas,
        resTiposAutoridad,
        resLegajos,
        resModalidades,
      ] = await Promise.all([
        comisionService.obtenerPorId(id),
        comisionAsignaturaService.obtenerTodos(),
        autoridadComisionService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        sedeService.obtenerTodas(),
        aulaService.obtenerTodas(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
        modalidadService.obtenerTodas(),
      ]);

      const comisionesDeEsta = obtenerLista(resComisionesAsignaturas).filter(
        (item) => Number(item.comision_id) === Number(id),
      );
      const idsComisionesAsignaturas = comisionesDeEsta.map((item) =>
        Number(item.id_comision_asignatura),
      );

      setComision({
        descripcion: resComision.data?.descripcion || "",
      });
      setComisionesAsignaturas(comisionesDeEsta);
      setAutoridades(
        obtenerLista(resAutoridades).filter((item) =>
          idsComisionesAsignaturas.includes(Number(item.comision_id)),
        ),
      );
      setPlanesAsignaturas(obtenerLista(resPlanesAsignaturas));
      setAsignaturas(obtenerLista(resAsignaturas));
      setPlanes(obtenerLista(resPlanes));
      setSedes(obtenerLista(resSedes));
      setAulas(obtenerLista(resAulas));
      setTiposAutoridad(obtenerLista(resTiposAutoridad));
      setLegajos(obtenerLista(resLegajos));
      setModalidades(obtenerLista(resModalidades));
    } catch (err) {
      setError(obtenerMensajeError(err));
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
      aulas: crearMapa(aulas, "id_aula", "aula"),
      modalidades: crearMapa(modalidades, "modalidadesid", "descripcion"),
      tiposAutoridad: crearMapa(tiposAutoridad, "id", "descripcion"),
      legajos: legajos.reduce((acc, item) => {
        acc[item.id] = obtenerEtiquetaLegajo(item);
        return acc;
      }, {}),
    };
  }, [
    planesAsignaturas,
    asignaturas,
    planes,
    sedes,
    aulas,
    modalidades,
    tiposAutoridad,
    legajos,
  ]);

  function cambiarComision(e) {
    const { name, value } = e.target;
    setComision({ ...comision, [name]: value });
  }

  function cambiarNuevaComisionAsignatura(e) {
    const { name, value } = e.target;
    setNuevaComisionAsignatura({
      ...nuevaComisionAsignatura,
      [name]: value,
    });
  }

  function cambiarNuevaAutoridad(e) {
    const { name, value } = e.target;
    setNuevaAutoridad({ ...nuevaAutoridad, [name]: value });
  }

  async function guardarCambios(e) {
    e.preventDefault();

    const descripcion = comision.descripcion.trim();

    if (!descripcion) {
      setError("La descripcion es obligatoria");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await comisionService.actualizar(id, {
        descripcion,
        usuario_accion: 1,
      });

      setMensaje("Comision actualizada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function agregarComisionAsignatura() {
    const payload = {
      plan_asignaturas_id: Number(nuevaComisionAsignatura.plan_asignaturas_id),
      aula_id: Number(nuevaComisionAsignatura.aula_id),
      comision_id: Number(id),
      nombre: nuevaComisionAsignatura.nombre.trim(),
      modalidad: nuevaComisionAsignatura.modalidad.trim(),
      modalidadesid: Number(nuevaComisionAsignatura.modalidadesid),
      cupo_maximo: Number(nuevaComisionAsignatura.cupo_maximo),
      estado: Number(nuevaComisionAsignatura.estado),
    };

    const mensajeValidacion = validarComisionAsignatura(payload);

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await comisionAsignaturaService.crear(payload);
      setNuevaComisionAsignatura(nuevaComisionAsignaturaInicial);
      setMensaje("Asignatura agregada correctamente");
      await cargarDatos();
      setSeccionAbierta("asignaturas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarComisionAsignatura(comisionAsignaturaId) {
    const confirmar = confirm(
      "Seguro que queres eliminar esta asignatura de la comision?",
    );

    if (!confirmar) {
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await comisionAsignaturaService.eliminar(comisionAsignaturaId);
      setMensaje("Asignatura eliminada correctamente");
      await cargarDatos();
      setSeccionAbierta("asignaturas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function agregarAutoridad() {
    const payload = {
      tipo_autoridad_id: Number(nuevaAutoridad.tipo_autoridad_id),
      legajo_id: Number(nuevaAutoridad.legajo_id),
      comision_id: Number(nuevaAutoridad.comision_id),
    };

    const mensajeValidacion = validarAutoridad(payload);

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await autoridadComisionService.crear(payload);
      setNuevaAutoridad(nuevaAutoridadInicial);
      setMensaje("Autoridad agregada correctamente");
      await cargarDatos();
      setSeccionAbierta("autoridades");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAutoridad(autoridadId) {
    const confirmar = confirm("Seguro que queres eliminar esta autoridad?");

    if (!confirmar) {
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await autoridadComisionService.eliminar(autoridadId);
      setMensaje("Autoridad eliminada correctamente");
      await cargarDatos();
      setSeccionAbierta("autoridades");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <GraduationCap size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">
                  Edicion
                </p>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-1">
                  Editar comision
                </h1>
                <p className="text-slate-500 mt-2">
                  Modifica datos, asignaturas y autoridades de la comision.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate(`/comisiones/${id}`)}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="mb-6 border border-green-200 bg-green-50 text-green-700 rounded-xl px-5 py-4 font-semibold">
              {mensaje}
            </div>
          )}

          {cargando ? (
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-slate-500 font-semibold">
              Cargando comision...
            </div>
          ) : (
            <form onSubmit={guardarCambios} className="space-y-8">
              <Seccion
                id="datos"
                icono={<GraduationCap size={23} />}
                titulo="Datos de la comision"
                abierta={seccionAbierta === "datos"}
                onToggle={setSeccionAbierta}
              >
                <CampoTexto
                  label="Descripcion"
                  name="descripcion"
                  value={comision.descripcion}
                  onChange={cambiarComision}
                  maxLength={45}
                  placeholder="Ej: Comision A"
                  icono={<GraduationCap size={20} />}
                />
              </Seccion>

              <Seccion
                id="asignaturas"
                icono={<BookOpenCheck size={23} />}
                titulo="Asignaturas"
                abierta={seccionAbierta === "asignaturas"}
                onToggle={setSeccionAbierta}
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4">
                    Agregar asignatura
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CampoSelect
                      label="Plan asignatura"
                      name="plan_asignaturas_id"
                      value={nuevaComisionAsignatura.plan_asignaturas_id}
                      onChange={cambiarNuevaComisionAsignatura}
                      opciones={planesAsignaturas}
                      getValue={(item) => item.id}
                      getLabel={(item) =>
                        mapas.planesAsignaturas[item.id] ||
                        `Plan asignatura #${item.id}`
                      }
                    />
                    <CampoSelect
                      label="Aula"
                      name="aula_id"
                      value={nuevaComisionAsignatura.aula_id}
                      onChange={cambiarNuevaComisionAsignatura}
                      opciones={aulas}
                      getValue={(item) => item.id_aula}
                      getLabel={(item) => item.aula}
                    />
                    <CampoSelect
                      label="Estado"
                      name="estado"
                      value={nuevaComisionAsignatura.estado}
                      onChange={cambiarNuevaComisionAsignatura}
                      opciones={[
                        { value: "1", label: "Activo" },
                        { value: "0", label: "Inactivo" },
                      ]}
                      getValue={(item) => item.value}
                      getLabel={(item) => item.label}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <CampoTexto
                      label="Nombre"
                      name="nombre"
                      value={nuevaComisionAsignatura.nombre}
                      onChange={cambiarNuevaComisionAsignatura}
                      placeholder="Ej: Comision A - Incendios"
                      maxLength={45}
                      icono={<Tag size={20} />}
                    />
                    <CampoSelect
                      label="Modalidad"
                      name="modalidadesid"
                      value={nuevaComisionAsignatura.modalidadesid}
                      onChange={cambiarNuevaComisionAsignatura}
                      opciones={modalidades}
                      getValue={(item) => item.modalidadesid}
                      getLabel={(item) => item.descripcion}
                    />
                    <CampoTexto
                      label="Horario"
                      name="modalidad"
                      value={nuevaComisionAsignatura.modalidad}
                      onChange={cambiarNuevaComisionAsignatura}
                      placeholder="Ej: 18:00 a 20:00"
                      maxLength={45}
                    />
                    <CampoTexto
                      label="Cupo maximo"
                      name="cupo_maximo"
                      type="number"
                      min="1"
                      max="500"
                      value={nuevaComisionAsignatura.cupo_maximo}
                      onChange={cambiarNuevaComisionAsignatura}
                      placeholder="Ej: 30"
                      icono={<Hash size={20} />}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={agregarComisionAsignatura}
                      disabled={guardando}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition cursor-pointer"
                    >
                      <PlusCircle size={22} />
                      Agregar asignatura
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Asignaturas asociadas
                  </h3>

                  {comisionesAsignaturas.length > 0 ? (
                    comisionesAsignaturas.map((item) => (
                      <article
                        key={item.id_comision_asignatura}
                        className="border border-slate-200 rounded-xl bg-slate-50 p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">
                              Comision asignatura
                            </p>
                            <h3 className="text-lg font-extrabold text-slate-800 mt-1">
                              {item.nombre}
                            </h3>
                            <p className="text-slate-600 font-semibold mt-1">
                              {mapas.planesAsignaturas[
                                item.plan_asignaturas_id
                              ] || "-"}
                            </p>
                            <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1">
                              <DoorOpen size={18} />
                              {mapas.aulas[item.aula_id] || "-"}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-5 gap-y-2 text-sm">
                            <Dato
                              label="Modalidad"
                              value={mapas.modalidades[item.modalidadesid]}
                            />

                            <Dato label="Horario" value={item.modalidad} />
                            <Dato label="Cupo" value={item.cupo_maximo} />
                            <Dato label="Estado" value={item.estado} />
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() =>
                              eliminarComisionAsignatura(
                                item.id_comision_asignatura,
                              )
                            }
                            disabled={guardando}
                            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60 transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <EstadoVacio texto="Esta comision todavia no tiene asignaturas asociadas." />
                  )}
                </div>
              </Seccion>

              <Seccion
                id="autoridades"
                icono={<ShieldUser size={23} />}
                titulo="Autoridades"
                abierta={seccionAbierta === "autoridades"}
                onToggle={setSeccionAbierta}
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4">
                    Agregar autoridad
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CampoSelect
                      label="Tipo autoridad"
                      name="tipo_autoridad_id"
                      value={nuevaAutoridad.tipo_autoridad_id}
                      onChange={cambiarNuevaAutoridad}
                      opciones={tiposAutoridad}
                      getValue={(item) => item.id}
                      getLabel={(item) => item.descripcion}
                    />
                    <CampoSelect
                      label="Legajo"
                      name="legajo_id"
                      value={nuevaAutoridad.legajo_id}
                      onChange={cambiarNuevaAutoridad}
                      opciones={legajos}
                      getValue={(item) => item.id}
                      getLabel={obtenerEtiquetaLegajo}
                    />
                    <CampoSelect
                      label="Asignatura de la comisión"
                      name="comision_id"
                      value={nuevaAutoridad.comision_id}
                      onChange={cambiarNuevaAutoridad}
                      opciones={comisionesAsignaturas}
                      getValue={(item) => item.id_comision_asignatura}
                      getLabel={(item) =>
                        mapas.planesAsignaturas[item.plan_asignaturas_id] ||
                        `Comisión #${item.id_comision_asignatura}`
                      }
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={agregarAutoridad}
                      disabled={guardando}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition cursor-pointer"
                    >
                      <PlusCircle size={22} />
                      Agregar autoridad
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Autoridades asociadas
                  </h3>

                  {autoridades.length > 0 ? (
                    autoridades.map((item) => (
                      <article
                        key={item.id}
                        className="border border-slate-200 rounded-xl bg-slate-50 p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="flex items-center gap-2 text-lg font-extrabold text-slate-800">
                              <ShieldUser size={22} />
                              {mapas.tiposAutoridad[item.tipo_autoridad_id] ||
                                "-"}
                            </p>
                            <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1">
                              <UserRound size={18} />
                              {mapas.legajos[item.legajo_id] || "-"}
                            </p>
                            <p className="text-slate-600 font-semibold mt-1">
                              {obtenerNombreComisionAsignatura(
                                item.comision_id,
                                comisionesAsignaturas,
                                mapas.planesAsignaturas,
                              )}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => eliminarAutoridad(item.id)}
                            disabled={guardando}
                            className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60 transition cursor-pointer"
                          >
                            <Trash2 size={18} />
                            Eliminar
                          </button>
                        </div>
                      </article>
                    ))
                  ) : (
                    <EstadoVacio texto="Esta comision todavia no tiene autoridades asociadas." />
                  )}
                </div>
              </Seccion>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/comisiones/${id}`)}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition cursor-pointer"
                >
                  <Save size={22} />
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

function Seccion({ id, icono, titulo, abierta, onToggle, children }) {
  return (
    <section className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(abierta ? "" : id)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50 transition cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
            {icono}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">{titulo}</h2>
        </div>
        <ChevronDown
          size={22}
          className={`text-slate-500 transition ${abierta ? "rotate-180" : ""}`}
        />
      </button>

      {abierta && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 p-5">
          {children}
        </div>
      )}
    </section>
  );
}

function CampoTexto({
  label,
  name,
  value,
  onChange,
  placeholder,
  icono,
  type = "text",
  maxLength,
  min,
  max,
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icono && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          min={min}
          max={max}
          className={`w-full h-14 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            icono ? "pl-12" : "pl-4"
          }`}
        />
      </div>
    </div>
  );
}

function CampoSelect({
  label,
  name,
  value,
  onChange,
  opciones,
  getValue,
  getLabel,
}) {
  const opcionesSeguras = Array.isArray(opciones) ? opciones : [];

  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <option value="">Seleccione una opcion</option>
        {opcionesSeguras.map((opcion) => (
          <option key={getValue(opcion)} value={getValue(opcion)}>
            {getLabel(opcion)}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoSelectSimple({ label, name, value, onChange, opciones }) {
  return (
    <CampoSelect
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      opciones={opciones.map((item) => ({ id: item, label: item }))}
      getValue={(item) => item.id}
      getLabel={(item) => item.label}
    />
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
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">
      {texto}
    </div>
  );
}

function crearMapa(items, idKey, valueKey) {
  const lista = Array.isArray(items) ? items : [];

  return lista.reduce((acc, item) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

function obtenerLista(respuesta) {
  return Array.isArray(respuesta?.data) ? respuesta.data : [];
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

  return partes.length
    ? partes.join(" - ")
    : `Plan asignatura #${planAsignatura.id}`;
}

function obtenerEtiquetaLegajo(legajo) {
  return legajo?.numero ? `Nro. ${legajo.numero}` : `Legajo #${legajo?.id}`;
}

function obtenerNombreComisionAsignatura(id, items, mapaPlanes) {
  const item = items.find(
    (registro) => Number(registro.id_comision_asignatura) === Number(id),
  );

  if (!item) return `Comision asignatura #${id}`;

  return mapaPlanes[item.plan_asignaturas_id] || item.nombre;
}

function validarComisionAsignatura(payload) {
  if (!payload.plan_asignaturas_id) {
    return "Debe seleccionar un plan asignatura";
  }

  if (!payload.aula_id) {
    return "Debe seleccionar un aula";
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

  if (!payload.cupo_maximo || payload.cupo_maximo <= 0) {
    return "El cupo maximo debe ser mayor a cero";
  }
  if (payload.cupo_maximo > 500) {
    return "El cupo maximo no puede ser mayor a 500";
  }
  if (!payload.estado) {
    return "El estado es obligatorio";
  }

  return "";
}

function validarAutoridad(payload) {
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

export default EditarComision;
