import { useEffect, useMemo, useState } from "react";
import { BookMarked, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { planService } from "../services/planesService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { rangoService } from "../services/rangoService";
import { sedeService } from "../services/sedeService";
import PlanAsignaturaModal from "../components/PlanesAsignaturas/PlanAsignaturaModal";

const formularioInicial = { asignatura_id: "", plan_id: "", rango_minimo_id: "", sedes_id: "", presentismo_porc: "", regularizacion_prom: "", final_aprobacion: "", duracion: "", regimen: "", modalidad: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activa" : "Inactiva"}
  </span>
);

export default function PlanesAsignaturas() {
  const [registros, setRegistros] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [rangos, setRangos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resRegs, resAsig, resPlanes, resRangos, resSedes] = await Promise.all([
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        rangoService.obtenerTodos(),
        sedeService.obtenerTodas(),
      ]);
      setRegistros(resRegs.data || []);
      setAsignaturas(resAsig.data || []);
      setPlanes(resPlanes.data || []);
      setRangos(resRangos.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los planes asignaturas");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => ({
    asignaturas: asignaturas.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
    planes: planes.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
    rangos: rangos.reduce((acc, x) => ({ ...acc, [x.id]: x.descripcion }), {}),
    sedes: sedes.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
  }), [asignaturas, planes, rangos, sedes]);

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarRegistro(e) {
    e.preventDefault();
    const asigId = Number(formulario.asignatura_id);
    const planId = Number(formulario.plan_id);
    const rangoId = Number(formulario.rango_minimo_id);
    const sedeId = Number(formulario.sedes_id);
    if (!asigId || !planId || !rangoId || !sedeId) return setErrorFormulario("Debe completar todos los select obligatorios");

    const payload = {
      asignatura_id: asigId,
      plan_id: planId,
      rango_minimo_id: rangoId,
      sedes_id: sedeId,
      presentismo_porc: Number(formulario.presentismo_porc),
      regularizacion_prom: Number(formulario.regularizacion_prom),
      final_aprobacion: Number(formulario.final_aprobacion),
      duracion: Number(formulario.duracion),
      regimen: formulario.regimen.trim(),
      modalidad: formulario.modalidad.trim(),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      if (editandoId) {
        await planAsignaturaService.actualizar(editandoId, payload);
      } else {
        await planAsignaturaService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarRegistro(id) {
    if (!confirm("¿Seguro que querés eliminar esta asignatura del plan?")) return;
    try {
      const res = await planAsignaturaService.eliminar(id);
      alert(res.message || "Asignatura quitada del plan correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo quitar");
    }
  }

  const registrosFiltrados = registros.filter((r) => {
    const term = busqueda.toLowerCase();
    const nombreAsig = (mapas.asignaturas[r.asignatura_id] || "").toLowerCase();
    const nombrePlan = (mapas.planes[r.plan_id] || "").toLowerCase();
    return nombreAsig.includes(term) || nombrePlan.includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><BookMarked size={30} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Materias en Planes</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las asignaturas correspondientes a cada plan de estudios.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100"><RefreshCcw size={22} /> Actualizar</button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800"><PlusCircle size={22} /> Nueva Materia</button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por plan o asignatura" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Plan</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Asignatura</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Rango Mínimo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Sede</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-500">Cargando materias de planes...</td></tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{mapas.planes[r.plan_id]}</td>
                      <td className="px-5 py-5 text-slate-700 font-bold text-red-600">{mapas.asignaturas[r.asignatura_id]}</td>
                      <td className="px-5 py-5 text-slate-600">{mapas.rangos[r.rango_minimo_id]}</td>
                      <td className="px-5 py-5 text-slate-600">{mapas.sedes[r.sedes_id]}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={r.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ asignatura_id: r.asignatura_id, plan_id: r.plan_id, rango_minimo_id: r.rango_minimo_id, sedes_id: r.sedes_id, presentismo_porc: r.presentismo_porc || "", regularizacion_prom: r.regularizacion_prom || "", final_aprobacion: r.final_aprobacion || "", duracion: r.duracion || "", regimen: r.regimen || "", modalidad: r.modalidad || "" }); setEditandoId(r.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarRegistro(r.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-500">No se encontraron registros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <PlanAsignaturaModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarRegistro={guardarRegistro} asignaturas={asignaturas} planes={planes} rangos={rangos} sedes={sedes} />
    </div>
  );
}
