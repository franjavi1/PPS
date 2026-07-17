import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, BookMarked, ClipboardList, GitBranch, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { asignaturaService } from "../services/asignaturaService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { tipoPlanesService } from "../services/tipoPlanesService";
import { StepPlan, StepAsignatura, StepCondiciones, StepCorrelativas, StepResumen } from "../components/AltaPlanWizard/AltaPlanWizardSteps";

const pasos = [
  { id: 1, titulo: "Plan", icono: BookOpen },
  { id: 2, titulo: "Asignatura", icono: BookMarked },
  { id: 3, titulo: "Condiciones", icono: ClipboardList },
  { id: 4, titulo: "Correlativas", icono: GitBranch },
  { id: 5, titulo: "Resumen", icono: CheckCircle2 },
];

const planInicial = { tipo_planes_id_tipo_planes: "", resolucion_ministerial: "", nombre: "", descrip: "", vigencia_dde: "", vigencia_hta: "" };
const asignaturaPlanInicial = { asignatura_id: "", rango_minimo_id: "", sedes_id: "", presentismo_porc: "", regularizacion_prom: "", final_aprobacion: "", duracion: "", regimen: "", modalidad: "" };
const correlativaInicial = { pa_id: "", asignatura_id: "" };
const obtenerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

export default function AltaPlanWizard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role || "invitado";

  // Declaramos el estado de control numérico
  const [paso, setPaso] = useState(1);
  const [planId, setPlanId] = useState(null);
  const [planAsignaturaId, setPlanAsignaturaId] = useState(null);
  const [plan, setPlan] = useState(planInicial);
  const [asignaturaPlan, setAsignaturaPlan] = useState(asignaturaPlanInicial);
  const [asignaturasCargadas, setAsignaturasCargadas] = useState([]);
  const [nuevaCorrelativa, setNuevaCorrelativa] = useState(correlativaInicial);
  const [correlativasCargadas, setCorrelativasCargadas] = useState([]);
  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarCombos();
  }, []);

  async function cargarCombos() {
    try {
      const [resTipos, resAsig, resRangos, resSedes] = await Promise.all([
        tipoPlanesService.obtenerTodos(), asignaturaService.obtenerTodas(), rangoService.obtenerTodos(), sedeService.obtenerTodas(),
      ]);
      setTiposPlanes(obtenerLista(resTipos));
      setAsignaturas(obtenerLista(resAsig));
      setRangos(obtenerLista(resRangos));
      setSedes(obtenerLista(resSedes));
    } catch {
      // Ignorar fallos silenciosamente
    }
  }

  const mapas = useMemo(() => ({
    asignaturas: asignaturas.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
    rangos: rangos.reduce((acc, x) => ({ ...acc, [x.id]: x.descripcion }), {}),
    sedes: sedes.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
  }), [asignaturas, rangos, sedes]);

  async function guardarPlan(e) {
    e.preventDefault();
    if (!plan.tipo_planes_id_tipo_planes || !plan.resolucion_ministerial || !plan.nombre.trim()) return setError("Complete los campos obligatorios");
    try {
      setGuardando(true); setError("");
      const res = await planService.crear({
        tipo_planes_id_tipo_planes: Number(plan.tipo_planes_id_tipo_planes), resolucion_ministerial: Number(plan.resolucion_ministerial),
        nombre: plan.nombre.trim(), descrip: plan.descrip.trim(), vigencia_dde: plan.vigencia_dde || null, vigencia_hta: plan.vigencia_hta || null, usuario_accion: 1,
      });
      setPlanId(res.data.id); setPaso(2);
    } catch (err) {
      setError(err.message || "Error al crear plan");
    } finally {
      setGuardando(false);
    }
  }

  async function guardarAsignatura(e) {
    e.preventDefault();
    if (asignaturasCargadas.length > 0 && !asignaturaPlan.asignatura_id) return setPaso(4);
    if (!asignaturaPlan.asignatura_id || !asignaturaPlan.rango_minimo_id || !asignaturaPlan.sedes_id) return setError("Complete campos obligatorios");
    setPaso(3);
  }

  async function guardarCondiciones(e) {
    e.preventDefault();
    const payload = {
      plan_id: Number(planId), asignatura_id: Number(asignaturaPlan.asignatura_id), rango_minimo_id: Number(asignaturaPlan.rango_minimo_id),
      sedes_id: Number(asignaturaPlan.sedes_id), presentismo_porc: Number(asignaturaPlan.presentismo_porc) || 0, regularizacion_prom: Number(asignaturaPlan.regularizacion_prom) || 0,
      final_aprobacion: Number(asignaturaPlan.final_aprobacion) || 0, duracion: Number(asignaturaPlan.duracion) || 0, regimen: asignaturaPlan.regimen.trim(), modalidad: asignaturaPlan.modalidad.trim(), usuario_accion: 1,
    };
    try {
      setGuardando(true); setError("");
      const res = await planAsignaturaService.crear(payload);
      setAsignaturasCargadas([
        ...asignaturasCargadas, { id: res.data.id, asignatura_id: payload.asignatura_id, asignatura: mapas.asignaturas[payload.asignatura_id], rango: mapas.rangos[payload.rango_minimo_id], sede: mapas.sedes[payload.sedes_id] },
      ]);
      setAsignaturaPlan(asignaturaPlanInicial); setPaso(2);
    } catch (err) {
      setError(err.message || "Error al guardar asignatura");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarCorrelativa() {
    if (!nuevaCorrelativa.pa_id || !nuevaCorrelativa.asignatura_id) return setError("Complete campos obligatorios");
    const payload = { pa_id: Number(nuevaCorrelativa.pa_id), asignatura_id: Number(nuevaCorrelativa.asignatura_id), usuario_accion: 1 };
    try {
      setGuardando(true); setError("");
      const res = await paCorrelativaService.crear(payload);
      setCorrelativasCargadas([
        ...correlativasCargadas, { id: res.data.id, pa_id: payload.pa_id, asignatura_id: payload.asignatura_id, asignaturaQueRequiere: asignaturasCargadas.find((x) => x.id === payload.pa_id)?.asignatura || "", asignaturaRequerida: asignaturasCargadas.find((x) => x.asignatura_id === payload.asignatura_id)?.asignatura || "" },
      ]);
      setNuevaCorrelativa(correlativaInicial);
    } catch (err) {
      setError(err.message || "Error al agregar correlativa");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCorrelativa(cId) {
    try {
      setGuardando(true); await paCorrelativaService.eliminar(cId);
      setCorrelativasCargadas(correlativasCargadas.filter((x) => x.id !== cId));
    } catch (err) {
      setError(err.message || "Error al eliminar correlativa");
    } finally {
      setGuardando(false);
    }
  }

  function cargarOtroPlan() {
    setPaso(1); setPlanId(null); setPlanAsignaturaId(null); setPlan(planInicial); setAsignaturaPlan(asignaturaPlanInicial);
    setAsignaturasCargadas([]); setNuevaCorrelativa(correlativaInicial); setCorrelativasCargadas([]); setError("");
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
                <BookOpen size={28} />
              </div>
              <div>
                <span className="text-red-600 text-xs font-bold tracking-wider uppercase block">Alta Guiada</span>
                <h1 className="text-3xl font-extrabold text-slate-900">Alta de Plan de Estudios</h1>
                <p className="text-slate-500 text-sm mt-1">Crea un plan de estudios académico, asocia asignaturas y define correlativas.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/planes")}
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
            {paso === 1 && <StepPlan plan={plan} cambiarPlan={(e) => setPlan({ ...plan, [e.target.name]: e.target.value })} tiposPlanes={tiposPlanes} guardando={guardando} guardarPlan={guardarPlan} />}
            {paso === 2 && <StepAsignatura asignaturaPlan={asignaturaPlan} cambiarAsignaturaPlan={(e) => setAsignaturaPlan({ ...asignaturaPlan, [e.target.name]: e.target.value })} asignaturas={asignaturas} rangos={rangos} sedes={sedes} guardando={guardando} guardarAsignatura={guardarAsignatura} asignaturasCargadas={asignaturasCargadas} onBack={() => setPaso(1)} />}
            {paso === 3 && <StepCondiciones asignaturaPlan={asignaturaPlan} cambiarAsignaturaPlan={(e) => setAsignaturaPlan({ ...asignaturaPlan, [e.target.name]: e.target.value })} guardando={guardando} guardarCondiciones={guardarCondiciones} onBack={() => setPaso(2)} />}
            {paso === 4 && <StepCorrelativas asignaturasCargadas={asignaturasCargadas} nuevaCorrelativa={nuevaCorrelativa} cambiarCorrelativa={(e) => setNuevaCorrelativa({ ...nuevaCorrelativa, [e.target.name]: e.target.value })} agregarCorrelativa={agregarCorrelativa} correlativasCargadas={correlativasCargadas} eliminarCorrelativa={eliminarCorrelativa} guardando={guardando} onBack={() => setPaso(2)} onNext={() => setPaso(5)} />}
            {paso === 5 && <StepResumen plan={plan} asignaturasCargadas={asignaturasCargadas} correlativasCargadas={correlativasCargadas} volverPlanes={() => navigate("/planes")} cargarOtroPlan={cargarOtroPlan} />}
          </div>

        </section>
      </main>
    </div>
  );
}
