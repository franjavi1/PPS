import React from "react";
import { GraduationCap, Save } from "lucide-react";

export default function PasoComision({
  comision,
  guardando,
  cambiarComision,
  guardarComision,
}) {
  return (
    <form onSubmit={guardarComision} className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <GraduationCap size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Datos de la comision</h2>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">Descripcion</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <GraduationCap size={20} />
          </span>
          <input
            type="text"
            name="descripcion"
            value={comision.descripcion}
            onChange={cambiarComision}
            placeholder="Ej: Comision A"
            className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
        >
          <Save size={22} />
          {guardando ? "Guardando..." : "Crear comision y seguir"}
        </button>
      </div>
    </form>
  );
}
