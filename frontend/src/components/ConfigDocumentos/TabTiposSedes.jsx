import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, X, Save } from "lucide-react";
import { tipoSedeService } from "../../services/tipoSedeService";

export default function TabTiposSedes({ tiposSedes, sedes, onRefresh }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, descripcion: "" });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validar() {
    const tempErrors = {};
    if (!form.descripcion.trim()) {
      tempErrors.descripcion = "La descripcion del tipo de sede es requerida.";
    }

    const duplicado = tiposSedes.some(
      (tipo) =>
        tipo.descripcion.toLowerCase() === form.descripcion.toLowerCase() &&
        tipo.id !== form.id
    );
    if (duplicado) {
      tempErrors.descripcion = "Ya existe un tipo de sede con esa descripcion.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;

    try {
      let response;
      const payload = {
        descripcion: form.descripcion.trim(),
        usuario_accion: 1,
      };

      if (modoEdicion) {
        response = await tipoSedeService.actualizar(form.id, payload);
      } else {
        response = await tipoSedeService.crear(payload);
      }

      if (response.status === "error") {
        setErrors(response.errors || {});
        alert(response.message || "Error al procesar tipo de sede.");
        return;
      }

      alert(response.message || "Tipo de sede guardado con exito.");
      onRefresh();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar tipo de sede:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  function editar(tipoSede) {
    setForm(tipoSede);
    setModoEdicion(true);
    setErrors({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const enUso = sedes.some((s) => s.tipo_sede_id === id);
    if (enUso) {
      alert("No es posible eliminar el tipo de sede. Existen sedes asociadas a este tipo.");
      return;
    }

    if (confirm("Confirma la eliminacion de este registro de tipo de sede?")) {
      try {
        const response = await tipoSedeService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }

        alert(response.message || "Tipo de sede eliminado con exito.");
        onRefresh();
        if (form.id === id) cerrarModal();
      } catch (err) {
        console.error("Error al eliminar tipo de sede:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function abrirNuevo() {
    setForm({ id: null, descripcion: "" });
    setModoEdicion(false);
    setErrors({});
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setForm({ id: null, descripcion: "" });
    setErrors({});
  }

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            Registros de Tipos de Sede
          </h2>
          <button
            onClick={abrirNuevo}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Tipo
          </button>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-slate-700 font-bold">Descripcion</th>
                <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
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
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(tipo.id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm"
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
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-lg relative">
            <button
              onClick={cerrarModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
              {modoEdicion ? "Editar Tipo de Sede" : "Nuevo Tipo de Sede"}
            </h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Descripcion del Tipo de Sede
                </label>
                <input
                  type="text"
                  name="descripcion"
                  value={form.descripcion}
                  onChange={manejarCambio}
                  placeholder="Ej: Central, Destacamento, Administrativa"
                  className={`w-full h-12 border ${
                    errors.descripcion ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.descripcion && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.descripcion}
                  </p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold transition text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
                >
                  <Save size={16} />
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
