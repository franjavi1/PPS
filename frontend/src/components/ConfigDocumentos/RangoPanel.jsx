import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { rangoService } from "../../services/rangoService";
import { hasPermission } from "../../utils/authHelper";

export default function RangoPanel({ currentUserRole }) {
  const [rangos, setRangos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, descripcion: "", nivelPrioridad: "" });
  const [error, setError] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const res = await rangoService.obtenerTodos();
      const rangosMapeados = (res.data || []).map((r) => ({
        ...r,
        nivelPrioridad: r.nivel_jerarquia ?? r.nivel_prioridad,
      }));
      setRangos(rangosMapeados);
    } catch (err) {
      console.error("Error al cargar datos en RangoPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "nivelPrioridad" ? parseInt(value, 10) || "" : value });
  }

  function validar() {
    const errores = {};
    if (!form.descripcion.trim()) {
      errores.descripcion = "La denominación es requerida.";
    }
    if (form.nivelPrioridad === "" || isNaN(form.nivelPrioridad) || form.nivelPrioridad <= 0) {
      errores.nivelPrioridad = "El nivel debe ser un número entero positivo.";
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
        descripcion: form.descripcion,
        nivel_jerarquia: form.nivelPrioridad,
        usuario_accion: 1,
      };

      if (modoEdicion) {
        response = await rangoService.actualizar(form.id, payload);
      } else {
        response = await rangoService.crear(payload);
      }

      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar rango.");
        return;
      }

      alert(response.message || "Rango guardado con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar rango:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(rg) {
    setForm(rg);
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    if (confirm("¿Confirma la eliminación de este registro de rango?")) {
      try {
        const response = await rangoService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Rango eliminado con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar rango:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, descripcion: "", nivelPrioridad: "" });
    setError({});
    setModoEdicion(false);
  }

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Registros de Rangos Jerárquicos
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
            Agregar Rango
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Denominación Oficial</th>
              <th className="px-5 py-4 text-slate-700 font-bold">Nivel Prioridad</th>
              <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rangos.length > 0 ? (
              rangos
                .sort((a, b) => a.nivelPrioridad - b.nivelPrioridad)
                .map((rg) => (
                  <tr key={rg.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-800 font-bold">{rg.descripcion}</td>
                    <td className="px-5 py-4">
                      <span className="bg-red-50 text-red-700 border border-red-200 text-xs px-2.5 py-1 rounded-full font-bold">
                        Nivel {rg.nivelPrioridad}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => editar(rg)}
                          disabled={!hasPermission(currentUserRole, "editar")}
                          className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${
                            hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"
                          }`}
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(rg.id)}
                          disabled={!hasPermission(currentUserRole, "eliminar")}
                          className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${
                            hasPermission(currentUserRole, "eliminar") ? "" : "opacity-50 cursor-not-allowed"
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
                <td colSpan="3" className="text-center py-8 text-slate-400">
                  No se registran rangos institucionales.
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
                {modoEdicion ? "Editar Rango" : "Nuevo Rango"}
              </h2>
            </div>
            <form onSubmit={guardar} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Denominación Oficial *
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Ej: Oficial Principal"
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.descripcion ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.descripcion && (
                  <p className="text-red-600 text-xs mt-1">{error.descripcion}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nivel de Prioridad (Jerarquía) *
                </label>
                <input
                  type="number"
                  name="nivelPrioridad"
                  value={form.nivelPrioridad}
                  onChange={manejarCambio}
                  placeholder="Ej: 1 (Mayor jerarquía)"
                  min="1"
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.nivelPrioridad ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.nivelPrioridad && (
                  <p className="text-red-600 text-xs mt-1">{error.nivelPrioridad}</p>
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
