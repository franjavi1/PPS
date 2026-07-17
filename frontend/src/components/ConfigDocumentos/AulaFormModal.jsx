import { useState, useEffect } from "react";
import { PlusCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

export default function AulaFormModal({
  mostrarModal,
  setMostrarModal,
  modoEdicion,
  form,
  error,
  sedes,
  manejarCambio,
  guardar,
  limpiarForm,
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
    { id: 2, label: "Ubicación" },
    { id: 3, label: "Confirmación" }
  ];

  // Validación local y restrictiva por paso
  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.nombre || !form.nombre.trim()) nuevosErrores.nombre = "El nombre del aula es requerido.";
      if (form.capacidad === "" || isNaN(form.capacidad) || form.capacidad <= 0) {
        nuevosErrores.capacidad = "Debe ingresar una capacidad válida.";
      }
    } else if (paso === 2) {
      if (!form.sedeId) nuevosErrores.sedeId = "Debe seleccionar una sede de ubicación.";
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
  const nombreSede = sedes.find(s => String(s.id) === String(form.sedeId))?.nombre || "-";

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
            {modoEdicion ? "Editar Aula" : "Nueva Aula"}
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
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre / Identificación del Aula *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Aula 102"
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errorCombinado.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errorCombinado.nombre && <p className="text-red-600 text-xs mt-1">{errorCombinado.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Capacidad (Alumnos Sentados) *</label>
                <input
                  type="number"
                  name="capacidad"
                  value={form.capacidad}
                  onChange={manejarCambio}
                  placeholder="Ej: 30"
                  min="1"
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errorCombinado.capacidad ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errorCombinado.capacidad && <p className="text-red-600 text-xs mt-1">{errorCombinado.capacidad}</p>}
              </div>
            </div>
          )}

          {/* Paso 2: Sede de Ubicación */}
          {paso === 2 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Sede de Ubicación *</label>
              <select
                name="sedeId"
                value={form.sedeId}
                onChange={manejarCambio}
                className={`w-full h-10 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                  errorCombinado.sedeId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                }`}
              >
                <option value="">Seleccione una Sede</option>
                {sedes.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
              {errorCombinado.sedeId && <p className="text-red-600 text-xs mt-1">{errorCombinado.sedeId}</p>}
            </div>
          )}

          {/* Paso 3: Confirmación y Resumen */}
          {paso === 3 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">Resumen del registro</p>
              <div>
                <span className="text-slate-400 font-bold block">Nombre Aula:</span>
                <span className="text-slate-800 font-extrabold">{form.nombre}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Sede de Ubicación:</span>
                <span className="text-slate-800 font-extrabold">{nombreSede}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Capacidad Física:</span>
                <span className="text-slate-850 font-semibold">{form.capacidad} Alumnos</span>
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
