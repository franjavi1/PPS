import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { User, FileText, HeartPulse, ShieldAlert, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { contactosService } from "../services/contactosService";
import { personasService } from "../services/personasService";
import { datosMedicosService } from "../services/datosMedicosService";
import { legajoRangosService } from "../services/legajoRangosService";
import { legajoSedesService } from "../services/legajoSedesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import StepPersona from "../components/AltaPersonaWizard/StepPersona";
import StepLegajo from "../components/AltaPersonaWizard/StepLegajo";
import StepDatosLegajo from "../components/AltaPersonaWizard/StepDatosLegajo";
import StepUsuario from "../components/AltaPersonaWizard/StepUsuario";
import StepResumen from "../components/AltaPersonaWizard/StepResumen";

const pasos = [
  { id: 1, titulo: "Persona", icono: User },
  { id: 2, titulo: "Legajo", icono: FileText },
  { id: 3, titulo: "Datos Legajo", icono: HeartPulse },
  { id: 4, titulo: "Usuario", icono: ShieldAlert },
  { id: 5, titulo: "Resumen", icono: CheckCircle2 },
];

const personaInicial = { td_id: "", numero_doc: "", nombre: "", apellido: "" };
const legajoInicial = { numero: "" };
const datosMedicosInicial = { grupo_sanguineo: "", alergias: "", aptitud_fisica: false, seguro: "" };
const datosLegajoInicial = { rangos_institucionales_id: "", Sede_id: "", es_autoridad: false, es_sede_base: true };
const contactosInicial = { email: "", celular: "" };
const usuarioInicial = { rol: "bombero", crear_usuario: true };

export default function AltaPersonaWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || "invitado";

  // Declaramos el estado de control numérico
  const [paso, setPaso] = useState(1);
  const [personaId, setPersonaId] = useState(null);
  const [legajoId, setLegajoId] = useState(null);
  const [persona, setPersona] = useState(personaInicial);
  const [legajo, setLegajo] = useState(legajoInicial);
  const [datosMedicos, setDatosMedicos] = useState(datosMedicosInicial);
  const [datosLegajo, setDatosLegajo] = useState(datosLegajoInicial);
  const [contactos, setContactos] = useState(contactosInicial);
  const [usuario, setUsuario] = useState(usuarioInicial);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tiposLegajo, setTiposLegajo] = useState([]);
  const [tiposLegajoSeleccionados, setTiposLegajoSeleccionados] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [resultadoUsuario, setResultadoUsuario] = useState(null);

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      const [respuestaTipos, respuestaRangos, respuestaSedes, respuestaTLegajos] = await Promise.all([
        apiRequest("/tipos-documentos"),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
        apiRequest("/tipos-legajo"),
      ]);
      setTiposDocumento(respuestaTipos.data || []);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
      setTiposLegajo(respuestaTLegajos.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function handleTipoLegajoChange(id) {
    setTiposLegajoSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }

  const personaResumen = useMemo(() => `${persona.apellido}, ${persona.nombre}`, [persona]);

  async function guardarPersona(e) {
    e.preventDefault();
    if (!persona.nombre || !persona.apellido || !persona.numero_doc || !persona.td_id) return setError("Complete los campos obligatorios");
    setError("");
    setPaso(2);
  }

  async function guardarLegajo(e) {
    e.preventDefault();
    if (!legajo.numero) return setError("El número de legajo es obligatorio");
    if (tiposLegajoSeleccionados.length === 0) return setError("Debe seleccionar al menos un tipo de legajo");
    setError("");
    setPaso(3);
  }

  async function guardarDatosDelLegajo(e) {
    e.preventDefault();
    setError("");
    setPaso(4);
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    try {
      setGuardando(true); setError("");
      
      // Step 1: Create Persona
      const resPersona = await personasService.crear({
        td_id: Number(persona.td_id),
        numero_doc: persona.numero_doc,
        nombre: persona.nombre,
        apellido: persona.apellido,
        usuario_accion: 1,
      });
      const createdPersonaId = resPersona.data.id;
      setPersonaId(createdPersonaId);

      // Step 2: Create Legajo
      const resLegajo = await apiRequest("/legajos", {
        method: "POST",
        body: JSON.stringify({
          persona_id: Number(createdPersonaId),
          numero: String(legajo.numero).trim(),
          usuario_accion: 1,
          tipo_legajo_ids: tiposLegajoSeleccionados
        }),
      });
      const createdLegajoId = resLegajo.data.id;
      setLegajoId(createdLegajoId);

      // Step 3: Create associated records
      const promesas = [];
      if (datosMedicos.grupo_sanguineo) {
        promesas.push(datosMedicosService.crear({
          legajo_id: Number(createdLegajoId),
          grupo_sanguineo: datosMedicos.grupo_sanguineo,
          alergias: datosMedicos.alergias,
          aptitud_fisica: datosMedicos.aptitud_fisica,
          seguro: datosMedicos.seguro,
          usuario_accion: 1
        }));
      }
      if (contactos.email || contactos.celular) {
        promesas.push(contactosService.crear({
          persona_id: Number(createdPersonaId),
          email: contactos.email,
          celular: contactos.celular,
          usuario_accion: 1
        }));
      }
      if (datosLegajo.rangos_institucionales_id) {
        promesas.push(legajoRangosService.crear({
          legajo_id: Number(createdLegajoId),
          rangos_institucionales_id: Number(datosLegajo.rangos_institucionales_id),
          es_autoridad: datosLegajo.es_autoridad,
          usuario_accion: 1
        }));
      }
      if (datosLegajo.sede_id) {
        promesas.push(legajoSedesService.crear({
          legajo_id: Number(createdLegajoId),
          sede_id: Number(datosLegajo.sede_id),
          es_sede_base: datosLegajo.es_sede_base,
          usuario_accion: 1
        }));
      }
      await Promise.all(promesas);

      if (usuario.crear_usuario) {
        setResultadoUsuario({ mensaje: "Usuario 'bombero' solicitado con éxito" });
      }
      setPaso(5);
    } catch (err) {
      setError(err.message || "Error al registrar toda la información");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 pb-12">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          
          {/* Encabezado Principal (Header) */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center shadow-xs">
                <User size={28} />
              </div>
              <div>
                <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Alta de Personal</h1>
                <p className="text-slate-500 text-sm mt-1">Asistente por pasos para dar de alta un legajo de bombero completo.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/legajos")}
              className="border border-slate-300 px-4 py-2 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition"
            >
              ← Volver al listado
            </button>
          </div>

          {/* Barra de Progreso del Stepper */}
          <div className="flex items-center justify-between mb-10 relative px-4">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 -z-10" />
            {pasos.map((p) => {
              const activo = paso === p.id;
              const completado = paso > p.id;
              const Icono = p.icono;
              return (
                <div key={p.id} className="flex flex-col items-center flex-1 relative bg-white px-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    activo || completado ? "bg-red-700 text-white shadow-md scale-110" : "bg-slate-100 border border-slate-200 text-slate-400"
                  }`}>
                    <Icono size={18} />
                  </div>
                  <span className={`text-[10px] mt-2 font-bold transition-colors duration-300 ${
                    activo || completado ? "text-red-700 font-extrabold" : "text-slate-450"
                  }`}>
                    {p.id}. {p.titulo}
                  </span>
                </div>
              );
            })}
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Cuerpo del Formulario Activo */}
          <div className="space-y-6">
            {paso === 1 && <StepPersona persona={persona} cambiarPersona={(e) => setPersona({ ...persona, [e.target.name]: e.target.value })} tiposDocumento={tiposDocumento} guardando={guardando} guardarPersona={guardarPersona} />}
            {paso === 2 && (
              <StepLegajo
                personaResumen={personaResumen}
                personaId={personaId}
                legajo={legajo}
                cambiarLegajo={(e) => setLegajo({ ...legajo, [e.target.name]: e.target.value })}
                guardando={guardando}
                guardarLegajo={guardarLegajo}
                onBack={() => setPaso(1)}
                tiposLegajo={tiposLegajo}
                tiposLegajoSeleccionados={tiposLegajoSeleccionados}
                onTipoLegajoChange={handleTipoLegajoChange}
              />
            )}
            {paso === 3 && <StepDatosLegajo datosMedicos={datosMedicos} cambiarDatosMedicos={(e) => setDatosMedicos({ ...datosMedicos, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })} contactos={contactos} cambiarContactos={(e) => setContactos({ ...contactos, [e.target.name]: e.target.value })} datosLegajo={datosLegajo} cambiarDatosLegajo={(e) => setDatosLegajo({ ...datosLegajo, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })} rangos={rangos} sedes={sedes} guardando={guardando} guardarDatosDelLegajo={guardarDatosDelLegajo} onBack={() => setPaso(2)} />}
            {paso === 4 && <StepUsuario usuario={usuario} cambiarUsuario={(e) => setUsuario({ ...usuario, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })} guardarUsuario={guardarUsuario} onBack={() => setPaso(3)} />}
            {paso === 5 && <StepResumen personaResumen={personaResumen} personaId={personaId} legajo={legajo} legajoId={legajoId} datosMedicos={datosMedicos} contactos={contactos} resultadoUsuario={resultadoUsuario} />}
          </div>

        </section>
      </main>
    </div>
  );
}
