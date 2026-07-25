import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "../api";
import { contactosService } from "../services/contactosService";

const formularioInicial = {
  persona_id: "",
  tipo_contacto_id: "",
  principal: false,
  contacto: "",
};

export function useContactos() {
  const [contactos, setContactos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
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

      const [respuestaContactos, respuestaPersonas, respuestaTiposContacto] =
        await Promise.all([
          contactosService.obtenerTodos(),
          apiRequest("/personas"),
          apiRequest("/tipos-contacto"),
        ]);

      setContactos(respuestaContactos.data || []);
      setPersonas(respuestaPersonas.data || []);
      setTiposContacto(respuestaTiposContacto.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los contactos");
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
      tiposContacto: tiposContacto.reduce((acc, tipo) => {
        acc[tipo.id] = tipo.tipo;
        return acc;
      }, {}),
    };
  }, [personas, tiposContacto]);

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setError("");
  }

  function abrirNuevoContacto() {
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

  function editarContacto(registro) {
    setFormulario({
      persona_id: registro.persona_id,
      tipo_contacto_id: registro.tipo_contacto_id,
      principal: Boolean(registro.principal),
      contacto: registro.contacto || "",
    });
    setEditandoId(registro.id);
    setError("");
    setMostrarModal(true);
  }

  async function guardarContacto(e) {
    e.preventDefault();

    if (!formulario.persona_id) {
      setError("La persona es obligatoria");
      return;
    }

    if (!formulario.tipo_contacto_id) {
      setError("El tipo de contacto es obligatorio");
      return;
    }

    if (formulario.contacto.trim() === "") {
      setError("El contacto es obligatorio");
      return;
    }

    const payload = {
      persona_id: Number(formulario.persona_id),
      tipo_contacto_id: Number(formulario.tipo_contacto_id),
      principal: formulario.principal,
      contacto: formulario.contacto,
      usuario_accion: 1,
    };

    try {
      setError("");

      if (editandoId) {
        await contactosService.actualizar(editandoId, payload);
      } else {
        await contactosService.crear(payload);
      }

      cerrarModal();
      await cargarDatos();
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  }

  async function eliminarContacto(id) {
    const confirmar = confirm("Seguro que queres eliminar este contacto?");
    if (!confirmar) return;

    try {
      const respuesta = await contactosService.eliminar(id);
      alert(respuesta.message || "Contacto eliminado correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el contacto");
    }
  }

  return {
    contactos,
    personas,
    tiposContacto,
    formulario,
    mostrarModal,
    editandoId,
    busqueda,
    setBusqueda,
    error,
    cargando,
    mapas,
    cargarDatos,
    abrirNuevoContacto,
    cerrarModal,
    manejarCambio,
    editarContacto,
    guardarContacto,
    eliminarContacto,
  };
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }
  return err.message || "No se pudo guardar el contacto";
}
