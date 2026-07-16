import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { aulaService } from "../../services/aulaService";
import { sedeService } from "../../services/sedeService";
import { comisionService } from "../../services/comisionService";
import { hasPermission } from "../../utils/authHelper";
import AulaFormModal from "./AulaFormModal";

export default function AulasPanel({ currentUserRole }) {
  const [aulas, setAulas] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", sedeId: "", capacidad: "" });
  const [error, setError] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [resAulas, resSedes, resComs] = await Promise.all([
        aulaService.obtenerTodas(),
        sedeService.obtenerTodas(),
        comisionService.obtenerTodas(),
      ]);
      setAulas(resAulas.data || []);
      setSedes(resSedes.data || []);
      setComisiones(resComs.data || []);
    } catch (err) {
      console.error("Error al cargar datos en AulasPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "sedeId" ? parseInt(value, 10) || "" : name === "capacidad" ? parseInt(value, 10) || "" : value,
    });
  }

  function validar() {
    const errores = {};
    if (!form.nombre.trim()) errores.nombre = "El nombre del aula es requerido.";
    if (!form.sedeId) errores.sedeId = "Debe seleccionar una sede de la lista.";
    if (form.capacidad === "" || isNaN(form.capacidad) || form.capacidad <= 0) {
      errores.capacidad = "Debe ingresar una capacidad física válida (entero positivo).";
    }
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
        sede_id: Number(form.sedeId),
        capacidad: Number(form.capacidad),
        usuario_accion: 1,
      };

      if (modoEdicion) {
        response = await aulaService.actualizar(form.id, payload);
      } else {
        response = await aulaService.crear(payload);
      }

      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar aula.");
        return;
      }

      alert(response.message || "Aula guardada con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar aula:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(aula) {
    setForm({
      id: aula.id,
      nombre: aula.nombre,
      sedeId: aula.sedeId || aula.sede_id,
      capacidad: aula.capacidad,
    });
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const tieneComisiones = comisiones.some((c) => c.aulaId === id || c.aula_id === id);
    if (tieneComisiones) {
      alert("No es posible eliminar el aula. Existen comisiones registradas asociadas a la misma.");
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de aula?")) {
      try {
        const response = await aulaService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Aula eliminada con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar aula:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, nombre: "", sedeId: "", capacidad: "" });
    setError({});
    setModoEdicion(false);
  }

  const tieneComisionesAsociadas = (id) => comisiones.some((c) => c.aulaId === id || c.aula_id === id);
  const obtenerNombreSede = (sedeId) => sedes.find((s) => s.id === sedeId)?.nombre || "-";

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">Registros de Aulas</h2>
        {hasPermission(currentUserRole, "crear") && (
          <button
            onClick={() => {
              limpiarForm();
              setMostrarModal(true);
            }}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Aula
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Aula</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Sede Asignada</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Capacidad</th>
              <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {aulas.length > 0 ? (
              aulas.map((a) => (
                <tr key={a.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-800 font-bold">{a.nombre}</td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{obtenerNombreSede(a.sedeId || a.sede_id)}</td>
                  <td className="px-5 py-4">
                    <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
                      {a.capacidad} Alumnos
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => editar(a)}
                        disabled={tieneComisionesAsociadas(a.id) || !hasPermission(currentUserRole, "editar")}
                        className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "editar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(a.id)}
                        disabled={tieneComisionesAsociadas(a.id) || !hasPermission(currentUserRole, "eliminar")}
                        className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Trash2 size={16} />
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-8 text-slate-400">
                  No se registran aulas en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
    </div>
  );
}
