import { PlusCircle, X } from "lucide-react";

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
  if (!mostrarModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-md relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={() => {
            limpiarForm();
            setMostrarModal(false);
          }}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={20} />
        </button>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            {modoEdicion ? "Editar Aula" : "Nueva Aula"}
          </h2>
        </div>
        <form onSubmit={guardar} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Nombre / Identificación del Aula *
            </label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Aula 102"
              className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                error.nombre ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
              }`}
            />
            {error.nombre && <p className="text-red-600 text-xs mt-1">{error.nombre}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Sede de Ubicación *
            </label>
            <select
              name="sedeId"
              value={form.sedeId}
              onChange={manejarCambio}
              className={`w-full h-11 px-3 border rounded-lg text-slate-700 bg-white focus:outline-none focus:ring-2 ${
                error.sedeId ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
              }`}
            >
              <option value="">Seleccione una Sede</option>
              {sedes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
            {error.sedeId && <p className="text-red-600 text-xs mt-1">{error.sedeId}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Capacidad (Alumnos Sentados) *
            </label>
            <input
              type="number"
              name="capacidad"
              value={form.capacidad}
              onChange={manejarCambio}
              placeholder="Ej: 30"
              min="1"
              className={`w-full h-11 px-3 border rounded-lg text-slate-700 focus:outline-none focus:ring-2 ${
                error.capacidad ? "border-red-500 focus:ring-red-500" : "border-slate-300 focus:ring-red-500"
              }`}
            />
            {error.capacidad && <p className="text-red-600 text-xs mt-1">{error.capacidad}</p>}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                limpiarForm();
                setMostrarModal(false);
              }}
              className="w-1/2 h-11 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-1/2 h-11 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 transition flex items-center justify-center gap-2"
            >
              <PlusCircle size={18} />
              {modoEdicion ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
