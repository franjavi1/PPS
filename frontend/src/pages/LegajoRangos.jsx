import { useEffect, useState } from "react";
import { ChevronsUp, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { rangoService } from "../services/rangoService";
import { legajoRangosService } from "../services/legajoRangosService";
import LegajoRangoModal from "../components/LegajoRangos/LegajoRangoModal";

const formularioInicial = { legajo_id: "", rangos_institucionales_id: "" };

export default function LegajoRangos() {
  const [legajoRangos, setLegajoRangos] = useState([]);
  const [legajos, setLegajos] = useState([]);
  const [rangos, setRangos] = useState([]);
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
      const [resLR, resLeg, resRangos] = await Promise.all([
        legajoRangosService.obtenerTodos(),
        apiRequest("/legajos"),
        rangoService.obtenerTodos(),
      ]);
      setLegajoRangos(resLR.data || []);
      setLegajos(resLeg.data || []);
      setRangos(resRangos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los rangos de legajos");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarLegajoRangos(e) {
    e.preventDefault();
    if (!formulario.legajo_id) return setErrorFormulario("El legajo es obligatorio");
    if (!formulario.rangos_institucionales_id) return setErrorFormulario("El rango es obligatorio");

    const payload = {
      legajo_id: Number(formulario.legajo_id),
      rangos_institucionales_id: Number(formulario.rangos_institucionales_id),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      if (editandoId) {
        await legajoRangosService.actualizar(editandoId, payload);
      } else {
        await legajoRangosService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarLegajoRangos(id) {
    if (!confirm("¿Seguro que querés desvincular este rango del legajo?")) return;
    try {
      const res = await legajoRangosService.eliminar(id);
      alert(res.message || "Vinculación eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la vinculación");
    }
  }

  const obtenerNumeroLegajo = (id) => legajos.find((l) => l.id === id)?.numero || "-";
  const obtenerDescRango = (id) => rangos.find((r) => r.id === id)?.descripcion || "-";

  const legajoRangosFiltrados = legajoRangos.filter((lr) => {
    const term = busqueda.toLowerCase();
    const nroLeg = obtenerNumeroLegajo(lr.legajo_id).toLowerCase();
    const descRango = obtenerDescRango(lr.rangos_institucionales_id).toLowerCase();
    return nroLeg.includes(term) || descRango.includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <ChevronsUp size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Rangos por Legajo</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las jerarquías de cada legajo.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nuevo Rango
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por legajo o rango" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Legajo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Rango Institucional</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-500">Cargando rangos por legajo...</td></tr>
                ) : legajoRangosFiltrados.length > 0 ? (
                  legajoRangosFiltrados.map((lr) => (
                    <tr key={lr.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">Legajo {obtenerNumeroLegajo(lr.legajo_id)}</td>
                      <td className="px-5 py-5 text-slate-700 font-semibold">{obtenerDescRango(lr.rangos_institucionales_id)}</td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ legajo_id: lr.legajo_id, rangos_institucionales_id: lr.rangos_institucionales_id }); setEditandoId(lr.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarLegajoRangos(lr.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-500">No se encontraron registros.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <LegajoRangoModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarLegajoRangos={guardarLegajoRangos} legajos={legajos} rangos={rangos} />
    </div>
  );
}
