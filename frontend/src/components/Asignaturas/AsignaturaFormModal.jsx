import { useState, useEffect } from "react";
import { Save, X, ChevronRight, ChevronLeft } from "lucide-react";

export default function AsignaturaFormModal({
  mostrarModal,
  cerrarModal,
  editandoId,
  formulario,
  manejarCambio,
  errorFormulario,
  guardarAsignatura,
}) {
  // Declaramos el estado de control numérico para el wizard simple de 2 pasos
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
    { id: 1, label: "Formulario" },
    { id: 2, label: "Confirmación" }
  ];

  // Validación preventiva local por paso
  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!formulario.nombre || !formulario.nombre.trim()) nuevosErrores.nombre = "El nombre de la asignatura es requerido.";
      if (!formulario.formato) nuevosErrores.formato = "El formato de la asignatura es requerido.";
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErroresLocales(nuevosErrores);
    } else {
      setErroresLocales({});
      setPaso(2);
    }
  }

  function retrocederPaso() {
    setErroresLocales({});
    setPaso(1);
  }

  const errorCombinado = errorFormulario || erroresLocales.nombre || erroresLocales.formato;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xl w-full max-w-xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={cerrarModal}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {editandoId ? "Editar Asignatura" : "Nueva Asignatura"}
          </h2>
        </div>

        {/* Stepper visual horizontal */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
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

        {errorCombinado && (
          <div className="mb-6 border border-red-200 bg-red-50 text-red-700 rounded-xl px-5 py-4 font-semibold text-sm">
            {errorCombinado}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); if (paso === 2) guardarAsignatura(e); }} className="space-y-6">
          
          {/* Paso 1: Carga de Datos */}
          {paso === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nombre de la Asignatura *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Matemática I"
                  maxLength={105}
                  className="w-full h-14 px-4 border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Formato *</label>
                <select
                  name="formato"
                  value={formulario.formato}
                  onChange={manejarCambio}
                  className="w-full h-14 px-4 border border-slate-300 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Seleccione formato</option>
                  <option value="Materia">Materia</option>
                  <option value="Taller">Taller</option>
                  <option value="Seminario">Seminario</option>
                  <option value="Practica Profesional">Práctica Profesional</option>
                </select>
              </div>
            </div>
          )}

          {/* Paso 2: Confirmación y Resumen */}
          {paso === 2 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3 text-sm">
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">Resumen del registro</p>
              <div>
                <span className="text-slate-400 font-bold block">Nombre:</span>
                <span className="text-slate-800 font-extrabold">{formulario.nombre}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Formato Académico:</span>
                <span className="text-slate-800 font-extrabold">{formulario.formato}</span>
              </div>
            </div>
          )}

          {/* Botonera de control de navegación */}
          <div className="flex gap-3 pt-4 border-t border-slate-100">
            {paso === 1 ? (
              <button
                type="button"
                onClick={cerrarModal}
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

            {paso < 2 ? (
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
                <Save size={18} />
                Confirmar y Guardar
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
