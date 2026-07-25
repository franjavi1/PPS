import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { sedeService } from "../../services/sedeService";
import { hasPermission } from "../../utils/authHelper";
import SedeFormModal from "./SedeFormModal";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function TabSedes({ sedes, tiposSedes, aulas, onRefresh, currentUserRole }) {
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
    if (!form.tipo_sede_id) tempErrors.tipo_sede_id = "El tipo de sede es requerido.";
    if (!form.nombre.trim()) tempErrors.nombre = "El nombre de la sede es requerido.";
    if (!form.direccion.trim()) tempErrors.direccion = "La dirección de la sede es requerida.";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  async function guardar(e) {
    e.preventDefault();
    if (!validar()) return;
    try {
      let response;
      const payload = { tipo_sede_id: Number(form.tipo_sede_id), nombre: form.nombre.trim(), direccion: form.direccion.trim(), usuario_accion: 1 };
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
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
    const enUso = aulas.some((a) => a.sedeId === id || a.sede_id === id);
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

  const obtenerDescripcionTipoSede = (id) => tiposSedes.find((t) => t.id === id)?.descripcion || "No definido";
  const tieneAulas = (id) => aulas.some((a) => a.sedeId === id || a.sede_id === id);

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">Registros de Sedes</h2>
          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
          {hasPermission(currentUserRole, "crear") && (
            <button onClick={abrirNuevo} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"><PlusCircle size={16} />Agregar Sede</button>
          )}
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
                    <td className="px-5 py-4"><span className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-2.5 py-1 rounded font-extrabold">{obtenerDescripcionTipoSede(s.tipo_sede_id)}</span></td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{s.direccion}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => editar(s)} disabled={tieneAulas(s.id) || !hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "editar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} />Editar</button>
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => eliminar(s.id)} disabled={tieneAulas(s.id) || !hasPermission(currentUserRole, "eliminar")} className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Trash2 size={16} />Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center py-8 text-slate-400">No se registran sedes en el sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <SedeFormModal
        mostrarModal={mostrarModal} setMostrarModal={setMostrarModal} modoEdicion={modoEdicion} form={form} error={errors} tiposSedes={tiposSedes}
        manejarCambio={manejarCambio} guardar={guardar} limpiarForm={cerrarModal}
      />
    </>
  );
}
