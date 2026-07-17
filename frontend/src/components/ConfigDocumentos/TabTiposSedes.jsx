import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { tipoSedeService } from "../../services/tipoSedeService";
import { hasPermission } from "../../utils/authHelper";
import TipoSedeFormModal from "./TipoSedeFormModal";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function TabTiposSedes({ tiposSedes, sedes, onRefresh, currentUserRole }) {
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
    if (!form.descripcion.trim()) tempErrors.descripcion = "La descripción del tipo de sede es requerida.";
    const duplicado = tiposSedes.some((tipo) => tipo.descripcion.toLowerCase() === form.descripcion.toLowerCase() && tipo.id !== form.id);
    if (duplicado) tempErrors.descripcion = "Ya existe un tipo de sede con esa descripción.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = { descripcion: form.descripcion.trim(), usuario_accion: 1 };
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
      alert(response.message || "Tipo de sede guardado con éxito.");
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
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
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

  const tieneSedes = (id) => sedes.some((s) => s.tipo_sede_id === id);

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">Registros de Tipos de Sede</h2>
          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
          {hasPermission(currentUserRole, "crear") && (
            <button onClick={abrirNuevo} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"><PlusCircle size={16} />Agregar Tipo</button>
          )}
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-slate-700 font-bold">Descripción</th>
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
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => editar(tipo)} disabled={!hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} />Editar</button>
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => eliminar(tipo.id)} disabled={tieneSedes(tipo.id) || !hasPermission(currentUserRole, "eliminar")} className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Trash2 size={16} />Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="2" className="text-center py-8 text-slate-400">No se registran tipos de sede en el sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TipoSedeFormModal
        mostrarModal={mostrarModal} cerrarModal={cerrarModal} modoEdicion={modoEdicion} form={form} errors={errors}
        manejarCambio={manejarCambio} guardar={guardar}
      />
    </>
  );
}
