import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  BookMarked,
  BookOpen,
  CalendarDays,
  FileText,
  GitBranch,
  Hash,
  MapPinned,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import { tipoPlanesService } from "../services/tipoPlanesService";

function VerPlan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [planAsignaturas, setPlanAsignaturas] = useState([]);
  const [correlativas, setCorrelativas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarDatos();
  }, [id]);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaPlan,
        respuestaTiposPlanes,
        respuestaPlanAsignaturas,
        respuestaCorrelativas,
        respuestaAsignaturas,
        respuestaRangos,
        respuestaSedes,
      ] = await Promise.all([
        planService.obtenerPorId(id),
        tipoPlanesService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        paCorrelativaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);

      setPlan(respuestaPlan.data || null);
      setTiposPlanes(respuestaTiposPlanes.data || []);
      const planAsignaturasDelPlan = (respuestaPlanAsignaturas.data || []).filter(
          (item) => Number(item.plan_id) === Number(id),
        );
      const idsPlanAsignaturas = planAsignaturasDelPlan.map((item) => Number(item.id));

      setPlanAsignaturas(
        planAsignaturasDelPlan,
      );
      setCorrelativas(
        (respuestaCorrelativas.data || []).filter((item) =>
          idsPlanAsignaturas.includes(Number(item.pa_id)),
        ),
      );
      setAsignaturas(respuestaAsignaturas.data || []);
      setRangos(respuestaRangos.data || []);
      setSedes(respuestaSedes.data || []);
    } catch (err) {
      setError(obtenerMensajeError(err));
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => {
    return {
      asignaturas: crearMapa(asignaturas, "id", "nombre"),
      rangos: crearMapa(rangos, "id", "descripcion"),
      sedes: crearMapa(sedes, "id", "nombre"),
      tiposPlanes: crearMapa(tiposPlanes, "id_tipo_planes", "descripcion"),
    };
  }, [asignaturas, rangos, sedes, tiposPlanes]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <BookOpen size={28} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-700 uppercase">
                  Plan de estudio
                </p>
                <h1 className="text-3xl font-extrabold text-slate-800 mt-1">
                  {plan?.nombre || "Detalle del plan"}
                </h1>
                <p className="text-slate-500 mt-2">
                  Consulta las asignaturas y condiciones del plan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/planes")}
              className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-5 py-3 rounded-lg font-bold hover:bg-slate-100 transition cursor-pointer"
            >
              <ArrowLeft size={20} />
              Volver
            </button>
          </div>

          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-slate-500 font-semibold">
              Cargando plan...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <InfoCard
                  icono={<FileText size={24} />}
                  titulo="Tipo"
                  texto={mapas.tiposPlanes[plan?.tipo_planes_id_tipo_planes] || "-"}
                />
                <InfoCard
                  icono={<Hash size={24} />}
                  titulo="Resolucion"
                  texto={plan?.resolucion_ministerial || "-"}
                />
                <InfoCard
                  icono={<CalendarDays size={24} />}
                  titulo="Vigencia desde"
                  texto={formatearFecha(plan?.vigencia_dde)}
                />
                <InfoCard
                  icono={<CalendarDays size={24} />}
                  titulo="Vigencia hasta"
                  texto={formatearFecha(plan?.vigencia_hta)}
                />
              </div>

              {plan?.descrip && (
                <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase">
                    Descripcion
                  </p>
                  <p className="text-slate-700 font-semibold mt-2">
                    {plan.descrip}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-2xl font-extrabold text-slate-800">
                  Asignaturas
                </h2>
                <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-sm font-bold">
                  {planAsignaturas.length} cargadas
                </span>
              </div>

              {planAsignaturas.length > 0 ? (
                <div className="space-y-4">
                  {planAsignaturas.map((item) => (
                    <article
                      key={item.id}
                      className="border border-slate-200 rounded-xl bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                        <div>
                          <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center mb-3">
                            <BookMarked size={24} />
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase">
                            Asignatura
                          </p>
                          <h3 className="text-xl font-extrabold text-slate-800 mt-1">
                            {mapas.asignaturas[item.asignatura_id] || "-"}
                          </h3>
                          <p className="flex items-center gap-2 text-slate-600 font-semibold mt-2">
                            <MapPinned size={18} />
                            {mapas.sedes[item.sedes_id] || "-"}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3 text-sm">
                          <Dato label="Rango minimo" value={mapas.rangos[item.rango_minimo_id]} />
                          <Dato label="Regimen" value={item.regimen} />
                          <Dato label="Modalidad" value={item.modalidad} />
                          <Dato label="Presentismo" value={`${item.presentismo_porc}%`} />
                          <Dato label="Regularizacion" value={item.regularizacion_prom} />
                          <Dato label="Final" value={item.final_aprobacion} />
                          <Dato label="Duracion" value={item.duracion} />
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-200">
                        <p className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase mb-3">
                          <GitBranch size={18} />
                          Correlativas
                        </p>
                        {obtenerCorrelativasDeAsignatura(item.id, correlativas).length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {obtenerCorrelativasDeAsignatura(item.id, correlativas).map(
                              (correlativa) => (
                                <span
                                  key={correlativa.id}
                                  className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-md text-sm font-bold"
                                >
                                  {mapas.asignaturas[correlativa.asignatura_id] || "-"}
                                </span>
                              ),
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-500 font-semibold">
                            Sin correlativas.
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="border border-slate-200 rounded-xl bg-slate-50 p-8 text-center text-slate-500 font-semibold">
                  Este plan todavia no tiene asignaturas asociadas.
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function InfoCard({ icono, titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
      <div className="text-red-700 mb-3">{icono}</div>
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

function Dato({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 font-bold">{label}</p>
      <p className="text-slate-800 font-semibold">{value || "-"}</p>
    </div>
  );
}

function crearMapa(items, idKey, valueKey) {
  return items.reduce((acc, item) => {
    acc[item[idKey]] = item[valueKey];
    return acc;
  }, {});
}

function formatearFecha(fecha) {
  if (!fecha) {
    return "-";
  }

  return String(fecha).slice(0, 10);
}

function obtenerCorrelativasDeAsignatura(planAsignaturaId, correlativas) {
  return correlativas.filter(
    (item) => Number(item.pa_id) === Number(planAsignaturaId),
  );
}

function obtenerMensajeError(err) {
  const errores = err.errors || {};
  const primerCampo = Object.keys(errores)[0];

  if (primerCampo && Array.isArray(errores[primerCampo])) {
    return errores[primerCampo][0];
  }

  return err.message || "No se pudo obtener el plan";
}

export default VerPlan;
