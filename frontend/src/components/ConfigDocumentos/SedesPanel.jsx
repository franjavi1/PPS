import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X, Building2 } from "lucide-react";
import { sedeService } from "../../services/sedeService";
import { tipoSedeService } from "../../services/tipoSedeService";
import { aulaService } from "../../services/aulaService";
import { hasPermission } from "../../utils/authHelper";

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

  async function cargarDatos() {
    try {
      const [resSedes, resTipos, resAulas] = await Promise.all([
        sedeService.obtenerTodas(),
        tipoSedeService.obtenerTodas(),
        aulaService.obtenerTodas(),
      ]);
      setSedes(resSedes.data || []);
      setTiposSedes(resTipos.data || []);
      setAulas(resAulas.data || []);
    } catch (err) {
      console.error("Error al cargar datos en SedesPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validar() {
    const errores = {};
    if (!form.tipo_sede_id) {
      errores.tipo_sede_id = "El tipo de sede es requerido.";
    }
    if (!form.nombre.trim()) {
      errores.nombre = "El nombre de la sede es requerido.";
    }
    if (!form.direccion.trim()) {
      errores.direccion = "La dirección de la sede es requerida.";
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
        tipo_sede_id: Number(form.tipo_sede_id),
        nombre: form.nombre,
        direccion: form.direccion,
        usuario_accion: 1,
      };

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
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar sede:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(sede) {
    setForm(sede);
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const tieneAulas = aulas.some((a) => a.sedeId === id || a.sede_id === id);
    if (tieneAulas) {
      alert("No es posible eliminar la sede. Existen aulas registradas asociadas a la misma.");
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de sede?")) {
      try {
        const response = await sedeService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Sede eliminada con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar sede:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, tipo_sede_id: "", nombre: "", direccion: "" });
    setError({});
    setModoEdicion(false);
  }

  const tieneAulasAsociadas = (id) => aulas.some((a) => a.sedeId === id || a.sede_id === id);

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Registros de Sedes
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
            Agregar Sede
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Dirección</th>
              <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sedes.length > 0 ? (
              sedes.map((s) => (
                <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-800 font-bold">{s.nombre}</td>
                  <td className="px-5 py-4 text-slate-600 font-medium">{s.direccion}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => editar(s)}
                        disabled={tieneAulasAsociadas(s.id) || !hasPermission(currentUserRole, "editar")}
                        className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "editar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"
                        }`}
                        title={tieneAulasAsociadas(s.id) ? "No se puede editar: contiene aulas asociadas" : "Editar Sede"}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(s.id)}
                        disabled={tieneAulasAsociadas(s.id) || !hasPermission(currentUserRole, "eliminar")}
                        className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"
                        }`}
                        title={tieneAulasAsociadas(s.id) ? "No se puede eliminar: contiene aulas asociadas" : "Eliminar Sede"}
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
                <td colSpan="3" className="text-center py-8 text-slate-400">
                  No se registran sedes en el sistema.
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
                {modoEdicion ? "Editar Sede" : "Nueva Sede"}
              </h2>
            </div>
            <form onSubmit={guardar} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tipo de Sede *
                </label>
                <select
                  name="tipo_sede_id"
                  value={form.tipo_sede_id}
                  onChange={manejarCambio}
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                    error.tipo_sede_id ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione tipo de sede</option>
                  {tiposSedes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.descripcion}
                    </option>
                  ))}
                </select>
                {error.tipo_sede_id && (
                  <p className="text-red-600 text-xs mt-1">{error.tipo_sede_id}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre de la Sede *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Cuartel Central"
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
                  Dirección *
                </label>
                <textarea
                  name="direccion"
                  value={form.direccion}
                  onChange={manejarCambio}
                  placeholder="Dirección completa"
                  className={`w-full h-24 px-3 py-2 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.direccion ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.direccion && (
                  <p className="text-red-600 text-xs mt-1">{error.direccion}</p>
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
