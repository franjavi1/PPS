import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { ArrowLeft, ChevronDown, FileText, HeartPulse, MapPinned, Phone, Save, User } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { contactosService } from "../services/contactosService";
import { personasService } from "../services/personasService";
import { SeccionPersona, SeccionLegajo, SeccionDatosMedicos, SeccionContactos, SeccionRangoSede } from "../components/EditarPersona/EditarPersonaSections";

const personaInicial = { td_id: "", numero_doc: "", nombre: "", apellido: "" };
const legajoInicial = { numero: "" };
const datosMedicosInicial = { grupo_sanguineo: "", alergias: "", aptitud_fisica: false, seguro: "" };
const rangoInicial = { rangos_institucionales_id: "" };
const sedeInicial = { sede_id: "", es_autoridad: false, es_sede_base: true };
const contactosInicial = { email: "", celular: "" };
const obtenerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

function Seccion({ id, icono, titulo, abierta, onToggle, children }) {
  return (
    <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button type="button" onClick={() => onToggle(abierta ? "" : id)} className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-red-100 text-red-700 flex items-center justify-center">{icono}</div>
          <h2 className="text-xl font-extrabold text-slate-800">{titulo}</h2>
        </div>
        <ChevronDown size={22} className={`text-slate-500 transition ${abierta ? "rotate-180" : ""}`} />
      </button>
      {abierta && <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-200 p-5 bg-white">{children}</div>}
    </section>
  );
}

export default function EditarPersona() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const esVer = !location.pathname.endsWith("/editar");
  // Explicamos el inicio síncrono del componente y cómo consume el rol de sesión con el hook useAuth.
  const { currentUserRole } = useAuth();

  const [persona, setPersona] = useState(personaInicial);
  const [legajo, setLegajo] = useState(legajoInicial);
  const [datosMedicos, setDatosMedicos] = useState(datosMedicosInicial);
  const [rango, setRango] = useState(rangoInicial);
  const [sede, setSede] = useState(sedeInicial);
  const [contactos, setContactos] = useState(contactosInicial);
  const [ids, setIds] = useState({ legajoId: null, datosMedicosId: null, rangoId: null, sedeId: null, emailContactoId: null, celularContactoId: null });
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState("persona");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true); setError("");
      const [resPers, resTipos, resLegs, resMed, resLangs, resLSedes, resConts, resRangos, resSedes] = await Promise.all([
        personasService.obtenerPorId(id), apiRequest("/tipos-documentos"), apiRequest("/legajos"), apiRequest("/datos-medicos"),
        apiRequest("/legajo-rangos"), apiRequest("/legajo-sedes"), contactosService.obtenerTodos(), apiRequest("/rangos-institucionales"), apiRequest("/sedes"),
      ]);
      setTiposDocumento(obtenerLista(resTipos)); setRangos(obtenerLista(resRangos)); setSedes(obtenerLista(resSedes));
      const persData = resPers.data || {};
      setPersona({ td_id: String(persData.td_id || ""), numero_doc: persData.numero_doc || "", nombre: persData.nombre || "", apellido: persData.apellido || "" });
      const leg = obtenerLista(resLegs).find((x) => x.persona_id === Number(id));
      if (leg) {
        setLegajo({ numero: leg.numero || "" }); setIds((prev) => ({ ...prev, legajoId: leg.id }));
        const dm = obtenerLista(resMed).find((x) => x.legajo_id === leg.id);
        if (dm) {
          setDatosMedicos({ grupo_sanguineo: dm.grupo_sanguineo || "", allergies: dm.alergias || "", aptitud_fisica: Boolean(dm.aptitud_fisica), seguro: dm.seguro || "" });
          setIds((prev) => ({ ...prev, datosMedicosId: dm.id }));
        }
        const lr = obtenerLista(resLangs).find((x) => x.legajo_id === leg.id);
        if (lr) {
          setRango({ rangos_institucionales_id: String(lr.rangos_institucionales_id || "") }); setIds((prev) => ({ ...prev, rangoId: lr.id }));
        }
        const ls = obtenerLista(resLSedes).find((x) => x.legajo_id === leg.id);
        if (ls) {
          setSede({ sede_id: String(ls.sede_id || ""), es_autoridad: Boolean(ls.es_autoridad), es_sede_base: Boolean(ls.es_sede_base) }); setIds((prev) => ({ ...prev, sedeId: ls.id }));
        }
      }
      const cList = obtenerLista(resConts).filter((x) => x.persona_id === Number(id));
      const emailC = cList.find((x) => x.tipo_contacto_id === 1);
      const celC = cList.find((x) => x.tipo_contacto_id === 2);
      setContactos({ email: emailC?.contacto || "", celular: celC?.contacto || "" });
      setIds((prev) => ({ ...prev, emailContactoId: emailC?.id || null, celularContactoId: celC?.id || null }));
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  }

  async function guardarCambios(e) {
    e.preventDefault();
    if (!persona.nombre || !persona.apellido || !persona.numero_doc || !persona.td_id) return setError("Complete campos obligatorios");
    try {
      setGuardando(true); setError("");
      await personasService.actualizar(id, { td_id: Number(persona.td_id), numero_doc: String(persona.numero_doc), nombre: persona.nombre, apellido: persona.apellido, usuario_accion: 1 });
      const promesas = [];
      if (ids.legajoId) {
        promesas.push(apiRequest(`/legajos/${ids.legajoId}`, { method: "PUT", body: JSON.stringify({ persona_id: Number(id), numero: String(legajo.numero), usuario_accion: 1 }) }));
        if (datosMedicos.grupo_sanguineo) {
          const bodyMed = { legajo_id: Number(ids.legajoId), grupo_sanguineo: datosMedicos.grupo_sanguineo, alergias: datosMedicos.alergias, aptitud_fisica: datosMedicos.aptitud_fisica ? 1 : 0, seguro: datosMedicos.seguro, usuario_accion: 1 };
          promesas.push(ids.datosMedicosId ? apiRequest(`/datos-medicos/${ids.datosMedicosId}`, { method: "PUT", body: JSON.stringify(bodyMed) }) : apiRequest("/datos-medicos", { method: "POST", body: JSON.stringify(bodyMed) }));
        }
        if (rango.rangos_institucionales_id) {
          const bodyRango = { legajo_id: Number(ids.legajoId), rangos_institucionales_id: Number(rango.rangos_institucionales_id), es_autoridad: sede.es_autoridad ? 1 : 0, usuario_accion: 1 };
          promesas.push(ids.rangoId ? apiRequest(`/legajo-rangos/${ids.rangoId}`, { method: "PUT", body: JSON.stringify(bodyRango) }) : apiRequest("/legajo-rangos", { method: "POST", body: JSON.stringify(bodyRango) }));
        }
        if (sede.sede_id) {
          const bodySede = { legajo_id: Number(ids.legajoId), sede_id: Number(sede.sede_id), es_sede_base: sede.es_sede_base ? 1 : 0, usuario_accion: 1 };
          promesas.push(ids.sedeId ? apiRequest(`/legajo-sedes/${ids.sedeId}`, { method: "PUT", body: JSON.stringify(bodySede) }) : apiRequest("/legajo-sedes", { method: "POST", body: JSON.stringify(bodySede) }));
        }
      }
      const guardarCont = (cId, cVal, tId) => {
        if (!cVal) return;
        const b = { persona_id: Number(id), tipo_contacto_id: tId, contacto: cVal, principal: 1, usuario_accion: 1 };
        promesas.push(cId ? contactosService.actualizar(cId, b) : contactosService.crear(b));
      };
      guardarCont(ids.emailContactoId, contactos.email, 1);
      guardarCont(ids.celularContactoId, contactos.celular, 2);
      await Promise.all(promesas); navigate("/personas");
    } catch (err) {
      setError(err.message || "Error al guardar cambios");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><User size={28} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">
                  {esVer ? "Ver Persona" : "Editar Persona"}
                </h1>
                <p className="text-slate-500 mt-2">
                  {esVer ? "Consulta los datos personales, de legajo y contactos." : "Modifica los datos personales, de legajo y contactos."}
                </p>
              </div>
            </div>
            <button type="button" onClick={() => navigate("/personas")} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100"><ArrowLeft size={20} />Volver</button>
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {cargando ? <div className="p-8 text-center text-slate-500">Cargando datos...</div> : (
            <form onSubmit={guardarCambios} className="space-y-6">
              <Seccion id="persona" icono={<User size={23} />} titulo="Datos personales" abierta={seccionAbierta === "persona"} onToggle={setSeccionAbierta}>
                <SeccionPersona disabled={esVer} persona={persona} cambiarPersona={(e) => setPersona({ ...persona, [e.target.name]: e.target.value })} tiposDocumento={tiposDocumento} />
              </Seccion>
              <Seccion id="legajo" icono={<FileText size={23} />} titulo="Legajo" abierta={seccionAbierta === "legajo"} onToggle={setSeccionAbierta}>
                <SeccionLegajo disabled={esVer} legajo={legajo} cambiarLegajo={(e) => setLegajo({ ...legajo, [e.target.name]: e.target.value })} />
              </Seccion>
              <Seccion id="datos-medicos" icono={<HeartPulse size={23} />} titulo="Datos médicos" abierta={seccionAbierta === "datos-medicos"} onToggle={setSeccionAbierta}>
                <SeccionDatosMedicos disabled={esVer} datosMedicos={datosMedicos} cambiarDatosMedicos={(e) => setDatosMedicos({ ...datosMedicos, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })} />
              </Seccion>
              <Seccion id="contactos" icono={<Phone size={23} />} titulo="Contactos" abierta={seccionAbierta === "contactos"} onToggle={setSeccionAbierta}>
                <SeccionContactos disabled={esVer} contactos={contactos} cambiarContactos={(e) => setContactos({ ...contactos, [e.target.name]: e.target.value })} />
              </Seccion>
              <Seccion id="rango-sede" icono={<MapPinned size={23} />} titulo="Rango y sede" abierta={seccionAbierta === "rango-sede"} onToggle={setSeccionAbierta}>
                <SeccionRangoSede disabled={esVer} rango={rango} cambiarRango={(e) => setRango({ ...rango, [e.target.name]: e.target.value })} sede={sede} cambiarSede={(e) => setSede({ ...sede, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value })} rangos={rangos} sedes={sedes} />
              </Seccion>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 bg-white">
                <button type="button" onClick={() => navigate("/personas")} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100">
                  {esVer ? "Volver" : "Cancelar"}
                </button>
                {!esVer && (
                  <button type="submit" disabled={guardando || !hasPermission(currentUserRole, "editar")} className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"><Save size={22} />{guardando ? "Guardando..." : "Guardar cambios"}</button>
                )}
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
