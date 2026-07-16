import React from "react";
import { BookOpen, CalendarDays, Hash, FileText, Save } from "lucide-react";

export default function PasoPlan({
  plan,
  tiposPlanes,
  guardando,
  cambiarPlan,
  guardarPlan,
}) {
  return (
    <form onSubmit={guardarPlan} className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <BookOpen size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Datos del Plan</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Plan</label>
          <select
            name="tipo_planes_id_tipo_planes"
            value={plan.tipo_planes_id_tipo_planes}
            onChange={cambiarPlan}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione un tipo</option>
            {tiposPlanes.map((tipo) => (
              <option key={tipo.id_tipo_planes} value={tipo.id_tipo_planes}>
                {tipo.descripcion}
              </option>
            ))}
          </select>
        </div>

        <CampoTexto
          label="Resolucion Ministerial"
          name="resolucion_ministerial"
          type="number"
          value={plan.resolucion_ministerial}
          onChange={cambiarPlan}
          placeholder="Ej: 450"
          icono={<Hash size={20} />}
        />

        <CampoTexto
          label="Nombre del Plan"
          name="nombre"
          value={plan.nombre}
          onChange={cambiarPlan}
          placeholder="Ej: Plan 2026"
          icono={<FileText size={20} />}
        />

        <CampoTexto
          label="Descripcion"
          name="descrip"
          value={plan.descrip}
          onChange={cambiarPlan}
          placeholder="Ej: Plan de estudios básico de bomberos"
          icono={<FileText size={20} />}
        />

        <CampoTexto
          label="Vigencia Desde"
          name="vigencia_dde"
          type="date"
          value={plan.vigencia_dde}
          onChange={cambiarPlan}
          icono={<CalendarDays size={20} />}
        />

        <CampoTexto
          label="Vigencia Hasta"
          name="vigencia_hta"
          type="date"
          value={plan.vigencia_hta}
          onChange={cambiarPlan}
          icono={<CalendarDays size={20} />}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
        >
          <Save size={22} />
          {guardando ? "Guardando..." : "Crear plan y seguir"}
        </button>
      </div>
    </form>
  );
}

function CampoTexto({ label, name, value, onChange, placeholder, type = "text", icono }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        {icono && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            {icono}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-14 pl-12 pr-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </div>
  );
}
