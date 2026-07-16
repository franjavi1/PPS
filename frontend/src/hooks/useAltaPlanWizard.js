import { useState, useEffect, useMemo } from "react";
import { planService } from "../services/planesService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { tipoPlanesService } from "../services/tipoPlanesService";
import { asignaturaService } from "../services/asignaturaService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";

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

export function useAltaPlanWizard() {
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
      ] = await Promise.all([
        tipoPlanesService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);

      setTiposPlanes(obtenerLista(respuestaTiposPlanes));
      setAsignaturas(obtenerLista(respuestaAsignaturas));
      setRangos(obtenerLista(respuestaRangos));
      setSedes(obtenerLista(respuestaSedes));
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
            Number(plan.tipo_planes_id_tipo_planes)
        )?.descripcion || "-",
      asignatura:
        asignaturas.find(
          (asignatura) =>
            Number(asignatura.id) === Number(asignaturaPlan.asignatura_id)
        )?.nombre || "-",
      rango:
        rangos.find(
          (rango) => Number(rango.id) === Number(asignaturaPlan.rango_minimo_id)
        )?.descripcion || "-",
      sede:
        sedes.find((sede) => Number(sede.id) === Number(asignaturaPlan.sedes_id))
          ?.nombre || "-",
    };
  }, [asignaturaPlan, asignaturas, plan, rangos, sedes, tiposPlanes]);

  function cambiarPlan(e) {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  }

  function cambiarAsignaturaPlan(e) {
    const { name, value } = e.target;
    setAsignaturaPlan({ ...asignaturaPlan, [name]: value });
  }

  function cambiarCorrelativa(e) {
    const { name, value } = e.target;
    setNuevaCorrelativa({ ...nuevaCorrelativa, [name]: value });
  }

  async function guardarPlan(e) {
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
      const respuesta = await planService.crear({
        tipo_planes_id_tipo_planes: tipoPlanId,
        resolucion_ministerial: resolucionMinisterial,
        nombre,
        descrip: descrip || null,
        vigencia_dde: `${plan.vigencia_dde}T00:00:00`,
        vigencia_hta: `${plan.vigencia_hta}T00:00:00`,
        usuario_accion: 1,
      });
      setPlanId(obtenerIdRespuesta(respuesta));
      setPasoActual(2);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
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

  async function guardarCondiciones(e) {
    e.preventDefault();

    if (!planId) {
      setError("Primero tenes que crear el plan");
      return;
    }

    const payload = {
      asignatura_id: Number(asignaturaPlan.asignatura_id),
      plan_id: Number(planId),
      rango_minimo_id: Number(asignaturaPlan.rango_minimo_id),
      sedes_id: Number(asignaturaPlan.sedes_id),
      presentismo_porc: Number(asignaturaPlan.presentismo_porc),
      regularizacion_prom: Number(asignaturaPlan.regularizacion_prom),
      final_aprobacion: Number(asignaturaPlan.final_aprobacion),
      duracion: Number(asignaturaPlan.duracion),
      regimen: asignaturaPlan.regimen.trim(),
      modalidad: asignaturaPlan.modalidad.trim(),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarCondiciones(payload);
    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      const respuesta = await planAsignaturaService.crear(payload);
      const nuevoPlanAsignaturaId = obtenerIdRespuesta(respuesta);

      setPlanAsignaturaId(nuevoPlanAsignaturaId);
      setAsignaturasCargadas([
        ...asignaturasCargadas,
        {
          id: nuevoPlanAsignaturaId,
          asignatura_id: payload.asignatura_id,
          asignatura: resumen.asignatura,
          rango: resumen.rango,
          sede: resumen.sede,
          presentismo_porc: payload.presentismo_porc,
          regularizacion_prom: payload.regularizacion_prom,
          final_aprobacion: payload.final_aprobacion,
          duracion: payload.duracion,
          regimen: payload.regimen,
          modalidad: payload.modalidad,
        },
      ]);
      setPasoActual(4);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarCorrelativa(e) {
    e.preventDefault();

    const payload = {
      pa_id: Number(nuevaCorrelativa.pa_id),
      asignatura_id: Number(nuevaCorrelativa.asignatura_id),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarCorrelativa(
      payload,
      asignaturasCargadas,
      correlativasCargadas
    );

    if (mensajeValidacion) {
      setError(mensajeValidacion);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      const respuesta = await paCorrelativaService.crear(payload);
      const asignaturaQueRequiere = asignaturasCargadas.find(
        (item) => Number(item.id) === Number(payload.pa_id)
      );
      const asignaturaRequerida = asignaturasCargadas.find(
        (item) => Number(item.asignatura_id) === Number(payload.asignatura_id)
      );

      setCorrelativasCargadas([
        ...correlativasCargadas,
        {
          id: obtenerIdRespuesta(respuesta),
          pa_id: payload.pa_id,
          asignatura_id: payload.asignatura_id,
          asignaturaQueRequiere: asignaturaQueRequiere?.asignatura || "-",
          asignaturaRequerida: asignaturaRequerida?.asignatura || "-",
        },
      ]);
      setNuevaCorrelativa(correlativaInicial);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCorrelativa(correlativaId) {
    const confirmar = confirm("Seguro que queres eliminar esta correlativa?");
    if (!confirmar) return;

    try {
      setGuardando(true);
      setError("");
      await paCorrelativaService.eliminar(correlativaId);
      setCorrelativasCargadas(
        correlativasCargadas.filter(
          (item) => Number(item.id) !== Number(correlativaId)
        )
      );
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  function agregarOtraAsignatura() {
    setAsignaturaPlan(asignaturaPlanInicial);
    setPlanAsignaturaId(null);
    setError("");
    setPasoActual(2);
  }

  function cargarOtroPlan() {
    setPasoActual(1);
    setPlanId(null);
    setPlanAsignaturaId(null);
    setPlan(planInicial);
    setAsignaturaPlan(asignaturaPlanInicial);
    setAsignaturasCargadas([]);
    setNuevaCorrelativa(correlativaInicial);
    setCorrelativasCargadas([]);
    setError("");
  }

  return {
    pasoActual,
    setPasoActual,
    planId,
    planAsignaturaId,
    plan,
    asignaturaPlan,
    asignaturasCargadas,
    nuevaCorrelativa,
    correlativasCargadas,
    tiposPlanes,
    asignaturas,
    rangos,
    sedes,
    guardando,
    cargando,
    error,
    setError,
    resumen,
    cambiarPlan,
    cambiarAsignaturaPlan,
    cambiarCorrelativa,
    guardarPlan,
    guardarDatosAsignatura,
    guardarCondiciones,
    guardarCorrelativa,
    eliminarCorrelativa,
    agregarOtraAsignatura,
    cargarOtroPlan,
  };
}

function obtenerLista(respuesta) {
  return Array.isArray(respuesta?.data) ? respuesta.data : [];
}

function validarCondiciones(payload) {
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
  if (!payload.regimen) {
    return "El regimen es obligatorio";
  }
  if (!payload.modalidad) {
    return "La modalidad es obligatoria";
  }
  return "";
}

function validarCorrelativa(payload, asignaturasCargadas, correlativasCargadas) {
  if (!payload.pa_id) {
    return "Debe seleccionar la materia que requiere correlativa";
  }
  if (!payload.asignatura_id) {
    return "Debe seleccionar la materia correlativa requerida";
  }

  const materiaDestino = asignaturasCargadas.find(
    (item) => Number(item.id) === Number(payload.pa_id)
  );

  if (Number(materiaDestino?.asignatura_id) === Number(payload.asignatura_id)) {
    return "Una materia no puede ser correlativa de si misma";
  }

  const duplicada = correlativasCargadas.some(
    (item) =>
      Number(item.pa_id) === Number(payload.pa_id) &&
      Number(item.asignatura_id) === Number(payload.asignatura_id)
  );

  if (duplicada) {
    return "Esta relacion de correlatividad ya fue cargada";
  }

  return "";
}

function obtenerIdRespuesta(respuesta) {
  return (
    respuesta?.data?.id ||
    respuesta?.data?.plan_id ||
    respuesta?.data?.id_plan_asignatura ||
    respuesta?.data?.id_correlativa
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }
  return err.message || "No se pudo completar la operacion";
}
