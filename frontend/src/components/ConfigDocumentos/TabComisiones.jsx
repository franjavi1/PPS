import React, { useState } from "react";
import { PlusCircle, Pencil, Trash2, X, Save } from "lucide-react";
import { comisionService } from "../../services/comisionService";

export default function TabComisiones({
  comisiones,
  asignaturas,
  aulas,
  onRefresh,
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({
    id: null,
    nombre: "",
    asignaturaId: "",
    aulaId: "",
    cupoMaximo: "",
    inscritos: 0,
  });
  const [errors, setErrors] = useState({});
  const [modoEdicion, setModoEdicion] = useState(false);

  function manejarCambio(e) {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]:
        name === "asignaturaId" ||
        name === "aulaId" ||
        name === "cupoMaximo" ||
        name === "inscritos"
          ? parseInt(value, 10) || 0
          : value,
    });
  }

  function validar() {
    const tempErrors = {};
    if (!form.nombre.trim()) {
      tempErrors.nombre = "El nombre de la comisión es requerido.";
    }
    if (!form.asignaturaId) {
      tempErrors.asignaturaId = "Debe seleccionar una asignatura de la lista.";
    }
    if (!form.aulaId) {
      tempErrors.aulaId = "Debe seleccionar un aula física de la lista.";
    }

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
    setForm({
      id: null,
      nombre: "",
      asignaturaId: "",
      aulaId: "",
      cupoMaximo: "",
      inscritos: 0,
    });
    setModoEdicion(false);
    setErrors({});
    setMostrarModal(true);
  }

  function cerrarModal() {
    setMostrarModal(false);
    setForm({
      id: null,
      nombre: "",
      asignaturaId: "",
      aulaId: "",
      cupoMaximo: "",
      inscritos: 0,
    });
    setErrors({});
  }

  function obtenerNombreAsignatura(id) {
    const encontrada = asignaturas.find((a) => a.id === id);
    return encontrada ? encontrada.nombre : "Asignatura no definida";
  }

  function obtenerNombreAula(id) {
    const encontrada = aulas.find((a) => a.id === id);
    return encontrada ? encontrada.nombre : "Aula no definida";
  }

  return (
    <>
      <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-slate-800">
            Registros de Comisiones
          </h2>
          <button
            onClick={abrirNuevo}
            className="h-10 bg-red-700 hover:bg-red-800 text-white px-4 rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"
          >
            <PlusCircle size={16} />
            Agregar Comisión
          </button>
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
                    <td className="px-5 py-4 text-slate-600 font-semibold">{obtenerNombreAsignatura(c.asignaturaId)}</td>
                    <td className="px-5 py-4 text-slate-600 font-semibold">{obtenerNombreAula(c.aulaId)}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex bg-slate-100 text-slate-700 border border-slate-200 rounded px-2.5 py-1 text-xs font-bold">
                        {c.inscritos} / {c.cupoMaximo} alumnos
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => editar(c)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold text-sm"
                        >
                          <Pencil size={16} />
                          Editar
                        </button>
                        <button
                          onClick={() => eliminar(c.id)}
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
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    No se registran comisiones en el sistema.
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
              {modoEdicion ? "Editar Comisión" : "Nueva Comisión"}
            </h2>
            <form onSubmit={guardar} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nombre/Identificación de la Comisión
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Comisión A, Curso Nocturno"
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
                  Asignatura Académica
                </label>
                <select
                  name="asignaturaId"
                  value={form.asignaturaId}
                  onChange={manejarCambio}
                  className={`w-full h-12 border ${
                    errors.asignaturaId ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <option value="">Seleccione una asignatura</option>
                  {asignaturas.map((asig) => (
                    <option key={asig.id} value={asig.id}>
                      {asig.nombre}
                    </option>
                  ))}
                </select>
                {errors.asignaturaId && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.asignaturaId}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Aula Física Asignada
                </label>
                <select
                  name="aulaId"
                  value={form.aulaId}
                  onChange={manejarCambio}
                  className={`w-full h-12 border ${
                    errors.aulaId ? "border-red-500" : "border-slate-300"
                  } rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                >
                  <option value="">Seleccione un aula</option>
                  {aulas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre} (Capacidad: {a.capacidad} alumnos)
                    </option>
                  ))}
                </select>
                {errors.aulaId && (
                  <p className="text-red-500 text-xs mt-1 font-semibold">
                    {errors.aulaId}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Cupo Máximo
                  </label>
                  <input
                    type="number"
                    name="cupoMaximo"
                    value={form.cupoMaximo}
                    onChange={manejarCambio}
                    placeholder="Ej: 30"
                    className={`w-full h-12 border ${
                      errors.cupoMaximo ? "border-red-500" : "border-slate-300"
                    } rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.cupoMaximo && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      {errors.cupoMaximo}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Inscritos Actuales
                  </label>
                  <input
                    type="number"
                    name="inscritos"
                    value={form.inscritos}
                    onChange={manejarCambio}
                    placeholder="Ej: 0"
                    className={`w-full h-12 border ${
                      errors.inscritos ? "border-red-500" : "border-slate-300"
                    } rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}
                  />
                  {errors.inscritos && (
                    <p className="text-red-500 text-xs mt-1 font-semibold">
                      {errors.inscritos}
                    </p>
                  )}
                </div>
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
