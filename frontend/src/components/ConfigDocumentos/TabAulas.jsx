import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { aulaService } from "../../services/aulaService";
import { hasPermission } from "../../utils/authHelper";
import AulaFormModal from "./AulaFormModal";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function TabAulas({ aulas, sedes, comisiones, onRefresh, currentUserRole }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", sedeId: "", capacidad: "" });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "sedeId" ? parseInt(value, 10) || "" : name === "capacidad" ? parseInt(value, 10) || "" : value,
    });
  }

  function validar() {
    const tempErrors = {};
    if (!form.nombre.trim()) tempErrors.nombre = "El nombre del aula es requerido.";
    if (!form.sedeId) tempErrors.sedeId = "Debe seleccionar una sede de la lista.";
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
      const payload = { nombre: form.nombre.trim(), sede_id: form.sedeId, capacidad: form.capacidad };
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
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
    const enUso = comisiones.some((c) => c.aulaId === id || c.aula_id === id);
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

  const obtenerNombreSede = (id) => sedes.find((s) => s.id === id)?.nombre || "Sede no definida";
  const tieneComisiones = (id) => comisiones.some((c) => c.aulaId === id || c.aula_id === id);

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">Registros de Aulas</h2>
          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
          {hasPermission(currentUserRole, "crear") && (
            <button onClick={abrirNuevo} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"><PlusCircle size={16} />Agregar Aula</button>
          )}
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
                    <td className="px-5 py-4 text-slate-600 font-semibold">{obtenerNombreSede(a.sedeId || a.sede_id)}</td>
                    <td className="px-5 py-4"><span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2 py-1 rounded font-bold">{a.capacidad} alumnos</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => editar(a)} disabled={tieneComisiones(a.id) || !hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "editar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} />Editar</button>
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => eliminar(a.id)} disabled={tieneComisiones(a.id) || !hasPermission(currentUserRole, "eliminar")} className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Trash2 size={16} />Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-8 text-slate-400">No se registran aulas en el sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AulaFormModal
        mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} modoEdicion={modoEdicion} form={form} error={errors} sedes={sedes}
        manejarCambio={manejarCambio} guardar={guardar} limpiarForm={cerrarModal}
      />
    </>
  );
}
