import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, X, Save } from "lucide-react";
import { aulaService } from "../../services/aulaService";

export default function TabAulas({ aulas, sedes, comisiones, onRefresh }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", sedeId: "", capacidad: "" });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "sedeId"
          ? parseInt(value, 10) || ""
          : name === "capacidad"
          ? parseInt(value, 10) || ""
          : value,
    });
  }

  function validar() {
    const tempErrors = {};
    if (!form.nombre.trim()) {
      tempErrors.nombre = "El nombre del aula es requerido.";
    }
    if (!form.sedeId) {
      tempErrors.sedeId = "Debe seleccionar una sede de la lista.";
    }
    if (form.capacidad === "" || isNaN(form.capacidad) || form.capacidad <= 0) {
      tempErrors.capacidad = "Debe ingresar una capacidad física válida (entero positivo).";
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
        nombre: form.nombre.trim(),
        sede_id: form.sedeId,
        capacidad: form.capacidad,
      };

      if (modoEdicion) {
        response = await aulaService.actualizar(form.id, payload);
      } else {
        response = await aulaService.crear(payload);
      }

      if (response.status === "error") {
        setErrors(response.errors || {});
        alert(response.message || "Error al procesar aula.");
        return;
      }

      alert(response.message || "Aula guardada con éxito.");
      onRefresh();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar aula:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  function editar(aula) {
    setForm(aula);
    setModoEdicion(true);
    setErrors({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const enUso = comisiones.some((c) => c.aulaId === id);
    if (enUso) {
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
        onRefresh();
        if (form.id === id) cerrarModal();
      } catch (err) {
        console.error("Error al eliminar aula:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function abrirNuevo() {
    setForm({ id: null, nombre: "", sedeId: "", capacidad: "" });
    setModoEdicion(false);
    setErrors({});
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setForm({ id: null, nombre: "", sedeId: "", capacidad: "" });
    setErrors({});
  }

  function obtenerNombreSede(id) {
    const encontrada = sedes.find((s) => s.id === id);
    return encontrada ? encontrada.nombre : "Sede no definida";
  }

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            Registros de Aulas
          </h2>
          <button
            onClick={abrirNuevo}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Aula
          </button>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-slate-700 font-bold">Identificación / Nombre</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Sede Física</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Capacidad Física</th>
                <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {aulas.length > 0 ? (
                aulas.map((a) => (
                  <tr key={a.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-800 font-bold">{a.nombre}</td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{obtenerNombreSede(a.sedeId)}</td>
                    <td className="px-5 py-4">
                      <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded font-bold">
                        {a.capacidad} alumnos
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => editar(a)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(a.id)}
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
                  <td colSpan="4" className="text-center py-8 text-slate-400">
                    No se registran aulas en el sistema.
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
              {modoEdicion ? "Editar Aula" : "Nueva Aula"}
            </h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Sede Perteneciente
                </label>
                <select
                  name="sedeId"
                  value={form.sedeId}
                  onChange={manejarCambio}
                  className={`w-full h-12 border ${
                    errors.sedeId ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <option value="">Seleccione una sede</option>
                  {sedes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
                {errors.sedeId && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.sedeId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre/Identificación del Aula
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Aula 102, Salón de Actos"
                  className={`w-full h-12 border ${
                    errors.nombre ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.nombre}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Capacidad Física (Alumnos)
                </label>
                <input
                  type="number"
                  name="capacidad"
                  value={form.capacidad}
                  onChange={manejarCambio}
                  placeholder="Ej: 30"
                  className={`w-full h-12 border ${
                    errors.capacidad ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.capacidad && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.capacidad}
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
