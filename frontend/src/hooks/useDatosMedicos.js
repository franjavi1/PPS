import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "../api";
import { datosMedicosService } from "../services/datosMedicosService";

const formularioInicial = {
  persona_id: "",
  grupo_sanguineo: "",
  alergias: "",
  aptitud_fisica: false,
  seguro: "",
};

export function useDatosMedicos() {
  const [datosMedicos, setDatosMedicos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [respuestaDatosMedicos, respuestaPersonas] = await Promise.all([
        datosMedicosService.obtenerTodos(),
        apiRequest("/personas"),
      ]);

      setDatosMedicos(respuestaDatosMedicos.data || []);
      setPersonas(respuestaPersonas.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los datos medicos");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      personas: personas.reduce((acc, persona) => {
        acc[persona.id] = `${persona.apellido}, ${persona.nombre}`;
        return acc;
      }, {}),
      documentos: personas.reduce((acc, persona) => {
        acc[persona.id] = persona.numero_doc || "No definido";
        return acc;
      }, {}),
    };
  }, [personas]);

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setError("");
  }

  function abrirNuevosDatosMedicos() {
    limpiarFormulario();
    setMostrarModal(true);
  }

  function cerrarModal() {
    limpiarFormulario();
    setMostrarModal(false);
  }

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function editarDatosMedicos(registro) {
    setFormulario({
      persona_id: registro.persona_id,
      grupo_sanguineo: registro.grupo_sanguineo,
      alergias: registro.alergias || "",
      aptitud_fisica: Boolean(registro.aptitud_fisica),
      seguro: registro.seguro,
    });
    setEditandoId(registro.id);
    setError("");
    setMostrarModal(true);
  }

  async function guardarDatosMedicos(e) {
    e.preventDefault();

    if (!formulario.persona_id) {
      setError("La persona es obligatoria");
      return;
    }

    if (!formulario.grupo_sanguineo) {
      setError("El grupo sanguineo es obligatorio");
      return;
    }

    if (formulario.seguro.trim() === "") {
      setError("El seguro es obligatorio");
      return;
    }

    const payload = {
      persona_id: Number(formulario.persona_id),
      grupo_sanguineo: formulario.grupo_sanguineo,
      alergias: formulario.alergias.trim() || null,
      aptitud_fisica: formulario.aptitud_fisica,
      seguro: formulario.seguro,
      usuario_accion: 1,
    };

    try {
      setError("");

      if (editandoId) {
        await datosMedicosService.actualizar(editandoId, payload);
      } else {
        await datosMedicosService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  }

  async function eliminarDatosMedicos(id) {
    const confirmar = confirm("Seguro que queres eliminar estos datos medicos?");
    if (!confirmar) return;

    try {
      const respuesta = await datosMedicosService.eliminar(id);
      alert(respuesta.message || "Datos medicos eliminados correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar los datos medicos");
    }
  }

  return {
    datosMedicos,
    personas,
    formulario,
    mostrarModal,
    editandoId,
    busqueda,
    setBusqueda,
    error,
    cargando,
    mapas,
    cargarDatos,
    abrirNuevosDatosMedicos,
    cerrarModal,
    manejarCambio,
    editarDatosMedicos,
    guardarDatosMedicos,
    eliminarDatosMedicos,
  };
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }
  return err.message || "No se pudieron guardar los datos medicos";
}
