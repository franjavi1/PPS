import React from "react";
import { ClipboardList, Save } from "lucide-react";

// Recibimos de la vista padre:
// - asignaturaPlan: objeto con las condiciones de presentismo, nota y horas de la asignatura.
// - resumen: contiene descripciones de texto para el encabezado (materia y sede).
// - guardando: flag booleano para inhabilitar controles en el submit.
// - cambiarAsignaturaPlan: manejador para actualizar campos de entrada.
// - guardarCondiciones: manejador onSubmit para persistir y avanzar.
// - setPasoActual: manejador para retroceder de paso.
export default function PasoCondicionesPlan({
  asignaturaPlan,
  resumen,
  guardando,
  cambiarAsignaturaPlan,
  guardarCondiciones,
  setPasoActual,
}) {
  return (
    // Disparamos la acción de guardar las condiciones definidas de cursado
    <form onSubmit={guardarCondiciones} className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <ClipboardList size={26} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">Condiciones de Cursado</h2>
          <p className="text-sm font-semibold text-red-700 uppercase mt-0.5">
            Asignatura: {resumen.asignatura} - Sede: {resumen.sede}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoTexto
          label="Porcentaje de Presentismo Requerido"
          name="presentismo_porc"
          type="number"
          value={asignaturaPlan.presentismo_porc}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 80"
        />

        <CampoTexto
          label="Nota Promedio de Regularizacion"
          name="regularizacion_prom"
          type="number"
          value={asignaturaPlan.regularizacion_prom}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 6"
        />

        <CampoTexto
          label="Nota Minima Examen Final"
          name="final_aprobacion"
          type="number"
          value={asignaturaPlan.final_aprobacion}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 4"
        />

        <CampoTexto
          label="Duracion (Horas)"
          name="duracion"
          type="number"
          value={asignaturaPlan.duracion}
          onChange={cambiarAsignaturaPlan}
          placeholder="Ej: 64"
        />

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Regimen</label>
          <select
            name="regimen"
            value={asignaturaPlan.regimen}
            onChange={cambiarAsignaturaPlan}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione regimen</option>
            <option value="Cuatrimestral">Cuatrimestral</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Modalidad</label>
          <select
            name="modalidad"
            value={asignaturaPlan.modalidad}
            onChange={cambiarAsignaturaPlan}
            className="w-full h-14 border border-slate-300 rounded-xl px-4 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 font-bold"
          >
            <option value="">Seleccione modalidad</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Hibrida">Hibrida</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        {/* Callback para regresar al paso de seleccionar asignatura */}
        <button
          type="button"
          onClick={() => setPasoActual(2)}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver
        </button>
        {/* Si está guardando, inhabilitamos visual y funcionalmente el botón */}
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition disabled:opacity-60"
        >
          <Save size={22} />
          {guardando ? "Guardando..." : "Guardar condiciones e ir a correlativas"}
        </button>
      </div>
    </form>
  );
}

// Componente helper de presentación para simplificar los inputs del formulario
function CampoTexto({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-14 px-4 border border-slate-300 rounded-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
      />
    </div>
  );
}

