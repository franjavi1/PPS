import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { comisionAsignaturaService } from "../../services/comisionAsignaturaService";
import { planAsignaturaService } from "../../services/planAsignaturaService";
import { aulaService } from "../../services/aulaService";
import { comisionService } from "../../services/comisionService";
import { hasPermission } from "../../utils/authHelper";
import ComisionFormModal from "./ComisionFormModal";
import TablaPrincipal from "../TablaPrincipal/TablaPrincipal";

export default function ComisionesPanel({ currentUserRole }) {
  const [comisiones, setComisiones] = useState([]);
  const [planesAsignaturas, setPlanesAsignaturas] = useState([]);
  const [aulas, setAulas] = useState([]);
  const [baseComisiones, setBaseComisiones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    planAsignaturasId: "",
    aulaId: "",
    comisionId: "",
    modalidad: "Presencial",
    cupoMaximo: "",
    estado: "Activo",
    inscritos: 0
  });
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
      const [resComisionesAsig, resPlanesAsignaturas, resAulas, resBaseComisiones] = await Promise.all([
        comisionAsignaturaService.obtenerTodos(),
        planAsignaturaService.obtenerTodos(),
        aulaService.obtenerTodas(),
        comisionService.obtenerTodas(),
      ]);

      const comisionesMapeadas = (resComisionesAsig.data || []).map((c) => ({
        id: c.id_comision_asignatura,
        nombre: c.nombre,
        planAsignaturasId: c.plan_asignaturas_id,
        aulaId: c.aula_id,
        comisionId: c.comision_id,
        modalidad: c.modalidad || "Presencial",
        cupoMaximo: c.cupo_maximo,
        estado: c.estado || "Activo",
        inscritos: c.inscritos || 0,
      }));

      setComisiones(comisionesMapeadas);
      setPlanesAsignaturas(resPlanesAsignaturas.data || []);
      setAulas(resAulas.data || []);
      setBaseComisiones(resBaseComisiones.data || []);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "planAsignaturasId" || name === "aulaId" || name === "comisionId" || name === "cupoMaximo"
        ? parseInt(value, 10) || ""
        : value
    });
  }

  function validar() {
    const errores = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre de la comisión es requerido.";
    if (!form.planAsignaturasId) errores.planAsignaturasId = "Debe seleccionar una materia planificada.";
    if (!form.aulaId) errores.aulaId = "Debe seleccionar un aula.";
    if (!form.comisionId) errores.comisionId = "Debe seleccionar una comisión base.";
    if (form.cupoMaximo === "" || isNaN(form.cupoMaximo) || form.cupoMaximo <= 0) errores.cupoMaximo = "Cupo máximo inválido.";
    setError(errores);
    return Object.keys(errores).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = {
        nombre: form.nombre,
        plan_asignaturas_id: Number(form.planAsignaturasId),
        aula_id: Number(form.aulaId),
        comision_id: Number(form.comisionId),
        modalidad: form.modalidad || "Presencial",
        cupo_maximo: Number(form.cupoMaximo),
        estado: form.estado || "Activo",
        usuario_accion: 1
      };
      if (modoEdicion) {
        response = await comisionAsignaturaService.actualizar(form.id, payload);
      } else {
        response = await comisionAsignaturaService.crear(payload);
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
    setForm({
      id: comision.id,
      nombre: comision.nombre,
      planAsignaturasId: comision.planAsignaturasId,
      aulaId: comision.aulaId,
      comisionId: comision.comisionId,
      modalidad: comision.modalidad,
      cupoMaximo: comision.cupoMaximo,
      estado: comision.estado,
      inscritos: comision.inscritos
    });
    setModoEdicion(true); setError({}); setMostrarModal(true);
  }

  async function eliminar(id) {
    const com = comisiones.find((c) => c.id === id);
    if (com && com.inscritos > 0) {
      return alert("No es posible eliminar la comisión. Existen alumnos inscriptos.");
    }
    if (!confirm("¿Confirma la eliminación de esta comisión?")) return;
    try {
      const response = await comisionAsignaturaService.eliminar(id);
      if (response.status === "error") return alert(response.message);
      alert(response.message || "Comisión eliminada con éxito.");
      cargarDatos();
      if (form.id === id) limpiarForm();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  }

  function limpiarForm() {
    setForm({
      id: null,
      nombre: "",
      planAsignaturasId: "",
      aulaId: "",
      comisionId: "",
      modalidad: "Presencial",
      cupoMaximo: "",
      estado: "Activo",
      inscritos: 0
    });
    setError({}); setModoEdicion(false);
  }

  const columnasConfig = [
    { clave: "nombre", titulo: "Comisión" },
    {
      clave: "planAsignaturasId", titulo: "Materia",
      renderizar: (c) => {
        const pa = planesAsignaturas.find((p) => p.id === c.planAsignaturasId);
        return pa ? `${pa.asignatura} - ${pa.plan}` : "-";
      },
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

  if (mostrarModal) {
    return (
      <ComisionFormModal
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        modoEdicion={modoEdicion}
        form={form}
        error={error}
        planesAsignaturas={planesAsignaturas}
        aulas={aulas}
        baseComisiones={baseComisiones}
        manejarCambio={manejarCambio}
        guardar={guardar}
        limpiarForm={limpiarForm}
      />
    );
  }

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
    </div>
  );
}
