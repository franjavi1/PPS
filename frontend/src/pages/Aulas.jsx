import { useEffect, useMemo, useState } from "react";
import { DoorOpen, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { aulaService } from "../services/aulaService";
import { sedeService } from "../services/sedeService";
import AulaModal from "../components/Aulas/AulaModal";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { estaAutenticado } from "../utils/auth";

const formularioInicial = { sedes_id: "", aula: "", es_virtual: "0" };

const TipoBadge = ({ esVirtual }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${esVirtual === 1 || esVirtual === true ? "bg-blue-100 text-blue-700 border-blue-300" : "bg-slate-100 text-slate-700 border-slate-300"}`}>
    {esVirtual === 1 || esVirtual === true ? "Virtual" : "Física"}
  </span>
);

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activa" : "Inactiva"}
  </span>
);

export default function Aulas() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();
  const [aulas, setAulas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  // Validamos que exista una sesión activa y que el rol del usuario le permita leer aulas antes de renderizar la vista.
  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
      return;
    }
    if (!hasPermission(currentUserRole, "leer")) {
      navigate("/inicio");
      return;
    }
    cargarDatos();
  }, [currentUserRole]);

  // Recuperamos las aulas y el listado completo de sedes en paralelo para agilizar los combos.
  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resAulas, resSedes] = await Promise.all([aulaService.obtenerTodas(), sedeService.obtenerTodas()]);
      setAulas(resAulas.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las aulas");
    } finally {
      setCargando(false);
    }
  }

  const sedesPorId = useMemo(() => sedes.reduce((acc, s) => ({ ...acc, [s.id]: s.nombre }), {}), [sedes]);

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  // Guardamos el aula. Convertimos a tipos numéricos adecuados ya que la base de datos Postgres los requiere así.
  async function guardarAula(e) {
    e.preventDefault();
    const sedesId = Number(formulario.sedes_id);
    const nombreAula = formulario.aula.trim();
    if (!sedesId) return setErrorFormulario("Debe seleccionar una sede");
    if (!nombreAula) return setErrorFormulario("El nombre del aula es obligatorio");

    const payload = { sedes_id: sedesId, aula: nombreAula, es_virtual: Number(formulario.es_virtual), usuario_accion: 1 };
    try {
      setErrorFormulario("");
      if (editandoId) {
        await aulaService.actualizar(editandoId, payload);
      } else {
        await aulaService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "No se pudo guardar");
    }
  }

  // Eliminación directa de aula tras la confirmación explícita del usuario administrativo.
  async function eliminarAula(id) {
    if (!confirm("¿Seguro que querés eliminar esta aula?")) return;
    try {
      const res = await aulaService.eliminar(id);
      alert(res.message || "Aula eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la aula");
    }
  }

  const aulasFiltradas = aulas.filter((a) => {
    const term = busqueda.toLowerCase();
    const sedeNombre = sedesPorId[a.sedes_id] || "";
    return String(a.aula || "").toLowerCase().includes(term) || sedeNombre.toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><DoorOpen size={30} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Aulas</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona aulas físicas o virtuales por sede.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100"><RefreshCcw size={22} /> Actualizar</button>
              {hasPermission(currentUserRole, "crear") && (
                <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800"><PlusCircle size={22} /> Nueva aula</button>
              )}
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por aula o sede" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse bg-white">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Aula</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Sede</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">Cargando aulas...</td></tr>
                ) : aulasFiltradas.length > 0 ? (
                  aulasFiltradas.map((aula) => (
                    <tr key={aula.id_aula} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{aula.aula}</td>
                      <td className="px-5 py-5 text-slate-700">{sedesPorId[aula.sedes_id] || "-"}</td>
                      <td className="px-5 py-5"><TipoBadge esVirtual={aula.es_virtual} /></td>
                      <td className="px-5 py-5"><EstadoBadge estado={aula.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ sedes_id: String(aula.sedes_id), aula: aula.aula, es_virtual: String(aula.es_virtual) }); setEditandoId(aula.id_aula); setMostrarModal(true); }} disabled={!hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 ${hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} /> Editar</button>
                          <button
                            onClick={() => eliminarAula(aula.id_aula)}
                            // Bloqueamos el borrado si el usuario no es admin o si el registro tiene hijos en la base de datos (evita error de FK en Postgres)
                            disabled={!hasPermission(currentUserRole, "eliminar")}
                            className={`text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 ${hasPermission(currentUserRole, "eliminar") ? "" : "opacity-50 cursor-not-allowed"}`}
                          ><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No se encontraron aulas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <AulaModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarAula={guardarAula} sedes={sedes} />
    </div>
  );
}
