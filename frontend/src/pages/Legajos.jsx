import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Search, PlusCircle, RefreshCcw, ClipboardList } from "lucide-react";
import Navbar from "../components/Navbar";
import { apiRequest } from "../api";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { estaAutenticado } from "../utils/auth";
import LegajoList from "../components/Legajos/LegajoList";
import LegajoFormModal from "../components/Legajos/LegajoFormModal";

export default function Legajos() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();

  const [busqueda, setBusqueda] = useState("");
  const [legajos, setLegajos] = useState([]);
  const [personas, setPersonas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState({ persona_id: "", numero: "" });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");

  // Controlamos el acceso: si el usuario no tiene rol para leer esta sección, lo enviamos al inicio.
  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
      return;
    }
    if (!hasPermission(currentUserRole, "leer")) {
      navigate("/inicio");
      return;
    }
    cargarLegajos();
  }, [currentUserRole]);

  // Cargamos de forma simultánea los legajos y el catálogo de personas para evitar múltiples re-renders.
  async function cargarLegajos() {
    try {
      setCargando(true);
      setError("");
      const [respuestaLegajos, respuestaPersonas] = await Promise.all([
        apiRequest("/legajos"),
        apiRequest("/personas"),
      ]);
      setLegajos(respuestaLegajos.data || []);
      setPersonas(respuestaPersonas.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener los legajos");
    } finally {
      setCargando(false);
    }
  }

  async function eliminarLegajo(id) {
    if (!confirm("¿Seguro que querés eliminar este legajo?")) return;
    try {
      const respuesta = await apiRequest(`/legajos/${id}`, { method: "DELETE" });
      alert(respuesta.message || "Legajo eliminado correctamente");
      await cargarLegajos();
    } catch (err) {
      setError(err.message || "No se pudo eliminar el legajo");
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  // Enviamos los datos para dar de alta o modificar. Validamos primero del lado del cliente.
  async function guardarLegajo(e) {
    e.preventDefault();
    if (!formulario.persona_id) return setErrorFormulario("La persona es obligatoria");
    if (String(formulario.numero).trim() === "") return setErrorFormulario("El número de legajo es obligatorio");

    const payload = {
      persona_id: Number(formulario.persona_id),
      numero: String(formulario.numero).trim(),
      usuario_accion: 1,
    };

    try {
      setErrorFormulario("");
      if (editandoId) {
        await apiRequest(`/legajos/${editandoId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiRequest("/legajos", { method: "POST", body: JSON.stringify(payload) });
      }
      setMostrarModal(false);
      setEditandoId(null);
      setFormulario({ persona_id: "", numero: "" });
      await cargarLegajos();
    } catch (err) {
      setErrorFormulario(err.message || "No se pudo guardar el legajo");
    }
  }

  const legajosFiltrados = legajos.filter((legajo) => {
    const term = busqueda.toLowerCase();
    const persona = personas.find((p) => p.id === legajo.persona_id);
    const nombrePersona = persona ? `${persona.nombre} ${persona.apellido}`.toLowerCase() : "";
    const nroDoc = persona ? String(persona.numero_doc || "") : "";
    return (
      String(legajo.numero || "").toLowerCase().includes(term) ||
      nombrePersona.includes(term) ||
      nroDoc.includes(term)
    );
  });

  const legajoTienePersonaActiva = (legajo) => {
    return false; // Lógica del negocio heredada
  };

  const obtenerNombrePersona = (personaId) => {
    const persona = personas.find((p) => p.id === personaId);
    return persona ? `${persona.apellido}, ${persona.nombre}` : "-";
  };

  const obtenerDocumentoPersona = (personaId) => {
    const persona = personas.find((p) => p.id === personaId);
    return persona ? persona.numero_doc || "-" : "-";
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center"><ClipboardList size={30} /></div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Legajos</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona los legajos de alumnos y docentes.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarLegajos} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"><RefreshCcw size={22} /> Actualizar</button>
              {hasPermission(currentUserRole, "crear") && (
                <button onClick={() => { setFormulario({ persona_id: "", numero: "" }); setEditandoId(null); setErrorFormulario(""); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"><PlusCircle size={22} /> Nuevo legajo</button>
              )}
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por numero, persona o documento" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          <LegajoList
            cargando={cargando} legajosFiltrados={legajosFiltrados} legajos={legajos} currentUserRole={currentUserRole} navigate={navigate}
            editarLegajo={(legajo) => { setFormulario({ persona_id: legajo.persona_id, numero: legajo.numero || "" }); setEditandoId(legajo.id); setErrorFormulario(""); setMostrarModal(true); }}
            eliminarLegajo={eliminarLegajo} legajoTienePersonaActiva={legajoTienePersonaActiva} obtenerNombrePersona={obtenerNombrePersona} obtenerDocumentoPersona={obtenerDocumentoPersona}
          />
        </section>
      </main>

      <LegajoFormModal
        mostrarModal={mostrarModal} editandoId={editandoId} formulario={formulario} manejarCambio={manejarCambio} errorFormulario={errorFormulario} guardarLegajo={guardarLegajo} personas={personas}
        cerrarModal={() => { setMostrarModal(false); setEditandoId(null); setFormulario({ persona_id: "", numero: "" }); }}
      />
    </div>
  );
}
