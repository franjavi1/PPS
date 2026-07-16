import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, GraduationCap, BookOpenCheck, ShieldUser, CheckCircle2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { asignaturaService } from "../services/asignaturaService";
import { aulaService } from "../services/aulaService";
import { autoridadComisionService } from "../services/autoridadComisionService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { comisionService } from "../services/comisionService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";
import { tipoAutoridadService } from "../services/tipoAutoridadService";

import StepComision from "../components/AltaComisionWizard/StepComision";
import StepAsignaturas from "../components/AltaComisionWizard/StepAsignaturas";
import StepAutoridades from "../components/AltaComisionWizard/StepAutoridades";
import StepResumen from "../components/AltaComisionWizard/StepResumen";

const pasos = [
  { id: 1, titulo: "Comision", icono: GraduationCap },
  { id: 2, titulo: "Asignaturas", icono: BookOpenCheck },
  { id: 3, titulo: "Autoridades", icono: ShieldUser },
  { id: 4, titulo: "Resumen", icono: CheckCircle2 },
];

const comisionInicial = { descripcion: "" };
const comisionAsignaturaInicial = { plan_asignaturas_id: "", aula_id: "", nombre: "", modalidad: "", cupo_maximo: "", estado: "Activo" };
const autoridadInicial = { tipo_autoridad_id: "", legajo_id: "", comision_id: "" };

const obtenerLista = (res) => (Array.isArray(res?.data) ? res.data : []);

export default function AltaComisionWizard() {
  const navigate = useNavigate();
  const [pasoActual, setPasoActual] = useState(1);
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
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        sedeService.obtenerTodas(),
        aulaService.obtenerTodas(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
      ]);
      setPlanesAsignaturas(obtenerLista(resPlanAsig));
      setAsignaturas(obtenerLista(resAsig));
      setPlanes(obtenerLista(resPlanes));
      setSedes(obtenerLista(resSedes));
      setAulas(obtenerLista(resAulas));
      setTiposAutoridad(obtenerLista(resTipos));
      setLegajos(obtenerLista(resLeg));
    } catch {
      // Ignorar fallos de carga inicial
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
      setGuardando(true);
      setError("");
      const res = await comisionService.crear({ descripcion: comision.descripcion.trim(), usuario_accion: 1 });
      setComisionId(res.data.id_comision);
      setPasoActual(2);
    } catch (err) {
      setError(err.message || "Error al crear comisión");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarComisionAsignatura() {
    if (!comisionAsignatura.plan_asignaturas_id) return setError("Seleccione plan asignatura");
    if (!comisionAsignatura.aula_id) return setError("Seleccione aula");
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
      setGuardando(true);
      setError("");
      const res = await comisionAsignaturaService.crear(payload);
      setComisionesAsignaturasCargadas([
        ...comisionesAsignaturasCargadas,
        {
          id_comision_asignatura: res.data.id || res.data.id_comision_asignatura,
          ...payload,
          planAsignatura: mapas.planesAsignaturas[payload.plan_asignaturas_id],
          aula: mapas.aulas[payload.aula_id],
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
      tipo_autoridad_id: Number(autoridad.tipo_autoridad_id),
      legajo_id: Number(autoridad.legajo_id),
      comision_id: Number(autoridad.comision_id),
      usuario_accion: 1,
    };
    try {
      setGuardando(true);
      setError("");
      await autoridadComisionService.crear(payload);
      setAutoridadesCargadas([
        ...autoridadesCargadas,
        {
          ...payload,
          tipoAutoridad: mapas.tiposAutoridad[payload.tipo_autoridad_id],
          legajo: mapas.legajos[payload.legajo_id],
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
    setPasoActual(1);
    setComisionId(null);
    setComision(comisionInicial);
    setComisionAsignatura(comisionAsignaturaInicial);
    setAutoridad(autoridadInicial);
    setComisionesAsignaturasCargadas([]);
    setAutoridadesCargadas([]);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><GraduationCap size={28} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Alta guiada Comisión</h1>
                <p className="text-slate-500 mt-2">Crea una comisión, agrega asignaturas y asigna autoridades.</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate("/comisiones")} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100"><ArrowLeft size={20} />Volver</button>
          </div>

          <div className="mb-8 flex items-start gap-4 overflow-x-auto">
            {pasos.map((paso) => (
              <div key={paso.id} className="flex items-center gap-2">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${pasoActual >= paso.id ? "bg-red-700 text-white" : "bg-slate-100 text-slate-400"}`}>{paso.id}</span>
                <span className={`text-sm font-bold ${pasoActual >= paso.id ? "text-slate-800" : "text-slate-400"}`}>{paso.titulo}</span>
              </div>
            ))}
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {pasoActual === 1 && <StepComision comision={comision} cambiarComision={(e) => setComision({ descripcion: e.target.value })} guardando={guardando} guardarComision={guardarComision} />}
          {pasoActual === 2 && <StepAsignaturas comisionAsignatura={comisionAsignatura} cambiarComisionAsignatura={(e) => setComisionAsignatura({ ...comisionAsignatura, [e.target.name]: e.target.value })} planesAsignaturas={planesAsignaturas} aulas={aulas} agregarComisionAsignatura={agregarComisionAsignatura} comisionesAsignaturasCargadas={comisionesAsignaturasCargadas} mapas={mapas} guardando={guardando} onBack={() => setPasoActual(1)} onNext={() => setPasoActual(3)} />}
          {pasoActual === 3 && <StepAutoridades autoridad={autoridad} cambiarAutoridad={(e) => setAutoridad({ ...autoridad, [e.target.name]: e.target.value })} tiposAutoridad={tiposAutoridad} legajos={legajos} comisionesAsignaturasCargadas={comisionesAsignaturasCargadas} agregarAutoridad={agregarAutoridad} autoridadesCargadas={autoridadesCargadas} guardando={guardando} onBack={() => setPasoActual(2)} onNext={() => setPasoActual(4)} />}
          {pasoActual === 4 && <StepResumen comision={comision} comisionId={comisionId} comisionesAsignaturasCargadas={comisionesAsignaturasCargadas} autoridadesCargadas={autoridadesCargadas} volverComisiones={() => navigate("/comisiones")} cargarOtraComision={cargarOtraComision} />}
        </section>
      </main>
    </div>
  );
}
