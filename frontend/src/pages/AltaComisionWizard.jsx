import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { asignaturaService } from "../services/asignaturaService";
import { aulaService } from "../services/aulaService";
import { autoridadComisionService } from "../services/autoridadComisionService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { comisionService } from "../services/comisionService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";
import { tipoAutoridadService } from "../services/tipoAutoridadService";
import StepAsignaturas from "../components/AltaComisionWizard/StepAsignaturas";
import StepAutoridades from "../components/AltaComisionWizard/StepAutoridades";
import StepResumen from "../components/AltaComisionWizard/StepResumen";

const comisionInicial = { descripcion: "" };
const comisionAsignaturaInicial = { plan_asignaturas_id: "", aula_id: "", nombre: "", modalidad: "", cupo_maximo: "", estado: "Activo" };
const autoridadInicial = { tipo_autoridad_id: "", legajo_id: "", comision_id: "" };
const obtenerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

export default function AltaComisionWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || "invitado";

  // Control de paso actual del asistente
  const [paso, setPaso] = useState(1);
  const [comisionId, setComisionId] = useState(null);
  const [comision, setComision] = useState(comisionInicial);
  const [comisionAsignatura, setComisionAsignatura] = useState(comisionAsignaturaInicial);
  const [autoridad, setAutoridad] = useState(autoridadInicial);
  const [comisionesAsignaturasCargadas, setComisionesAsignaturasCargadas] = useState([]);
  const [autoridadesCargadas, setAutoridadesCargadas] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      setCargando(true);
      const [resPlanAsig, resAsig, resPlanes, resSedes, resAulas, resTipos, resLeg] = await Promise.all([
        planAsignaturaService.obtenerTodos(), asignaturaService.obtenerTodas(), planService.obtenerTodos(),
        sedeService.obtenerTodas(), aulaService.obtenerTodas(), tipoAutoridadService.obtenerTodos(), apiRequest("/legajos"),
      ]);
      setPlanesAsignaturas(obtenerLista(resPlanAsig));
      setAsignaturas(obtenerLista(resAsig));
      setPlanes(obtenerLista(resPlanes));
      setSedes(obtenerLista(resSedes));
      setAulas(obtenerLista(resAulas));
      setTiposAutoridad(obtenerLista(resTipos));
      setLegajos(obtenerLista(resLeg));
    } catch {
      // Ignorar fallos silenciosamente
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    const labelPlanAsig = (pa) => {
      const asig = asignaturas.find((x) => x.id === pa.asignatura_id);
      const pl = planes.find((x) => x.id === pa.plan_id);
      const se = sedes.find((x) => x.id === pa.sedes_id);
      return [asig?.nombre, pl?.nombre, se?.nombre].filter(Boolean).join(" - ") || `Plan asignatura #${pa.id}`;
    };
    return {
      planesAsignaturas: planesAsignaturas.reduce((acc, x) => ({ ...acc, [x.id]: labelPlanAsig(x) }), {}),
      aulas: aulas.reduce((acc, x) => ({ ...acc, [x.id_aula]: x.aula }), {}),
      tiposAutoridad: tiposAutoridad.reduce((acc, x) => ({ ...acc, [x.id]: x.descripcion }), {}),
      legajos: legajos.reduce((acc, x) => ({ ...acc, [x.id]: x.numero ? `Nro. ${x.numero}` : `Legajo #${x.id}` }), {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes, aulas, tiposAutoridad, legajos]);

  async function guardarComision(e) {
    e.preventDefault();
    if (!comision.descripcion.trim()) return setError("La descripción es obligatoria");
    try {
      setGuardando(true); setError("");
      const res = await comisionService.crear({ descripcion: comision.descripcion.trim(), usuario_accion: 1 });
      setComisionId(res.data.id_comision);
      setPaso(2);
    } catch (err) {
      setError(err.message || "Error al crear comisión");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarComisionAsignatura() {
    if (!comisionAsignatura.plan_asignaturas_id || !comisionAsignatura.aula_id) return setError("Complete campos requeridos");
    const payload = {
      plan_asignaturas_id: Number(comisionAsignatura.plan_asignaturas_id),
      aula_id: Number(comisionAsignatura.aula_id),
      comision_id: Number(comisionId),
      nombre: comisionAsignatura.nombre.trim(),
      modalidad: comisionAsignatura.modalidad.trim(),
      cupo_maximo: Number(comisionAsignatura.cupo_maximo),
      estado: comisionAsignatura.estado,
      usuario_accion: 1,
    };
    try {
      setGuardando(true); setError("");
      const res = await comisionAsignaturaService.crear(payload);
      setComisionesAsignaturasCargadas([
        ...comisionesAsignaturasCargadas,
        {
          id_comision_asignatura: res.data.id || res.data.id_comision_asignatura, ...payload,
          planAsignatura: mapas.planesAsignaturas[payload.plan_asignaturas_id], aula: mapas.aulas[payload.aula_id],
        },
      ]);
      setComisionAsignatura(comisionAsignaturaInicial);
    } catch (err) {
      setError(err.message || "Error al agregar asignatura");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarAutoridad() {
    if (!autoridad.tipo_autoridad_id || !autoridad.legajo_id || !autoridad.comision_id) return setError("Complete campos obligatorios de autoridad");
    const payload = {
      tipo_autoridad_id: Number(autoridad.tipo_autoridad_id), legajo_id: Number(autoridad.legajo_id), comision_id: Number(autoridad.comision_id), usuario_accion: 1,
    };
    try {
      setGuardando(true); setError("");
      await autoridadComisionService.crear(payload);
      setAutoridadesCargadas([
        ...autoridadesCargadas,
        {
          ...payload, tipoAutoridad: mapas.tiposAutoridad[payload.tipo_autoridad_id], legajo: mapas.legajos[payload.legajo_id],
          comisionAsignatura: comisionesAsignaturasCargadas.find((x) => Number(x.id_comision_asignatura) === payload.comision_id)?.nombre || "",
        },
      ]);
      setAutoridad(autoridadInicial);
    } catch (err) {
      setError(err.message || "Error al agregar autoridad");
    } finally {
      setGuardando(false);
    }
  }

  function cargarOtraComision() {
    setPaso(1); setComisionId(null); setComision(comisionInicial); setComisionAsignatura(comisionAsignaturaInicial);
    setAutoridad(autoridadInicial); setComisionesAsignaturasCargadas([]); setAutoridadesCargadas([]); setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <Navbar />
      <main className="p-8">
        
        {/* 1. CABECERA PRINCIPAL */}
        <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <span className="text-xl">🎓</span>
            </div>
            <div>
              <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
              <h1 className="text-slate-900 text-3xl font-extrabold">Comision</h1>
              <p className="text-slate-500 text-sm mt-1">Crea una comision, agrega asignaturas y asigna autoridades.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/comisiones")}
            className="flex items-center gap-2 border border-slate-300 px-4 py-2 rounded-xl text-slate-700 text-sm font-semibold bg-white hover:bg-slate-50 transition"
          >
            <span>←</span> Volver
          </button>
        </div>

        {/* 2. STEPPER DE PROGRESO */}
        <div className="flex items-center justify-between mb-12 max-w-4xl mx-auto px-4">
          {/* Paso 1: Comisión */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${paso >= 1 ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
              🎓
            </div>
            <span className={`text-xs font-bold ${paso >= 1 ? 'text-red-700' : 'text-slate-400'}`}>Comision</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-slate-200" />

          {/* Paso 2: Asignaturas */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${paso >= 2 ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
              📖
            </div>
            <span className={`text-xs font-bold ${paso >= 2 ? 'text-red-700' : 'text-slate-400'}`}>Asignaturas</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-slate-200" />

          {/* Paso 3: Autoridades */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${paso >= 3 ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
              👤
            </div>
            <span className={`text-xs font-bold ${paso >= 3 ? 'text-red-700' : 'text-slate-400'}`}>Autoridades</span>
          </div>
          <div className="flex-1 h-0.5 mx-4 bg-slate-200" />

          {/* Paso 4: Resumen */}
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition ${paso === 4 ? 'bg-red-700 text-white' : 'bg-slate-100 text-slate-400'}`}>
              ✓
            </div>
            <span className={`text-xs font-bold ${paso === 4 ? 'text-red-700' : 'text-slate-400'}`}>Resumen</span>
          </div>
        </div>

        {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold max-w-4xl mx-auto">{error}</div>}

        {/* 3. CONTENIDO DEL PASO ACTIVO */}
        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-xs max-w-4xl mx-auto min-h-[300px]">
          {paso === 1 && (
            <form onSubmit={guardarComision} className="space-y-6">
              <div className="flex items-center gap-2 text-slate-800 text-xl font-bold mb-2">
                <span>🎓</span> Datos de la comision
              </div>
              <hr className="border-slate-200 mb-6" />
              <div className="flex flex-col gap-2">
                <label className="text-slate-700 text-sm font-bold">Descripcion</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">🎓</span>
                  <input 
                    type="text" 
                    value={comision.descripcion}
                    onChange={(e) => setComision({ descripcion: e.target.value })}
                    placeholder="Ej: Comision A" 
                    className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-red-600 text-slate-800"
                  />
                </div>
              </div>
              
              {/* Botón de acción para el Paso 1 */}
              <div className="flex justify-end mt-8 pt-6 border-t border-slate-100">
                <button 
                  type="submit"
                  disabled={guardando}
                  className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
                >
                  <span>💾</span> {guardando ? "Guardando..." : "Crear comision y seguir"}
                </button>
              </div>
            </form>
          )}

          {paso === 2 && (
            <StepAsignaturas 
              comisionAsignatura={comisionAsignatura} 
              cambiarComisionAsignatura={(e) => setComisionAsignatura({ ...comisionAsignatura, [e.target.name]: e.target.value })} 
              planesAsignaturas={planesAsignaturas} 
              aulas={aulas} 
              agregarComisionAsignatura={agregarComisionAsignatura} 
              comisionesAsignaturasCargadas={comisionesAsignaturasCargadas} 
              mapas={mapas} 
              guardando={guardando} 
              onBack={() => setPaso(1)} 
              onNext={() => setPaso(3)} 
            />
          )}

          {paso === 3 && (
            <StepAutoridades 
              autoridad={autoridad} 
              cambiarAutoridad={(e) => setAutoridad({ ...autoridad, [e.target.name]: e.target.value })} 
              tiposAutoridad={tiposAutoridad} 
              legajos={legajos} 
              comisionesAsignaturasCargadas={comisionesAsignaturasCargadas} 
              agregarAutoridad={agregarAutoridad} 
              autoridadesCargadas={autoridadesCargadas} 
              guardando={guardando} 
              onBack={() => setPaso(2)} 
              onNext={() => setPaso(4)} 
            />
          )}

          {paso === 4 && (
            <StepResumen 
              comision={comision} 
              comisionId={comisionId} 
              comisionesAsignaturasCargadas={comisionesAsignaturasCargadas} 
              autoridadesCargadas={autoridadesCargadas} 
              volverComisiones={() => navigate("/comisiones")} 
              cargarOtraComision={cargarOtraComision} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
