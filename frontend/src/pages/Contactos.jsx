import { useEffect, useState } from "react";
import { Pencil, Phone, PlusCircle, RefreshCcw, Search, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { contactosService } from "../services/contactosService";
import ContactoModal from "../components/Contactos/ContactoModal";

const formularioInicial = { persona_id: "", tipo_contacto_id: "", principal: false, contacto: "" };

export default function Contactos() {
  const [contactos, setContactos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [tiposContacto, setTiposContacto] = useState([]);
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
      const [resCont, resPers, resTipos] = await Promise.all([
        contactosService.obtenerTodos(),
        apiRequest("/personas"),
        apiRequest("/tipos-contacto"),
      ]);
      setContactos(resCont.data || []);
      setPersonas(resPers.data || []);
      setTiposContacto(resTipos.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los contactos");
    } finally {
      setCargando(false);
    }
  }

  function manejarCambio(e) {
    const { name, value, type, checked } = e.target;
    setFormulario({ ...formulario, [name]: type === "checkbox" ? checked : value });
  }

  async function guardarContacto(e) {
    e.preventDefault();
    if (!formulario.persona_id) return setError("La persona es obligatoria");
    if (!formulario.tipo_contacto_id) return setError("El tipo de contacto es obligatorio");
    if (!formulario.contacto.trim()) return setError("El valor de contacto es obligatorio");

    const payload = {
      persona_id: Number(formulario.persona_id),
      tipo_contacto_id: Number(formulario.tipo_contacto_id),
      principal: Boolean(formulario.principal) ? 1 : 0,
      contacto: formulario.contacto.trim(),
      usuario_accion: 1,
    };

    try {
      setError("");
      if (editandoId) {
        await contactosService.actualizar(editandoId, payload);
      } else {
        await contactosService.crear(payload);
      }
      setMostrarModal(false);
      setFormulario(formularioInicial);
      await cargarDatos();
    } catch (err) {
      setError(err.message || "Error al guardar");
    }
  }

  async function eliminarContacto(id) {
    if (!confirm("¿Seguro que querés eliminar este contacto?")) return;
    try {
      const res = await contactosService.eliminar(id);
      alert(res.message || "Contacto eliminado correctamente");
      await cargarDatos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el contacto");
    }
  }

  const obtenerNombrePersona = (id) => {
    const p = personas.find((x) => x.id === id);
    return p ? `${p.apellido}, ${p.nombre}` : "-";
  };

  const obtenerTipoContactoDesc = (id) => tiposContacto.find((t) => t.id === id)?.descripcion || "-";

  const contactosFiltrados = contactos.filter((c) => {
    const term = busqueda.toLowerCase();
    const personaNombre = obtenerNombrePersona(c.persona_id);
    return personaNombre.toLowerCase().includes(term) || String(c.contacto || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <Phone size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Contactos</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona la información de contacto de las personas.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarDatos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100">
                <RefreshCcw size={22} /> Actualizar
              </button>
              <button onClick={() => { setFormulario(formularioInicial); setEditandoId(null); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800">
                <PlusCircle size={22} /> Nuevo contacto
              </button>
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por persona o contacto" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-slate-700 font-bold">Persona</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Tipo</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Contacto</th>
                  <th className="px-5 py-4 text-slate-700 font-bold">Principal</th>
                  <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">Cargando contactos...</td></tr>
                ) : contactosFiltrados.length > 0 ? (
                  contactosFiltrados.map((c) => (
                    <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-5 py-5 font-semibold text-slate-800">{obtenerNombrePersona(c.persona_id)}</td>
                      <td className="px-5 py-5 text-slate-600">{obtenerTipoContactoDesc(c.tipo_contacto_id)}</td>
                      <td className="px-5 py-5 text-slate-800">{c.contacto}</td>
                      <td className="px-5 py-5 text-slate-600">{c.principal === 1 || c.principal === true ? "Sí" : "No"}</td>
                      <td className="px-5 py-5 text-center">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => { setFormulario({ persona_id: c.persona_id, tipo_contacto_id: c.tipo_contacto_id, principal: Boolean(c.principal), contacto: c.contacto || "" }); setEditandoId(c.id); setMostrarModal(true); }} className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"><Pencil size={16} /> Editar</button>
                          <button onClick={() => eliminarContacto(c.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1"><Trash2 size={16} /> Eliminar</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-10 text-slate-500">No se encontraron contactos.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <ContactoModal mostrarModal={mostrarModal} cerrarModal={() => setMostrarModal(false)} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} error={error} guardarContacto={guardarContacto} personas={personas} tiposContacto={tiposContacto} />
    </div>
  );
}
