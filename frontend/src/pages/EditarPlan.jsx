import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CalendarDays,
  ChevronDown,
  FileText,
  GitBranch,
  Hash,
  Pencil,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { modalidadService } from "../services/modalidadService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { tipoPlanesService } from "../services/tipoPlanesService";

const planInicial = {
  tipo_planes_id_tipo_planes: "",
  resolucion_ministerial: "",
  nombre: "",
  descrip: "",
  vigencia_dde: "",
  vigencia_hta: "",
};

const nuevaAsignaturaInicial = {
  asignatura_id: "",
  rango_minimo_id: "",
  sedes_id: "",
  presentismo_porc: "",
  regularizacion_prom: "",
  final_aprobacion: "",
  duracion: "",
  regimen: "",
  modalidad: "",
};

const nuevaCorrelativaInicial = {
  pa_id: "",
  asignatura_id: "",
};

function EditarPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(planInicial);
  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [planAsignaturas, setPlanAsignaturas] = useState([]);
  const [nuevaAsignatura, setNuevaAsignatura] = useState(nuevaAsignaturaInicial);
  const [correlativas, setCorrelativas] = useState([]);
  const [nuevaCorrelativa, setNuevaCorrelativa] = useState(nuevaCorrelativaInicial);
  const [correlativaEditandoId, setCorrelativaEditandoId] = useState(null);
  const [asignaturas, setAsignaturas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState("plan");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaPlan,
        respuestaTiposPlanes,
        respuestaPlanAsignaturas,
        respuestaCorrelativas,
        respuestaAsignaturas,
        respuestaRangos,
        respuestaSedes,
        respuestaModalidades,
      ] = await Promise.all([
        planService.obtenerPorId(id),
        tipoPlanesService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        paCorrelativaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
        modalidadService.obtenerTodas(),
      ]);

      const planData = respuestaPlan.data || {};

      setPlan({
        tipo_planes_id_tipo_planes: String(
          planData.tipo_planes_id_tipo_planes || "",
        ),
        resolucion_ministerial: String(planData.resolucion_ministerial || ""),
        nombre: planData.nombre || "",
        descrip: planData.descrip || "",
        vigencia_dde: formatearFechaInput(planData.vigencia_dde),
        vigencia_hta: formatearFechaInput(planData.vigencia_hta),
      });
      setTiposPlanes(respuestaTiposPlanes.data || []);
      const planAsignaturasDelPlan = (respuestaPlanAsignaturas.data || []).filter(
          (item) => Number(item.plan_id) === Number(id),
        );
      const idsPlanAsignaturas = planAsignaturasDelPlan.map((item) => Number(item.id));

      setPlanAsignaturas(
        planAsignaturasDelPlan,
      );
      setCorrelativas(
        (respuestaCorrelativas.data || []).filter((item) =>
          idsPlanAsignaturas.includes(Number(item.pa_id)),
        ),
      );
      setAsignaturas(respuestaAsignaturas.data || []);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
      setModalidades(respuestaModalidades.data || []);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      asignaturas: crearMapa(asignaturas, "id", "nombre"),
      rangos: crearMapa(rangos, "id", "descripcion"),
      sedes: crearMapa(sedes, "id", "nombre"),
    };
  }, [asignaturas, rangos, sedes]);

  function cambiarPlan(e) {
    let { name, value } = e.target;

    if (name === "resolucion_ministerial") {
      value = value.replace(/[^0-9/-]/g, "").slice(0, 14);
    }

    setPlan({ ...plan, [name]: value });
  }

  function cambiarNuevaAsignatura(e) {
    let { name, value } = e.target;

    if (["presentismo_porc", "regularizacion_prom", "final_aprobacion"].includes(name)) {
      value = value.replace(/[^0-9]/g, "");
      if (value !== "" && parseInt(value, 10) > 100) {
        value = "100";
      }
    } else if (name === "duracion") {
      value = value.replace(/[^0-9]/g, "").slice(0, 4);
    } else if (name === "regimen") {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 20);
    }

    setNuevaAsignatura({ ...nuevaAsignatura, [name]: value });
  }

  function cambiarNuevaCorrelativa(e) {
    const { name, value } = e.target;
    setNuevaCorrelativa({ ...nuevaCorrelativa, [name]: value });
  }

  async function agregarAsignatura() {
    const payload = {
      asignatura_id: Number(nuevaAsignatura.asignatura_id),
      plan_id: Number(id),
      rango_minimo_id: Number(nuevaAsignatura.rango_minimo_id),
      sedes_id: Number(nuevaAsignatura.sedes_id),
      presentismo_porc: nuevaAsignatura.presentismo_porc !== "" ? Number(nuevaAsignatura.presentismo_porc) : null,
      regularizacion_prom: nuevaAsignatura.regularizacion_prom !== "" ? Number(nuevaAsignatura.regularizacion_prom) : null,
      final_aprobacion: nuevaAsignatura.final_aprobacion !== "" ? Number(nuevaAsignatura.final_aprobacion) : null,
      duracion: nuevaAsignatura.duracion !== "" ? Number(nuevaAsignatura.duracion) : null,
      regimen: nuevaAsignatura.regimen.trim(),
      modalidad: nuevaAsignatura.modalidad.trim(),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarAsignatura(payload);

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await planAsignaturaService.crear(payload);
      setNuevaAsignatura(nuevaAsignaturaInicial);
      setMensaje("Asignatura agregada correctamente");
      await cargarDatos();
      setSeccionAbierta("asignaturas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAsignatura(planAsignaturaId) {
    const confirmar = confirm("Seguro que queres eliminar esta asignatura del plan?");

    if (!confirmar) {
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await planAsignaturaService.eliminar(planAsignaturaId);
      setMensaje("Asignatura eliminada correctamente");
      await cargarDatos();
      setSeccionAbierta("asignaturas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarCorrelativa() {
    const payload = {
      pa_id: Number(nuevaCorrelativa.pa_id),
      asignatura_id: Number(nuevaCorrelativa.asignatura_id),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarCorrelativa(
      payload,
      planAsignaturas,
      correlativas,
      correlativaEditandoId,
    );

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      if (correlativaEditandoId) {
        await paCorrelativaService.actualizar(correlativaEditandoId, payload);
      } else {
        await paCorrelativaService.crear(payload);
      }

      setNuevaCorrelativa(nuevaCorrelativaInicial);
      setCorrelativaEditandoId(null);
      setMensaje(
        correlativaEditandoId
          ? "Correlativa actualizada correctamente"
          : "Correlativa agregada correctamente",
      );
      await cargarDatos();
      setSeccionAbierta("correlativas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  function editarCorrelativa(correlativa) {
    setNuevaCorrelativa({
      pa_id: String(correlativa.pa_id || ""),
      asignatura_id: String(correlativa.asignatura_id || ""),
    });
    setCorrelativaEditandoId(correlativa.id);
    setError("");
    setMensaje("");
    setSeccionAbierta("correlativas");
  }

  function cancelarEdicionCorrelativa() {
    setNuevaCorrelativa(nuevaCorrelativaInicial);
    setCorrelativaEditandoId(null);
    setError("");
  }

  async function eliminarCorrelativa(correlativaId) {
    const confirmar = confirm("Seguro que queres eliminar esta correlativa?");

    if (!confirmar) {
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await paCorrelativaService.eliminar(correlativaId);
      setMensaje("Correlativa eliminada correctamente");
      await cargarDatos();
      setSeccionAbierta("correlativas");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarCambios(e) {
    e.preventDefault();

    const tipoPlanId = Number(plan.tipo_planes_id_tipo_planes);
    const resolucionMinisterial = plan.resolucion_ministerial.trim();
    const nombre = plan.nombre.trim();
    const descrip = plan.descrip.trim();

    if (!tipoPlanId) {
      setError("Debe seleccionar un tipo de plan");
      return;
    }

    if (!resolucionMinisterial) {
      setError("La resolucion ministerial no puede estar vacía");
      return;
    }

    if (!nombre) {
      setError("El nombre del plan es obligatorio");
      return;
    }

    if (!plan.vigencia_dde || !plan.vigencia_hta) {
      setError("Debe cargar las fechas de vigencia");
      return;
    }

    if (plan.vigencia_hta < plan.vigencia_dde) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      setMensaje("");

      await planService.actualizar(id, {
        tipo_planes_id_tipo_planes: tipoPlanId,
        resolucion_ministerial: resolucionMinisterial,
        nombre,
        descrip: descrip || null,
        vigencia_dde: `${plan.vigencia_dde}T00:00:00`,
        vigencia_hta: `${plan.vigencia_hta}T00:00:00`,
        usuario_accion: 1,
      });

      navigate("/planes");
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
                <BookOpen size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">
                  Edicion
                </p>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-1">
                  Editar plan
                </h1>
                <p className="text-slate-500 mt-2">
                  Modifica los datos generales y consulta sus asignaturas.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/planes")}
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
              Cargando plan...
            </div>
          ) : (
            <form onSubmit={guardarCambios} className="space-y-8">
              <Seccion
                id="plan"
                icono={<BookOpen size={23} />}
                titulo="Datos del plan"
                abierta={seccionAbierta === "plan"}
                onToggle={setSeccionAbierta}
              >
                <CampoSelect
                  label="Tipo de plan"
                  name="tipo_planes_id_tipo_planes"
                  value={plan.tipo_planes_id_tipo_planes}
                  onChange={cambiarPlan}
                  opciones={tiposPlanes}
                  getValue={(tipo) => tipo.id_tipo_planes}
                  getLabel={(tipo) => tipo.descripcion}
                />
                <CampoTexto
                  label="Resolucion ministerial"
                  name="resolucion_ministerial"
                  value={plan.resolucion_ministerial}
                  onChange={cambiarPlan}
                  placeholder="Ej: 12314/-2022"
                  icono={<Hash size={20} />}
                  maxLength={14}
                />
                <CampoTexto
                  label="Nombre"
                  name="nombre"
                  value={plan.nombre}
                  onChange={cambiarPlan}
                  placeholder="Ej: Plan de Formacion Inicial"
                  icono={<FileText size={20} />}
                />
                <CampoTexto
                  label="Descripcion"
                  name="descrip"
                  value={plan.descrip}
                  onChange={cambiarPlan}
                  placeholder="Breve descripcion"
                  icono={<FileText size={20} />}
                />
                <CampoTexto
                  label="Vigencia desde"
                  name="vigencia_dde"
                  type="date"
                  value={plan.vigencia_dde}
                  onChange={cambiarPlan}
                  icono={<CalendarDays size={20} />}
                />
                <CampoTexto
                  label="Vigencia hasta"
                  name="vigencia_hta"
                  type="date"
                  value={plan.vigencia_hta}
                  onChange={cambiarPlan}
                  icono={<CalendarDays size={20} />}
                />
              </Seccion>

              <Seccion
                id="asignaturas"
                icono={<BookMarked size={23} />}
                titulo="Asignaturas del plan"
                abierta={seccionAbierta === "asignaturas"}
                onToggle={setSeccionAbierta}
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4">
                    Agregar asignatura
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CampoSelect
                      label="Asignatura"
                      name="asignatura_id"
                      value={nuevaAsignatura.asignatura_id}
                      onChange={cambiarNuevaAsignatura}
                      opciones={asignaturas}
                      getValue={(asignatura) => asignatura.id}
                      getLabel={(asignatura) => asignatura.nombre}
                    />
                    <CampoSelect
                      label="Rango minimo"
                      name="rango_minimo_id"
                      value={nuevaAsignatura.rango_minimo_id}
                      onChange={cambiarNuevaAsignatura}
                      opciones={rangos}
                      getValue={(rango) => rango.id}
                      getLabel={(rango) => rango.descripcion}
                    />
                    <CampoSelect
                      label="Sede"
                      name="sedes_id"
                      value={nuevaAsignatura.sedes_id}
                      onChange={cambiarNuevaAsignatura}
                      opciones={sedes}
                      getValue={(sede) => sede.id}
                      getLabel={(sede) => sede.nombre}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <CampoTexto
                      label="Presentismo requerido"
                      name="presentismo_porc"
                      value={nuevaAsignatura.presentismo_porc}
                      onChange={cambiarNuevaAsignatura}
                      placeholder="Ej: 75"
                      icono={<Hash size={20} />}
                      inputMode="numeric"
                    />
                    <CampoTexto
                      label="Promedio para regularizar"
                      name="regularizacion_prom"
                      value={nuevaAsignatura.regularizacion_prom}
                      onChange={cambiarNuevaAsignatura}
                      placeholder="Ej: 6"
                      icono={<Hash size={20} />}
                      inputMode="numeric"
                    />
                    <CampoTexto
                      label="Nota mínima de aprobación de final"
                      name="final_aprobacion"
                      value={nuevaAsignatura.final_aprobacion}
                      onChange={cambiarNuevaAsignatura}
                      placeholder="Ej: 7"
                      icono={<Hash size={20} />}
                      inputMode="numeric"
                    />
                    <CampoTexto
                      label="Horas cátedra"
                      name="duracion"
                      value={nuevaAsignatura.duracion}
                      onChange={cambiarNuevaAsignatura}
                      placeholder="Ej: 120"
                      icono={<Hash size={20} />}
                      maxLength={4}
                      inputMode="numeric"
                    />
                    <CampoTexto
                      label="Regimen"
                      name="regimen"
                      value={nuevaAsignatura.regimen}
                      onChange={cambiarNuevaAsignatura}
                      placeholder="Ej: Anual"
                      icono={<BookMarked size={20} />}
                      maxLength={20}
                    />
                    <CampoSelect
                      label="Modalidad"
                      name="modalidad"
                      value={nuevaAsignatura.modalidad}
                      onChange={cambiarNuevaAsignatura}
                      opciones={modalidades}
                      getValue={(modalidad) => modalidad.descripcion}
                      getLabel={(modalidad) => modalidad.descripcion}
                    />
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={agregarAsignatura}
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

                  {planAsignaturas.length > 0 ? (
                    planAsignaturas.map((item) => (
                      <article
                        key={item.id}
                        className="border border-slate-200 rounded-xl bg-slate-50 p-4"
                      >
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">
                              Asignatura
                            </p>
                            <h3 className="text-lg font-extrabold text-slate-800 mt-1">
                              {mapas.asignaturas[item.asignatura_id] || "-"}
                            </h3>
                            <p className="text-slate-600 font-semibold mt-1">
                              Sede: {mapas.sedes[item.sedes_id] || "-"}
                            </p>
                            <p className="text-slate-600 font-semibold mt-1">
                              Rango minimo: {mapas.rangos[item.rango_minimo_id] || "-"}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-2 text-sm">
                            <Dato label="Regimen" value={item.regimen} />
                            <Dato label="Modalidad" value={item.modalidad} />
                            <Dato
                              label="Presentismo"
                              value={`${item.presentismo_porc}%`}
                            />
                            <Dato label="Final" value={item.final_aprobacion} />
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={() => eliminarAsignatura(item.id)}
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
                    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">
                      Este plan todavia no tiene asignaturas asociadas.
                    </div>
                  )}
                </div>
              </Seccion>

              <Seccion
                id="correlativas"
                icono={<GitBranch size={23} />}
                titulo="Correlativas"
                abierta={seccionAbierta === "correlativas"}
                onToggle={setSeccionAbierta}
              >
                <div className="md:col-span-2">
                  <h3 className="text-lg font-extrabold text-slate-800 mb-4">
                    {correlativaEditandoId ? "Editar correlativa" : "Agregar correlativa"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CampoSelect
                      label="Asignatura que requiere"
                      name="pa_id"
                      value={nuevaCorrelativa.pa_id}
                      onChange={cambiarNuevaCorrelativa}
                      opciones={planAsignaturas}
                      getValue={(item) => item.id}
                      getLabel={(item) => mapas.asignaturas[item.asignatura_id] || `Plan asignatura #${item.id}`}
                    />
                    <CampoSelect
                      label="Asignatura requerida"
                      name="asignatura_id"
                      value={nuevaCorrelativa.asignatura_id}
                      onChange={cambiarNuevaCorrelativa}
                      opciones={planAsignaturas}
                      getValue={(item) => item.asignatura_id}
                      getLabel={(item) => mapas.asignaturas[item.asignatura_id] || `Asignatura #${item.asignatura_id}`}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    {correlativaEditandoId && (
                      <button
                        type="button"
                        onClick={cancelarEdicionCorrelativa}
                        disabled={guardando}
                        className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-60 transition cursor-pointer"
                      >
                        Cancelar edicion
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={guardarCorrelativa}
                      disabled={guardando}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition cursor-pointer"
                    >
                      {correlativaEditandoId ? <Save size={22} /> : <PlusCircle size={22} />}
                      {correlativaEditandoId ? "Guardar correlativa" : "Agregar correlativa"}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3 border-t border-slate-200 pt-5">
                  <h3 className="text-lg font-extrabold text-slate-800">
                    Correlativas cargadas
                  </h3>

                  {correlativas.length > 0 ? (
                    correlativas.map((item) => {
                      const planAsignatura = planAsignaturas.find(
                        (pa) => Number(pa.id) === Number(item.pa_id),
                      );

                      return (
                        <article
                          key={item.id}
                          className="border border-slate-200 rounded-xl bg-slate-50 p-4"
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">
                                Para cursar
                              </p>
                              <h3 className="text-lg font-extrabold text-slate-800 mt-1">
                                {mapas.asignaturas[planAsignatura?.asignatura_id] || "-"}
                              </h3>
                              <p className="text-slate-600 font-semibold mt-1">
                                Requiere: {mapas.asignaturas[item.asignatura_id] || "-"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <button
                                type="button"
                                onClick={() => editarCorrelativa(item)}
                                disabled={guardando}
                                className="flex items-center gap-2 text-slate-700 font-semibold hover:text-slate-900 disabled:opacity-60 transition cursor-pointer"
                              >
                                <Pencil size={18} />
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => eliminarCorrelativa(item.id)}
                                disabled={guardando}
                                className="flex items-center gap-2 text-red-600 font-semibold hover:text-red-800 disabled:opacity-60 transition cursor-pointer"
                              >
                                <Trash2 size={18} />
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })
                  ) : (
                    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">
                      Este plan todavia no tiene correlativas cargadas.
                    </div>
                  )}
                </div>
              </Seccion>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/planes")}
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
  inputMode,
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
          inputMode={inputMode}
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
        {opciones.map((opcion) => (
          <option key={getValue(opcion)} value={getValue(opcion)}>
            {getLabel(opcion)}
          </option>
        ))}
      </select>
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

function crearMapa(items, idKey, valueKey) {
  return items.reduce((acc, item) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

function formatearFechaInput(fecha) {
  if (!fecha) {
    return "";
  }

  return String(fecha).slice(0, 10);
}

function validarAsignatura(payload) {
  const camposSelect = [
    ["asignatura_id", "Debe seleccionar una asignatura"],
    ["rango_minimo_id", "Debe seleccionar un rango minimo"],
    ["sedes_id", "Debe seleccionar una sede"],
  ];

  for (const [campo, mensaje] of camposSelect) {
    if (!payload[campo]) {
      return mensaje;
    }
  }

  if (payload.presentismo_porc === null || payload.presentismo_porc < 1 || payload.presentismo_porc > 100) {
    return "El presentismo debe ser un número entre 1 y 100";
  }

  if (payload.regularizacion_prom !== null && (payload.regularizacion_prom < 1 || payload.regularizacion_prom > 100)) {
    return "La regularización debe ser un número entre 1 y 100, o estar vacía";
  }

  if (payload.final_aprobacion !== null && (payload.final_aprobacion < 1 || payload.final_aprobacion > 100)) {
    return "La nota final debe ser un número entre 1 y 100, o estar vacía";
  }

  if (payload.duracion === null || payload.duracion < 1) {
    return "La duración debe ser de al menos 1 y no puede estar vacía";
  }

  if (!payload.regimen) {
    return "El regimen es obligatorio y sólo debe contener letras";
  }

  if (!payload.modalidad) {
    return "La modalidad es obligatoria";
  }

  return "";
}

function validarCorrelativa(payload, planAsignaturas, correlativas, correlativaEditandoId) {
  if (!payload.pa_id) {
    return "Debe seleccionar la asignatura que requiere correlativa";
  }

  if (!payload.asignatura_id) {
    return "Debe seleccionar la asignatura requerida";
  }

  const planAsignatura = planAsignaturas.find(
    (item) => Number(item.id) === Number(payload.pa_id),
  );

  if (Number(planAsignatura?.asignatura_id) === Number(payload.asignatura_id)) {
    return "Una asignatura no puede ser correlativa de si misma";
  }

  const yaExiste = correlativas.some(
    (item) =>
      Number(item.id) !== Number(correlativaEditandoId) &&
      Number(item.pa_id) === Number(payload.pa_id) &&
      Number(item.asignatura_id) === Number(payload.asignatura_id),
  );

  if (yaExiste) {
    return "Esa correlativa ya esta cargada";
  }

  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo completar la operacion";
}

export default EditarPlan;