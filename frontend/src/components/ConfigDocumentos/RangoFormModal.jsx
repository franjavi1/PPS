import { PlusCircle, X, Save } from "lucide-react";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function RangoFormModal({
  mostrarModal,
  cerrarModal,
  modoEdicion,
  form,
  errors,
  manejarCambio,
  guardar
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        <button onClick={cerrarModal} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition" title="Cerrar modal"><X size={20} /></button>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">{modoEdicion ? "Editar Rango Jerárquico" : "Nuevo Rango Jerárquico"}</h2>
        
        <form onSubmit={guardar} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Descripción Oficial del Rango</label>
            <input type="text" name="descripcion" value={form.descripcion} onChange={manejarCambio} placeholder="Ej: Oficial Principal, Suboficial, Cadete" className={`w-full h-12 border ${errors.descripcion ? "border-red-500" : "border-slate-300"} rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`} />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.descripcion}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nivel Jerárquico (Prioridad Numérica)</label>
            <input type="number" name="nivelPrioridad" value={form.nivelPrioridad} onChange={manejarCambio} placeholder="Ej: 1 (Mayor jerarquía), 2, 3" className={`w-full h-12 border ${errors.nivelPrioridad ? "border-red-500" : "border-slate-300"} rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`} />
            {errors.nivelPrioridad && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.nivelPrioridad}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={cerrarModal} className="px-5 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-bold transition text-sm">Cancelar</button>
            <button type="submit" className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold transition flex items-center gap-2 text-sm shadow-sm"><Save size={16} />Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
