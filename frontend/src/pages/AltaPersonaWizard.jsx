import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ClipboardPlus,
  FileText,
  HeartPulse,
  IdCard,
  Mail,
  MapPinned,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { contactosService } from "../services/contactosService";
import { personasService } from "../services/personasService";
import { datosMedicosService } from "../services/datosMedicosService";
import { legajoRangosService } from "../services/legajoRangosService";
import { legajoSedesService } from "../services/legajoSedesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";

const pasos = [
  { id: 1, titulo: "Persona", icono: User },
  { id: 2, titulo: "Legajo", icono: FileText },
  { id: 3, titulo: "Datos del legajo", icono: HeartPulse },
  { id: 4, titulo: "Usuario", icono: ShieldCheck },
  { id: 5, titulo: "Resumen", icono: CheckCircle2 },
];

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

function AltaPersonaWizard() {
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

  function cambiarDatosLegajo(e) {
    const { name, value, type, checked } = e.target;
    setDatosLegajo({
      ...datosLegajo,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function cambiarContactos(e) {
    const { name, value } = e.target;
    setContactos({ ...contactos, [name]: value });
  }

  function cambiarUsuario(e) {
    const { name, value, type, checked } = e.target;
    setUsuario({
      ...usuario,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function guardarPersona(e) {
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

    setError("");
    setPasoActual(2);
  }

  function guardarLegajo(e) {
    e.preventDefault();

    if (!legajo.numero.trim()) {
      setError("El numero de legajo es obligatorio.");
      return;
    }

    setError("");
    setPasoActual(3);
  }

  function guardarDatosDelLegajo(e) {
    e.preventDefault();

    const mensajeContactos = validarContactos(contactos);

    if (mensajeContactos) {
      setError(mensajeContactos);
      return;
    }

    if (
      (datosMedicos.grupo_sanguineo && !datosMedicos.seguro.trim()) ||
      (!datosMedicos.grupo_sanguineo && datosMedicos.seguro.trim())
    ) {
      setError(
        "Para guardar datos medicos completa grupo sanguineo y seguro.",
      );
      return;
    }

    if (
      contactos.email.trim() &&
      !obtenerTipoContacto(tiposContacto, "email")
    ) {
      setError("No existe el tipo de contacto Email en la base.");
      return;
    }

    if (
      contactos.celular.trim() &&
      !obtenerTipoContacto(tiposContacto, "celular")
    ) {
      setError("No existe el tipo de contacto Celular en la base.");
      return;
    }

    setError("");
    setPasoActual(4);
  }

  function guardarUsuario(e) {
    e.preventDefault();

    setError("");
    setPasoActual(5);
  }

  async function confirmarAltaPersona() {
    if (guardando || personaId) {
      return;
    }

    try {
      setGuardando(true);
      setError("");

      const respuestaPersona = await personasService.crear({
        td_id: Number(persona.td_id),
        numero_doc: Number(persona.numero_doc),
        nombre: persona.nombre.trim(),
        apellido: persona.apellido.trim(),
        usuario_accion: 1,
      });

      const nuevaPersonaId = obtenerIdRespuesta(respuestaPersona);

      if (!nuevaPersonaId) {
        throw new Error("No se recibio el ID de la persona creada.");
      }

      const respuestaLegajo = await apiRequest(
        `/personas/${nuevaPersonaId}/legajo`,
        {
          method: "POST",
          body: JSON.stringify({
            numero: legajo.numero.trim(),
            usuario_accion: 1,
          }),
        },
      );

      const nuevoLegajoId = obtenerIdRespuesta(respuestaLegajo);

      if (!nuevoLegajoId) {
        throw new Error("No se recibio el ID del legajo creado.");
      }

      if (datosMedicos.grupo_sanguineo && datosMedicos.seguro.trim()) {
        await apiRequest(`/personas/${nuevaPersonaId}/datos-medicos`, {
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
        await apiRequest(`/legajos/${nuevoLegajoId}/rangos`, {
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
        await apiRequest(`/legajos/${nuevoLegajoId}/sedes`, {
          method: "POST",
          body: JSON.stringify({
            sede_id: Number(datosLegajo.sede_id),
            es_autoridad: Boolean(datosLegajo.es_autoridad),
            es_sede_base: Boolean(datosLegajo.es_sede_base),
            usuario_accion: 1,
          }),
        });
      }

      if (contactos.email.trim()) {
        const tipoEmail = obtenerTipoContacto(tiposContacto, "email");

        await contactosService.crear({
          persona_id: Number(nuevaPersonaId),
          tipo_contacto_id: Number(tipoEmail.id),
          principal: true,
          contacto: contactos.email.trim(),
          usuario_accion: 1,
        });
      }

      if (contactos.celular.trim()) {
        const tipoCelular = obtenerTipoContacto(tiposContacto, "celular");

        await contactosService.crear({
          persona_id: Number(nuevaPersonaId),
          tipo_contacto_id: Number(tipoCelular.id),
          principal: false,
          contacto: contactos.celular.trim(),
          usuario_accion: 1,
        });
      }

      setPersonaId(nuevaPersonaId);
      setLegajoId(nuevoLegajoId);
      setResultadoUsuario({
        mensaje: usuario.crear_usuario
          ? "Pendiente de conectar Login"
          : "No solicitado",
      });

      alert("Persona guardada correctamente.");
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setGuardando(false);
    }
  }

  const personaResumen = useMemo(() => {
    return `${persona.apellido || "-"}, ${persona.nombre || "-"}`;
  }, [persona]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div>
              <p className="text-sm font-bold text-red-700 uppercase">
                Alta guiada
              </p>
              <h1 className="text-4xl font-extrabold text-slate-800 mt-2">
                Persona, legajo y usuario
              </h1>
              <p className="text-slate-500 mt-2">
                Completa todos los pasos. Los datos se guardan al confirmar el
                resumen.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 min-w-64">
              <p className="text-xs font-bold text-slate-400 uppercase">
                Progreso
              </p>
              <p className="text-slate-800 font-bold mt-1">
                Persona ID: {personaId || "pendiente"}
              </p>
              <p className="text-slate-800 font-bold mt-1">
                Legajo ID: {legajoId || "pendiente"}
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-start">
              {pasos.map((paso, index) => (
                <PasoIndicador
                  key={paso.id}
                  paso={paso}
                  activo={pasoActual === paso.id}
                  completo={pasoActual > paso.id}
                  ultimo={index === pasos.length - 1}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-sm font-bold text-slate-500 md:hidden">
              Paso {pasoActual}: {pasos.find((paso) => paso.id === pasoActual)?.titulo}
            </p>
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          {pasoActual === 1 && (
            <form onSubmit={guardarPersona} className="space-y-6">
              <TituloPaso
                icono={<User size={26} />}
                titulo="Datos de la persona"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              </div>
              <Acciones guardando={guardando} texto="Continuar" />
            </form>
          )}

          {pasoActual === 2 && (
            <form onSubmit={guardarLegajo} className="space-y-6">
              <TituloPaso
                icono={<FileText size={26} />}
                titulo="Datos del legajo"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CampoSoloLectura
                  label="Persona cargada"
                  value={personaResumen}
                />
                <CampoTexto
                  label="Numero de legajo"
                  name="numero"
                  value={legajo.numero}
                  onChange={cambiarLegajo}
                  placeholder="Ej: 1001"
                />
              </div>
              <Acciones
                guardando={guardando}
                texto="Continuar"
                onBack={() => setPasoActual(1)}
              />
            </form>
          )}

          {pasoActual === 3 && (
            <form onSubmit={guardarDatosDelLegajo} className="space-y-8">
              <TituloPaso
                icono={<ClipboardPlus size={26} />}
                titulo="Datos asociados"
              />

              <div>
                <h2 className="text-xl font-extrabold text-slate-800 mb-4">
                  Datos medicos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CampoSelectSimple
                    label="Grupo sanguineo"
                    name="grupo_sanguineo"
                    value={datosMedicos.grupo_sanguineo}
                    onChange={cambiarDatosMedicos}
                    opciones={[
                      "A+",
                      "A-",
                      "B+",
                      "B-",
                      "AB+",
                      "AB-",
                      "O+",
                      "O-",
                    ]}
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
                </div>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-800 mb-4">
                  Contactos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                </div>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-slate-800 mb-4">
                  Rango y sede
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <CampoSelect
                    label="Rango"
                    name="rangos_institucionales_id"
                    value={datosLegajo.rangos_institucionales_id}
                    onChange={cambiarDatosLegajo}
                    opciones={rangos}
                    getLabel={(rango) =>
                      `${rango.descripcion} - Nivel ${rango.nivel_jerarquia}`
                    }
                  />
                  <CampoSelect
                    label="Sede"
                    name="sede_id"
                    value={datosLegajo.sede_id}
                    onChange={cambiarDatosLegajo}
                    opciones={sedes}
                    getLabel={(sede) => sede.nombre}
                  />
                  <CampoCheckbox
                    label="Es autoridad"
                    name="es_autoridad"
                    checked={datosLegajo.es_autoridad}
                    onChange={cambiarDatosLegajo}
                  />
                  <CampoCheckbox
                    label="Es sede base"
                    name="es_sede_base"
                    checked={datosLegajo.es_sede_base}
                    onChange={cambiarDatosLegajo}
                  />
                </div>
              </div>

              <Acciones
                guardando={guardando}
                texto="Continuar"
                onBack={() => setPasoActual(2)}
              />
            </form>
          )}

          {pasoActual === 4 && (
            <form onSubmit={guardarUsuario} className="space-y-6">
              <TituloPaso
                icono={<ShieldCheck size={26} />}
                titulo="Usuario de acceso"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <CampoTexto
                  label="Rol solicitado"
                  name="rol"
                  value={usuario.rol}
                  onChange={cambiarUsuario}
                  placeholder="Ej: bombero"
                />
                <CampoCheckbox
                  label="Solicitar usuario al microservicio Login"
                  name="crear_usuario"
                  checked={usuario.crear_usuario}
                  onChange={cambiarUsuario}
                />
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 text-yellow-800 font-semibold">
                Este paso queda en modo pendiente/mock hasta conectar el
                microservicio de usuarios.
              </div>
              <Acciones
                guardando={false}
                texto="Ir al resumen"
                onBack={() => setPasoActual(3)}
              />
            </form>
          )}

          {pasoActual === 5 && (
            <section className="space-y-6">
              <TituloPaso
                icono={<CheckCircle2 size={26} />}
                titulo="Resumen del alta"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ResumenItem
                  icono={<User size={24} />}
                  titulo="Persona"
                  texto={`${personaResumen} - ID ${personaId || "pendiente de guardar"}`}
                />
                <ResumenItem
                  icono={<IdCard size={24} />}
                  titulo="Legajo"
                  texto={`Numero ${legajo.numero} - ID ${legajoId || "pendiente de guardar"}`}
                />
                <ResumenItem
                  icono={<HeartPulse size={24} />}
                  titulo="Datos medicos"
                  texto={
                    datosMedicos.grupo_sanguineo
                      ? "Cargados o solicitados"
                      : "Omitidos"
                  }
                />
                <ResumenItem
                  icono={<MapPinned size={24} />}
                  titulo="Rango y sede"
                  texto="Se guardaran si fueron seleccionados"
                />
                <ResumenItem
                  icono={<Phone size={24} />}
                  titulo="Contactos"
                  texto={
                    contactos.email || contactos.celular
                      ? `${contactos.email || "Sin email"} - ${contactos.celular || "Sin celular"}`
                      : "Omitidos"
                  }
                />
                <ResumenItem
                  icono={<ShieldCheck size={24} />}
                  titulo="Usuario"
                  texto={resultadoUsuario?.mensaje || "Pendiente"}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={confirmarAltaPersona}
                  disabled={guardando || Boolean(personaId)}
                  className="px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"
                >
                  {guardando
                    ? "Guardando..."
                    : personaId
                      ? "Alta guardada"
                      : "Confirmar y guardar"}
                </button>
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  );
}

function PasoIndicador({ paso, activo, completo, ultimo }) {
  const resaltado = activo || completo;

  return (
    <div className="flex flex-1 items-start">
      <div className="flex flex-col items-center min-w-12">
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-extrabold border-2 transition ${
            resaltado
              ? "bg-red-700 border-red-700 text-white shadow-sm"
              : "bg-slate-100 border-slate-300 text-slate-400"
          }`}
        >
          {paso.id}
        </div>
        <p
          className={`hidden md:block mt-2 text-xs font-extrabold text-center ${
            resaltado ? "text-red-700" : "text-slate-400"
          }`}
        >
          {paso.titulo}
        </p>
      </div>

      {!ultimo && (
        <div
          className={`h-1 flex-1 rounded-full mt-5 transition ${
            completo ? "bg-red-700" : "bg-slate-200"
          }`}
        />
      )}
    </div>
  );
}

function TituloPaso({ icono, titulo }) {
  return (
    <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
      <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
        {icono}
      </div>
      <h2 className="text-2xl font-extrabold text-slate-800">{titulo}</h2>
    </div>
  );
}

function CampoTexto({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  icono,
}) {
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

function CampoSoloLectura({ label, value }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <div className="min-h-14 border border-slate-200 rounded-xl px-4 py-4 bg-slate-50 text-slate-700 font-bold">
        {value}
      </div>
    </div>
  );
}

function Acciones({ guardando, texto, onBack }) {
  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
        >
          Volver
        </button>
      )}
      <button
        type="submit"
        disabled={guardando}
        className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
      >
        <Save size={22} />
        {guardando ? "Guardando..." : texto}
      </button>
    </div>
  );
}

function ResumenItem({ icono, titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <div className="text-red-700 mb-3">{icono}</div>
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

function obtenerIdRespuesta(respuesta) {
  return (
    respuesta?.data?.id ||
    respuesta?.data?.persona_id ||
    respuesta?.data?.legajo_id
  );
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

export default AltaPersonaWizard;
