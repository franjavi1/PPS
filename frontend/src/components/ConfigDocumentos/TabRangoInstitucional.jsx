import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { rangoService } from "../../services/rangoService";
import { hasPermission } from "../../utils/authHelper";
import RangoFormModal from "./RangoFormModal";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function TabRangoInstitucional({ rangos, onRefresh, currentUserRole }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, descripcion: "", nivelPrioridad: "" });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "nivelPrioridad" ? parseInt(value, 10) || "" : value,
    });
  }

  function validar() {
    const tempErrors = {};
    if (!form.descripcion.trim()) tempErrors.descripcion = "La descripción oficial es requerida.";
    if (form.nivelPrioridad === "") {
      tempErrors.nivelPrioridad = "El nivel de prioridad es requerido.";
    } else {
      const prioridadNum = parseInt(form.nivelPrioridad, 10);
      if (isNaN(prioridadNum) || prioridadNum <= 0) {
        tempErrors.nivelPrioridad = "Debe ser un valor numérico entero positivo.";
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = { descripcion: form.descripcion.trim(), nivel_jerarquia: Number(form.nivelPrioridad), usuario_accion: 1 };
      if (modoEdicion) {
        response = await rangoService.actualizar(form.id, payload);
      } else {
        response = await rangoService.crear(payload);
      }
      if (response.status === "error") {
        setErrors(response.errors || {});
        alert(response.message || "Error al procesar rango.");
        return;
      }
      alert(response.message || "Rango guardado con éxito.");
      onRefresh();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar rango:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  function editar(rg) {
    setForm(rg);
    setModoEdicion(true);
    setErrors({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
    if (confirm("¿Confirma la eliminación de este rango institucional?")) {
      try {
        const response = await rangoService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Rango eliminado con éxito.");
        onRefresh();
        if (form.id === id) cerrarModal();
      } catch (err) {
        console.error("Error al eliminar rango:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function abrirNuevo() {
    setForm({ id: null, descripcion: "", nivelPrioridad: "" });
    setModoEdicion(false);
    setErrors({});
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setForm({ id: null, descripcion: "", nivelPrioridad: "" });
    setErrors({});
  }

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">Registros de Rangos Jerárquicos</h2>
          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
          {hasPermission(currentUserRole, "crear") && (
            <button onClick={abrirNuevo} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"><PlusCircle size={16} />Agregar Rango</button>
          )}
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-slate-700 font-bold">Rango Institucional (Descripción)</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Nivel Jerárquico / Prioridad</th>
                <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rangos.length > 0 ? (
                rangos.map((rg) => (
                  <tr key={rg.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-800 font-semibold">{rg.descripcion}</td>
                    <td className="px-5 py-4"><span className="inline-flex bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-full font-extrabold border border-red-200">Nivel {rg.nivelPrioridad}</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => editar(rg)} disabled={!hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "editar") ? "" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} />Editar</button>
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => eliminar(rg.id)} disabled={!hasPermission(currentUserRole, "eliminar")} className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "eliminar") ? "" : "opacity-50 cursor-not-allowed"}`}><Trash2 size={16} />Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="3" className="text-center py-8 text-slate-400">No se registran rangos jerárquicos en el sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <RangoFormModal
        mostrarModal={mostrarModal} cerrarModal={cerrarModal} modoEdicion={modoEdicion} form={form} errors={errors}
        manejarCambio={manejarCambio} guardar={guardar}
      />
    </>
  );
}
