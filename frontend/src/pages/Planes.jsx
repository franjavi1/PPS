import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Pencil, PlusCircle, RefreshCcw, Search, Trash2, Eye } from "lucide-react";
import Navbar from "../components/Navbar";
import { planService } from "../services/planesService";
import { tipoPlanesService } from "../services/tipoPlanesService";
import PlanModal from "../components/Planes/PlanModal";

const formularioInicial = { tipo_planes_id_tipo_planes: "", resolucion_ministerial: "", nombre: "", descrip: "", vigencia_dde: "", vigencia_hta: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activo" : "Inactivo"}
  </span>
);

export default function Planes() {
  const navigate = useNavigate();
  const [planes, setPlanes] = useState([]);
  const [tiposPlanes, setTiposPlanes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  // Escuchamos el parámetro de acción de la URL para redirigir al asistente de alta guiada
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'nuevo') {
      navigate("/planes/alta");
    }
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resPlanes, resTipos] = await Promise.all([planService.obtenerTodos(), tipoPlanesService.obtenerTodos()]);
      setPlanes(resPlanes.data || []);
      setTiposPlanes(resTipos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los planes");
    } finally {
      setCargando(false);
    }
  }

  const tiposPorId = useMemo(() => tiposPlanes.reduce((acc, t) => ({ ...acc, [t.id_tipo_planes]: t.descripcion }), {}), [tiposPlanes]);

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarPlan(e) {
    e.preventDefault();
    const tipoPlanId = Number(formulario.tipo_planes_id_tipo_planes);
    const resolucionMinisterial = Number(formulario.resolucion_ministerial);
    const nombre = formulario.nombre.trim();
    if (!tipoPlanId) return setErrorFormulario("Debe seleccionar un tipo de plan");
    if (!resolucionMinisterial) return setErrorFormulario("La resolución ministerial es obligatoria");
    if (!nombre) return setErrorFormulario("El nombre del plan es obligatorio");

    const payload = {
      tipo_planes_id_tipo_planes: tipoPlanId,
      resolucion_ministerial: resolucionMinisterial,
      nombre,
      descrip: formulario.descrip.trim(),
      vigencia_dde: formulario.vigencia_dde || null,
      vigencia_hta: formulario.vigencia_hta || null,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      await planService.crear(payload);
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarPlan(id) {
    if (!confirm("¿Seguro que querés dar de baja este plan?")) return;
    try {
      const res = await planService.eliminar(id);
      alert(res.message || "Plan dado de baja correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el plan");
    }
  }

  const planesFiltrados = planes.filter((p) => {
    const term = busqueda.toLowerCase();
    return String(p.nombre || "").toLowerCase().includes(term) || String(p.resolucion_ministerial || "").includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <BookOpen size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Planes de Estudio</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona los planes curriculares e institucionales.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => navigate("/planes/alta")} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nuevo Plan
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por plan o resolución" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Plan</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Resolución</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">Cargando planes...</td></tr>
                ) : planesFiltrados.length > 0 ? (
                  planesFiltrados.map((p) => (
                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{p.nombre}</td>
                      <td className="px-5 py-5 text-slate-600">{tiposPorId[p.tipo_planes_id_tipo_planes] || "-"}</td>
                      <td className="px-5 py-5 text-slate-600">Resolución {p.resolucion_ministerial}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={p.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => navigate(`/planes/${p.id}`)} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Eye size={16} /> Ver</button>
                          <button onClick={() => navigate(`/planes/${p.id}/editar`)} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarPlan(p.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No se encontraron planes.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <PlanModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarPlan={guardarPlan} tiposPlanes={tiposPlanes} />
    </div>
  );
}
