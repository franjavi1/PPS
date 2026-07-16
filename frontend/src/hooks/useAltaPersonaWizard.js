import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api";
import { contactosService } from "../services/contactosService";
import { personasService } from "../services/personasService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import {
  obtenerIdRespuesta,
  validarContactos,
  obtenerTipoContacto,
  obtenerMensajeError,
} from "../utils/wizardHelpers";

const personaInicial = {
  td_id: "",
  numero_doc: "",
  nombre: "",
  apellido: "",
};

const legajoInicial = {
  numero: "",
};

const datosMedicosInicial = {
  grupo_sanguineo: "",
  alergias: "",
  aptitud_fisica: false,
  seguro: "",
};

const datosLegajoInicial = {
  rangos_institucionales_id: "",
  sede_id: "",
  es_autoridad: false,
  es_sede_base: true,
};

const contactosInicial = {
  email: "",
  celular: "",
};

const usuarioInicial = {
  rol: "bombero",
  crear_usuario: true,
};

export function useAltaPersonaWizard() {
  const [pasoActual, setPasoActual] = useState(1);
  const [personaId, setPersonaId] = useState(null);
  const [legajoId, setLegajoId] = useState(null);
  const [persona, setPersona] = useState(personaInicial);
  const [legajo, setLegajo] = useState(legajoInicial);
  const [datosMedicos, setDatosMedicos] = useState(datosMedicosInicial);
  const [datosLegajo, setDatosLegajo] = useState(datosLegajoInicial);
  const [contactos, setContactos] = useState(contactosInicial);
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [resultadoUsuario, setResultadoUsuario] = useState(null);

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      const [respuestaTipos, respuestaRangos, respuestaSedes, respuestaTiposContacto] =
        await Promise.all([
          apiRequest("/tipos-documentos"),
          rangoService.obtenerTodos(),
          sedeService.obtenerTodas(),
          apiRequest("/tipos-contacto"),
        ]);

      setTiposDocumento(respuestaTipos.data || []);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
      setTiposContacto(respuestaTiposContacto.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos iniciales");
    }
  }

  const cambiarPersona = (e) => {
    const { name, value } = e.target;
    setPersona((prev) => ({ ...prev, [name]: value }));
  };

  const cambiarLegajo = (e) => {
    const { name, value } = e.target;
    setLegajo((prev) => ({ ...prev, [name]: value }));
  };

  const cambiarDatosMedicos = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosMedicos((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const cambiarDatosLegajo = (e) => {
    const { name, value, type, checked } = e.target;
    setDatosLegajo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const cambiarContactos = (e) => {
    const { name, value } = e.target;
    setContactos((prev) => ({ ...prev, [name]: value }));
  };

  const cambiarUsuario = (e) => {
    const { name, value, type, checked } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  async function guardarPersona(e) {
    e.preventDefault();

    if (
      !persona.td_id ||
      !persona.numero_doc ||
      !persona.nombre.trim() ||
      !persona.apellido.trim()
    ) {
      setError("Completa tipo de documento, numero, nombre y apellido.");
      return;
    }

    const payload = {
      td_id: Number(persona.td_id),
      numero_doc: Number(persona.numero_doc),
      nombre: persona.nombre.trim(),
      apellido: persona.apellido.trim(),
      usuario_accion: 1,
    };

    try {
      setGuardando(true);
      setError("");
      const respuesta = await personasService.crear(payload);
      setPersonaId(obtenerIdRespuesta(respuesta));
      setPasoActual(2);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarLegajo(e) {
    e.preventDefault();

    if (!personaId) {
      setError("Primero tenes que crear la persona.");
      return;
    }

    if (!legajo.numero.trim()) {
      setError("El numero de legajo es obligatorio.");
      return;
    }

    const payload = {
      numero: legajo.numero.trim(),
      usuario_accion: 1,
    };

    try {
      setGuardando(true);
      setError("");
      const respuesta = await apiRequest(`/personas/${personaId}/legajo`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setLegajoId(obtenerIdRespuesta(respuesta));
      setPasoActual(3);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarDatosDelLegajo(e) {
    e.preventDefault();

    if (!personaId || !legajoId) {
      setError("Primero tenes que crear persona y legajo.");
      return;
    }

    const mensajeContactos = validarContactos(contactos);

    if (mensajeContactos) {
      setError(mensajeContactos);
      return;
    }

    try {
      setGuardando(true);
      setError("");

      if (datosMedicos.grupo_sanguineo || datosMedicos.seguro) {
        if (!datosMedicos.grupo_sanguineo || !datosMedicos.seguro.trim()) {
          setError(
            "Para guardar datos medicos completa grupo sanguineo y seguro.",
          );
          return;
        }

        await apiRequest(`/personas/${personaId}/datos-medicos`, {
          method: "POST",
          body: JSON.stringify({
            grupo_sanguineo: datosMedicos.grupo_sanguineo,
            alergias: datosMedicos.alergias.trim() || null,
            aptitud_fisica: Boolean(datosMedicos.aptitud_fisica),
            seguro: datosMedicos.seguro.trim(),
            usuario_accion: 1,
          }),
        });
      }

      if (datosLegajo.rangos_institucionales_id) {
        await apiRequest(`/legajos/${legajoId}/rangos`, {
          method: "POST",
          body: JSON.stringify({
            rangos_institucionales_id: Number(
              datosLegajo.rangos_institucionales_id,
            ),
            usuario_accion: 1,
          }),
        });
      }

      if (datosLegajo.sede_id) {
        await apiRequest(`/legajos/${legajoId}/sedes`, {
          method: "POST",
          body: JSON.stringify({
            sede_id: Number(datosLegajo.sede_id),
            es_autoridad: Boolean(datosLegajo.es_autoridad),
            es_sede_base: Boolean(datosLegajo.es_sede_base),
            usuario_accion: 1,
          }),
        });
      }

      const tipoEmail = obtenerTipoContacto(tiposContacto, "email");
      const tipoCelular = obtenerTipoContacto(tiposContacto, "celular");
      const contactosAGuardar = [];

      if (contactos.email.trim()) {
        if (!tipoEmail) {
          setError("No existe el tipo de contacto Email en la base.");
          return;
        }

        contactosAGuardar.push({
          persona_id: Number(personaId),
          tipo_contacto_id: Number(tipoEmail.id),
          principal: true,
          contacto: contactos.email.trim(),
          usuario_accion: 1,
        });
      }

      if (contactos.celular.trim()) {
        if (!tipoCelular) {
          setError("No existe el tipo de contacto Celular en la base.");
          return;
        }

        contactosAGuardar.push({
          persona_id: Number(personaId),
          tipo_contacto_id: Number(tipoCelular.id),
          principal: false,
          contacto: contactos.celular.trim(),
          usuario_accion: 1,
        });
      }

      await Promise.all(
        contactosAGuardar.map((contacto) => contactosService.crear(contacto)),
      );

      setPasoActual(4);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    try {
      setError("");
      const respuesta = await apiRequest(`/personas/${personaId}/usuario`, {
        method: "POST",
        body: JSON.stringify({
          legajo_id: Number(legajoId),
          dni: persona.numero_doc,
          email: contactos.email.trim() || null,
          rol: usuario.rol,
        }),
      });

      setResultadoUsuario(respuesta || { mensaje: "Mock: Usuario solicitado" });
      setPasoActual(5);
    } catch (err) {
      setError(obtenerMensajeError(err));
    }
  }

  const personaResumen = useMemo(() => {
    return `${persona.apellido || "-"}, ${persona.nombre || "-"}`;
  }, [persona]);

  return {
    pasoActual,
    setPasoActual,
    personaId,
    legajoId,
    persona,
    legajo,
    datosMedicos,
    datosLegajo,
    contactos,
    usuario,
    tiposDocumento,
    rangos,
    sedes,
    guardando,
    error,
    setError,
    resultadoUsuario,
    cambiarPersona,
    cambiarLegajo,
    cambiarDatosMedicos,
    cambiarDatosLegajo,
    cambiarContactos,
    cambiarUsuario,
    guardarPersona,
    guardarLegajo,
    guardarDatosDelLegajo,
    guardarUsuario,
    personaResumen,
  };
}
