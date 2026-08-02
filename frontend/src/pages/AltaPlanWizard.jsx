import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  GitBranch,
  Hash,
  MapPinned,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import BotonVolver from "../components/BotonVolver";
import { asignaturaService } from "../services/asignaturaService";
import { modalidadService } from "../services/modalidadService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { tipoPlanesService } from "../services/tipoPlanesService";

const pasos = [
  { id: 1, titulo: "Plan", icono: BookOpen },
  { id: 2, titulo: "Asignatura", icono: BookMarked },
  { id: 3, titulo: "Condiciones", icono: ClipboardList },
  { id: 4, titulo: "Correlativas", icono: GitBranch },
  { id: 5, titulo: "Resumen", icono: CheckCircle2 },
];

const planInicial = {
  tipo_planes_id_tipo_planes: "",
  resolucion_ministerial: "",
  nombre: "",
  descrip: "",
  vigencia_dde: "",
  vigencia_hta: "",
};

const asignaturaPlanInicial = {
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

const correlativaInicial = {
  pa_id: "",
  asignatura_id: "",
};

function AltaPlanWizard() {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);
  const [planId, setPlanId] = useState(null);
  const [planAsignaturaId, setPlanAsignaturaId] = useState(null);
  const [plan, setPlan] = useState(planInicial);
  const [asignaturaPlan, setAsignaturaPlan] = useState(asignaturaPlanInicial);
  const [asignaturasCargadas, setAsignaturasCargadas] = useState([]);
  const [nuevaCorrelativa, setNuevaCorrelativa] = useState(correlativaInicial);
  const [correlativasCargadas, setCorrelativasCargadas] = useState([]);
  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaTiposPlanes,
        respuestaAsignaturas,
        respuestaRangos,
        respuestaSedes,
        respuestaModalidades,
      ] = await Promise.all([
        tipoPlanesService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
        modalidadService.obtenerTodas(),
      ]);

      setTiposPlanes(obtenerLista(respuestaTiposPlanes));
      setAsignaturas(obtenerLista(respuestaAsignaturas));
      setRangos(obtenerLista(respuestaRangos));
      setSedes(obtenerLista(respuestaSedes));
      setModalidades(obtenerLista(respuestaModalidades));
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos iniciales");
    } finally {
      setCargando(false);
    }
  }

  const resumen = useMemo(() => {
    return {
      tipoPlan:
        tiposPlanes.find(
          (tipo) =>
            Number(tipo.id_tipo_planes) ===
            Number(plan.tipo_planes_id_tipo_planes),
        )?.descripcion || "-",
      asignatura:
        asignaturas.find(
          (asignatura) =>
            Number(asignatura.id) === Number(asignaturaPlan.asignatura_id),
        )?.nombre || "-",
      rango:
        rangos.find(
          (rango) => Number(rango.id) === Number(asignaturaPlan.rango_minimo_id),
        )?.descripcion || "-",
      sede:
        sedes.find((sede) => Number(sede.id) === Number(asignaturaPlan.sedes_id))
          ?.nombre || "-",
    };
  }, [asignaturaPlan, asignaturas, plan, rangos, sedes, tiposPlanes]);

  function cambiarPlan(e) {
    let { name, value } = e.target;

    // Validación en tiempo real para Resolución Ministerial
    if (name === "resolucion_ministerial") {
      value = value.replace(/[^0-9/-]/g, "").slice(0, 14);
    }

    setPlan({ ...plan, [name]: value });
  }

  function cambiarAsignaturaPlan(e) {
    let { name, value } = e.target;

    // Validación en tiempo real para campos numéricos
    if (["presentismo_porc", "regularizacion_prom", "final_aprobacion"].includes(name)) {
      value = value.replace(/[^0-9]/g, ""); // Sólo enteros
      if (value !== "" && parseInt(value, 10) > 100) {
        value = "100"; // Máximo 100
      }
    } else if (name === "duracion") {
      value = value.replace(/[^0-9]/g, "").slice(0, 4); // Sólo enteros, máx 4 dígitos
    } else if (name === "regimen") {
      value = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 20); // Sólo letras y espacios, máx 20 chars
    }

    setAsignaturaPlan({ ...asignaturaPlan, [name]: value });
  }

  function cambiarCorrelativa(e) {
    const { name, value } = e.target;
    setNuevaCorrelativa({ ...nuevaCorrelativa, [name]: value });
  }

  function guardarPlan(e) {
    e.preventDefault();

    const tipoPlanId = Number(plan.tipo_planes_id_tipo_planes);
    const resolucionMinisterial = plan.resolucion_ministerial.trim();
    const nombre = plan.nombre.trim();

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

    setError("");
    setPasoActual(2);
  }

  function guardarDatosAsignatura(e) {
    e.preventDefault();

    if (!asignaturaPlan.asignatura_id) {
      setError("Debe seleccionar una asignatura");
      return;
    }

    if (!asignaturaPlan.rango_minimo_id) {
      setError("Debe seleccionar un rango minimo");
      return;
    }

    if (!asignaturaPlan.sedes_id) {
      setError("Debe seleccionar una sede");
      return;
    }

    setError("");
    setPasoActual(3);
  }

  function guardarCondiciones(e) {
    e.preventDefault();

    const payload = {
      asignatura_id: Number(asignaturaPlan.asignatura_id),
      rango_minimo_id: Number(asignaturaPlan.rango_minimo_id),
      sedes_id: Number(asignaturaPlan.sedes_id),
      presentismo_porc: asignaturaPlan.presentismo_porc !== "" ? Number(asignaturaPlan.presentismo_porc) : null,
      regularizacion_prom: asignaturaPlan.regularizacion_prom !== "" ? Number(asignaturaPlan.regularizacion_prom) : null,
      final_aprobacion: asignaturaPlan.final_aprobacion !== "" ? Number(asignaturaPlan.final_aprobacion) : null,
      duracion: asignaturaPlan.duracion !== "" ? Number(asignaturaPlan.duracion) : null,
      regimen: asignaturaPlan.regimen.trim(),
      modalidad: asignaturaPlan.modalidad.trim(),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarCondiciones(payload);

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    const idTemporal = Date.now();

    setAsignaturasCargadas([
      ...asignaturasCargadas,
      {
        id: idTemporal,
        ...payload,
        asignatura: resumen.asignatura,
        rango: resumen.rango,
        sede: resumen.sede,
      },
    ]);
    setError("");
    setPasoActual(4);
  }

  function guardarCorrelativa(e) {
    e.preventDefault();

    const payload = {
      pa_id: Number(nuevaCorrelativa.pa_id),
      asignatura_id: Number(nuevaCorrelativa.asignatura_id),
    };

    const mensajeValidacion = validarCorrelativa(
      payload,
      asignaturasCargadas,
      correlativasCargadas,
    );

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    const asignaturaQueRequiere = asignaturasCargadas.find(
      (item) => Number(item.id) === Number(payload.pa_id),
    );
    const asignaturaRequerida = asignaturasCargadas.find(
      (item) => Number(item.asignatura_id) === Number(payload.asignatura_id),
    );

    setCorrelativasCargadas([
      ...correlativasCargadas,
      {
        id: Date.now(),
        ...payload,
        asignaturaQueRequiere: asignaturaQueRequiere?.asignatura || "-",
        asignaturaRequerida: asignaturaRequerida?.asignatura || "-",
      },
    ]);
    setNuevaCorrelativa(correlativaInicial);
    setError("");
  }

  function eliminarCorrelativa(correlativaId) {
    const confirmar = confirm("Seguro que queres eliminar esta correlativa?");

    if (!confirmar) {
      return;
    }

    setCorrelativasCargadas(
      correlativasCargadas.filter(
        (item) => Number(item.id) !== Number(correlativaId),
      ),
    );
  }

  function agregarOtraAsignatura() {
    setAsignaturaPlan(asignaturaPlanInicial);
    setPlanAsignaturaId(null);
    setError("");
    setPasoActual(2);
  }

  async function confirmarPlan() {
    if (guardando || planId) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const respuestaPlan = await planService.crear({
        tipo_planes_id_tipo_planes: Number(
          plan.tipo_planes_id_tipo_planes,
        ),
        resolucion_ministerial: plan.resolucion_ministerial.trim(),
        nombre: plan.nombre.trim(),
        descrip: plan.descrip.trim() || null,
        vigencia_dde: `${plan.vigencia_dde}T00:00:00`,
        vigencia_hta: `${plan.vigencia_hta}T00:00:00`,
        usuario_accion: 1,
      });

      const nuevoPlanId = obtenerIdRespuesta(respuestaPlan);

      if (!nuevoPlanId) {
        throw new Error("No se recibio el ID del plan creado.");
      }

      const idsReales = {};

      for (const item of asignaturasCargadas) {
        const respuesta = await planAsignaturaService.crear({
          asignatura_id: item.asignatura_id,
          plan_id: nuevoPlanId,
          rango_minimo_id: item.rango_minimo_id,
          sedes_id: item.sedes_id,
          presentismo_porc: item.presentismo_porc,
          regularizacion_prom: item.regularizacion_prom,
          final_aprobacion: item.final_aprobacion,
          duracion: item.duracion,
          regimen: item.regimen,
          modalidad: item.modalidad,
          usuario_accion: 1,
        });

        const idReal = obtenerIdRespuesta(respuesta);

        if (!idReal) {
          throw new Error("No se recibio el ID de una asignatura del plan.");
        }

        idsReales[item.id] = idReal;
      }

      for (const item of correlativasCargadas) {
        await paCorrelativaService.crear({
          pa_id: idsReales[item.pa_id],
          asignatura_id: item.asignatura_id,
          usuario_accion: 1,
        });
      }

      setPlanId(nuevoPlanId);
      alert("Plan guardado correctamente.");
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
          <BotonVolver />
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <BookOpen size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">
                  Alta guiada
                </p>
                <h1 className="text-4xl font-extrabold text-slate-800 mt-1">
                  Plan y asignaturas
                </h1>
                <p className="text-slate-500 mt-2">
                  Completa todos los pasos. El plan se guarda al confirmar el
                  resumen.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate("/planes")}
                className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                <BookOpen size={20} />
                Planes
              </button>

              <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 min-w-64">
                <p className="text-xs font-bold text-slate-400 uppercase">
                  Progreso
                </p>
                <p className="text-slate-800 font-bold mt-1">
                  Plan ID: {planId || "pendiente"}
                </p>
                <p className="text-slate-800 font-bold mt-1">
                  Plan asignatura ID: {planAsignaturaId || "pendiente"}
                </p>
                <p className="text-slate-800 font-bold mt-1">
                  Asignaturas: {asignaturasCargadas.length}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start">
              {pasos.map((paso, index) => (
                <PasoIndicador
                  key={paso.id}
                  paso={paso}
                  activo={pasoActual === paso.id}
                  completo={pasoActual > paso.id}
                  ultimo={index === pasos.length - 1}
                />
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          {cargando ? (
            <EstadoVacio texto="Cargando datos..." />
          ) : (
            <>
              {pasoActual === 1 && (
                <form onSubmit={guardarPlan} className="space-y-6">
                  <TituloPaso
                    icono={<BookOpen size={26} />}
                    titulo="Datos del plan"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                    <CampoTexto label="Nombre" name="nombre" value={plan.nombre} onChange={cambiarPlan} placeholder="Ej: Plan de Formacion Inicial" icono={<FileText size={20} />} />
                    <CampoTexto label="Descripcion" name="descrip" value={plan.descrip} onChange={cambiarPlan} placeholder="Breve descripcion" icono={<FileText size={20} />} />
                    <CampoTexto label="Vigencia desde" name="vigencia_dde" type="date" value={plan.vigencia_dde} onChange={cambiarPlan} icono={<CalendarDays size={20} />} />
                    <CampoTexto label="Vigencia hasta" name="vigencia_hta" type="date" value={plan.vigencia_hta} onChange={cambiarPlan} icono={<CalendarDays size={20} />} />
                  </div>

                  <Acciones
                    guardando={guardando}
                    texto="Continuar"
                    onCancel={() => navigate("/planes")}
                  />
                </form>
              )}

              {pasoActual === 2 && (
                <form onSubmit={guardarDatosAsignatura} className="space-y-6">
                  <TituloPaso
                    icono={<BookMarked size={26} />}
                    titulo="Asignatura del plan"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CampoSoloLectura
                      label="Plan cargado"
                      value={plan.nombre || "-"}
                    />
                    <CampoSelect label="Asignatura" name="asignatura_id" value={asignaturaPlan.asignatura_id} onChange={cambiarAsignaturaPlan} opciones={asignaturas} getValue={(asignatura) => asignatura.id} getLabel={(asignatura) => asignatura.nombre} />
                    <CampoSelect label="Rango minimo" name="rango_minimo_id" value={asignaturaPlan.rango_minimo_id} onChange={cambiarAsignaturaPlan} opciones={rangos} getValue={(rango) => rango.id} getLabel={(rango) => rango.descripcion} />
                    <CampoSelect label="Sede" name="sedes_id" value={asignaturaPlan.sedes_id} onChange={cambiarAsignaturaPlan} opciones={sedes} getValue={(sede) => sede.id} getLabel={(sede) => sede.nombre} />
                  </div>

                  <Acciones
                    guardando={guardando}
                    texto="Continuar"
                    onBack={() => setPasoActual(1)}
                    onCancel={() => navigate("/planes")}
                  />
                </form>
              )}

              {pasoActual === 3 && (
                <form onSubmit={guardarCondiciones} className="space-y-6">
                  <TituloPaso
                    icono={<ClipboardList size={26} />}
                    titulo="Condiciones de cursado"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <CampoTexto 
                      label="Presentismo requerido" 
                      name="presentismo_porc" 
                      value={asignaturaPlan.presentismo_porc} 
                      onChange={cambiarAsignaturaPlan} 
                      placeholder="Ej: 75" 
                      icono={<Hash size={20} />} 
                      inputMode="numeric"
                    />
                    <CampoTexto 
                      label="Promedio requerido para regularizar" 
                      name="regularizacion_prom" 
                      value={asignaturaPlan.regularizacion_prom} 
                      onChange={cambiarAsignaturaPlan} 
                      placeholder="Ej: 6" 
                      icono={<Hash size={20} />} 
                      inputMode="numeric"
                    />
                    <CampoTexto 
                      label="Nota final requerida para aprobar" 
                      name="final_aprobacion" 
                      value={asignaturaPlan.final_aprobacion} 
                      onChange={cambiarAsignaturaPlan} 
                      placeholder="Ej: 7" 
                      icono={<Hash size={20} />} 
                      inputMode="numeric"
                    />
                    <CampoTexto 
                      label="Horas cátedra" 
                      name="duracion" 
                      value={asignaturaPlan.duracion} 
                      onChange={cambiarAsignaturaPlan} 
                      placeholder="Ej: 120" 
                      icono={<Hash size={20} />} 
                      maxLength={4}
                      inputMode="numeric"
                    />
                    <CampoTexto 
                      label="Régimen" 
                      name="regimen" 
                      value={asignaturaPlan.regimen} 
                      onChange={cambiarAsignaturaPlan} 
                      placeholder="Ej: Anual" 
                      icono={<BookMarked size={20} />} 
                      maxLength={20}
                    />
                    <CampoSelect
                      label="Modalidad"
                      name="modalidad"
                      value={asignaturaPlan.modalidad}
                      onChange={cambiarAsignaturaPlan}
                      opciones={modalidades}
                      getValue={(modalidad) => modalidad.descripcion}
                      getLabel={(modalidad) => modalidad.descripcion}
                    />
                  </div>

                  <Acciones
                    guardando={guardando}
                    texto="Guardar asignatura"
                    onBack={() => setPasoActual(2)}
                    onCancel={() => navigate("/planes")}
                  />
                </form>
              )}

              {pasoActual === 4 && (
                <section className="space-y-6">
                  <TituloPaso
                    icono={<GitBranch size={26} />}
                    titulo="Correlativas del plan"
                  />

                  {asignaturasCargadas.length < 2 ? (
                    <EstadoVacio texto="Necesitas al menos dos asignaturas cargadas para crear correlativas." />
                  ) : (
                    <form onSubmit={guardarCorrelativa} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <CampoSelect
                          label="Asignatura que requiere"
                          name="pa_id"
                          value={nuevaCorrelativa.pa_id}
                          onChange={cambiarCorrelativa}
                          opciones={asignaturasCargadas}
                          getValue={(item) => item.id}
                          getLabel={(item) => item.asignatura}
                        />
                        <CampoSelect
                          label="Asignatura requerida"
                          name="asignatura_id"
                          value={nuevaCorrelativa.asignatura_id}
                          onChange={cambiarCorrelativa}
                          opciones={asignaturasCargadas}
                          getValue={(item) => item.asignatura_id}
                          getLabel={(item) => item.asignatura}
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={guardando}
                          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition cursor-pointer"
                        >
                          <PlusCircle size={22} />
                          {guardando ? "Guardando..." : "Agregar correlativa"}
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    <h3 className="text-xl font-extrabold text-slate-800">
                      Correlativas cargadas
                    </h3>

                    {correlativasCargadas.length > 0 ? (
                      correlativasCargadas.map((item) => (
                        <article
                          key={item.id}
                          className="border border-slate-200 rounded-xl p-5 bg-slate-50"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">
                                Para cursar
                              </p>
                              <h4 className="text-lg font-extrabold text-slate-800 mt-1">
                                {item.asignaturaQueRequiere}
                              </h4>
                              <p className="text-slate-600 font-semibold mt-1">
                                Requiere: {item.asignaturaRequerida}
                              </p>
                            </div>

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
                        </article>
                      ))
                    ) : (
                      <EstadoVacio texto="Todavia no cargaste correlativas para este plan." />
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={agregarOtraAsignatura}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-red-200 rounded-lg font-bold text-red-700 hover:bg-red-50 transition cursor-pointer"
                    >
                      <PlusCircle size={22} />
                      Agregar otra asignatura
                    </button>

                    <button
                      type="button"
                      onClick={() => setPasoActual(5)}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition cursor-pointer"
                    >
                      <CheckCircle2 size={22} />
                      Ir al resumen
                    </button>
                  </div>
                </section>
              )}

              {pasoActual === 5 && (
                <section className="space-y-6">
                  <TituloPaso
                    icono={<CheckCircle2 size={26} />}
                    titulo="Resumen del alta"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <ResumenItem
                      icono={<BookOpen size={24} />}
                      titulo="Plan"
                      texto={`${plan.nombre || "-"} - ${planId || "pendiente de guardar"}`}
                    />
                    <ResumenItem
                      icono={<FileText size={24} />}
                      titulo="Tipo"
                      texto={resumen.tipoPlan}
                    />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-800 mb-4">
                      Asignaturas cargadas
                    </h3>

                    <div className="space-y-3">
                      {asignaturasCargadas.map((item, index) => (
                        <article
                          key={`${item.id || index}-${item.asignatura}`}
                          className="border border-slate-200 rounded-xl p-5 bg-slate-50"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div>
                              <p className="text-xs font-bold text-slate-400 uppercase">
                                Asignatura {index + 1}
                              </p>
                              <h4 className="text-lg font-extrabold text-slate-800 mt-1">
                                {item.asignatura}
                              </h4>
                              <p className="text-slate-600 font-semibold mt-1">
                                {item.rango} - {item.sede}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                              <DatoResumen label="Regimen" value={item.regimen} />
                              <DatoResumen label="Modalidad" value={item.modalidad} />
                              <DatoResumen label="Presentismo" value={`${item.presentismo_porc}%`} />
                              <DatoResumen label="Regularizacion" value={item.regularizacion_prom} />
                              <DatoResumen label="Final" value={item.final_aprobacion} />
                              <DatoResumen label="Horas cátedra" value={item.duracion} />
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={agregarOtraAsignatura}
                      className="flex items-center justify-center gap-2 px-6 py-3 border border-red-200 rounded-lg font-bold text-red-700 hover:bg-red-50 transition cursor-pointer"
                    >
                      <PlusCircle size={22} />
                      Agregar otra asignatura
                    </button>

                    <button
                      type="button"
                      onClick={confirmarPlan}
                      disabled={guardando || Boolean(planId)}
                      className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60 transition cursor-pointer"
                    >
                      <Save size={22} />
                      {guardando
                        ? "Guardando..."
                        : planId
                          ? "Plan guardado"
                          : "Confirmar y guardar"}
                    </button>
                  </div>
                </section>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function PasoIndicador({ paso, activo, completo, ultimo }) {
  const resaltado = activo || completo;
  const Icono = paso.icono;

  return (
    <div className="flex flex-1 items-start">
      <div className="flex flex-col items-center min-w-12">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition ${
            resaltado
              ? "bg-red-700 border-red-700 text-white shadow-sm"
              : "bg-slate-100 border-slate-300 text-slate-400"
          }`}
        >
          <Icono size={20} />
        </div>
        <p
          className={`hidden md:block mt-2 text-xs font-extrabold text-center ${
            resaltado ? "text-red-700" : "text-slate-400"
          }`}
        >
          {paso.titulo}
        </p>
      </div>

      {!ultimo && (
        <div
          className={`h-1 flex-1 rounded-full mt-5 transition ${
            completo ? "bg-red-700" : "bg-slate-200"
          }`}
        />
      )}
    </div>
  );
}

function TituloPaso({ icono, titulo }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
        {icono}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800">{titulo}</h2>
    </div>
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
  step,
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
          step={step}
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

function CampoSoloLectura({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="min-h-14 border border-slate-200 rounded-xl px-4 py-4 bg-slate-50 text-slate-700 font-bold">
        {value}
      </div>
    </div>
  );
}

function Acciones({ guardando, texto, onBack, onCancel }) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          Cancelar
        </button>
      )}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          Volver
        </button>
      )}

      <button
        type="submit"
        disabled={guardando}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition-colors duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Save size={22} />
        {guardando ? "Guardando..." : texto}
      </button>
    </div>
  );
}

function ResumenItem({ icono, titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <div className="text-red-700 mb-3">{icono}</div>
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

function DatoResumen({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

function EstadoVacio({ texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-slate-500 font-semibold">
      {texto}
    </div>
  );
}

function validarCondiciones(payload) {
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

function validarCorrelativa(payload, asignaturasCargadas, correlativasCargadas) {
  if (!payload.pa_id) {
    return "Debe seleccionar la asignatura que requiere correlativa";
  }

  if (!payload.asignatura_id) {
    return "Debe seleccionar la asignatura requerida";
  }

  const asignaturaQueRequiere = asignaturasCargadas.find(
    (item) => Number(item.id) === Number(payload.pa_id),
  );

  if (
    Number(asignaturaQueRequiere?.asignatura_id) ===
    Number(payload.asignatura_id)
  ) {
    return "Una asignatura no puede ser correlativa de si misma";
  }

  const yaExiste = correlativasCargadas.some(
    (item) =>
      Number(item.pa_id) === Number(payload.pa_id) &&
      Number(item.asignatura_id) === Number(payload.asignatura_id),
  );

  if (yaExiste) {
    return "Esa correlativa ya esta cargada";
  }

  return "";
}

function obtenerIdRespuesta(respuesta) {
  return respuesta?.data?.id || respuesta?.data?.plan_id;
}

function obtenerLista(respuesta) {
  return Array.isArray(respuesta?.data) ? respuesta.data : [];
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo completar la operacion";
}

export default AltaPlanWizard;