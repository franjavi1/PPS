import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, Sliders } from "lucide-react";
import { comisionService } from "../../services/comisionService";
import { asignaturaService } from "../../services/asignaturaService";
import { aulaService } from "../../services/aulaService";
import { hasPermission } from "../../utils/authHelper";

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

  async function cargarDatos() {
    try {
      const [resComisiones, resAsignaturas, resAulas] = await Promise.all([
        comisionService.obtenerTodas(),
        asignaturaService.obtenerTodas(),
        aulaService.obtenerTodas(),
      ]);
      const comisionesMapeadas = (resComisiones.data || []).map((c) => ({
        ...c,
        asignaturaId: c.asignatura_id,
        aulaId: c.aula_id,
        cupoMaximo: c.cupo_maximo,
      }));
      setComisiones(comisionesMapeadas);
      setAsignaturas(resAsignaturas.data || []);
      setAulas(resAulas.data || []);
    } catch (err) {
      console.error("Error al cargar datos en ComisionesPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "asignaturaId" || name === "aulaId" || name === "cupoMaximo" ? parseInt(value, 10) || "" : value,
    });
  }

  function validar() {
    const errores = {};
    if (!form.nombre.trim()) {
      errores.nombre = "El nombre/código de la comisión es requerido.";
    }
    if (!form.asignaturaId) {
      errores.asignaturaId = "Debe seleccionar una asignatura.";
    }
    if (!form.aulaId) {
      errores.aulaId = "Debe seleccionar un aula.";
    }
    if (form.cupoMaximo === "" || isNaN(form.cupoMaximo) || form.cupoMaximo <= 0) {
      errores.cupoMaximo = "Debe ingresar un cupo máximo válido (entero positivo).";
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
        asignatura_id: Number(form.asignaturaId),
        aula_id: Number(form.aulaId),
        cupo_maximo: Number(form.cupoMaximo),
        usuario_accion: 1,
      };

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
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar comisión:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(comision) {
    setForm(comision);
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const comision = comisiones.find((c) => c.id === id);
    const tieneInscriptos = comision && comision.inscritos > 0;
    if (tieneInscriptos) {
      alert("No es posible eliminar la comisión. Existen alumnos inscriptos en la misma.");
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de comisión?")) {
      try {
        const response = await comisionService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Comisión eliminada con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar comisión:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, nombre: "", asignaturaId: "", aulaId: "", cupoMaximo: "", inscritos: 0 });
    setError({});
    setModoEdicion(false);
  }

  const tieneAlumnosInscriptos = (com) => com && com.inscritos > 0;
  const obtenerNombreAsignatura = (asigId) => asignaturas.find((a) => a.id === asigId)?.nombre || "-";
  const obtenerNombreAula = (aulaId) => aulas.find((a) => a.id === aulaId)?.nombre || "-";

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Registros de Comisiones
        </h2>
        {hasPermission(currentUserRole, "crear") && (
          <button
            onClick={() => {
              limpiarForm();
              setMostrarModal(true);
            }}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Comisión
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Comisión</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Asignatura</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Aula</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Inscriptos / Cupo</th>
              <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {comisiones.length > 0 ? (
              comisiones.map((c) => (
                <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-800 font-bold">{c.nombre}</td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{obtenerNombreAsignatura(c.asignaturaId || c.asignatura_id)}</td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{obtenerNombreAula(c.aulaId || c.aula_id)}</td>
                  <td className="px-5 py-4">
                    <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
                      {c.inscritos} / {c.cupoMaximo} Alumnos
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => editar(c)}
                        disabled={tieneAlumnosInscriptos(c) || !hasPermission(currentUserRole, "editar")}
                        className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "editar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"
                        }`}
                        title={tieneAlumnosInscriptos(c) ? "No se puede editar: posee alumnos inscriptos" : "Editar Comisión"}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(c.id)}
                        disabled={tieneAlumnosInscriptos(c) || !hasPermission(currentUserRole, "eliminar")}
                        className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"
                        }`}
                        title={tieneAlumnosInscriptos(c) ? "No se puede eliminar: posee alumnos inscriptos" : "Eliminar Comisión"}
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
                <td colSpan="5" className="text-center py-8 text-slate-400">
                  No se registran comisiones en el sistema.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => {
                limpiarForm();
                setMostrarModal(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
              title="Cerrar modal"
            >
              <X size={20} />
            </button>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {modoEdicion ? "Editar Comisión" : "Nueva Comisión"}
              </h2>
            </div>
            <form onSubmit={guardar} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre/Código de la Comisión *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Comisión A - Turno Tarde"
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.nombre && (
                  <p className="text-red-600 text-xs mt-1">{error.nombre}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Asignatura Académica *
                </label>
                <select
                  name="asignaturaId"
                  value={form.asignaturaId}
                  onChange={manejarCambio}
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                    error.asignaturaId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione una Asignatura</option>
                  {asignaturas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
                {error.asignaturaId && (
                  <p className="text-red-600 text-xs mt-1">{error.asignaturaId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Aula Física Asignada *
                </label>
                <select
                  name="aulaId"
                  value={form.aulaId}
                  onChange={manejarCambio}
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                    error.aulaId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione un Aula</option>
                  {aulas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
                {error.aulaId && (
                  <p className="text-red-600 text-xs mt-1">{error.aulaId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Cupo Máximo (Alumnos) *
                </label>
                <input
                  type="number"
                  name="cupoMaximo"
                  value={form.cupoMaximo}
                  onChange={manejarCambio}
                  placeholder="Ej: 30"
                  min="1"
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.cupoMaximo ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.cupoMaximo && (
                  <p className="text-red-600 text-xs mt-1">{error.cupoMaximo}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    limpiarForm();
                    setMostrarModal(false);
                  }}
                  className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
                >
                  <PlusCircle size={18} />
                  {modoEdicion ? "Guardar" : "Agregar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
