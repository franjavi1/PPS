import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { aulaService } from "../services/aulaService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { comisionService } from "../services/comisionService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";
import ComisionAsignaturaModal from "../components/ComisionesAsignaturas/ComisionAsignaturaModal";

const formularioInicial = { plan_asignaturas_id: "", aula_id: "", comision_id: "", nombre: "", modalidad: "", cupo_maximo: "", estado: "Activo" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true || estado === "Activo" ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true || estado === "Activo" ? "Activa" : "Inactiva"}
  </span>
);

export default function ComisionesAsignaturas() {
  const [registros, setRegistros] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [comisiones, setComisiones] = useState([]);
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
      const [resRegs, resPA, resAsig, resPlanes, resAulas, resComs, resSedes] = await Promise.all([
        comisionAsignaturaService.obtainAll || comisionAsignaturaService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(),
        planService.obtenerTodos(),
        aulaService.obtenerTodas(),
        comisionService.obtenerTodas(),
        sedeService.obtenerTodas(),
      ]);
      setRegistros(resRegs.data || []);
      setPlanesAsignaturas(resPA.data || []);
      setAsignaturas(resAsig.data || []);
      setPlanes(resPlanes.data || []);
      setAulas(resAulas.data || []);
      setComisiones(resComs.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las comisiones asignaturas");
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
      comisiones: comisiones.reduce((acc, x) => ({ ...acc, [x.id_comision]: x.descripcion }), {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes, aulas, comisiones]);

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarRegistro(e) {
    e.preventDefault();
    const paId = Number(formulario.plan_asignaturas_id);
    const aulaId = Number(formulario.aula_id);
    const comisionId = Number(formulario.comision_id);
    const nombre = formulario.nombre.trim();
    if (!paId) return setErrorFormulario("Debe seleccionar un plan asignatura");
    if (!aulaId) return setErrorFormulario("Debe seleccionar un aula");
    if (!comisionId) return setErrorFormulario("Debe seleccionar una comisión");
    if (!nombre) return setErrorFormulario("El nombre es obligatorio");

    const payload = {
      plan_asignaturas_id: paId,
      aula_id: aulaId,
      comision_id: comisionId,
      nombre,
      modalidad: formulario.modalidad.trim(),
      cupo_maximo: Number(formulario.cupo_maximo),
      estado: formulario.estado,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      if (editandoId) {
        await comisionAsignaturaService.actualizar(editandoId, payload);
      } else {
        await comisionAsignaturaService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarRegistro(id) {
    if (!confirm("¿Seguro que querés eliminar esta comision asignatura?")) return;
    try {
      const res = await comisionAsignaturaService.eliminar(id);
      alert(res.message || "Eliminado correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar");
    }
  }

  const registrosFiltrados = registros.filter((r) => {
    const term = busqueda.toLowerCase();
    return String(r.nombre || "").toLowerCase().includes(term) || (mapas.comisiones[r.comision_id] || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><BookOpenCheck size={30} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Materias en Comisión</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las asignaturas dictadas dentro de cada comisión.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100"><RefreshCcw size={22} /> Actualizar</button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800"><PlusCircle size={22} /> Nueva Materia</button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por materia o comisión" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Materia de Cursado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Comisión</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Aula</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Cupo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-500">Cargando materias...</td></tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((r) => (
                    <tr key={r.id_comision_asignatura} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">
                        <span className="block font-bold">{r.nombre}</span>
                        <span className="text-xs text-slate-500">{mapas.planesAsignaturas[r.plan_asignaturas_id]}</span>
                      </td>
                      <td className="px-5 py-5 text-slate-700 font-semibold">{mapas.comisiones[r.comision_id]}</td>
                      <td className="px-5 py-5 text-slate-600">{mapas.aulas[r.aula_id]}</td>
                      <td className="px-5 py-5 text-slate-600">{r.cupo_maximo} alumnos</td>
                      <td className="px-5 py-5"><EstadoBadge estado={r.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ plan_asignaturas_id: r.plan_asignaturas_id, aula_id: r.aula_id, comision_id: r.comision_id, nombre: r.nombre || "", modalidad: r.modalidad || "", cupo_maximo: r.cupo_maximo || "", estado: r.estado }); setEditandoId(r.id_comision_asignatura); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarRegistro(r.id_comision_asignatura)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
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

      <ComisionAsignaturaModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarRegistro={guardarRegistro} planesAsignaturas={planesAsignaturas} aulas={aulas} comisiones={comisiones} mapas={mapas} />
    </div>
  );
}
