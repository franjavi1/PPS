import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, BookOpenCheck, DoorOpen, GraduationCap, Pencil, ShieldUser, UserRound } from "lucide-react";
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
import { Dato } from "../components/FormHelpers";

const EstadoVacio = ({ texto }) => <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 text-center text-slate-500 font-semibold">{texto}</div>;
const crearMapa = (items, idKey, valueKey) => (items || []).reduce((acc, item) => ({ ...acc, [item[idKey]]: item[valueKey] }), {});

export default function VerComision() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comision, setComision] = useState(null);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
  const [autoridades, setAutoridades] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
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

      setComision(resCom.data || null);
      setComisionesAsignaturas(comisionesDeEsta);
      setAutoridades((resAut.data || []).filter((x) => idsComisionesAsignaturas.includes(Number(x.comision_id))));
      setPlanesAsignaturas(resPlanAsig.data || []);
      setAsignaturas(resAsig.data || []);
      setPlanes(resPlanes.data || []);
      setSedes(resSedes.data || []);
      setAulas(resAulas.data || []);
      setTiposAutoridad(resTipos.data || []);
      setLegajos(resLeg.data || []);
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
      aulas: crearMapa(aulas, "id_aula", "aula"),
      tiposAutoridad: crearMapa(tiposAutoridad, "id", "descripcion"),
      legajos: legajos.reduce((acc, x) => ({ ...acc, [x.id]: x.numero ? `Nro. ${x.numero}` : `Legajo #${x.id}` }), {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes, aulas, tiposAutoridad, legajos]);

  const nombreComisionAsig = (cId) => comisionesAsignaturas.find((x) => Number(x.id_comision_asignatura) === Number(cId))?.nombre || `Comisión asignatura #${cId}`;

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <GraduationCap size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">Comisión</p>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-1">{comision?.descripcion || "Detalle"}</h1>
                <p className="text-slate-500 mt-2">Consulta asignaturas, aulas y autoridades asociadas.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => navigate("/comisiones")} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100"><ArrowLeft size={20} />Volver</button>
              <button type="button" onClick={() => navigate(`/comisiones/${id}/editar`)} className="flex items-center justify-center gap-2 bg-red-700 text-white px-5 py-3 rounded-lg font-bold hover:bg-red-800"><Pencil size={20} />Editar</button>
            </div>
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {cargando ? <EstadoVacio texto="Cargando comisión..." /> : (
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Asignaturas</h2>
                {comisionesAsignaturas.length > 0 ? (
                  <div className="space-y-4">
                    {comisionesAsignaturas.map((item) => (
                      <article key={item.id_comision_asignatura} className="border border-slate-200 rounded-xl bg-slate-50 p-5">
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
                          <div>
                            <BookOpenCheck className="text-red-700 mb-3" size={24} />
                            <h3 className="text-xl font-extrabold text-slate-800">{item.nombre}</h3>
                            <p className="text-slate-600 font-semibold mt-1">{mapas.planesAsignaturas[item.plan_asignaturas_id] || "-"}</p>
                            <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1"><DoorOpen size={18} />{mapas.aulas[item.aula_id] || "-"}</p>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 text-sm">
                            <Dato label="Modalidad" value={item.modalidad} />
                            <Dato label="Cupo" value={item.cupo_maximo} />
                            <Dato label="Estado" value={item.estado === 1 || item.estado === true ? "Activo" : "Inactivo"} />
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : <EstadoVacio texto="Esta comisión no tiene asignaturas asociadas." />}
              </section>

              <section>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-4">Autoridades</h2>
                {autoridades.length > 0 ? (
                  <div className="space-y-3">
                    {autoridades.map((item) => (
                      <article key={item.id} className="border border-slate-200 rounded-xl bg-slate-50 p-5">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="flex items-center gap-2 text-lg font-extrabold text-slate-800"><ShieldUser size={22} />{mapas.tiposAutoridad[item.tipo_autoridad_id] || "-"}</p>
                            <p className="flex items-center gap-2 text-slate-600 font-semibold mt-1"><UserRound size={18} />{mapas.legajos[item.legajo_id] || "-"}</p>
                          </div>
                          <Dato label="Comisión asignatura" value={nombreComisionAsig(item.comision_id)} />
                        </div>
                      </article>
                    ))}
                  </div>
                ) : <EstadoVacio texto="Esta comisión no tiene autoridades asociadas." />}
              </section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
