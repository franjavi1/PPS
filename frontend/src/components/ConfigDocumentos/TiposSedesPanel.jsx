import { useState, useEffect } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { tipoSedeService } from "../../services/tipoSedeService";
import { sedeService } from "../../services/sedeService";
import { hasPermission } from "../../utils/authHelper";

export default function TiposSedesPanel({ currentUserRole }) {
  const [tiposSedes, setTiposSedes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [form, setForm] = useState({ id: null, descripcion: "" });
  const [error, setError] = useState({});

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    try {
      const [resTipos, resSedes] = await Promise.all([
        tipoSedeService.obtenerTodas(),
        sedeService.obtenerTodas(),
      ]);
      setTiposSedes(resTipos.data || []);
      setSedes(resSedes.data || []);
    } catch (err) {
      console.error("Error al cargar datos en TiposSedesPanel:", err);
    }
  }

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validar() {
    const errores = {};
    if (!form.descripcion.trim()) {
      errores.descripcion = "La descripción es requerida.";
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
        usuario_accion: 1,
      };

      if (modoEdicion) {
        response = await tipoSedeService.actualizar(form.id, payload);
      } else {
        response = await tipoSedeService.crear(payload);
      }

      if (response.status === "error") {
        setError(response.errors || {});
        alert(response.message || "Error al procesar tipo de sede.");
        return;
      }

      alert(response.message || "Tipo de sede guardado con éxito.");
      cargarDatos();
      limpiarForm();
      setMostrarModal(false);
    } catch (err) {
      console.error("Error al guardar tipo de sede:", err);
      alert("Error al procesar la solicitud.");
    }
  }

  function editar(tipo) {
    setForm(tipo);
    setModoEdicion(true);
    setError({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const enUso = sedes.some((s) => s.tipo_sede_id === id);
    if (enUso) {
      alert("No es posible eliminar el tipo de sede. Existen sedes asociadas a este tipo.");
      return;
    }

    if (confirm("¿Confirma la eliminación de este registro de tipo de sede?")) {
      try {
        const response = await tipoSedeService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Tipo de sede eliminado con éxito.");
        cargarDatos();
        if (form.id === id) limpiarForm();
      } catch (err) {
        console.error("Error al eliminar tipo de sede:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function limpiarForm() {
    setForm({ id: null, descripcion: "" });
    setError({});
    setModoEdicion(false);
  }

  const tieneSedesAsociadas = (id) => sedes.some((s) => s.tipo_sede_id === id);

  return (
    <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          Registros de Tipos de Sede
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
            Agregar Tipo
          </button>
        )}
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className="px-5 py-4 text-slate-700 font-bold">Descripción</th>
              <th className="px-5 py-4 text-center text-slate-700 font-bold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tiposSedes.length > 0 ? (
              tiposSedes.map((tipo) => (
                <tr key={tipo.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-800 font-bold">{tipo.descripcion}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => editar(tipo)}
                        disabled={!hasPermission(currentUserRole, "editar")}
                        className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        onClick={() => eliminar(tipo.id)}
                        disabled={tieneSedesAsociadas(tipo.id) || !hasPermission(currentUserRole, "eliminar")}
                        className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${
                          hasPermission(currentUserRole, "eliminar") && !tieneSedesAsociadas(tipo.id)
                            ? ""
                            : "opacity-50 cursor-not-allowed"
                        }`}
                        title={tieneSedesAsociadas(tipo.id) ? "No se puede eliminar: existen sedes asociadas" : "Eliminar Tipo de Sede"}
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
                <td colSpan="2" className="text-center py-8 text-slate-400">
                  No se registran tipos de sede en el sistema.
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
                {modoEdicion ? "Editar Tipo de Sede" : "Nuevo Tipo de Sede"}
              </h2>
            </div>
            <form onSubmit={guardar} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descripción *
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Ej: Central"
                  className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    error.descripcion ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {error.descripcion && (
                  <p className="text-red-600 text-xs mt-1">{error.descripcion}</p>
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
