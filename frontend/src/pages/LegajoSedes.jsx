import { useEffect, useState } from "react";
import { MapPinned, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { sedeService } from "../services/sedeService";
import { legajoSedesService } from "../services/legajoSedesService";
import LegajoSedeModal from "../components/LegajoSedes/LegajoSedeModal";

const formularioInicial = { legajo_id: "", sede_id: "", es_autoridad: false, es_sede_base: false };

export default function LegajoSedes() {
  const [legajoSedes, setLegajoSedes] = useState([]);
  const [legajos, setLegajos] = useState([]);
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
      const [resLS, resLeg, resSedes] = await Promise.all([
        legajoSedesService.obtenerTodos(),
        apiRequest("/legajos"),
        sedeService.obtenerTodas(),
      ]);
      setLegajoSedes(resLS.data || []);
      setLegajos(resLeg.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los legajos por sede");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    const { name, type, checked, value } = e.target;
    setFormulario({ ...formulario, [name]: type === "checkbox" ? checked : value });
  }

  async function guardarLegajoSedes(e) {
    e.preventDefault();
    if (!formulario.legajo_id) return setErrorFormulario("Debe seleccionar un legajo");
    if (!formulario.sede_id) return setErrorFormulario("Debe seleccionar una sede");

    const payload = {
      legajo_id: Number(formulario.legajo_id),
      sede_id: Number(formulario.sede_id),
      es_autoridad: formulario.es_autoridad ? 1 : 0,
      es_sede_base: formulario.es_sede_base ? 1 : 0,
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      if (editandoId) {
        await legajoSedesService.actualizar(editandoId, payload);
      } else {
        await legajoSedesService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarLegajoSedes(id) {
    if (!confirm("¿Seguro que querés desvincular este legajo de la sede?")) return;
    try {
      const res = await legajoSedesService.eliminar(id);
      alert(res.message || "Vinculación eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la vinculación");
    }
  }

  const obtenerNumeroLegajo = (id) => legajos.find((l) => l.id === id)?.numero || "-";
  const obtenerNombreSede = (id) => sedes.find((s) => s.id === id)?.nombre || "-";

  const legajoSedesFiltrados = legajoSedes.filter((ls) => {
    const term = busqueda.toLowerCase();
    const nroLeg = obtenerNumeroLegajo(ls.legajo_id).toLowerCase();
    const sedeName = obtenerNombreSede(ls.sede_id).toLowerCase();
    return nroLeg.includes(term) || sedeName.includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <MapPinned size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Legajos por Sede</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las vinculaciones de legajos a sedes operativas.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nueva Sede
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por legajo o sede" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Sede</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Autoridad</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Sede Base</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">Cargando vinculaciones...</td></tr>
                ) : legajoSedesFiltrados.length > 0 ? (
                  legajoSedesFiltrados.map((ls) => (
                    <tr key={ls.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">Legajo {obtenerNumeroLegajo(ls.legajo_id)}</td>
                      <td className="px-5 py-5 text-slate-700">{obtenerNombreSede(ls.sede_id)}</td>
                      <td className="px-5 py-5 text-slate-600">{ls.es_autoridad === 1 || ls.es_autoridad === true ? "Sí" : "No"}</td>
                      <td className="px-5 py-5 text-slate-600">{ls.es_sede_base === 1 || ls.es_sede_base === true ? "Sí" : "No"}</td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ legajo_id: ls.legajo_id, sede_id: ls.sede_id, es_autoridad: Boolean(ls.es_autoridad), es_sede_base: Boolean(ls.es_sede_base) }); setEditandoId(ls.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarLegajoSedes(ls.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No se encontraron registros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <LegajoSedeModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarLegajoSedes={guardarLegajoSedes} legajos={legajos} sedes={sedes} />
    </div>
  );
}
