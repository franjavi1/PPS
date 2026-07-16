import { useState, useEffect, useMemo } from "react";
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

const comisionInicial = { descripcion: "" };
const comisionAsignaturaInicial = {
  plan_asignaturas_id: "",
  aula_id: "",
  nombre: "",
  modalidad: "",
  cupo_maximo: "",
  estado: "Activo",
};
const autoridadInicial = {
  tipo_autoridad_id: "",
  legajo_id: "",
  comision_id: "",
};

export function useAltaComisionWizard() {
  const [pasoActual, setPasoActual] = useState(1);
  const [comisionId, setComisionId] = useState(null);
  const [comision, setComision] = useState(comisionInicial);
  const [comisionAsignatura, setComisionAsignatura] = useState(comisionAsignaturaInicial);
  const [autoridad, setAutoridad] = useState(autoridadInicial);
  const [comisionesAsignaturasCargadas, setComisionesAsignaturasCargadas] = useState([]);
  const [autoridadesCargadas, setAutoridadesCargadas] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      setCargando(true);
      const [
        resPlanesAsignaturas,
        resAsignaturas,
        resPlanes,
        resSedes,
        resAulas,
        resTiposAutoridad,
        resLegajos,
      ] = await Promise.all([
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        sedeService.obtenerTodas(),
        aulaService.obtenerTodas(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
      ]);

      setPlanesAsignaturas(obtenerLista(resPlanesAsignaturas));
      setAsignaturas(obtenerLista(resAsignaturas));
      setPlanes(obtenerLista(resPlanes));
      setSedes(obtenerLista(resSedes));
      setAulas(obtenerLista(resAulas));
      setTiposAutoridad(obtenerLista(resTiposAutoridad));
      setLegajos(obtenerLista(resLegajos));
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos iniciales");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      planesAsignaturas: planesAsignaturas.reduce((acc, item) => {
        acc[item.id] = obtenerEtiquetaPlanAsignatura(item, asignaturas, planes, sedes);
        return acc;
      }, {}),
      aulas: crearMapa(aulas, "id_aula", "aula"),
      tiposAutoridad: crearMapa(tiposAutoridad, "id", "descripcion"),
      legajos: legajos.reduce((acc, item) => {
        acc[item.id] = obtenerEtiquetaLegajo(item);
        return acc;
      }, {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes, aulas, tiposAutoridad, legajos]);

  function cambiarComision(e) {
    setComision({ ...comision, [e.target.name]: e.target.value });
  }

  function cambiarComisionAsignatura(e) {
    setComisionAsignatura({ ...comisionAsignatura, [e.target.name]: e.target.value });
  }

  function cambiarAutoridad(e) {
    setAutoridad({ ...autoridad, [e.target.name]: e.target.value });
  }

  async function guardarComision(e) {
    e.preventDefault();
    const descripcion = comision.descripcion.trim();

    if (!descripcion) {
      setError("La descripcion es obligatoria");
      return;
    }

    try {
      setGuardando(true);
      setError("");
      const respuesta = await comisionService.crear({ descripcion, usuario_accion: 1 });
      setComisionId(obtenerIdRespuesta(respuesta));
      setPasoActual(2);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function agregarComisionAsignatura() {
    const payload = {
      plan_asignaturas_id: Number(comisionAsignatura.plan_asignaturas_id),
      aula_id: Number(comisionAsignatura.aula_id),
      comision_id: Number(comisionId),
      nombre: comisionAsignatura.nombre.trim(),
      modalidad: comisionAsignatura.modalidad.trim(),
      cupo_maximo: Number(comisionAsignatura.cupo_maximo),
      estado: comisionAsignatura.estado,
      usuario_accion: 1,
    };
    const mensaje = validarComisionAsignatura(payload);

    if (mensaje) {
      setError(mensaje);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      const respuesta = await comisionAsignaturaService.crear(payload);
      const idCreado = obtenerIdRespuesta(respuesta);
      setComisionesAsignaturasCargadas([
        ...comisionesAsignaturasCargadas,
        {
          id_comision_asignatura: idCreado,
          ...payload,
          planAsignatura: mapas.planesAsignaturas[payload.plan_asignaturas_id],
          aula: mapas.aulas[payload.aula_id],
        },
      ]);
      setComisionAsignatura(comisionAsignaturaInicial);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function agregarAutoridad() {
    const payload = {
      tipo_autoridad_id: Number(autoridad.tipo_autoridad_id),
      legajo_id: Number(autoridad.legajo_id),
      comision_id: Number(autoridad.comision_id),
      usuario_accion: 1,
    };
    const mensaje = validarAutoridad(payload);

    if (mensaje) {
      setError(mensaje);
      return;
    }

    try {
      setGuardando(true);
      setError("");
      await autoridadComisionService.crear(payload);
      setAutoridadesCargadas([
        ...autoridadesCargadas,
        {
          ...payload,
          tipoAutoridad: mapas.tiposAutoridad[payload.tipo_autoridad_id],
          legajo: mapas.legajos[payload.legajo_id],
          comisionAsignatura: obtenerEtiquetaComisionAsignaturaCargada(
            payload.comision_id,
            comisionesAsignaturasCargadas
          ),
        },
      ]);
      setAutoridad(autoridadInicial);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  function cargarOtraComision() {
    setPasoActual(1);
    setComisionId(null);
    setComision(comisionInicial);
    setComisionAsignatura(comisionAsignaturaInicial);
    setAutoridad(autoridadInicial);
    setComisionesAsignaturasCargadas([]);
    setAutoridadesCargadas([]);
    setError("");
  }

  return {
    pasoActual,
    setPasoActual,
    comisionId,
    comision,
    comisionAsignatura,
    autoridad,
    comisionesAsignaturasCargadas,
    autoridadesCargadas,
    planesAsignaturas,
    asignaturas,
    planes,
    sedes,
    aulas,
    tiposAutoridad,
    legajos,
    cargando,
    guardando,
    error,
    setError,
    mapas,
    cambiarComision,
    cambiarComisionAsignatura,
    cambiarAutoridad,
    guardarComision,
    agregarComisionAsignatura,
    agregarAutoridad,
    cargarOtraComision,
  };
}

function obtenerEtiquetaPlanAsignatura(planAsignatura, asignaturas, planes, sedes) {
  const asignatura = asignaturas.find((item) => item.id === planAsignatura.asignatura_id);
  const plan = planes.find((item) => item.id === planAsignatura.plan_id);
  const sede = sedes.find((item) => item.id === planAsignatura.sedes_id);
  const partes = [asignatura?.nombre, plan?.nombre, sede?.nombre].filter(Boolean);
  return partes.length ? partes.join(" - ") : `Plan asignatura #${planAsignatura.id}`;
}

function obtenerEtiquetaLegajo(legajo) {
  return legajo?.numero ? `Nro. ${legajo.numero}` : `Legajo #${legajo?.id}`;
}

function obtenerEtiquetaComisionAsignaturaCargada(id, items) {
  const item = items.find((registro) => Number(registro.id_comision_asignatura) === Number(id));
  return item?.nombre || `Comision asignatura #${id}`;
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

function validarComisionAsignatura(payload) {
  if (!payload.plan_asignaturas_id) return "Debe seleccionar un plan asignatura";
  if (!payload.aula_id) return "Debe seleccionar un aula";
  if (!payload.nombre) return "El nombre es obligatorio";
  if (!payload.modalidad) return "La modalidad es obligatoria";
  if (!payload.cupo_maximo || payload.cupo_maximo <= 0) return "El cupo maximo debe ser mayor a cero";
  return "";
}

function validarAutoridad(payload) {
  if (!payload.tipo_autoridad_id) return "Debe seleccionar un tipo de autoridad";
  if (!payload.legajo_id) return "Debe seleccionar un legajo";
  if (!payload.comision_id) return "Debe seleccionar una comision asignatura";
  return "";
}

function obtenerIdRespuesta(respuesta) {
  return respuesta?.data?.id || respuesta?.data?.id_comision || respuesta?.data?.id_comision_asignatura;
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) return errores[primerCampo][0];
  return err.message || "No se pudo completar la operacion";
}
