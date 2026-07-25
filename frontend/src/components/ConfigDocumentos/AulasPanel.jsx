import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { aulaService } from "../../services/aulaService";
import { sedeService } from "../../services/sedeService";
import { comisionService } from "../../services/comisionService";
import { hasPermission } from "../../utils/authHelper";
import AulaFormModal from "./AulaFormModal";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function AulasPanel({ currentUserRole }) {
  const [aulas, setAulas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id_aula: null, aula: "", sedes_id: "", es_virtual: "0" });
  const [error, setError] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  // Escuchamos el parámetro de acción de la URL para disparar el alta guiada
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('action') === 'nuevo') {
      limpiarForm();
      setMostrarModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  async function cargarDatos() {
    try {
      const [resAulas, resSedes, resComs] = await Promise.all([
        aulaService.obtenerTodas(), sedeService.obtenerTodas(), comisionService.obtenerTodas(),
      ]);
      setAulas(resAulas.data || []);
      setSedes(resSedes.data || []);
      setComisiones(resComs.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "sedes_id" || name === "es_virtual" ? parseInt(value, 10) || 0 : value });
  }

  function validar() {
    const errores = {};
    if (!form.aula.trim()) errores.aula = "El nombre del aula es requerido.";
    if (!form.sedes_id) errores.sedes_id = "Debe seleccionar una sede de la lista.";
    setError(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = { aula: form.aula, sedes_id: Number(form.sedes_id), es_virtual: Number(form.es_virtual), usuario_accion: 1 };
      if (modoEdicion) {
        response = await aulaService.actualizar(form.id_aula, payload);
      } else {
        response = await aulaService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar aula.");
        return;
      }
      alert(response.message || "Aula guardada con éxito.");
      cargarDatos(); limpiarForm(); setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  }

  function editar(aula) {
    setForm({ id_aula: aula.id_aula, aula: aula.aula, sedes_id: aula.sedes_id, es_virtual: String(aula.es_virtual ?? 0) });
    setModoEdicion(true); setError({}); setMostrarModal(true);
  }

  async function eliminar(id_aula) {
    if (comisiones.some((c) => c.aulaId === id_aula || c.aula_id === id_aula)) {
      return alert("No es posible eliminar el aula. Existen comisiones asociadas.");
    }
    if (!confirm("¿Confirma la eliminación de esta aula?")) return;
    try {
      const response = await aulaService.eliminar(id_aula);
      if (response.status === "error") return alert(response.message);
      alert(response.message || "Aula eliminada con éxito.");
      cargarDatos();
      if (form.id_aula === id_aula) limpiarForm();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  function limpiarForm() {
    setForm({ id_aula: null, aula: "", sedes_id: "", es_virtual: "0" });
    setError({}); setModoEdicion(false);
  }

  const columnasConfig = [
    { clave: "aula", titulo: "Nombre del Aula" },
    {
      clave: "sedes_id", titulo: "Sede de Ubicación",
      renderizar: (a) => sedes.find((s) => s.id === a.sedes_id)?.nombre || "-",
    },
    {
      clave: "es_virtual",
      titulo: "Tipo de Aula",
      renderizar: (a) => a.es_virtual === 1 || a.es_virtual === true ? "Virtual" : "Presencial"
    },
  ];

  const accionesPorFila = (a) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(a)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(a.id_aula)} disabled={!hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  if (mostrarModal) {
    return (
      <AulaFormModal
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        modoEdicion={modoEdicion}
        form={form}
        error={error}
        sedes={sedes}
        manejarCambio={manejarCambio}
        guardar={guardar}
        limpiarForm={limpiarForm}
      />
    );
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Aulas</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Aula
          </button>
        )}
      </div>

      <TablaPrincipal data={aulas} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id_aula" placeholderBusqueda="Buscar aulas..." />
    </div>
  );
}
