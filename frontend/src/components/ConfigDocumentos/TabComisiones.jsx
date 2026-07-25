import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { comisionService } from "../../services/comisionService";
import { hasPermission } from "../../utils/authHelper";
import TabComisionFormModal from "./TabComisionFormModal";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function TabComisiones({ comisiones, asignaturas, aulas, onRefresh, currentUserRole }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ id: null, nombre: "", asignaturaId: "", aulaId: "", cupoMaximo: "", inscritos: 0 });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "asignaturaId" || name === "aulaId" || name === "cupoMaximo" || name === "inscritos" ? parseInt(value, 10) || 0 : value,
    });
  }

  function validar() {
    const tempErrors = {};
    if (!form.nombre.trim()) tempErrors.nombre = "El nombre de la comisión es requerido.";
    if (!form.asignaturaId) tempErrors.asignaturaId = "Debe seleccionar una asignatura de la lista.";
    if (!form.aulaId) tempErrors.aulaId = "Debe seleccionar un aula física de la lista.";
    
    const cupo = parseInt(form.cupoMaximo, 10);
    if (isNaN(cupo) || cupo <= 0) {
      tempErrors.cupoMaximo = "Debe ingresar un cupo máximo válido (entero positivo).";
    } else if (form.aulaId) {
      const aulaAsignada = aulas.find((a) => a.id === form.aulaId);
      if (aulaAsignada && cupo > aulaAsignada.capacidad) {
        tempErrors.cupoMaximo = `El cupo máximo de la comisión (${cupo}) supera la capacidad física del aula seleccionada (${aulaAsignada.capacidad} alumnos).`;
      }
    }
    const inscritosVal = parseInt(form.inscritos, 10);
    if (isNaN(inscritosVal) || inscritosVal < 0) {
      tempErrors.inscritos = "El número de inscritos debe ser un valor entero no negativo.";
    } else if (!isNaN(cupo) && inscritosVal > cupo) {
      tempErrors.inscritos = "El número de inscritos no puede superar al cupo máximo definido.";
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
        asignatura_id: form.asignaturaId,
        aula_id: form.aulaId,
        cupo_maximo: form.cupoMaximo,
        inscritos: form.inscritos,
      };
      if (modoEdicion) {
        response = await comisionService.actualizar(form.id, payload);
      } else {
        response = await comisionService.crear(payload);
      }
      if (response.status === "error") {
        setErrors(response.errors || {});
        alert(response.message || "Error al procesar comisión.");
        return;
      }
      alert(response.message || "Comisión guardada con éxito.");
      onRefresh();
      cerrarModal();
    } catch (err) {
      console.error("Error al guardar comisión:", err);
      alert("Error al procesar la solicitud en el servidor.");
    }
  }

  function editar(comision) {
    setForm(comision);
    setModoEdicion(true);
    setErrors({});
    setMostrarModal(true);
  }

  async function eliminar(id) {
    // Antes de borrar, validamos integridad local en memoria para no tirar error de FK en Postgres.
    const comision = comisiones.find((c) => c.id === id);
    const enUso = comision && comision.inscritos > 0;
    if (enUso) {
      alert("No es posible eliminar la comisión. Existen alumnos inscriptos en la misma.");
      return;
    }
    if (confirm("¿Confirma la eliminación de este registro de comisión?")) {
      try {
        const response = await comisionService.eliminar(id);
        if (response.status === "error") {
          alert(response.message);
          return;
        }
        alert(response.message || "Comisión eliminada con éxito.");
        onRefresh();
        if (form.id === id) cerrarModal();
      } catch (err) {
        console.error("Error al eliminar comisión:", err);
        alert("Error al intentar eliminar el registro.");
      }
    }
  }

  function abrirNuevo() {
    setForm({ id: null, nombre: "", asignaturaId: "", aulaId: "", cupoMaximo: "", inscritos: 0 });
    setModoEdicion(false);
    setErrors({});
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setForm({ id: null, nombre: "", asignaturaId: "", aulaId: "", cupoMaximo: "", inscritos: 0 });
    setErrors({});
  }

  const obtenerNombreAsignatura = (id) => asignaturas.find((a) => a.id === id)?.nombre || "Asignatura no definida";
  const obtenerNombreAula = (id) => aulas.find((a) => a.id === id)?.nombre || "Aula no definida";
  const tieneAlumnos = (c) => c && c.inscritos > 0;

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">Registros de Comisiones</h2>
          {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
          {hasPermission(currentUserRole, "crear") && (
            <button onClick={abrirNuevo} className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"><PlusCircle size={16} />Agregar Comisión</button>
          )}
        </div>
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className="px-5 py-4 text-slate-700 font-bold">Comisión</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Asignatura</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Aula Asignada</th>
                <th className="px-5 py-4 text-slate-700 font-bold">Cupo / Inscritos</th>
                <th className="px-5 py-4 text-slate-700 font-bold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {comisiones.length > 0 ? (
                comisiones.map((c) => (
                  <tr key={c.id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-800 font-bold">{c.nombre}</td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{obtenerNombreAsignatura(c.asignaturaId || c.asignatura_id)}</td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{obtenerNombreAula(c.aulaId || c.aula_id)}</td>
                    <td className="px-5 py-4"><span className="inline-flex bg-slate-100 text-slate-700 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold">{c.inscritos} / {c.cupoMaximo} alumnos</span></td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => editar(c)} disabled={tieneAlumnos(c) || !hasPermission(currentUserRole, "editar")} className={`text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "editar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Pencil size={16} />Editar</button>
                        {/* Si no tiene permisos de rol, ocultamos/deshabilitamos el elemento para que no intente la llamada. */}
                        <button onClick={() => eliminar(c.id)} disabled={tieneAlumnos(c) || !hasPermission(currentUserRole, "eliminar")} className={`text-red-600 hover:text-red-800 flex items-center gap-1 font-semibold text-sm ${hasPermission(currentUserRole, "eliminar") ? "disabled:opacity-40 disabled:cursor-not-allowed" : "opacity-50 cursor-not-allowed"}`}><Trash2 size={16} />Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="5" className="text-center py-8 text-slate-400">No se registran comisiones en el sistema.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TabComisionFormModal
        mostrarModal={mostrarModal} cerrarModal={cerrarModal} modoEdicion={modoEdicion} form={form} errors={errors} asignaturas={asignaturas} aulas={aulas}
        manejarCambio={manejarCambio} guardar={guardar}
      />
    </>
  );
}
