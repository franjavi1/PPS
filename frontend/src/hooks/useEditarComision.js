import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
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
const nuevaComisionAsignaturaInicial = {
  plan_asignaturas_id: "",
  aula_id: "",
  nombre: "",
  modalidad: "",
  cupo_maximo: "",
  estado: "Activo",
};
const nuevaAutoridadInicial = {
  tipo_autoridad_id: "",
  legajo_id: "",
  comision_id: "",
};

export function useEditarComision() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [comision, setComision] = useState(comisionInicial);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
  const [nuevaComisionAsignatura, setNuevaComisionAsignatura] = useState(nuevaComisionAsignaturaInicial);
  const [autoridades, setAutoridades] = useState([]);
  const [nuevaAutoridad, setNuevaAutoridad] = useState(nuevaAutoridadInicial);
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
      ]);

      setComision(resComision.data || comisionInicial);
      setComisionesAsignaturas(resComisionesAsignaturas.data || []);
      setAutoridades(resAutoridades.data || []);
      setPlanesAsignaturas(resPlanesAsignaturas.data || []);
      setAsignaturas(resAsignaturas.data || []);
      setPlanes(resPlanes.data || []);
      setSedes(resSedes.data || []);
      setAulas(resAulas.data || []);
      setTiposAutoridad(resTiposAutoridad.data || []);
      setLegajos(resLegajos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los datos de la comision");
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
      aulas: aulas.reduce((acc, aula) => {
        acc[aula.id_aula] = aula.aula;
        return acc;
      }, {}),
      tiposAutoridad: tiposAutoridad.reduce((acc, tipo) => {
        acc[tipo.id] = tipo.descripcion;
        return acc;
      }, {}),
      legajos: legajos.reduce((acc, legajo) => {
        acc[legajo.id] = legajo.numero ? `Nro. ${legajo.numero}` : `Legajo #${legajo.id}`;
        return acc;
      }, {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes, aulas, tiposAutoridad, legajos]);

  function cambiarComision(e) {
    setComision({ ...comision, [e.target.name]: e.target.value });
  }

  function cambiarNuevaComisionAsignatura(e) {
    setNuevaComisionAsignatura({
      ...nuevaComisionAsignatura,
      [e.target.name]: e.target.value,
    });
  }

  function cambiarNuevaAutoridad(e) {
    setNuevaAutoridad({ ...nuevaAutoridad, [e.target.name]: e.target.value });
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

      await comisionService.actualizar(id, { descripcion, usuario_accion: 1 });
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
      cupo_maximo: Number(nuevaComisionAsignatura.cupo_maximo),
      estado: nuevaComisionAsignatura.estado,
      usuario_accion: 1,
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
    const confirmar = confirm("Seguro que queres eliminar esta asignatura de la comision?");
    if (!confirmar) return;

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
      usuario_accion: 1,
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
    if (!confirmar) return;

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

  return {
    id,
    navigate,
    comision,
    comisionesAsignaturas,
    nuevaComisionAsignatura,
    autoridades,
    nuevaAutoridad,
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
    mensaje,
    setMensaje,
    seccionAbierta,
    setSeccionAbierta,
    mapas,
    cambiarComision,
    cambiarNuevaComisionAsignatura,
    cambiarNuevaAutoridad,
    guardarCambios,
    agregarComisionAsignatura,
    eliminarComisionAsignatura,
    agregarAutoridad,
    eliminarAutoridad,
  };
}

function obtenerEtiquetaPlanAsignatura(planAsignatura, asignaturas, planes, sedes) {
  const asignatura = asignaturas.find((item) => item.id === planAsignatura.asignatura_id);
  const plan = planes.find((item) => item.id === planAsignatura.plan_id);
  const Sede = sedes.find((item) => item.id === planAsignatura.sedes_id);
  const partes = [asignatura?.nombre, plan?.nombre, Sede?.nombre].filter(Boolean);
  return partes.length ? partes.join(" - ") : `Plan asignatura #${planAsignatura.id}`;
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

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) return errores[primerCampo][0];
  return err.message || "No se pudo guardar";
}
