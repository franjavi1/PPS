import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "../api";
import { autoridadComisionService } from "../services/autoridadComisionService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { tipoAutoridadService } from "../services/tipoAutoridadService";

const formularioInicial = {
  tipo_autoridad_id: "",
  legajo_id: "",
  comision_id: "",
};

export function useAutoridadesComision() {
  const [registros, setRegistros] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
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
        respuestaAutoridades,
        respuestaTipos,
        respuestaLegajos,
        respuestaComisiones,
      ] = await Promise.all([
        autoridadComisionService.obtenerTodos(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
        comisionAsignaturaService.obtenerTodos(),
      ]);

      setRegistros(respuestaAutoridades.data || []);
      setTiposAutoridad(respuestaTipos.data || []);
      setLegajos(respuestaLegajos.data || []);
      setComisionesAsignaturas(respuestaComisiones.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las autoridades de comision");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      tiposAutoridad: tiposAutoridad.reduce((acc, tipo) => {
        acc[tipo.id] = tipo.descripcion;
        return acc;
      }, {}),
      legajos: legajos.reduce((acc, legajo) => {
        acc[legajo.id] = obtenerEtiquetaLegajo(legajo);
        return acc;
      }, {}),
      comisiones: comisionesAsignaturas.reduce((acc, comision) => {
        acc[comision.id_comision_asignatura] = obtenerEtiquetaComision(comision);
        return acc;
      }, {}),
    };
  }, [tiposAutoridad, legajos, comisionesAsignaturas]);

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
      tipo_autoridad_id: String(registro.tipo_autoridad_id || ""),
      legajo_id: String(registro.legajo_id || ""),
      comision_id: String(registro.comision_id || ""),
    });
    setEditandoId(registro.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  async function guardarRegistro(e) {
    e.preventDefault();

    const payload = {
      tipo_autoridad_id: Number(formulario.tipo_autoridad_id),
      legajo_id: Number(formulario.legajo_id),
      comision_id: Number(formulario.comision_id),
      usuario_accion: 1,
    };

    const mensajeValidacion = validarPayload(payload);
    if (mensajeValidacion) {
      setErrorFormulario(mensajeValidacion);
      return;
    }

    try {
      setErrorFormulario("");

      if (editandoId) {
        await autoridadComisionService.actualizar(editandoId, payload);
      } else {
        await autoridadComisionService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(obtenerMensajeError(err));
    }
  }

  async function eliminarRegistro(id) {
    const confirmar = confirm("Seguro que queres eliminar esta autoridad de comision?");
    if (!confirmar) return;

    try {
      await autoridadComisionService.eliminar(id);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la autoridad de comision");
    }
  }

  return {
    registros,
    tiposAutoridad,
    legajos,
    comisionesAsignaturas,
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

function obtenerEtiquetaLegajo(legajo) {
  if (!legajo) return "Legajo no definido";
  return legajo.numero ? `Nro. ${legajo.numero}` : `Legajo #${legajo.id}`;
}

function obtenerEtiquetaComision(comision) {
  if (!comision) return "Comision no definida";
  const partes = [comision.nombre, comision.modalidad].filter(Boolean);
  if (partes.length === 0) {
    return `Comision asignatura #${comision.id_comision_asignatura}`;
  }
  return partes.join(" - ");
}

function validarPayload(payload) {
  if (!payload.tipo_autoridad_id) return "Debe seleccionar un tipo de autoridad";
  if (!payload.legajo_id) return "Debe seleccionar un legajo";
  if (!payload.comision_id) return "Debe seleccionar una comision asignatura";
  return "";
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }
  return err.message || "No se pudo guardar la autoridad de comision";
}
