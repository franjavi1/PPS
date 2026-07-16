import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, X, Save } from "lucide-react";
import { sedeService } from "../../services/sedeService";

export default function TabSedes({ sedes, tiposSedes, aulas, onRefresh }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, tipo_sede_id: "", nombre: "", direccion: "" });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  }

  function validar() {
    const tempErrors = {};
    if (!form.tipo_sede_id) {
      tempErrors.tipo_sede_id = "El tipo de sede es requerido.";
    }
    if (!form.nombre.trim()) {
      tempErrors.nombre = "El nombre de la sede es requerido.";
    }
    if (!form.direccion.trim()) {
      tempErrors.direccion = "La dirección de la sede es requerida.";
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
        tipo_sede_id: Number(form.tipo_sede_id),
        nombre: form.nombre.trim(),
        direccion: form.direccion.trim(),
        usuario_accion: 1,
      };

      if (modoEdicion) {
        response = await sedeService.actualizar(form.id, payload);
      } else {
        response = await sedeService.crear(payload);
      }

      if (response.status === "error") {
        setErrors(response.errors || {});
        alert(response.message || "Error al procesar sede.");
        return;
      }

      alert(response.message || "Sede guardada con éxito.");
      onRefresh();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar sede:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  function editar(sede) {
    setForm(sede);
    setModoEdicion(true);
    setErrors({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    const enUso = aulas.some((a) => a.sedeId === id);
    if (enUso) {
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
        onRefresh();
        if (form.id === id) cerrarModal();
      } catch (err) {
        console.error("Error al eliminar sede:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function abrirNuevo() {
    setForm({ id: null, tipo_sede_id: "", nombre: "", direccion: "" });
    setModoEdicion(false);
    setErrors({});
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setForm({ id: null, tipo_sede_id: "", nombre: "", direccion: "" });
    setErrors({});
  }

  function obtenerDescripcionTipoSede(id) {
    const encontrado = tiposSedes.find((t) => t.id === id);
    return encontrado ? encontrado.descripcion : "No definido";
  }

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            Registros de Sedes
          </h2>
          <button
            onClick={abrirNuevo}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Sede
          </button>
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-slate-700 font-bold">Nombre</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Tipo de Sede</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Dirección</th>
                <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sedes.length > 0 ? (
                sedes.map((s) => (
                  <tr key={s.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-800 font-bold">{s.nombre}</td>
                    <td className="px-5 py-4">
                      <span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded font-extrabold">
                        {obtenerDescripcionTipoSede(s.tipo_sede_id)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{s.direccion}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => editar(s)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(s.id)}
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
                    No se registran sedes en el sistema.
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
              {modoEdicion ? "Editar Sede" : "Nueva Sede"}
            </h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tipo de Sede
                </label>
                <select
                  name="tipo_sede_id"
                  value={form.tipo_sede_id}
                  onChange={manejarCambio}
                  className={`w-full h-12 border ${
                    errors.tipo_sede_id ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <option value="">Seleccione un tipo</option>
                  {tiposSedes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.descripcion}
                    </option>
                  ))}
                </select>
                {errors.tipo_sede_id && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.tipo_sede_id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre de la Sede
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Destacamento Norte"
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
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={manejarCambio}
                  placeholder="Ej: Av. Pellegrini 1250"
                  className={`w-full h-12 border ${
                    errors.direccion ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                />
                {errors.direccion && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.direccion}
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
