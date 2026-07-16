import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { apiRequest } from "../api";
import { contactosService } from "../services/contactosService";
import { personasService } from "../services/personasService";

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

const rangoInicial = {
  rangos_institucionales_id: "",
};

const sedeInicial = {
  sede_id: "",
  es_autoridad: false,
  es_sede_base: true,
};

const contactosInicial = {
  email: "",
  celular: "",
};

export function useEditarPersona() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [persona, setPersona] = useState(personaInicial);
  const [legajo, setLegajo] = useState(legajoInicial);
  const [datosMedicos, setDatosMedicos] = useState(datosMedicosInicial);
  const [rango, setRango] = useState(rangoInicial);
  const [sede, setSede] = useState(sedeInicial);
  const [contactos, setContactos] = useState(contactosInicial);
  const [ids, setIds] = useState({
    legajoId: null,
    datosMedicosId: null,
    rangoId: null,
    sedeId: null,
    emailContactoId: null,
    celularContactoId: null,
  });

  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState("persona");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaPersona,
        respuestaTipos,
        respuestaLegajos,
        respuestaDatosMedicos,
        respuestaRangosAsignados,
        respuestaSedesAsignadas,
        respuestaContactos,
        respuestaTiposContacto,
        respuestaRangos,
        respuestaSedes,
      ] = await Promise.all([
        personasService.obtenerPorId(id),
        apiRequest("/tipos-documentos"),
        apiRequest("/legajos"),
        apiRequest("/datos-medicos"),
        apiRequest("/legajo-rangos"),
        apiRequest("/legajo-sedes"),
        contactosService.obtenerTodos(),
        apiRequest("/tipos-contacto"),
        apiRequest("/rangos-institucionales"),
        apiRequest("/sedes"),
      ]);

      const personaData = respuestaPersona.data || {};
      const legajoData = (respuestaLegajos.data || []).find(
        (item) => Number(item.persona_id) === Number(id)
      );
      const datosMedicosData = (respuestaDatosMedicos.data || []).find(
        (item) => Number(item.persona_id) === Number(id)
      );
      const rangoData = legajoData
        ? (respuestaRangosAsignados.data || []).find(
            (item) => Number(item.legajo_id) === Number(legajoData.id)
          )
        : null;
      const sedeData = legajoData
        ? (respuestaSedesAsignadas.data || []).find(
            (item) => Number(item.legajo_id) === Number(legajoData.id)
          )
        : null;
      const tiposContactoData = respuestaTiposContacto.data || [];
      const tipoEmail = obtenerTipoContacto(tiposContactoData, "email");
      const tipoCelular = obtenerTipoContacto(tiposContactoData, "celular");
      const contactoEmailData = (respuestaContactos.data || []).find(
        (item) =>
          Number(item.persona_id) === Number(id) &&
          Number(item.tipo_contacto_id) === Number(tipoEmail?.id)
      );
      const contactoCelularData = (respuestaContactos.data || []).find(
        (item) =>
          Number(item.persona_id) === Number(id) &&
          Number(item.tipo_contacto_id) === Number(tipoCelular?.id)
      );

      setPersona({
        td_id: personaData.td_id || "",
        numero_doc: personaData.numero_doc || "",
        nombre: personaData.nombre || "",
        apellido: personaData.apellido || "",
      });
      setLegajo({
        numero: legajoData?.numero || "",
      });
      setDatosMedicos({
        grupo_sanguineo: datosMedicosData?.grupo_sanguineo || "",
        alergias: datosMedicosData?.alergias || "",
        aptitud_fisica: Boolean(datosMedicosData?.aptitud_fisica),
        seguro: datosMedicosData?.seguro || "",
      });
      setRango({
        rangos_institucionales_id: rangoData?.rangos_institucionales_id || "",
      });
      setSede({
        sede_id: sedeData?.sede_id || "",
        es_autoridad: Boolean(sedeData?.es_autoridad),
        es_sede_base: sedeData?.es_sede_base ?? true,
      });
      setContactos({
        email: contactoEmailData?.contacto || "",
        celular: contactoCelularData?.contacto || "",
      });
      setIds({
        legajoId: legajoData?.id || null,
        datosMedicosId: datosMedicosData?.id || null,
        rangoId: rangoData?.id || null,
        sedeId: sedeData?.id || null,
        emailContactoId: contactoEmailData?.id || null,
        celularContactoId: contactoCelularData?.id || null,
      });
      setTiposDocumento(respuestaTipos.data || []);
      setTiposContacto(tiposContactoData);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }

  function cambiarPersona(e) {
    const { name, value } = e.target;
    setPersona((prev) => ({ ...prev, [name]: value }));
  }

  function cambiarLegajo(e) {
    const { name, value } = e.target;
    setLegajo((prev) => ({ ...prev, [name]: value }));
  }

  function cambiarDatosMedicos(e) {
    const { name, value, type, checked } = e.target;
    setDatosMedicos((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function cambiarRango(e) {
    const { name, value } = e.target;
    setRango((prev) => ({ ...prev, [name]: value }));
  }

  function cambiarSede(e) {
    const { name, value, type, checked } = e.target;
    setSede((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function cambiarContactos(e) {
    const { name, value } = e.target;
    setContactos((prev) => ({ ...prev, [name]: value }));
  }

  async function guardarCambios(e) {
    e.preventDefault();

    if (!persona.td_id || !persona.numero_doc || !persona.nombre.trim() || !persona.apellido.trim()) {
      setError("Completa tipo de documento, numero, nombre y apellido.");
      return;
    }

    if ((rango.rangos_institucionales_id || sede.sede_id) && !legajo.numero.trim() && !ids.legajoId) {
      setError("Para asignar rango o sede primero carga un numero de legajo.");
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
      setMensaje("");

      await personasService.actualizar(id, {
        td_id: Number(persona.td_id),
        numero_doc: Number(persona.numero_doc),
        nombre: persona.nombre.trim(),
        apellido: persona.apellido.trim(),
        usuario_accion: 1,
      });

      let legajoId = ids.legajoId;

      if (legajo.numero.trim()) {
        const payloadLegajo = {
          numero: legajo.numero.trim(),
          usuario_accion: 1,
        };

        if (legajoId) {
          await apiRequest(`/legajos/${legajoId}`, {
            method: "PUT",
            body: JSON.stringify(payloadLegajo),
          });
        } else {
          const respuestaLegajo = await apiRequest(`/personas/${id}/legajo`, {
            method: "POST",
            body: JSON.stringify(payloadLegajo),
          });
          legajoId = obtenerIdRespuesta(respuestaLegajo);
        }
      }

      if (datosMedicos.grupo_sanguineo || datosMedicos.seguro) {
        const payloadDatosMedicos = {
          grupo_sanguineo: datosMedicos.grupo_sanguineo,
          alergias: datosMedicos.alergias.trim() || null,
          aptitud_fisica: Boolean(datosMedicos.aptitud_fisica),
          seguro: datosMedicos.seguro.trim(),
          usuario_accion: 1,
        };

        if (ids.datosMedicosId) {
          await apiRequest(`/datos-medicos/${ids.datosMedicosId}`, {
            method: "PUT",
            body: JSON.stringify(payloadDatosMedicos),
          });
        } else {
          await apiRequest(`/personas/${id}/datos-medicos`, {
            method: "POST",
            body: JSON.stringify(payloadDatosMedicos),
          });
        }
      }

      if (rango.rangos_institucionales_id && legajoId) {
        const payloadRango = {
          rangos_institucionales_id: Number(rango.rangos_institucionales_id),
          usuario_accion: 1,
        };

        if (ids.rangoId) {
          await apiRequest(`/legajo-rangos/${ids.rangoId}`, {
            method: "PUT",
            body: JSON.stringify(payloadRango),
          });
        } else {
          await apiRequest(`/legajos/${legajoId}/rangos`, {
            method: "POST",
            body: JSON.stringify(payloadRango),
          });
        }
      }

      if (sede.sede_id && legajoId) {
        const payloadSede = {
          sede_id: Number(sede.sede_id),
          es_autoridad: Boolean(sede.es_autoridad),
          es_sede_base: Boolean(sede.es_sede_base),
          usuario_accion: 1,
        };

        if (ids.sedeId) {
          await apiRequest(`/legajo-sedes/${ids.sedeId}`, {
            method: "PUT",
            body: JSON.stringify(payloadSede),
          });
        } else {
          await apiRequest(`/legajos/${legajoId}/sedes`, {
            method: "POST",
            body: JSON.stringify(payloadSede),
          });
        }
      }

      await guardarContactoPersona({
        personaId: id,
        valor: contactos.email,
        tipoNombre: "email",
        tipoPrincipal: true,
        contactoId: ids.emailContactoId,
        tiposContacto,
      });

      await guardarContactoPersona({
        personaId: id,
        valor: contactos.celular,
        tipoNombre: "celular",
        tipoPrincipal: false,
        contactoId: ids.celularContactoId,
        tiposContacto,
      });

      setMensaje("Cambios guardados correctamente");
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
    persona,
    legajo,
    datosMedicos,
    rango,
    sede,
    contactos,
    ids,
    tiposDocumento,
    tiposContacto,
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
    cambiarPersona,
    cambiarLegajo,
    cambiarDatosMedicos,
    cambiarRango,
    cambiarSede,
    cambiarContactos,
    guardarCambios,
  };
}

function obtenerIdRespuesta(respuesta) {
  return respuesta?.data?.id || respuesta?.data?.legajo_id;
}

async function guardarContactoPersona({
  personaId,
  valor,
  tipoNombre,
  tipoPrincipal,
  contactoId,
  tiposContacto,
}) {
  const contacto = valor.trim();

  if (!contacto && contactoId) {
    await contactosService.eliminar(contactoId);
    return;
  }

  if (!contacto) {
    return;
  }

  const tipoContacto = obtenerTipoContacto(tiposContacto, tipoNombre);
  if (!tipoContacto) {
    throw new Error(`No existe el tipo de contacto ${tipoNombre} en la base.`);
  }

  const payload = {
    persona_id: Number(personaId),
    tipo_contacto_id: Number(tipoContacto.id),
    principal: Boolean(tipoPrincipal),
    contacto,
    usuario_accion: 1,
  };

  if (contactoId) {
    await contactosService.actualizar(contactoId, payload);
  } else {
    await contactosService.crear(payload);
  }
}

function validarContactos(contactos) {
  const email = contactos.email.trim();
  const celular = contactos.celular.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexCelular = /^[0-9+\-\s()]{6,20}$/;

  if (email && !regexEmail.test(email)) {
    return "Ingresa un email valido";
  }

  if (celular && !regexCelular.test(celular)) {
    return "Ingresa un celular valido";
  }

  return "";
}

function obtenerTipoContacto(tiposContacto, nombre) {
  const nombreNormalizado = normalizarTexto(nombre);
  return tiposContacto.find((tipo) => {
    const tipoNormalizado = normalizarTexto(tipo.tipo || tipo.descripcion || "");
    return tipoNormalizado === nombreNormalizado;
  });
}

function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];
  if (primerCampo && Array.isArray(errores[primerCampo])) return errores[primerCampo][0];
  return err.message || "No se pudo completar la operacion";
}
