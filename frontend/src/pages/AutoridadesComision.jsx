import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Pencil, PlusCircle, RefreshCcw, Search, Trash2, ShieldUser } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { autoridadComisionService } from "../services/autoridadComisionService";
import { comisionAsignaturaService } from "../services/comisionAsignaturaService";
import { tipoAutoridadService } from "../services/tipoAutoridadService";
import AutoridadesComisionModal from "../components/AutoridadesComision/AutoridadesComisionModal";

const formularioInicial = { tipo_autoridad_id: "", legajo_id: "", comision_id: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activa" : "Inactiva"}
  </span>
);

export default function AutoridadesComision() {
  const [registros, setRegistros] = useState([]);
  const [tiposAutoridad, setTiposAutoridad] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [comisionesAsignaturas, setComisionesAsignaturas] = useState([]);
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
      const [resAut, resTipos, resLegs, resComs] = await Promise.all([
        autoridadComisionService.obtenerTodos(),
        tipoAutoridadService.obtenerTodos(),
        apiRequest("/legajos"),
        comisionAsignaturaService.obtenerTodos(),
      ]);
      setRegistros(resAut.data || []);
      setTiposAutoridad(resTipos.data || []);
      setLegajos(resLegs.data || []);
      setComisionesAsignaturas(resComs.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las autoridades");
    } finally {
      setCargando(false);
    }
  }

  const mapas = useMemo(() => ({
    tiposAutoridad: tiposAutoridad.reduce((acc, x) => ({ ...acc, [x.id]: x.descripcion }), {}),
    legajos: legajos.reduce((acc, x) => ({ ...acc, [x.id]: x.numero ? `Nro. ${x.numero}` : `Legajo #${x.id}` }), {}),
    comisiones: comisionesAsignaturas.reduce((acc, x) => ({ ...acc, [x.id_comision_asignatura]: x.nombre || `Asignatura #${x.id_comision_asignatura}` }), {}),
  }), [tiposAutoridad, legajos, comisionesAsignaturas]);

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarRegistro(e) {
    e.preventDefault();
    const tipoId = Number(formulario.tipo_autoridad_id);
    const legajoId = Number(formulario.legajo_id);
    const comisionId = Number(formulario.comision_id);
    if (!tipoId) return setErrorFormulario("Debe seleccionar un tipo de autoridad");
    if (!legajoId) return setErrorFormulario("Debe seleccionar un legajo");
    if (!comisionId) return setErrorFormulario("Debe seleccionar una comisión asignatura");

    const payload = { tipo_autoridad_id: tipoId, legajo_id: legajoId, comision_id: comisionId, usuario_accion: 1 };
    try {
      setErrorFormulario("");
      if (editandoId) {
        await autoridadComisionService.actualizar(editandoId, payload);
      } else {
        await autoridadComisionService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarRegistro(id) {
    if (!confirm("¿Seguro que querés eliminar esta autoridad de comisión?")) return;
    try {
      const res = await autoridadComisionService.eliminar(id);
      alert(res.message || "Autoridad eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la autoridad");
    }
  }

  const registrosFiltrados = registros.filter((r) => {
    const term = busqueda.toLowerCase();
    const tipoDesc = (mapas.tiposAutoridad[r.tipo_autoridad_id] || "").toLowerCase();
    const legajoDesc = (mapas.legajos[r.legajo_id] || "").toLowerCase();
    const comisionDesc = (mapas.comisiones[r.comision_id] || "").toLowerCase();
    return tipoDesc.includes(term) || legajoDesc.includes(term) || comisionDesc.includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><ShieldUser size={30} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Autoridades de Comisión</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las autoridades asignadas a las asignaturas de cada comisión.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100"><RefreshCcw size={22} /> Actualizar</button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800"><PlusCircle size={22} /> Nueva Autoridad</button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por tipo, legajo o comisión" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo Autoridad</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Comisión Asignatura</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">Cargando autoridades...</td></tr>
                ) : registrosFiltrados.length > 0 ? (
                  registrosFiltrados.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{mapas.tiposAutoridad[r.tipo_autoridad_id]}</td>
                      <td className="px-5 py-5 text-slate-700">{mapas.legajos[r.legajo_id]}</td>
                      <td className="px-5 py-5 text-slate-700 font-bold text-red-600">{mapas.comisiones[r.comision_id]}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={r.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ tipo_autoridad_id: r.tipo_autoridad_id, legajo_id: r.legajo_id, comision_id: r.comision_id }); setEditandoId(r.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarRegistro(r.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No se encontraron autoridades.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <AutoridadesComisionModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarRegistro={guardarRegistro} tiposAutoridad={tiposAutoridad} legajos={legajos} comisionesAsignaturas={comisionesAsignaturas} />
    </div>
  );
}
