import { useEffect, useMemo, useState } from "react";
import { BookMarked, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { paCorrelativaService } from "../services/paCorrelativaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { planService } from "../services/planesService";
import { sedeService } from "../services/sedeService";
import PACorrelativaModal from "../components/PACorrelativas/PACorrelativaModal";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { estaAutenticado } from "../utils/auth";

const formularioInicial = { pa_id: "", asignatura_id: "" };

export default function PACorrelativas() {
  const navigate = useNavigate();
  // Explicamos el inicio síncrono del componente y cómo consume el rol de sesión con el hook useAuth.
  const { currentUserRole } = useAuth();

  const [registros, setRegistros] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!estaAutenticado()) return navigate("/login");
    if (!hasPermission(currentUserRole, "leer")) return navigate("/inicio");
    cargarDatos();
  }, [currentUserRole]);

  async function cargarDatos() {
    try {
      setCargando(true); setError("");
      const [resRegs, resPA, resAsig, resPlanes, resSedes] = await Promise.all([
        paCorrelativaService.obtenerTodos(), planAsignaturaService.obtenerTodos(),
        asignaturaService.obtenerTodas(), planService.obtenerTodos(), sedeService.obtenerTodas(),
      ]);
      setRegistros(resRegs.data || []); setPlanesAsignaturas(resPA.data || []); setAsignaturas(resAsig.data || []);
      setPlanes(resPlanes.data || []); setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las correlativas");
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
      asignaturas: asignaturas.reduce((acc, x) => ({ ...acc, [x.id]: x.nombre }), {}),
    };
  }, [planesAsignaturas, asignaturas, planes, sedes]);

  function manejarCambio(e) { setFormulario({ ...formulario, [e.target.name]: e.target.value }); }

  async function guardarRegistro(e) {
    e.preventDefault();
    const paId = Number(formulario.pa_id);
    const asigId = Number(formulario.asignatura_id);
    if (!paId || !asigId) return setErrorFormulario("Debe completar todos los select obligatorios");

    const payload = { pa_id: paId, asignatura_id: asigId, usuario_accion: 1 };
    try {
      setErrorFormulario("");
      if (editandoId) await paCorrelativaService.actualizar(editandoId, payload);
      else await paCorrelativaService.crear(payload);
      setMostrarModal(false); setFormulario(formularioInicial); await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarRegistro(id) {
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
    if (!confirm("¿Seguro que querés quitar esta correlativa?")) return;
    try {
      await paCorrelativaService.eliminar(id); await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo quitar");
    }
  }

  const registrosFiltrados = registros.filter((r) => {
    const term = busqueda.toLowerCase();
    return (mapas.planesAsignaturas[r.pa_id] || "").toLowerCase().includes(term) || (mapas.asignaturas[r.asignatura_id] || "").toLowerCase().includes(term);
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
                <h1 className="text-4xl font-extrabold text-slate-800">Materias Correlativas</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las asignaturas correlativas requeridas para cursar cada materia.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100"><RefreshCcw size={22} /> Actualizar</button>
              {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
              {hasPermission(currentUserRole, "crear") && (
                <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800"><PlusCircle size={22} /> Nueva Correlativa</button>
              )}
            </div>
          </div>
          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por materia o correlativa" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>
          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Materia (Plan Sede)</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Requiere Correlativa (Materia)</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-500">Cargando correlativas...</td></tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{mapas.planesAsignaturas[r.pa_id]}</td>
                      <td className="px-5 py-5 text-slate-700 font-bold text-red-600">{mapas.asignaturas[r.asignatura_id]}</td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                          <button onClick={() => { setFormulario({ pa_id: r.pa_id, asignatura_id: r.asignatura_id }); setEditandoId(r.id); setMostrarModal(true); }} disabled={!hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 ${hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} /> Editar</button>
                          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                          <button onClick={() => eliminarRegistro(r.id)} disabled={!hasPermission(currentUserRole, "eliminar")} className={`text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 ${hasPermission(currentUserRole, "eliminar") ? "" : "opacity-50 cursor-not-allowed"}`}><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-500">No se encontraron correlativas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <PACorrelativaModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarRegistro={guardarRegistro} planesAsignaturas={planesAsignaturas} asignaturas={asignaturas} />
    </div>
  );
}
