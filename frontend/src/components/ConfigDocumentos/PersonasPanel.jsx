import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { personaService } from "../../services/personaService";
import { tipoDocumentoService } from "../../services/tipoDocumentoService";
import { hasPermission } from "../../utils/authHelper";
import PersonaFormModal from "./PersonaFormModal";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function PersonasPanel({ currentUserRole }) {
  const [personas, setPersonas] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", apellido: "", tipoDocumentoId: "", documento: "" });
  const [error, setError] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  // Escuchamos parámetros de la URL para disparar el alta guiada
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
      const [resPersonas, resTipos] = await Promise.all([
        personaService.obtenerTodas(), tipoDocumentoService.obtenerTodos(),
      ]);
      const personasMapeadas = (resPersonas.data || []).map((p) => ({
        ...p, tipoDocumentoId: p.td_id, documento: p.numero_doc,
      }));
      setPersonas(personasMapeadas);
      setTiposDocumento(resTipos.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  }

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const errores = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre es requerido.";
    if (!form.apellido.trim()) errores.apellido = "El apellido es requerido.";
    if (!form.tipoDocumentoId) errores.tipoDocumentoId = "Debe seleccionar un tipo.";
    if (!form.documento.trim()) errores.documento = "El número es requerido.";
    setError(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = {
        nombre: form.nombre, apellido: form.apellido,
        td_id: Number(form.tipoDocumentoId), numero_doc: form.documento, usuario_accion: 1,
      };
      if (modoEdicion) {
        response = await personaService.actualizar(form.id, payload);
      } else {
        response = await personaService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar persona.");
        return;
      }
      alert(response.message || "Persona guardada con éxito.");
      cargarDatos(); limpiarForm(); setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(p) {
    setForm(p); setModoEdicion(true); setError({}); setMostrarModal(true);
  }

  async function eliminar(id) {
    if (!confirm("¿Confirma la eliminación de esta persona?")) return;
    try {
      const response = await personaService.eliminar(id);
      if (response.status === "error") return alert(response.message);
      alert(response.message || "Persona eliminada con éxito.");
      cargarDatos();
      if (form.id === id) limpiarForm();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  function limpiarForm() {
    setForm({ id: null, nombre: "", apellido: "", tipoDocumentoId: "", documento: "" });
    setError({}); setModoEdicion(false);
  }

  const columnasConfig = [
    {
      clave: "nombre_completo", titulo: "Nombre Completo",
      renderizar: (p) => <span className="font-semibold text-slate-800">{p.apellido}, {p.nombre}</span>,
    },
    {
      clave: "tipoDocumentoId", titulo: "Tipo Doc.",
      renderizar: (p) => (
        <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded font-bold">
          {tiposDocumento.find((t) => t.id === (p.tipoDocumentoId || p.td_id))?.descripcion || "-"}
        </span>
      ),
    },
    { clave: "documento", titulo: "Nro. Documento", renderizar: (p) => p.documento || p.numero_doc || "-" },
  ];

  const accionesPorFila = (p) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(p)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(p.id)} disabled={!hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Personas</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Persona
          </button>
        )}
      </div>

      <TablaPrincipal data={personas} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id" placeholderBusqueda="Buscar personas..." />

      <PersonaFormModal mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} modoEdicion={modoEdicion} form={form} error={error} tiposDocumento={tiposDocumento} manejarCambio={manejarCambio} guardar={guardar} limpiarForm={limpiarForm} />
    </div>
  );
}
