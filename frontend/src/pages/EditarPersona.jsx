import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, ChevronDown, FileText, HeartPulse, IdCard, Mail, MapPinned, Phone, Save, User } from "lucide-react";
import Navbar from "../components/Navbar";
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

function EditarPersona() {
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
        (item) => Number(item.persona_id) === Number(id),
      );
      const datosMedicosData = (respuestaDatosMedicos.data || []).find(
        (item) => Number(item.persona_id) === Number(id),
      );
      const rangoData = legajoData
        ? (respuestaRangosAsignados.data || []).find(
            (item) => Number(item.legajo_id) === Number(legajoData.id),
          )
        : null;
      const sedeData = legajoData
        ? (respuestaSedesAsignadas.data || []).find(
            (item) => Number(item.legajo_id) === Number(legajoData.id),
          )
        : null;
      const tiposContactoData = respuestaTiposContacto.data || [];
      const tipoEmail = obtenerTipoContacto(tiposContactoData, "email");
      const tipoCelular = obtenerTipoContacto(tiposContactoData, "celular");
      const contactoEmailData = (respuestaContactos.data || []).find(
        (item) =>
          Number(item.persona_id) === Number(id) &&
          Number(item.tipo_contacto_id) === Number(tipoEmail?.id),
      );
      const contactoCelularData = (respuestaContactos.data || []).find(
        (item) =>
          Number(item.persona_id) === Number(id) &&
          Number(item.tipo_contacto_id) === Number(tipoCelular?.id),
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
    setPersona({ ...persona, [name]: value });
  }

  function cambiarLegajo(e) {
    const { name, value } = e.target;
    setLegajo({ ...legajo, [name]: value });
  }

  function cambiarDatosMedicos(e) {
    const { name, value, type, checked } = e.target;
    setDatosMedicos({
      ...datosMedicos,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function cambiarRango(e) {
    const { name, value } = e.target;
    setRango({ ...rango, [name]: value });
  }

  function cambiarSede(e) {
    const { name, value, type, checked } = e.target;
    setSede({
      ...sede,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function cambiarContactos(e) {
    const { name, value } = e.target;
    setContactos({ ...contactos, [name]: value });
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

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <User size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">
                  Edicion
                </p>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-1">
                  Editar persona
                </h1>
                <p className="text-slate-500 mt-2">
                  Modifica persona, legajo, datos medicos, rango y sede.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/personas")}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          {mensaje && (
            <div className="mb-6 border border-green-200 bg-green-50 text-green-700 rounded-xl px-5 py-4 font-semibold">
              {mensaje}
            </div>
          )}

          {cargando ? (
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-slate-500 font-semibold">
              Cargando persona...
            </div>
          ) : (
            <form onSubmit={guardarCambios} className="space-y-8">
              <Seccion
                id="persona"
                icono={<IdCard size={23} />}
                titulo="Datos personales"
                abierta={seccionAbierta === "persona"}
                onToggle={setSeccionAbierta}
              >
                <CampoSelect
                  label="Tipo de documento"
                  name="td_id"
                  value={persona.td_id}
                  onChange={cambiarPersona}
                  opciones={tiposDocumento}
                  getLabel={(tipo) => tipo.descripcion}
                />
                <CampoTexto
                  label="Numero de documento"
                  name="numero_doc"
                  type="number"
                  value={persona.numero_doc}
                  onChange={cambiarPersona}
                  placeholder="Ej: 30123456"
                />
                <CampoTexto
                  label="Nombre"
                  name="nombre"
                  value={persona.nombre}
                  onChange={cambiarPersona}
                  placeholder="Ej: Juan"
                />
                <CampoTexto
                  label="Apellido"
                  name="apellido"
                  value={persona.apellido}
                  onChange={cambiarPersona}
                  placeholder="Ej: Perez"
                />
              </Seccion>

              <Seccion
                id="legajo"
                icono={<FileText size={23} />}
                titulo="Legajo"
                abierta={seccionAbierta === "legajo"}
                onToggle={setSeccionAbierta}
              >
                <CampoTexto
                  label="Numero de legajo"
                  name="numero"
                  value={legajo.numero}
                  onChange={cambiarLegajo}
                  placeholder="Ej: 1001"
                />
              </Seccion>

              <Seccion
                id="datos-medicos"
                icono={<HeartPulse size={23} />}
                titulo="Datos medicos"
                abierta={seccionAbierta === "datos-medicos"}
                onToggle={setSeccionAbierta}
              >
                <CampoSelectSimple
                  label="Grupo sanguineo"
                  name="grupo_sanguineo"
                  value={datosMedicos.grupo_sanguineo}
                  onChange={cambiarDatosMedicos}
                  opciones={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
                />
                <CampoTexto
                  label="Seguro"
                  name="seguro"
                  value={datosMedicos.seguro}
                  onChange={cambiarDatosMedicos}
                  placeholder="Ej: OSDE"
                />
                <CampoTexto
                  label="Alergias"
                  name="alergias"
                  value={datosMedicos.alergias}
                  onChange={cambiarDatosMedicos}
                  placeholder="Ej: Penicilina"
                />
                <CampoCheckbox
                  label="Aptitud fisica"
                  name="aptitud_fisica"
                  checked={datosMedicos.aptitud_fisica}
                  onChange={cambiarDatosMedicos}
                />
              </Seccion>

              <Seccion
                id="contactos"
                icono={<Phone size={23} />}
                titulo="Contactos"
                abierta={seccionAbierta === "contactos"}
                onToggle={setSeccionAbierta}
              >
                <CampoTexto
                  label="Email"
                  name="email"
                  type="email"
                  value={contactos.email}
                  onChange={cambiarContactos}
                  placeholder="Ej: persona@email.com"
                  icono={<Mail size={20} />}
                />
                <CampoTexto
                  label="Celular"
                  name="celular"
                  value={contactos.celular}
                  onChange={cambiarContactos}
                  placeholder="Ej: 3415551234"
                  icono={<Phone size={20} />}
                />
              </Seccion>

              <Seccion
                id="rango-sede"
                icono={<MapPinned size={23} />}
                titulo="Rango y sede"
                abierta={seccionAbierta === "rango-sede"}
                onToggle={setSeccionAbierta}
              >
                <CampoSelect
                  label="Rango"
                  name="rangos_institucionales_id"
                  value={rango.rangos_institucionales_id}
                  onChange={cambiarRango}
                  opciones={rangos}
                  getLabel={(item) => `${item.descripcion} - Nivel ${item.nivel_jerarquia}`}
                />
                <CampoSelect
                  label="Sede"
                  name="sede_id"
                  value={sede.sede_id}
                  onChange={cambiarSede}
                  opciones={sedes}
                  getLabel={(item) => item.nombre}
                />
                <CampoCheckbox
                  label="Es autoridad"
                  name="es_autoridad"
                  checked={sede.es_autoridad}
                  onChange={cambiarSede}
                />
                <CampoCheckbox
                  label="Es sede base"
                  name="es_sede_base"
                  checked={sede.es_sede_base}
                  onChange={cambiarSede}
                />
              </Seccion>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/personas")}
                  className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={guardando}
                  className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
                >
                  <Save size={22} />
                  {guardando ? "Guardando..." : "Guardar cambios"}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}

function Seccion({ id, icono, titulo, abierta, onToggle, children }) {
  return (
    <section className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => onToggle(abierta ? "" : id)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
            {icono}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {titulo}
          </h2>
        </div>
        <ChevronDown
          size={22}
          className={`text-slate-500 transition ${abierta ? "rotate-180" : ""}`}
        />
      </button>

      {abierta && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 p-5">
          {children}
        </div>
      )}
    </section>
  );
}

function CampoTexto({ label, name, value, onChange, placeholder, type = "text", icono }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {icono && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full h-14 border border-slate-300 rounded-xl pr-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
            icono ? "pl-12" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

function CampoSelect({ label, name, value, onChange, opciones, getLabel }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <option value="">Seleccione una opcion</option>
        {opciones.map((opcion) => (
          <option key={opcion.id} value={opcion.id}>
            {getLabel(opcion)}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoSelectSimple({ label, name, value, onChange, opciones }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      >
        <option value="">Seleccione una opcion</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}

function CampoCheckbox({ label, name, checked, onChange }) {
  return (
    <label className="h-14 flex items-center gap-3 border border-slate-300 rounded-xl px-4 text-slate-700 font-bold">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 accent-red-700"
      />
      {label}
    </label>
  );
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

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo completar la operacion";
}

export default EditarPersona;
