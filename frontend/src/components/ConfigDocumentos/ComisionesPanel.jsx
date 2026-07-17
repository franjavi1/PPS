import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { comisionService } from "../../services/comisionService";
import { asignaturaService } from "../../services/asignaturaService";
import { aulaService } from "../../services/aulaService";
import { hasPermission } from "../../utils/authHelper";
import ComisionFormModal from "./ComisionFormModal";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function ComisionesPanel({ currentUserRole }) {
  const [comisiones, setComisiones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", asignaturaId: "", aulaId: "", cupoMaximo: "", inscritos: 0 });
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
      const [resComisiones, resAsignaturas, resAulas] = await Promise.all([
        comisionService.obtenerTodas(), asignaturaService.obtenerTodas(), aulaService.obtenerTodas(),
      ]);
      const comisionesMapeadas = (resComisiones.data || []).map((c) => ({
        ...c, asignaturaId: c.asignatura_id, aulaId: c.aula_id, cupoMaximo: c.cupo_maximo,
      }));
      setComisiones(comisionesMapeadas);
      setAsignaturas(resAsignaturas.data || []);
      setAulas(resAulas.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "asignaturaId" || name === "aulaId" || name === "cupoMaximo" ? parseInt(value, 10) || "" : value });
  }

  function validar() {
    const errores = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre de la comisión es requerido.";
    if (!form.asignaturaId) errores.asignaturaId = "Debe seleccionar una asignatura.";
    if (!form.aulaId) errores.aulaId = "Debe seleccionar un aula.";
    if (form.cupoMaximo === "" || isNaN(form.cupoMaximo) || form.cupoMaximo <= 0) errores.cupoMaximo = "Cupo máximo inválido.";
    setError(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = { nombre: form.nombre, asignatura_id: Number(form.asignaturaId), aula_id: Number(form.aulaId), cupo_maximo: Number(form.cupoMaximo), usuario_accion: 1 };
      if (modoEdicion) {
        response = await comisionService.actualizar(form.id, payload);
      } else {
        response = await comisionService.crear(payload);
      }
      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar comisión.");
        return;
      }
      alert(response.message || "Comisión guardada con éxito.");
      cargarDatos(); limpiarForm(); setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  }

  function editar(comision) {
    setForm(comision); setModoEdicion(true); setError({}); setMostrarModal(true);
  }

  async function eliminar(id) {
    const com = comisiones.find((c) => c.id === id);
    if (com && com.inscritos > 0) {
      return alert("No es posible eliminar la comisión. Existen alumnos inscriptos.");
    }
    if (!confirm("¿Confirma la eliminación de esta comisión?")) return;
    try {
      const response = await comisionService.eliminar(id);
      if (response.status === "error") return alert(response.message);
      alert(response.message || "Comisión eliminada con éxito.");
      cargarDatos();
      if (form.id === id) limpiarForm();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  function limpiarForm() {
    setForm({ id: null, nombre: "", asignaturaId: "", aulaId: "", cupoMaximo: "", inscritos: 0 });
    setError({}); setModoEdicion(false);
  }

  const columnasConfig = [
    { clave: "nombre", titulo: "Comisión" },
    {
      clave: "asignaturaId", titulo: "Materia",
      renderizar: (c) => asignaturas.find((a) => a.id === c.asignaturaId)?.nombre || "-",
    },
    {
      clave: "aulaId", titulo: "Aula de dictado",
      renderizar: (c) => aulas.find((a) => a.id_aula === c.aulaId)?.aula || "-",
    },
    { clave: "cupoMaximo", titulo: "Cupo Máximo", renderizar: (c) => `${c.inscritos || 0} / ${c.cupoMaximo} inscriptos` },
  ];

  const accionesPorFila = (c) => (
    <div className="flex items-center justify-center gap-3">
      <button onClick={() => editar(c)} disabled={!hasPermission(currentUserRole, "editar")} className="text-blue-600 hover:text-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Pencil size={16} /> Editar
      </button>
      <button onClick={() => eliminar(c.id)} disabled={!hasPermission(currentUserRole, "eliminar")} className="text-red-600 hover:text-red-800 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-sm flex items-center gap-1">
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Comisiones</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button onClick={() => { limpiarForm(); setMostrarModal(true); }} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm">
            <PlusCircle size={16} /> Agregar Comisión
          </button>
        )}
      </div>

      <TablaPrincipal data={comisiones} columnas={columnasConfig} accionesPorFila={accionesPorFila} propiedadKey="id" placeholderBusqueda="Buscar comisiones..." />

      <ComisionFormModal mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} modoEdicion={modoEdicion} form={form} error={error} asignaturas={asignaturas} aulas={aulas} manejarCambio={manejarCambio} guardar={guardar} limpiarForm={limpiarForm} />
    </div>
  );
}
