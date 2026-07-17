import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { FileText, PlusCircle, RefreshCcw, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import { asignaturaService } from "../services/asignaturaService";
import { planAsignaturaService } from "../services/planAsignaturaService";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/authHelper";
import { estaAutenticado } from "../utils/auth";
import AsignaturaList from "../components/Asignaturas/AsignaturaList";
import AsignaturaFormModal from "../components/Asignaturas/AsignaturaFormModal";

const formularioInicial = { nombre: "", formato: "" };

export default function Asignaturas() {
  const navigate = useNavigate();
  const { currentUserRole } = useAuth();
  const [asignaturas, setAsignaturas] = useState([]);
  const [planAsignaturas, setPlanAsignaturas] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [error, setError] = useState("");
  const [errorFormulario, setErrorFormulario] = useState("");
  const [cargando, setCargando] = useState(true);

  // Redireccionamos si no hay sesión activa o si carece de permisos de lectura.
  useEffect(() => {
    if (!estaAutenticado()) {
      navigate("/login");
      return;
    }
    if (!hasPermission(currentUserRole, "leer")) {
      navigate("/inicio");
      return;
    }
    cargarAsignaturas();
  }, [currentUserRole]);

  // Escuchamos el parámetro de acción de la URL para disparar el asistente de alta
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'nuevo') {
      limpiarFormulario();
      setMostrarModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Cargamos en paralelo tanto las asignaturas generales como su asociación en planes para no bloquear el hilo principal.
  async function cargarAsignaturas() {
    try {
      setCargando(true);
      setError("");
      const [respuesta, respuestaPlanAsignaturas] = await Promise.all([
        asignaturaService.obtenerTodas(),
        planAsignaturaService.obtenerTodos(),
      ]);
      setAsignaturas(respuesta.data || []);
      setPlanAsignaturas(respuestaPlanAsignaturas.data || []);
    } catch (err) {
      setError(err.message || "No se pudieron obtener las asignaturas");
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  }

  function editarAsignatura(asignatura) {
    setFormulario({ nombre: asignatura.nombre || "", formato: asignatura.formato || "" });
    setEditandoId(asignatura.id);
    setErrorFormulario("");
    setMostrarModal(true);
  }

  // Validamos reglas de negocio para evitar guardar nombres duplicados o formatos vacíos en la API.
  async function guardarAsignatura(e) {
    e.preventDefault();
    const nombre = formulario.nombre.trim();
    const formato = formulario.formato.trim();

    if (!nombre) return setErrorFormulario("El nombre de la asignatura es obligatorio");
    if (nombre.length > 105) return setErrorFormulario("El nombre no puede superar los 105 caracteres");
    if (!formato) return setErrorFormulario("El formato es obligatorio");
    if (formato.length > 45) return setErrorFormulario("El formato no puede superar los 45 caracteres");

    try {
      setErrorFormulario("");
      const payload = { nombre, formato, usuario_accion: 1 };
      if (editandoId) {
        await asignaturaService.actualizar(editandoId, payload);
      } else {
        await asignaturaService.crear(payload);
      }
      setMostrarModal(false);
      limpiarFormulario();
      await cargarAsignaturas();
    } catch (err) {
      setErrorFormulario(err.errors ? Object.values(err.errors)[0]?.[0] : err.message || "Error al guardar");
    }
  }

  // Prevenimos la eliminación si la materia ya forma parte de algún plan de estudio.
  async function eliminarAsignatura(id) {
    if (asignaturaEstaEnPlan(id)) {
      setError("No se puede eliminar una asignatura asociada a un plan");
      return;
    }
    if (!confirm("¿Seguro que querés eliminar esta asignatura?")) return;

    try {
      const respuesta = await asignaturaService.eliminar(id);
      alert(respuesta.message || "Asignatura eliminada correctamente");
      await cargarAsignaturas();
    } catch (err) {
      setError(err.message || "No se pudo eliminar la asignatura");
    }
  }

  const asignaturaEstaEnPlan = (asignaturaId) =>
    planAsignaturas.some(
      (item) => Number(item.asignatura_id) === Number(asignaturaId) && Number(item.estado ?? 1) === 1
    );

  const asignaturasFiltradas = asignaturas.filter((a) => {
    const term = busqueda.toLowerCase();
    return String(a.nombre || "").toLowerCase().includes(term) || String(a.formato || "").toLowerCase().includes(term);
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <section className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
                <FileText size={30} />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-slate-800">Asignaturas</h1>
                <p className="text-slate-500 mt-2">Consulta y gestiona las materias asociadas a los planes de estudio.</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={cargarAsignaturas} className="flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-bold hover:bg-slate-100 transition"><RefreshCcw size={22} /> Actualizar</button>
              {hasPermission(currentUserRole, "crear") && (
                <button onClick={() => { limpiarFormulario(); setMostrarModal(true); }} className="flex items-center justify-center gap-2 bg-red-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-800 transition"><PlusCircle size={22} /> Nueva asignatura</button>
              )}
            </div>
          </div>

          <div className="relative w-full md:w-96 mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar por asignatura o formato" className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          {error && <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold">{error}</div>}

          <AsignaturaList
            cargando={cargando}
            asignaturasFiltradas={asignaturasFiltradas}
            currentUserRole={currentUserRole}
            editarAsignatura={editarAsignatura}
            eliminarAsignatura={eliminarAsignatura}
            asignaturaEstaEnPlan={asignaturaEstaEnPlan}
          />
        </section>
      </main>

      <AsignaturaFormModal
        mostrarModal={mostrarModal}
        cerrarModal={() => { setMostrarModal(false); limpiarFormulario(); }}
        editandoId={editandoId}
        formulario={formulario}
        manejarCambio={manejarCambio}
        errorFormulario={errorFormulario}
        guardarAsignatura={guardarAsignatura}
      />
    </div>
  );
}
