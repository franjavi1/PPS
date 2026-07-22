import React from "react";
import { X, Save } from "lucide-react";

export default function TipoRangosModal({
  formulario,
  errorFormulario,
  editandoId,
  manejarCambio,
  guardarRango,
  cerrarModal,
}) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[200] px-4">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl w-full max-w-xl relative">
        <button
          type="button"
          onClick={cerrarModal}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
          aria-label="Cerrar modal"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-extrabold text-slate-800 mb-5">
          {editandoId ? "Editar tipo de rango" : "Nuevo tipo de rango"}
        </h2>

        {errorFormulario && (
          <div className="mb-5 border border-red-200 bg-red-50 text-red-700 rounded-xl px-4 py-3 font-semibold">
            {errorFormulario}
          </div>
        )}

        <form onSubmit={guardarRango} className="space-y-5">
          <CampoTexto
            label="Descripcion"
            name="descripcion"
            value={formulario.descripcion}
            onChange={manejarCambio}
            placeholder="Ej: Cabo"
          />

          <CampoTexto
            label="Nivel de jerarquia"
            name="nivel_jerarquia"
            type="number"
            value={formulario.nivel_jerarquia}
            onChange={manejarCambio}
            placeholder="Ej: 2"
          />

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={cerrarModal}
              className="px-5 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
            >
              <Save size={20} />
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CampoTexto({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 border border-slate-300 rounded-xl px-4 text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
}
