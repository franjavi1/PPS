import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, BookOpenCheck, ChevronDown, GraduationCap, Save, ShieldUser } from "lucide-react";
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

import SeccionDatos from "../components/EditarComision/SeccionDatos";
import SeccionAsignaturas from "../components/EditarComision/SeccionAsignaturas";
import SeccionAutoridades from "../components/EditarComision/SeccionAutoridades";

const comisionInicial = { descripcion: "" };
const nuevaComisionAsignaturaInicial = { plan_asignaturas_id: "", aula_id: "", nombre: "", modalidad: "", cupo_maximo: "", estado: "Activo" };
const nuevaAutoridadInicial = { tipo_autoridad_id: "", legajo_id: "", comision_id: "" };

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

export default function EditarComision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comision, setComision] = useState(comisionInicial);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
  const [nuevaComisionAsignatura, setNuevaComisionAsignatura] = useState(nuevaComisionAsignaturaInicial);
  const [autoridades, setAutoridades] = useState([]);
  const [nuevaAutoridad, setNuevaAutoridad] = useState(nuevaAutoridadInicial);
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
  const [seccionAbierta, setSeccionAbierta] = useState("datos");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resCom, resComAsig, resAut, resPlanAsig, resAsig, resPlanes, resSedes, resAulas, resTipos, resLeg] = await Promise.all([
        comisionService.obtenerPorId(id),
        comisionAsignaturaService.obtenerTodos(),
        autoridadComisionService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        sedeService.obtenerTodas(),
        aulaService.obtenerTodas(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
      ]);

      const comisionesDeEsta = (resComAsig.data || []).filter((x) => Number(x.comision_id) === Number(id));
      const idsComisionesAsignaturas = comisionesDeEsta.map((x) => Number(x.id_comision_asignatura));

      setComision(resCom.data || comisionInicial);
      setComisionesAsignaturas(comisionesDeEsta);
      setAutoridades((resAut.data || []).filter((x) => idsComisionesAsignaturas.includes(Number(x.comision_id))));
      setPlanesAsignaturas(obtenerLista(resPlanAsig));
      setAsignaturas(obtenerLista(resAsig));
      setPlanes(obtenerLista(resPlanes));
      setSedes(obtenerLista(resSedes));
      setAulas(obtenerLista(resAulas));
      setTiposAutoridad(obtenerLista(resTipos));
      setLegajos(obtenerLista(resLeg));
    } catch (err) {
      setError(err.message || "Error al cargar datos");
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

  async function guardarComisionGeneral(e) {
    e.preventDefault();
    if (!comision.descripcion.trim()) return setError("La descripción es obligatoria");
    try {
      setGuardando(true);
      setError("");
      await comisionService.actualizar(id, { descripcion: comision.descripcion.trim(), usuario_accion: 1 });
      navigate(`/comisiones/${id}`);
    } catch (err) {
      setError(err.message || "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarComisionAsignatura() {
    if (!nuevaComisionAsignatura.plan_asignaturas_id || !nuevaComisionAsignatura.aula_id) return setError("Complete campos obligatorios");
    const payload = {
      plan_asignaturas_id: Number(nuevaComisionAsignatura.plan_asignaturas_id),
      aula_id: Number(nuevaComisionAsignatura.aula_id),
      comision_id: Number(id),
      nombre: nuevaComisionAsignatura.nombre.trim(),
      modalidad: nuevaComisionAsignatura.modalidad.trim(),
      cupo_maximo: Number(nuevaComisionAsignatura.cupo_maximo),
      estado: nuevaComisionAsignatura.estado,
      usuario_accion: 1,
    };
    try {
      setGuardando(true);
      const res = await comisionAsignaturaService.crear(payload);
      setComisionesAsignaturas([...comisionesAsignaturas, { id_comision_asignatura: res.data.id || res.data.id_comision_asignatura, ...payload }]);
      setNuevaComisionAsignatura(nuevaComisionAsignaturaInicial);
    } catch (err) {
      setError(err.message || "Error al agregar");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarComisionAsignatura(caId) {
    if (!confirm("¿Seguro que querés quitar esta asignatura?")) return;
    try {
      setGuardando(true);
      await comisionAsignaturaService.eliminar(caId);
      setComisionesAsignaturas(comisionesAsignaturas.filter((x) => x.id_comision_asignatura !== caId));
      setAutoridades(autoridades.filter((x) => x.comision_id !== caId));
    } catch (err) {
      setError(err.message || "Error al eliminar");
    } finally {
      setGuardando(false);
    }
  }

  async function agregarAutoridad() {
    if (!nuevaAutoridad.tipo_autoridad_id || !nuevaAutoridad.legajo_id || !nuevaAutoridad.comision_id) return setError("Complete campos obligatorios de autoridad");
    const payload = {
      tipo_autoridad_id: Number(nuevaAutoridad.tipo_autoridad_id),
      legajo_id: Number(nuevaAutoridad.legajo_id),
      comision_id: Number(nuevaAutoridad.comision_id),
      usuario_accion: 1,
    };
    try {
      setGuardando(true);
      const res = await autoridadComisionService.crear(payload);
      setAutoridades([...autoridades, { id: res.data.id || res.data.id_autoridad, ...payload }]);
      setNuevaAutoridad(nuevaAutoridadInicial);
    } catch (err) {
      setError(err.message || "Error al agregar autoridad");
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAutoridad(autId) {
    if (!confirm("¿Seguro que querés quitar esta autoridad?")) return;
    try {
      setGuardando(true);
      await autoridadComisionService.eliminar(autId);
      setAutoridades(autoridades.filter((x) => x.id !== autId));
    } catch (err) {
      setError(err.message || "Error al eliminar");
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
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><GraduationCap size={28} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Editar Comisión</h1>
                <p className="text-slate-500 mt-2">Modifica la información general, asignaturas y autoridades.</p>
              </div>
            </div>
            <button type="button" onClick={() => navigate(`/comisiones/${id}`)} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100"><ArrowLeft size={20} />Volver</button>
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {cargando ? <div className="p-8 text-center text-slate-500">Cargando comisión...</div> : (
            <form onSubmit={guardarComisionGeneral} className="space-y-6">
              <Seccion id="datos" icono={<GraduationCap size={23} />} titulo="Datos generales" abierta={seccionAbierta === "datos"} onToggle={setSeccionAbierta}>
                <SeccionDatos comision={comision} cambiarComision={(e) => setComision({ descripcion: e.target.value })} />
              </Seccion>

              <Seccion id="asignaturas" icono={<BookOpenCheck size={23} />} titulo="Asignaturas" abierta={seccionAbierta === "asignaturas"} onToggle={setSeccionAbierta}>
                <SeccionAsignaturas nuevaComisionAsignatura={nuevaComisionAsignatura} cambiarNuevaComisionAsignatura={(e) => setNuevaComisionAsignatura({ ...nuevaComisionAsignatura, [e.target.name]: e.target.value })} planesAsignaturas={planesAsignaturas} aulas={aulas} agregarComisionAsignatura={agregarComisionAsignatura} comisionesAsignaturas={comisionesAsignaturas} eliminarComisionAsignatura={eliminarComisionAsignatura} mapas={mapas} guardando={guardando} />
              </Seccion>

              <Seccion id="autoridades" icono={<ShieldUser size={23} />} titulo="Autoridades" abierta={seccionAbierta === "autoridades"} onToggle={setSeccionAbierta}>
                <SeccionAutoridades nuevaAutoridad={nuevaAutoridad} cambiarNuevaAutoridad={(e) => setNuevaAutoridad({ ...nuevaAutoridad, [e.target.name]: e.target.value })} tiposAutoridad={tiposAutoridad} legajos={legajos} comisionesAsignaturas={comisionesAsignaturas} agregarAutoridad={agregarAutoridad} autoridades={autoridades} eliminarAutoridad={eliminarAutoridad} mapas={mapas} guardando={guardando} />
              </Seccion>

              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-200 bg-white">
                <button type="button" onClick={() => navigate(`/comisiones/${id}`)} className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100">Cancelar</button>
                <button type="submit" disabled={guardando} className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 disabled:opacity-60"><Save size={22} />{guardando ? "Guardando..." : "Guardar comisión"}</button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
