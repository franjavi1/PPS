import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, PlusCircle, RefreshCcw, Search, Trash2, User } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { personasService } from "../services/personasService";
import PersonaModal from "../components/Personas/PersonaModal";

const formularioInicial = { td_id: "", nombre: "", apellido: "", numero_doc: "" };

const EstadoBadge = ({ estado }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-bold border ${estado === 1 || estado === true ? "bg-green-100 text-green-700 border-green-300" : "bg-red-100 text-red-700 border-red-300"}`}>
    {estado === 1 || estado === true ? "Activa" : "Inactiva"}
  </span>
);

export default function Personas() {
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resPers, resTipos] = await Promise.all([personasService.obtenerTodas(), apiRequest("/tipos-documentos")]);
      setPersonas(resPers.data || []);
      setTiposDocumento(resTipos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los datos");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  }

  async function guardarPersona(e) {
    e.preventDefault();
    if (!formulario.td_id) return setError("El tipo de documento es obligatorio");
    if (!formulario.nombre.trim()) return setError("El nombre es obligatorio");
    if (!formulario.apellido.trim()) return setError("El apellido es obligatorio");
    if (!formulario.numero_doc) return setError("El número de documento es obligatorio");

    const payload = {
      td_id: Number(formulario.td_id),
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      numero_doc: String(formulario.numero_doc),
      usuario_accion: 1,
    };

    try {
      setError("");
      if (editandoId) {
        await personasService.actualizar(editandoId, payload);
      } else {
        await personasService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  }

  async function eliminarPersona(id) {
    if (!confirm("¿Seguro que querés eliminar esta persona?")) return;
    try {
      const res = await personasService.eliminar(id);
      alert(res.message || "Persona de baja correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la persona");
    }
  }

  const obtenerTipoDocDesc = (id) => tiposDocumento.find((t) => t.id === id)?.descripcion || "-";

  const personasFiltradas = personas.filter((p) => {
    const term = busqueda.toLowerCase();
    return `${p.nombre} ${p.apellido}`.toLowerCase().includes(term) || String(p.numero_doc || "").includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <User size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Personas</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona los registros de personas de la institución.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nueva persona
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por nombre o documento" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Nombre Completo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Documento</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Estado</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">Cargando personas...</td></tr>
                ) : personasFiltradas.length > 0 ? (
                  personasFiltradas.map((p) => (
                    <tr key={p.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{p.apellido}, {p.nombre}</td>
                      <td className="px-5 py-5 text-slate-600">{obtenerTipoDocDesc(p.td_id)}: {p.numero_doc}</td>
                      <td className="px-5 py-5"><EstadoBadge estado={p.estado} /></td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ td_id: String(p.td_id), nombre: p.nombre || "", apellido: p.apellido || "", numero_doc: p.numero_doc || "" }); setEditandoId(p.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarPersona(p.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="4" className="text-center py-10 text-slate-500">No se encontraron personas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <PersonaModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} error={error} guardarPersona={guardarPersona} tiposDocumento={tiposDocumento} />
    </div>
  );
}
