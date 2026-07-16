import { useEffect, useMemo, useState } from "react";
import { User, FileText, HeartPulse, ShieldCheck, CheckCircle2, ClipboardPlus } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
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
  { id: 3, titulo: "Datos del legajo", icono: HeartPulse },
  { id: 4, titulo: "Usuario", icono: ShieldCheck },
  { id: 5, titulo: "Resumen", icono: CheckCircle2 },
];

const personaInicial = { td_id: "", numero_doc: "", nombre: "", apellido: "" };
const legajoInicial = { numero: "" };
const datosMedicosInicial = { grupo_sanguineo: "", alergias: "", aptitud_fisica: false, seguro: "" };
const datosLegajoInicial = { rangos_institucionales_id: "", Sede_id: "", es_autoridad: false, es_sede_base: true };
const contactosInicial = { email: "", celular: "" };
const usuarioInicial = { rol: "bombero", crear_usuario: true };

export default function AltaPersonaWizard() {
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
      const [respuestaTipos, respuestaRangos, respuestaSedes] = await Promise.all([
        apiRequest("/tipos-documentos"),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);
      setTiposDocumento(respuestaTipos.data || []);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const personaResumen = useMemo(() => `${persona.apellido}, ${persona.nombre}`, [persona]);

  async function guardarPersona(e) {
    e.preventDefault();
    if (!persona.nombre || !persona.apellido || !persona.numero_doc || !persona.td_id) {
      return setError("Complete los campos obligatorios de la persona");
    }
    try {
      setGuardando(true);
      setError("");
      const res = await personasService.crear({
        td_id: Number(persona.td_id),
        numero_doc: persona.numero_doc,
        nombre: persona.nombre,
        apellido: persona.apellido,
        usuario_accion: 1,
      });
      setPersonaId(res.data.id);
      setPasoActual(2);
    } catch (err) {
      setError(err.message || "Error al crear persona");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarLegajo(e) {
    e.preventDefault();
    if (!legajo.numero) return setError("El número de legajo es obligatorio");
    try {
      setGuardando(true);
      setError("");
      const res = await apiRequest("/legajos", {
        method: "POST",
        body: JSON.stringify({
          persona_id: Number(personaId),
          numero: String(legajo.numero).trim(),
          usuario_accion: 1,
        }),
      });
      setLegajoId(res.data.id);
      setPasoActual(3);
    } catch (err) {
      setError(err.message || "Error al crear legajo");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarDatosDelLegajo(e) {
    e.preventDefault();
    try {
      setGuardando(true);
      setError("");
      const promesas = [];
      if (datosMedicos.grupo_sanguineo) {
        promesas.push(
          datosMedicosService.crear({
            legajo_id: Number(legajoId),
            grupo_sanguineo: datosMedicos.grupo_sanguineo,
            alergias: datosMedicos.alergias,
            aptitud_fisica: datosMedicos.aptitud_fisica,
            seguro: datosMedicos.seguro,
            usuario_accion: 1,
          })
        );
      }
      if (contactos.email || contactos.celular) {
        promesas.push(
          contactosService.crear({
            persona_id: Number(personaId),
            email: contactos.email,
            celular: contactos.celular,
            usuario_accion: 1,
          })
        );
      }
      if (datosLegajo.rangos_institucionales_id) {
        promesas.push(
          legajoRangosService.crear({
            legajo_id: Number(legajoId),
            rangos_institucionales_id: Number(datosLegajo.rangos_institucionales_id),
            es_autoridad: datosLegajo.es_autoridad,
            usuario_accion: 1,
          })
        );
      }
      if (datosLegajo.sede_id) {
        promesas.push(
          legajoSedesService.crear({
            legajo_id: Number(legajoId),
            sede_id: Number(datosLegajo.sede_id),
            es_sede_base: datosLegajo.es_sede_base,
            usuario_accion: 1,
          })
        );
      }
      await Promise.all(promesas);
      setPasoActual(4);
    } catch (err) {
      setError(err.message || "Error al guardar los datos asociados");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarUsuario(e) {
    e.preventDefault();
    if (usuario.crear_usuario) {
      setResultadoUsuario({ mensaje: "Usuario 'bombero' solicitado con éxito" });
    }
    setPasoActual(5);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex items-center gap-6 border-b border-slate-200 pb-8 mb-8">
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-slate-800">Alta de persona</h1>
              <p className="text-slate-500 mt-2">Wizard paso a paso para dar de alta un bombero completo.</p>
            </div>
          </div>

          <div className="flex gap-4 border-b border-slate-200 pb-8 mb-8 overflow-x-auto">
            {pasos.map((paso) => {
              const Icon = paso.icono;
              const resaltado = pasoActual >= paso.id;
              return (
                <div key={paso.id} className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${resaltado ? "bg-red-700 text-white" : "bg-slate-100 text-slate-400"}`}>
                    {paso.id}
                  </span>
                  <span className={`text-sm font-bold hidden sm:inline ${resaltado ? "text-slate-800" : "text-slate-400"}`}>{paso.titulo}</span>
                </div>
              );
            })}
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {pasoActual === 1 && (
            <StepPersona
              persona={persona}
              cambiarPersona={(e) => setPersona({ ...persona, [e.target.name]: e.target.value })}
              tiposDocumento={tiposDocumento}
              guardando={guardando}
              guardarPersona={guardarPersona}
            />
          )}
          {pasoActual === 2 && (
            <StepLegajo
              personaResumen={personaResumen}
              personaId={personaId}
              legajo={legajo}
              cambiarLegajo={(e) => setLegajo({ ...legajo, [e.target.name]: e.target.value })}
              guardando={guardando}
              guardarLegajo={guardarLegajo}
              onBack={() => setPasoActual(1)}
            />
          )}
          {pasoActual === 3 && (
            <StepDatosLegajo
              datosMedicos={datosMedicos}
              cambiarDatosMedicos={(e) => setDatosMedicos({ ...datosMedicos, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })}
              contactos={contactos}
              cambiarContactos={(e) => setContactos({ ...contactos, [e.target.name]: e.target.value })}
              datosLegajo={datosLegajo}
              cambiarDatosLegajo={(e) => setDatosLegajo({ ...datosLegajo, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })}
              rangos={rangos}
              sedes={sedes}
              guardando={guardando}
              guardarDatosDelLegajo={guardarDatosDelLegajo}
              onBack={() => setPasoActual(2)}
            />
          )}
          {pasoActual === 4 && (
            <StepUsuario
              usuario={usuario}
              cambiarUsuario={(e) => setUsuario({ ...usuario, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })}
              guardarUsuario={guardarUsuario}
              onBack={() => setPasoActual(3)}
            />
          )}
          {pasoActual === 5 && (
            <StepResumen
              personaResumen={personaResumen}
              personaId={personaId}
              legajo={legajo}
              legajoId={legajoId}
              datosMedicos={datosMedicos}
              contactos={contactos}
              resultadoUsuario={resultadoUsuario}
            />
          )}
        </section>
      </main>
    </div>
  );
}
