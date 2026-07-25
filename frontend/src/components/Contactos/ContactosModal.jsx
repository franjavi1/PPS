import React from "react";
import { Phone, X, Save } from "lucide-react";

export default function ContactosModal({
  formulario,
  personas,
  tiposContacto,
  error,
  editandoId,
  manejarCambio,
  guardarContacto,
  cerrarModal,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-2xl relative">
        <button
          onClick={cerrarModal}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition"
          title="Cerrar modal"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
          {editandoId ? "Editar contacto" : "Nuevo contacto"}
        </h2>

        <form onSubmit={guardarContacto} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Persona</label>
              <select
                name="persona_id"
                value={formulario.persona_id}
                onChange={manejarCambio}
                className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccione una persona</option>
                {personas.map((persona) => (
                  <option key={persona.id} value={persona.id}>
                    {persona.apellido}, {persona.nombre} - {persona.numero_doc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de contacto</label>
              <select
                name="tipo_contacto_id"
                value={formulario.tipo_contacto_id}
                onChange={manejarCambio}
                className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Seleccione un tipo</option>
                {tiposContacto.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Contacto</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={20} />
                </span>
                <input
                  type="text"
                  name="contacto"
                  value={formulario.contacto}
                  onChange={manejarCambio}
                  placeholder="Ej: +54 9 351 1234567 o email@correo.com"
                  maxLength={100}
                  className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-2 py-2">
              <input
                type="checkbox"
                id="principal"
                name="principal"
                checked={formulario.principal}
                onChange={manejarCambio}
                className="w-5 h-5 accent-red-700 rounded focus:ring-red-500"
              />
              <label htmlFor="principal" className="text-sm font-bold text-slate-700 select-none">
                Establecer como contacto principal
              </label>
            </div>
          </div>

          {error && <p className="text-red-600 font-semibold">{error}</p>}

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
            >
              <X size={20} />
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
            >
              <Save size={22} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
