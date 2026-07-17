import { useState, useEffect } from "react";
import { PlusCircle, X, ChevronRight, ChevronLeft } from "lucide-react";

export default function SedeFormModal({
  mostrarModal,
  setMostrarModal,
  modoEdicion,
  form,
  error,
  tiposSedes,
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
    { id: 2, label: "Ubicación" },
    { id: 3, label: "Confirmación" }
  ];

  // Validación local y restrictiva por paso
  function avanzarPaso() {
    const nuevosErrores = {};
    if (paso === 1) {
      if (!form.tipo_sede_id) nuevosErrores.tipo_sede_id = "El tipo de sede es requerido.";
      if (!form.nombre || !form.nombre.trim()) nuevosErrores.nombre = "El nombre de la sede es requerido.";
    } else if (paso === 2) {
      if (!form.direccion || !form.direccion.trim()) nuevosErrores.direccion = "La dirección de la sede es requerida.";
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
  const nombreTipoSede = tiposSedes.find(t => String(t.id) === String(form.tipo_sede_id))?.descripcion || "-";

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
            {modoEdicion ? "Editar Sede" : "Nueva Sede"}
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
                <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Sede *</label>
                <select
                  name="tipo_sede_id"
                  value={form.tipo_sede_id}
                  onChange={manejarCambio}
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                    errorCombinado.tipo_sede_id ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                >
                  <option value="">Seleccione tipo de sede</option>
                  {tiposSedes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
                  ))}
                </select>
                {errorCombinado.tipo_sede_id && <p className="text-red-600 text-xs mt-1">{errorCombinado.tipo_sede_id}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Sede *</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={manejarCambio}
                  placeholder="Ej: Cuartel Central"
                  className={`w-full h-10 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                    errorCombinado.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                  }`}
                />
                {errorCombinado.nombre && <p className="text-red-600 text-xs mt-1">{errorCombinado.nombre}</p>}
              </div>
            </div>
          )}

          {/* Paso 2: Ubicación */}
          {paso === 2 && (
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Dirección *</label>
              <textarea
                name="direccion"
                value={form.direccion}
                onChange={manejarCambio}
                placeholder="Dirección completa"
                className={`w-full h-20 px-3 py-1 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                  errorCombinado.direccion ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
                }`}
              />
              {errorCombinado.direccion && <p className="text-red-600 text-xs mt-1">{errorCombinado.direccion}</p>}
            </div>
          )}

          {/* Paso 3: Confirmación y Resumen */}
          {paso === 3 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider mb-2">Resumen del registro</p>
              <div>
                <span className="text-slate-400 font-bold block">Tipo Sede:</span>
                <span className="text-slate-800 font-extrabold">{nombreTipoSede}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Nombre:</span>
                <span className="text-slate-800 font-extrabold">{form.nombre}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">Dirección:</span>
                <span className="text-slate-800 font-semibold">{form.direccion}</span>
              </div>
            </div>
          )}

          {/* Botonera en el Footer */}
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
