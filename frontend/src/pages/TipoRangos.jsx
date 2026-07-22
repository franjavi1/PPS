import { useEffect, useState } from "react";
import { ChevronsUp, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { rangoService } from "../services/rangoService";
import TipoRangoModal from "../components/TipoRangos/TipoRangoModal";

const formularioInicial = { descripcion: "", nivel_jerarquia: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activo" : "Inactivo"}
  </span>
);

export default function TipoRangos() {
  const [rangos, setRangos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  useEffect(() => {
    cargarRangos();
  }, []);

  async function cargarRangos() {
    try {
      setCargando(true);
      setError("");
      const respuesta = await rangoService.obtenerTodos();
      setRangos(respuesta.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los tipos de rango");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarRango(e) {
    e.preventDefault();
    const descripcion = formulario.descripcion.trim();
    const nivelJerarquia = Number(formulario.nivel_jerarquia);
    if (!descripcion) return setErrorFormulario("La descripción es obligatoria");
    if (descripcion.length > 45) return setErrorFormulario("La descripción debe tener hasta 45 caracteres");
    if (!nivelJerarquia || nivelJerarquia <= 0) return setErrorFormulario("El nivel de jerarquía debe ser un número positivo");

    const payload = { descripcion, nivel_jerarquia: nivelJerarquia, usuario_accion: 1 };
    try {
      setErrorFormulario("");
      if (editandoId) {
        await rangoService.actualizar(editandoId, payload);
      } else {
        await rangoService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarRangos();
    } catch (err) {
      setErrorFormulario(err.message || "Error al guardar");
    }
  }

  async function eliminarRango(id) {
    if (!confirm("¿Seguro que querés eliminar este rango?")) return;
    try {
      const res = await rangoService.eliminar(id);
      alert(res.message || "Rango eliminado correctamente");
      await cargarRangos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el rango");
    }
  }

  const rangosFiltrados = rangos.filter((r) =>
    String(r.descripcion || "").toLowerCase().includes(busqueda.toLowerCase())
  );

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
                <h1 className="text-4xl font-extrabold text-slate-800">Rangos Jerárquicos</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las jerarquías operativas.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarRangos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nuevo rango
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por rango" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Rango</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Nivel Jerarquía</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">Cargando rangos...</td></tr>
                ) : rangosFiltrados.length > 0 ? (
                  rangosFiltrados.map((r) => (
                    <tr key={r.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{r.descripcion}</td>
                      <td className="px-5 py-5 text-slate-600">Nivel {r.nivel_jerarquia}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={r.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ descripcion: r.descripcion || "", nivel_jerarquia: String(r.nivel_jerarquia || "") }); setEditandoId(r.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarRango(r.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">No se encontraron rangos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <TipoRangoModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarRango={guardarRango} />
    </div>
  );
}
