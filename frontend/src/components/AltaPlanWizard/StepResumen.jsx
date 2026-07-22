import { CheckCircle2, Save } from "lucide-react";
import { TituloPaso } from "../FormHelpers";

// Recibimos de la vista padre:
// - plan: objeto de datos con los atributos del plan de estudio.
// - asignaturasCargadas: lista de materias asociadas.
// - correlativasCargadas: lista de correlativas configuradas.
// - volverPlanes: callback para volver al listado general de planes.
// - cargarOtroPlan: callback para restablecer el asistente y comenzar una nueva carga.
export default function StepResumen({ plan, asignaturasCargadas, correlativasCargadas, volverPlanes, cargarOtroPlan }) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<CheckCircle2 size={26} />} titulo="Resumen del alta del plan" />
      {/* Grilla con tarjetas informativas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-400 uppercase">Plan de estudio</p>
          <p className="text-slate-800 font-extrabold mt-1">{plan.nombre || "-"}</p>
        </div>
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-400 uppercase">Asignaturas cargadas</p>
          <p className="text-slate-800 font-extrabold mt-1">{asignaturasCargadas.length}</p>
        </div>
        <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
          <p className="text-sm font-bold text-slate-400 uppercase">Correlativas creadas</p>
          <p className="text-slate-800 font-extrabold mt-1">{correlativasCargadas.length}</p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
        {/* Dispara la navegación de regreso al listado general */}
        <button
          type="button"
          onClick={volverPlanes}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
        >
          Volver a planes
        </button>
        {/* Reinicia el estado del asistente para cargar un nuevo plan desde cero */}
        <button
          type="button"
          onClick={cargarOtroPlan}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
        >
          <Save size={22} />
          Cargar otro plan
        </button>
      </div>
    </section>
  );
}

