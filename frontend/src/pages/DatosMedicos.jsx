import { useEffect, useState } from "react";
import { ClipboardPlus, Pencil, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { datosMedicosService } from "../services/datosMedicosService";
import DatosMedicosModal from "../components/DatosMedicos/DatosMedicosModal";

const formularioInicial = { persona_id: "", grupo_sanguineo: "", alergias: "", aptitud_fisica: false, seguro: "" };

export default function DatosMedicos() {
  const [datosMedicos, setDatosMedicos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      setCargando(true);
      setError("");
      const [resMed, resPers] = await Promise.all([
        datosMedicosService.obtenerTodos(),
        apiRequest("/personas"),
      ]);
      setDatosMedicos(resMed.data || []);
      setPersonas(resPers.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los datos medicos");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;
    setFormulario({ ...formulario, [name]: type === "checkbox" ? checked : value });
  }

  async function guardarDatosMedicos(e) {
    e.preventDefault();
    if (!formulario.persona_id) return setError("La persona es obligatoria");
    if (!formulario.grupo_sanguineo) return setError("El grupo sanguíneo es obligatorio");
    if (!formulario.seguro.trim()) return setError("El seguro es obligatorio");

    const payload = {
      persona_id: Number(formulario.persona_id),
      grupo_sanguineo: formulario.grupo_sanguineo,
      alergias: formulario.alergias.trim(),
      aptitud_fisica: Boolean(formulario.aptitud_fisica) ? 1 : 0,
      seguro: formulario.seguro.trim(),
      usuario_accion: 1,
    };

    try {
      setError("");
      if (editandoId) {
        await datosMedicosService.actualizar(editandoId, payload);
      } else {
        await datosMedicosService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  }

  async function eliminarDatosMedicos(id) {
    if (!confirm("¿Seguro que querés eliminar estos datos médicos?")) return;
    try {
      const res = await datosMedicosService.eliminar(id);
      alert(res.message || "Datos médicos eliminados correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el registro");
    }
  }

  const obtenerNombrePersona = (id) => {
    const p = personas.find((x) => x.id === id);
    return p ? `${p.apellido}, ${p.nombre}` : "-";
  };

  const datosMedicosFiltrados = datosMedicos.filter((d) => {
    const term = busqueda.toLowerCase();
    const nombre = obtenerNombrePersona(d.persona_id);
    return nombre.toLowerCase().includes(term) || String(d.grupo_sanguineo || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <ClipboardPlus size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Datos Médicos</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las fichas médicas de las personas.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nuevos Datos
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por persona o grupo" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Persona</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Grupo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Seguro</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Alergias</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Apto</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-500">Cargando fichas médicas...</td></tr>
                ) : datosMedicosFiltrados.length > 0 ? (
                  datosMedicosFiltrados.map((d) => (
                    <tr key={d.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{obtenerNombrePersona(d.persona_id)}</td>
                      <td className="px-5 py-5 font-bold text-red-600">{d.grupo_sanguineo}</td>
                      <td className="px-5 py-5 text-slate-600">{d.seguro}</td>
                      <td className="px-5 py-5 text-slate-600">{d.alergias || "-"}</td>
                      <td className="px-5 py-5 text-slate-600">{d.aptitud_fisica === 1 || d.aptitud_fisica === true ? "Apto" : "No apto"}</td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ persona_id: d.persona_id, grupo_sanguineo: d.grupo_sanguineo, alergias: d.alergias || "", aptitud_fisica: Boolean(d.aptitud_fisica), seguro: d.seguro }); setEditandoId(d.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarDatosMedicos(d.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center py-10 text-slate-500">No se encontraron fichas médicas.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <DatosMedicosModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} error={error} guardarDatosMedicos={guardarDatosMedicos} personas={personas} />
    </div>
  );
}
