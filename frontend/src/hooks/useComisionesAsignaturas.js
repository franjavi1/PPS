import { useState, useEffect, useMemo } from "react";
import { asignaturaService } from "../services/asignaturaService";
import { aulaService } from "../services/aulaService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { comisionService } from "../services/comisionService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";

const formularioInicial = {
  plan_asignaturas_id: "",
  aula_id: "",
  comision_id: "",
  nombre: "",
  modalidad: "",
  cupo_maximo: "",
  estado: "Activo",
};

export function useComisionesAsignaturas() {
  const [registros, setRegistros] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
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
        resPlanesAsignaturas,
        resAsignaturas,
        resPlanes,
        resAulas,
        resComisiones,
        resSedes,
      ] = await Promise.all([
        comisionAsignaturaService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        aulaService.obtenerTodas(),
        comisionService.obtenerTodas(),
        sedeService.obtenerTodas(),
      ]);

      setRegistros(resRegistros.data || []);
      setPlanesAsignaturas(resPlanesAsignaturas.data || []);
      setAsignaturas(resAsignaturas.data || []);
      setPlanes(resPlanes.data || []);
      setAulas(resAulas.data || []);
      setComisiones(resComisiones.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las comisiones asignaturas");
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
      comisiones: comisiones.reduce((acc, comision) => {
        acc[comision.id_comision] = comision.descripcion;
        return acc;
      }, {}),
    };
  }, [planesAsignaturas, asignaturas, planes, aulas, comisiones, sedes]);

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
    setFormulario((prev) => ({ ...prev, [name]: value }));
  }

  function editarRegistro(registro) {
    setFormulario({
      plan_asignaturas_id: String(registro.plan_asignaturas_id || ""),
      aula_id: String(registro.aula_id || ""),
      comision_id: String(registro.comision_id || ""),
      nombre: registro.nombre || "",
      modalidad: registro.modalidad || "",
      cupo_maximo: String(registro.cupo_maximo || ""),
      estado: registro.estado || "Activo",
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
      modalidad: formulario.modalidad.trim(),
      cupo_maximo: Number(formulario.cupo_maximo),
      estado: formulario.estado,
      usuario_accion: 1,
    };

    const validacion = validarPayload(payload);
    if (validacion) {
      setErrorFormulario(validacion);
      return;
    }

    try {
      setErrorFormulario("");
      let respuesta;
      if (editandoId) {
        respuesta = await comisionAsignaturaService.actualizar(editandoId, payload);
      } else {
        respuesta = await comisionAsignaturaService.crear(payload);
      }

      if (respuesta.status === "error") {
        setErrorFormulario(respuesta.message || "Error al procesar la comision asignatura");
        return;
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRegistro(id) {
    const confirmar = confirm("Seguro que queres eliminar esta comision asignatura?");
    if (!confirmar) return;

    try {
      const respuesta = await comisionAsignaturaService.eliminar(id);
      alert(respuesta.message || "Comision asignatura eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la comision asignatura");
    }
  }

  return {
    registros,
    planesAsignaturas,
    asignaturas,
    planes,
    aulas,
    comisiones,
    sedes,
    formulario,
    mostrarModal,
    editandoId,
    busqueda,
    setBusqueda,
    error,
    errorFormulario,
    cargando,
    mapas,
    cargarDatos,
    abrirNuevoRegistro,
    cerrarModal,
    manejarCambio,
    editarRegistro,
    guardarRegistro,
    eliminarRegistro,
  };
}

function obtenerEtiquetaPlanAsignatura(planAsignatura, asignaturas, planes, sedes) {
  const asignatura = asignaturas.find((item) => item.id === planAsignatura.asignatura_id);
  const plan = planes.find((item) => item.id === planAsignatura.plan_id);
  const sede = sedes.find((item) => item.id === planAsignatura.sedes_id);

  const partes = [asignatura?.nombre, plan?.nombre, sede?.nombre].filter(Boolean);
  if (partes.length === 0) {
    return `Plan asignatura #${planAsignatura.id}`;
  }
  return partes.join(" - ");
}

function validarPayload(payload) {
  if (!payload.plan_asignaturas_id) return "Debe seleccionar un plan asignatura";
  if (!payload.aula_id) return "Debe seleccionar un aula";
  if (!payload.comision_id) return "Debe seleccionar una comision";
  if (!payload.nombre) return "El nombre es obligatorio";
  if (!payload.modalidad) return "La modalidad es obligatoria";
  if (!payload.cupo_maximo || payload.cupo_maximo <= 0) return "El cupo maximo debe ser mayor a cero";
  if (!payload.estado) return "El estado es obligatorio";
  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }
  return err.message || "No se pudo guardar la comision asignatura";
}
