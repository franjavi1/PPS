import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, BookOpen, BookMarked, ChevronDown, GitBranch, Save } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { asignaturaService } from "../services/asignaturaService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { tipoPlanesService } from "../services/tipoPlanesService";
import { SeccionPlanBase, SeccionAsignaturasPlan, SeccionCorrelativasPlan } from "../components/EditarPlan/EditarPlanSections";

const planInicial = { tipo_planes_id_tipo_planes: "", resolucion_ministerial: "", nombre: "", descrip: "", vigencia_dde: "", vigencia_hta: "" };
const nuevaAsignaturaInicial = { asignatura_id: "", rango_minimo_id: "", sedes_id: "", presentismo_porc: "", regularizacion_prom: "", final_aprobacion: "", duracion: "", regimen: "", modalidad: "" };
const nuevaCorrelativaInicial = { pa_id: "", asignatura_id: "" };
const obtenerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

function Seccion({ id, icono, titulo, abierta, onToggle, children }) {
  return (
    <section className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button type="button" onClick={() => onToggle(abierta ? "" : id)} className="w-full flex items-center justify-between gap-4 p-5 hover:bg-slate-50">
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

export default function EditarPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Explicamos el inicio síncrono del componente y cómo consume el rol de sesión con el hook useAuth.
  const { currentUserRole } = useAuth();

  const [plan, setPlan] = useState(planInicial);
  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [planAsignaturas, setPlanAsignaturas] = useState([]);
  const [nuevaAsignatura, setNuevaAsignatura] = useState(nuevaAsignaturaInicial);
  const [correlativas, setCorrelativas] = useState([]);
  const [nuevaCorrelativa, setNuevaCorrelativa] = useState(nuevaCorrelativaInicial);
  const [asignaturas, setAsignaturas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [seccionAbierta, setSeccionAbierta] = useState("plan");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true); setError("");
      const [resPlan, resTipos, resPlanAsig, resCorr, resAsig, resRangos, resSedes] = await Promise.all([
        planService.obtenerPorId(id), tipoPlanesService.obtenerTodos(), planAsignaturaService.obtenerTodos(),
        paCorrelativaService.obtenerTodos(), asignaturaService.obtenerTodas(), rangoService.obtenerTodos(), sedeService.obtenerTodas(),
      ]);
      const planAsignaturasDelPlan = (resPlanAsig.data || []).filter((x) => Number(x.plan_id) === Number(id));
      const idsPlanAsignaturas = planAsignaturasDelPlan.map((x) => Number(x.id));
      setPlan(resPlan.data || planInicial); setTiposPlanes(obtenerLista(resTipos)); setPlanAsignaturas(planAsignaturasDelPlan);
      setCorrelativas((resCorr.data || []).filter((x) => idsPlanAsignaturas.includes(Number(x.pa_id))));
      setAsignaturas(obtenerLista(resAsig)); setRangos(obtenerLista(resRangos)); setSedes(obtenerLista(resSedes));
    } catch (err) {
      setError(err.message || "Error al cargar datos");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => ({
    asignaturas: asignaturas.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
    rangos: rangos.reduce((acc, x) => ({ ...acc, [x.id]: x.descripcion }), {}),
    sedes: sedes.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
  }), [asignaturas, rangos, sedes]);

  async function guardarPlanGeneral(e) {
    e.preventDefault();
    if (!plan.nombre.trim() || !plan.resolucion_ministerial || !plan.tipo_planes_id_tipo_planes) return setError("Complete los campos obligatorios del plan");
    try {
      setGuardando(true); setError("");
      await planService.actualizar(id, {
        tipo_planes_id_tipo_planes: Number(plan.tipo_planes_id_tipo_planes), resolucion_ministerial: Number(plan.resolucion_ministerial),
        nombre: plan.nombre.trim(), descrip: plan.descrip.trim(), vigencia_dde: plan.vigencia_dde || null, vigencia_hta: plan.vigencia_hta || null, usuario_accion: 1,
      });
      navigate(`/planes/${id}`);
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarAsignatura() {
    if (!nuevaAsignatura.asignatura_id || !nuevaAsignatura.rango_minimo_id || !nuevaAsignatura.sedes_id) return setError("Complete campos obligatorios");
    const payload = {
      plan_id: Number(id), asignatura_id: Number(nuevaAsignatura.asignatura_id), rango_minimo_id: Number(nuevaAsignatura.rango_minimo_id), sedes_id: Number(nuevaAsignatura.sedes_id),
      presentismo_porc: Number(nuevaAsignatura.presentismo_porc) || 0, regularizacion_prom: Number(nuevaAsignatura.regularizacion_prom) || 0, final_aprobacion: Number(nuevaAsignatura.final_aprobacion) || 0,
      duracion: Number(nuevaAsignatura.duracion) || 0, regimen: nuevaAsignatura.regimen.trim(), modalidad: nuevaAsignatura.modalidad.trim(), usuario_accion: 1,
    };
    try {
      setGuardando(true);
      const res = await planAsignaturaService.crear(payload);
      setPlanAsignaturas([...planAsignaturas, { id: res.data.id, ...payload }]);
      setNuevaAsignatura(nuevaAsignaturaInicial);
    } catch (err) {
      setError(err.message || "Error al agregar asignatura");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAsignatura(paId) {
    if (!confirm("¿Seguro que querés quitar esta asignatura del plan?")) return;
    try {
      setGuardando(true); await planAsignaturaService.eliminar(paId);
      setPlanAsignaturas(planAsignaturas.filter((x) => x.id !== paId));
      setCorrelativas(correlativas.filter((x) => x.pa_id !== paId && x.asignatura_id !== paId));
    } catch (err) {
      setError(err.message || "Error al quitar asignatura");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarCorrelativa() {
    if (!nuevaCorrelativa.pa_id || !nuevaCorrelativa.asignatura_id) return setError("Complete campos obligatorios");
    const payload = { pa_id: Number(nuevaCorrelativa.pa_id), asignatura_id: Number(nuevaCorrelativa.asignatura_id), usuario_accion: 1 };
    try {
      setGuardando(true);
      const res = await paCorrelativaService.crear(payload);
      setCorrelativas([...correlativas, { id: res.data.id, ...payload }]);
      setNuevaCorrelativa(nuevaCorrelativaInicial);
    } catch (err) {
      setError(err.message || "Error al agregar correlativa");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCorrelativa(cId) {
    if (!confirm("¿Seguro que querés eliminar esta correlativa?")) return;
    try {
      setGuardando(true); await paCorrelativaService.eliminar(cId);
      setCorrelativas(correlativas.filter((x) => x.id !== cId));
    } catch (err) {
      setError(err.message || "Error al eliminar correlativa");
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
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><BookOpen size={28} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Editar Plan</h1>
                <p className="text-slate-500 mt-2">Modifica los datos del plan, sus asignaturas y correlativas.</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate(`/planes/${id}`)} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100"><ArrowLeft size={20} />Volver</button>
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {cargando ? <div className="p-8 text-center text-slate-500">Cargando datos del plan...</div> : (
            <form onSubmit={guardarPlanGeneral} className="space-y-6">
              <Seccion id="plan" icono={<BookOpen size={23} />} titulo="Plan base" abierta={seccionAbierta === "plan"} onToggle={setSeccionAbierta}>
                <SeccionPlanBase plan={plan} cambiarPlan={(e) => setPlan({ ...plan, [e.target.name]: e.target.value })} tiposPlanes={tiposPlanes} />
              </Seccion>
              <Seccion id="asignaturas" icono={<BookMarked size={23} />} titulo="Asignaturas" abierta={seccionAbierta === "asignaturas"} onToggle={setSeccionAbierta}>
                <SeccionAsignaturasPlan nuevaAsignatura={nuevaAsignatura} cambiarNuevaAsignatura={(e) => setNuevaAsignatura({ ...nuevaAsignatura, [e.target.name]: e.target.value })} asignaturas={asignaturas} rangos={rangos} sedes={sedes} agregarAsignatura={agregarAsignatura} planAsignaturas={planAsignaturas} eliminarAsignatura={eliminarAsignatura} mapas={mapas} guardando={guardando} />
              </Seccion>
              <Seccion id="correlativas" icono={<GitBranch size={23} />} titulo="Correlativas" abierta={seccionAbierta === "correlativas"} onToggle={setSeccionAbierta}>
                <SeccionCorrelativasPlan planAsignaturas={planAsignaturas} nuevaCorrelativa={nuevaCorrelativa} cambiarCorrelativa={(e) => setNuevaCorrelativa({ ...nuevaCorrelativa, [e.target.name]: e.target.value })} agregarCorrelativa={agregarCorrelativa} correlativas={correlativas} eliminarCorrelativa={eliminarCorrelativa} mapas={mapas} guardando={guardando} />
              </Seccion>
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 bg-white">
                <button type="button" onClick={() => navigate(`/planes/${id}`)} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100">Cancelar</button>
                {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                <button type="submit" disabled={guardando || !hasPermission(currentUserRole, "editar")} className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"><Save size={22} />{guardando ? "Guardando..." : "Guardar plan"}</button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
