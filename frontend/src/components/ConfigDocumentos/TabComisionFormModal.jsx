import { PlusCircle, X, Save } from "lucide-react";

// Este componente es puramente de presentación; recibe sus props del padre para no exceder el límite de líneas.
export default function TabComisionFormModal({
  mostrarModal,
  cerrarModal,
  modoEdicion,
  form,
  errors,
  asignaturas,
  aulas,
  manejarCambio,
  guardar
}) {
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in duration-200">
        <button onClick={cerrarModal} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition" title="Cerrar modal"><X size={20} /></button>
        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">{modoEdicion ? "Editar Comisión" : "Nueva Comisión"}</h2>
        
        <form onSubmit={guardar} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nombre/Identificación de la Comisión</label>
            <input type="text" name="nombre" value={form.nombre} onChange={manejarCambio} placeholder="Ej: Comisión A, Curso Nocturno" className={`w-full h-12 border ${errors.nombre ? "border-red-500" : "border-slate-300"} rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`} />
            {errors.nombre && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Asignatura Académica</label>
            <select name="asignaturaId" value={form.asignaturaId} onChange={manejarCambio} className={`w-full h-12 border ${errors.asignaturaId ? "border-red-500" : "border-slate-300"} rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}>
              <option value="">Seleccione una asignatura</option>
              {asignaturas.map((asig) => (<option key={asig.id} value={asig.id}>{asig.nombre}</option>))}
            </select>
            {errors.asignaturaId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.asignaturaId}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Aula Física Asignada</label>
            <select name="aulaId" value={form.aulaId} onChange={manejarCambio} className={`w-full h-12 border ${errors.aulaId ? "border-red-500" : "border-slate-300"} rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`}>
              <option value="">Seleccione un aula</option>
              {aulas.map((a) => (<option key={a.id} value={a.id}>{a.nombre} (Capacidad: {a.capacidad} alumnos)</option>))}
            </select>
            {errors.aulaId && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.aulaId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Cupo Máximo</label>
              <input type="number" name="cupoMaximo" value={form.cupoMaximo} onChange={manejarCambio} placeholder="Ej: 30" className={`w-full h-12 border ${errors.cupoMaximo ? "border-red-500" : "border-slate-300"} rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`} />
              {errors.cupoMaximo && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.cupoMaximo}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Inscritos Actuales</label>
              <input type="number" name="inscritos" value={form.inscritos} onChange={manejarCambio} placeholder="Ej: 0" className={`w-full h-12 border ${errors.inscritos ? "border-red-500" : "border-slate-300"} rounded-xl px-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500`} />
              {errors.inscritos && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.inscritos}</p>}
            </div>
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
