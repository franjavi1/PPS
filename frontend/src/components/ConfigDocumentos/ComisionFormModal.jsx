import { useState, useEffect } from "react";
import { PlusCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

export default function ComisionFormModal({
  mostrarModal,
  setMostrarModal,
  modoEdicion,
  form,
  error,
  asignaturas,
  aulas,
  manejarCambio,
  guardar,
  limpiarForm
}) {
  // Declaramos el estado de control numérico para el wizard
  const [paso, setPaso] = useState(1);
  const [erroresLocales, setErroresLocales] = useState({});

  // Reiniciamos el stepper al cerrar el modal
  useEffect(() => {
    if (!mostrarModal) {
      setPaso(1);
      setErroresLocales({});
    }
  }, [mostrarModal]);

  if (!mostrarModal) return null;

  const pasos = [
    { id: 1, label: "Datos Básicos" },
    { id: 2, label: "Vinculación" },
    { id: 3, label: "Confirmación" }
  ];

  // Validación local y restrictiva por paso
  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.nombre || !form.nombre.trim()) nuevosErrores.nombre = "El nombre/código de la comisión es requerido.";
      if (form.cupoMaximo === "" || isNaN(form.cupoMaximo) || form.cupoMaximo <= 0) {
        nuevosErrores.cupoMaximo = "Debe ingresar un cupo máximo válido.";
      }
    } else if (paso === 2) {
      if (!form.asignaturaId) nuevosErrores.asignaturaId = "Debe seleccionar una asignatura académica.";
      if (!form.aulaId) nuevosErrores.aulaId = "Debe seleccionar un aula física asignada.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
    } else {
      setErroresLocales({});
      setPaso(paso + 1);
    }
  }

  function retrocederPaso() {
    setErroresLocales({});
    setPaso(paso - 1);
  }

  const errorCombinado = { ...error, ...erroresLocales };
  const nombreAsignatura = asignaturas.find(a => String(a.id) === String(form.asignaturaId))?.nombre || "-";
  const nombreAula = aulas.find(a => String(a.id) === String(form.aulaId))?.nombre || "-";

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => { limpiarForm(); setMostrarModal(false); }}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {modoEdicion ? "Editar Comisión" : "Nueva Comisión"}
          </h2>
        </div>

        {/* Stepper visual horizontal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
          {pasos.map((p) => {
            const activo = paso === p.id;
            const completado = paso > p.id;
            return (
              <div key={p.id} className="flex flex-col items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  activo ? "bg-red-700 text-white shadow-sm" : completado ? "bg-slate-800 text-white" : "bg-slate-100 text-slate-400"
                }`}>
                  {p.id}
                </div>
                <span className={`text-[10px] font-bold mt-1.5 ${activo || completado ? "text-slate-800" : "text-slate-400"}`}>
                  {p.label}
                </span>
              </div>
            );
          })}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (paso === 3) guardar(e); }} className="space-y-4">
          
          {/* Paso 1: Datos Básicos */}
          {paso === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre/Código de la Comisión *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Comisión A - Turno Tarde"
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errorCombinado.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errorCombinado.nombre && <p className="text-red-600 text-xs mt-1">{errorCombinado.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cupo Máximo (Alumnos) *</label>
                <input
                  type="number"
                  name="cupoMaximo"
                  value={form.cupoMaximo}
                  onChange={manejarCambio}
                  placeholder="Ej: 30"
                  min="1"
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errorCombinado.cupoMaximo ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errorCombinado.cupoMaximo && <p className="text-red-600 text-xs mt-1">{errorCombinado.cupoMaximo}</p>}
              </div>
            </div>
          )}

          {/* Paso 2: Vinculación Académica */}
          {paso === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Asignatura Académica *</label>
                <select
                  name="asignaturaId"
                  value={form.asignaturaId}
                  onChange={manejarCambio}
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                    errorCombinado.asignaturaId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione una Asignatura</option>
                  {asignaturas.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
                {errorCombinado.asignaturaId && <p className="text-red-600 text-xs mt-1">{errorCombinado.asignaturaId}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Aula Física Asignada *</label>
                <select
                  name="aulaId"
                  value={form.aulaId}
                  onChange={manejarCambio}
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                    errorCombinado.aulaId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione un Aula</option>
                  {aulas.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre}</option>
                  ))}
                </select>
                {errorCombinado.aulaId && <p className="text-red-600 text-xs mt-1">{errorCombinado.aulaId}</p>}
              </div>
            </div>
          )}

          {/* Paso 3: Confirmación y Resumen */}
          {paso === 3 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">Resumen del registro</p>
              <div>
                <span className="text-slate-400 font-bold block">Nombre Comisión:</span>
                <span className="text-slate-800 font-extrabold">{form.nombre}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Asignatura:</span>
                <span className="text-slate-800 font-extrabold">{nombreAsignatura}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Aula Física:</span>
                <span className="text-slate-800 font-extrabold">{nombreAula}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Cupo de Alumnos:</span>
                <span className="text-slate-800 font-semibold">{form.cupoMaximo} Alumnos</span>
              </div>
            </div>
          )}

          {/* Botonera de control de navegación */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            {paso === 1 ? (
              <button
                type="button"
                onClick={() => { limpiarForm(); setMostrarModal(false); }}
                className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
            ) : (
              <button
                type="button"
                onClick={retrocederPaso}
                className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
              >
                <ChevronLeft size={16} />
                Volver
              </button>
            )}

            {paso < 3 ? (
              <button
                type="button"
                onClick={avanzarPaso}
                className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-1.5"
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-1.5"
              >
                <PlusCircle size={18} />
                Confirmar y Guardar
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
