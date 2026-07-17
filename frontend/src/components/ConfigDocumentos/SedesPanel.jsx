import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { sedeService } from "../../services/sedeService";
import { tipoSedeService } from "../../services/tipoSedeService";
import { aulaService } from "../../services/aulaService";
import { hasPermission } from "../../utils/authHelper";
import SedeFormModal from "./SedeFormModal";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function SedesPanel({ currentUserRole }) {
  const [sedes, setSedes] = useState([]);
  const [tiposSedes, setTiposSedes] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, tipo_sede_id: "", nombre: "", direccion: "" });
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
      const [resSedes, resTipos, resAulas] = await Promise.all([
        sedeService.obtenerTodas(), tipoSedeService.obtenerTodas(), aulaService.obtenerTodas(),
      ]);
      setSedes(resSedes.data || []);
      setTiposSedes(resTipos.data || []);
      setAulas(resAulas.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  }

  function manejarCambio(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validar() {
    const errores = {};
    if (!form.tipo_sede_id) errores.tipo_sede_id = "El tipo de sede es requerido.";
    if (!form.nombre.trim()) errores.nombre = "El nombre de la sede es requerido.";
    if (!form.direccion.trim()) errores.direccion = "La dirección es requerida.";
    setError(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = { tipo_sede_id: Number(form.tipo_sede_id), nombre: form.nombre, direccion: form.direccion, usuario_accion: 1 };
      if (modoEdicion) {
        response = await sedeService.actualizar(form.id, payload);
      } else {
        response = await sedeService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar sede.");
        return;
      }
      alert(response.message || "Sede guardada con éxito.");
      cargarDatos(); limpiarForm(); setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar sede:", err);
    }
  }

  function editar(sede) {
    setForm(sede); setModoEdicion(true); setError({}); setMostrarModal(true);
  }

  async function eliminar(id) {
    if (aulas.some((a) => a.sedeId === id || a.sede_id === id)) {
      return alert("No es posible eliminar la sede. Existen aulas asociadas.");
    }
    if (!confirm("¿Confirma la eliminación de esta sede?")) return;
    try {
      const response = await sedeService.eliminar(id);
      if (response.status === "error") return alert(response.message);
      alert(response.message || "Sede eliminada con éxito.");
      cargarDatos();
      if (form.id === id) limpiarForm();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  function limpiarForm() {
    setForm({ id: null, tipo_sede_id: "", nombre: "", direccion: "" });
    setError({}); setModoEdicion(false);
  }

  const columnasConfig = [
    { clave: "nombre", titulo: "Nombre" },
    {
      clave: "tipo_sede_id", titulo: "Tipo Sede",
      renderizar: (s) => tiposSedes.find((t) => t.id === s.tipo_sede_id)?.descripcion || "-",
    },
    { clave: "direccion", titulo: "Dirección" },
  ];

  const accionesPorFila = (s) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(s)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(s.id)} disabled={!hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Sedes</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Sede
          </button>
        )}
      </div>

      <TablaPrincipal data={sedes} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id" placeholderBusqueda="Buscar sedes..." />

      <SedeFormModal mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} modoEdicion={modoEdicion} form={form} error={error} tiposSedes={tiposSedes} manejarCambio={manejarCambio} guardar={guardar} limpiarForm={limpiarForm} />
    </div>
  );
}
