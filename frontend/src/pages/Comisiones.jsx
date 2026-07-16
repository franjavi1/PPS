import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Eye, GraduationCap, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { comisionService } from "../services/comisionService";
import ComisionModal from "../components/Comisiones/ComisionModal";

const formularioInicial = { descripcion: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activa" : "Inactiva"}
  </span>
);

export default function Comisiones() {
  const navigate = useNavigate();
  const [comisiones, setComisiones] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarComisiones();
  }, []);

  async function cargarComisiones() {
    try {
      setCargando(true);
      setError("");
      const respuesta = await comisionService.obtenerTodas();
      setComisiones(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las comisiones");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarComision(e) {
    e.preventDefault();
    const descripcion = formulario.descripcion.trim();
    if (!descripcion) return setErrorFormulario("La descripción es obligatoria");
    if (descripcion.length > 45) return setErrorFormulario("La descripción debe tener hasta 45 caracteres");

    const payload = { descripcion, usuario_accion: 1 };
    try {
      setErrorFormulario("");
      if (editandoId) {
        await comisionService.actualizar(editandoId, payload);
      } else {
        await comisionService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarComisiones();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarComision(id) {
    if (!confirm("¿Seguro que querés eliminar esta comisión?")) return;
    try {
      const res = await comisionService.eliminar(id);
      alert(res.message || "Comisión eliminada correctamente");
      await cargarComisiones();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la comisión");
    }
  }

  const comisionesFiltradas = comisiones.filter((c) =>
    String(c.descripcion || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <GraduationCap size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Comisiones</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las divisiones o comisiones.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarComisiones} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nueva comisión
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por comisión" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Comisión</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-500">Cargando comisiones...</td></tr>
                ) : comisionesFiltradas.length > 0 ? (
                  comisionesFiltradas.map((c) => (
                    <tr key={c.id_comision} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{c.descripcion}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={c.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => navigate(`/comisiones/${c.id_comision}`)} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Eye size={16} /> Ver</button>
                          <button onClick={() => { setFormulario({ descripcion: c.descripcion || "" }); setEditandoId(c.id_comision); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarComision(c.id_comision)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="3" className="text-center py-10 text-slate-500">No se encontraron comisiones.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <ComisionModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarComision={guardarComision} />
    </div>
  );
}
