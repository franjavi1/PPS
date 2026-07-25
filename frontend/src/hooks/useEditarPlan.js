import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { asignaturaService } from "../services/asignaturaService";
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

export function useEditarPlan() {
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
      ] = await Promise.all([
        planService.obtenerPorId(id),
        tipoPlanesService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        paCorrelativaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);

      const planData = respuestaPlan.data || {};

      setPlan({
        tipo_planes_id_tipo_planes: String(planData.tipo_planes_id_tipo_planes || ""),
        resolucion_ministerial: String(planData.resolucion_ministerial || ""),
        nombre: planData.nombre || "",
        descrip: planData.descrip || "",
        vigencia_dde: formatearFechaInput(planData.vigencia_dde),
        vigencia_hta: formatearFechaInput(planData.vigencia_hta),
      });

      setTiposPlanes(respuestaTiposPlanes.data || []);

      const planAsignaturasDelPlan = (respuestaPlanAsignaturas.data || []).filter(
        (item) => Number(item.plan_id) === Number(id)
      );
      const idsPlanAsignaturas = planAsignaturasDelPlan.map((item) => Number(item.id));

      setPlanAsignaturas(planAsignaturasDelPlan);
      setCorrelativas(
        (respuestaCorrelativas.data || []).filter((item) =>
          idsPlanAsignaturas.includes(Number(item.pa_id))
        )
      );

      setAsignaturas(respuestaAsignaturas.data || []);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
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
    const { name, value } = e.target;
    setPlan((prev) => ({ ...prev, [name]: value }));
  }

  function cambiarNuevaAsignatura(e) {
    const { name, value } = e.target;
    setNuevaAsignatura((prev) => ({ ...prev, [name]: value }));
  }

  function cambiarNuevaCorrelativa(e) {
    const { name, value } = e.target;
    setNuevaCorrelativa((prev) => ({ ...prev, [name]: value }));
  }

  async function agregarAsignatura() {
    const payload = {
      asignatura_id: Number(nuevaAsignatura.asignatura_id),
      plan_id: Number(id),
      rango_minimo_id: Number(nuevaAsignatura.rango_minimo_id),
      sedes_id: Number(nuevaAsignatura.sedes_id),
      presentismo_porc: Number(nuevaAsignatura.presentismo_porc),
      regularizacion_prom: Number(nuevaAsignatura.regularizacion_prom),
      final_aprobacion: Number(nuevaAsignatura.final_aprobacion),
      duracion: Number(nuevaAsignatura.duracion),
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
    if (!confirmar) return;

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
      correlativaEditandoId
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
          : "Correlativa agregada correctamente"
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
    if (!confirmar) return;

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
    const resolucionMinisterial = Number(plan.resolucion_ministerial);
    const nombre = plan.nombre.trim();
    const descrip = plan.descrip.trim();

    if (!tipoPlanId) {
      setError("Debe seleccionar un tipo de plan");
      return;
    }

    if (!resolucionMinisterial || resolucionMinisterial <= 0) {
      setError("La resolucion ministerial debe ser un numero positivo");
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

      setMensaje("Plan actualizado correctamente");
      await cargarDatos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  return {
    id,
    navigate,
    plan,
    tiposPlanes,
    planAsignaturas,
    nuevaAsignatura,
    correlativas,
    nuevaCorrelativa,
    correlativaEditandoId,
    asignaturas,
    rangos,
    sedes,
    cargando,
    guardando,
    error,
    setError,
    mensaje,
    setMensaje,
    seccionAbierta,
    setSeccionAbierta,
    mapas,
    cambiarPlan,
    cambiarNuevaAsignatura,
    cambiarNuevaCorrelativa,
    agregarAsignatura,
    eliminarAsignatura,
    guardarCorrelativa,
    editarCorrelativa,
    cancelarEdicionCorrelativa,
    eliminarCorrelativa,
    guardarCambios,
  };
}

function formatearFechaInput(fecha) {
  if (!fecha) return "";
  return fecha.split("T")[0];
}

function crearMapa(items, idKey, valueKey) {
  const lista = Array.isArray(items) ? items : [];
  return lista.reduce((acc, item) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

function validarAsignatura(payload) {
  if (!payload.asignatura_id) return "Debe seleccionar una asignatura";
  if (!payload.rango_minimo_id) return "Debe seleccionar un rango minimo";
  if (!payload.sedes_id) return "Debe seleccionar una sede";
  if (
    payload.presentismo_porc === "" ||
    payload.presentismo_porc < 0 ||
    payload.presentismo_porc > 100
  ) {
    return "El porcentaje de presentismo debe estar entre 0 y 100";
  }
  if (
    payload.regularizacion_prom === "" ||
    payload.regularizacion_prom < 1 ||
    payload.regularizacion_prom > 10
  ) {
    return "La nota promedio de regularizacion debe estar entre 1 y 10";
  }
  if (
    payload.final_aprobacion === "" ||
    payload.final_aprobacion < 1 ||
    payload.final_aprobacion > 10
  ) {
    return "La nota de aprobacion final debe estar entre 1 y 10";
  }
  if (payload.duracion === "" || payload.duracion <= 0) {
    return "La duracion debe ser mayor a cero";
  }
  if (!payload.regimen) return "El regimen es obligatorio";
  if (!payload.modalidad) return "La modalidad es obligatoria";
  return "";
}

function validarCorrelativa(payload, planAsignaturas, correlativas, correlativaEditandoId) {
  if (!payload.pa_id) return "Debe seleccionar la materia que requiere correlativa";
  if (!payload.asignatura_id) return "Debe seleccionar la materia correlativa requerida";

  const materiaDestino = planAsignaturas.find((item) => Number(item.id) === Number(payload.pa_id));
  if (Number(materiaDestino?.asignatura_id) === Number(payload.asignatura_id)) {
    return "Una materia no puede ser correlativa de si misma";
  }

  const duplicada = correlativas.some(
    (item) =>
      Number(item.id) !== Number(correlativaEditandoId) &&
      Number(item.pa_id) === Number(payload.pa_id) &&
      Number(item.asignatura_id) === Number(payload.asignatura_id)
  );

  if (duplicada) {
    return "Esta relacion de correlatividad ya fue cargada";
  }

  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) return errores[primerCampo][0];
  return err.message || "No se pudo completar la operacion";
}
