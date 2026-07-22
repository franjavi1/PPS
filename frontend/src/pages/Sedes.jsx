import { useEffect, useState } from "react";
import { Building2, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { sedeService } from "../services/sedeService";
import { tipoSedeService } from "../services/tipoSedeService";
import SedeModal from "../components/Sedes/SedeModal";

const formularioInicial = { tipo_sede_id: "", nombre: "", direccion: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activa" : "Inactiva"}
  </span>
);

export default function Sedes() {
  const [sedes, setSedes] = useState([]);
  const [tiposSedes, setTiposSedes] = useState([]);
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
      const [resSedes, resTipos] = await Promise.all([sedeService.obtenerTodas(), tipoSedeService.obtenerTodas()]);
      setSedes(resSedes.data || []);
      setTiposSedes(resTipos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las sedes");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarSede(e) {
    e.preventDefault();
    if (!formulario.tipo_sede_id) return setErrorFormulario("El tipo de sede es obligatorio");
    if (!formulario.nombre.trim()) return setErrorFormulario("El nombre de la sede es obligatorio");
    if (!formulario.direccion.trim()) return setErrorFormulario("La dirección de la sede es obligatoria");

    const payload = {
      tipo_sede_id: Number(formulario.tipo_sede_id),
      nombre: formulario.nombre.trim(),
      direccion: formulario.direccion.trim(),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      if (editandoId) {
        await sedeService.actualizar(editandoId, payload);
      } else {
        await sedeService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarSede(id) {
    if (!confirm("¿Seguro que querés eliminar esta sede?")) return;
    try {
      const res = await sedeService.eliminar(id);
      alert(res.message || "Sede eliminada correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la sede");
    }
  }

  const sedesFiltradas = sedes.filter((s) => {
    const term = busqueda.toLowerCase();
    return String(s.nombre || "").toLowerCase().includes(term) || String(s.direccion || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <Building2 size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Sedes</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las sedes operativas de la institución.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nueva sede
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por sede o dirección" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Dirección</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">Cargando sedes...</td></tr>
                ) : sedesFiltradas.length > 0 ? (
                  sedesFiltradas.map((sede) => (
                    <tr key={sede.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{sede.nombre}</td>
                      <td className="px-5 py-5 text-slate-600">{sede.direccion}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={sede.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ tipo_sede_id: String(sede.tipo_sede_id || ""), nombre: sede.nombre || "", direccion: sede.direccion || "" }); setEditandoId(sede.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarSede(sede.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">No se encontraron sedes.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <SedeModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarSede={guardarSede} tiposSedes={tiposSedes} />
    </div>
  );
}
