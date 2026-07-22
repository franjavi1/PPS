import React from "react";
import { CheckCircle2, PlusCircle, Save } from "lucide-react";
import { useNavigate } from "react-router";

// Recibimos de la vista padre:
// - plan: objeto de datos con los atributos del plan creado.
// - planId: identificador único generado.
// - asignaturasCargadas: lista de asignaturas vinculadas.
// - correlativasCargadas: lista de correlatividades creadas.
// - resumen: objeto con datos auxiliares formateados.
// - agregarOtraAsignatura: callback para reiniciar el flujo e incorporar una nueva materia.
// - cargarOtroPlan: callback para restablecer el asistente para un plan completamente nuevo.
export default function PasoResumenPlan({
  plan,
  planId,
  asignaturasCargadas,
  correlativasCargadas,
  resumen,
  agregarOtraAsignatura,
  cargarOtroPlan,
}) {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Plan Creado Exitosamente</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <ResumenItem titulo="Nombre del Plan" texto={plan.nombre || "-"} />
        <ResumenItem titulo="Plan ID" texto={planId || "-"} />
        <ResumenItem titulo="Tipo de Plan" texto={resumen.tipoPlan} />
        <ResumenItem titulo="Resolucion" texto={plan.resolucion_ministerial || "-"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
        <ResumenItem
          titulo="Asignaturas Vinculadas"
          texto={`${asignaturasCargadas.length} materia(s) cargada(s)`}
        />
        <ResumenItem
          titulo="Correlativas Asociadas"
          texto={`${correlativasCargadas.length} relacion(es) creada(s)`}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
        {/* Navega de regreso al panel general de planes de estudio */}
        <button
          type="button"
          onClick={() => navigate("/planes")}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver a planes
        </button>

        {/* Reinicia el wizard para agregar más asignaturas al plan actual */}
        <button
          type="button"
          onClick={agregarOtraAsignatura}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-700 text-red-700 rounded-lg font-bold hover:bg-red-50 transition"
        >
          <PlusCircle size={22} />
          Agregar otra asignatura al plan
        </button>

        {/* Reinicia el wizard para dar de alta otro plan totalmente diferente */}
        <button
          type="button"
          onClick={cargarOtroPlan}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
        >
          <Save size={22} />
          Cargar otro plan nuevo
        </button>
      </div>
    </section>
  );
}

// Componente secundario reutilizable para mostrar las tarjetas del resumen
function ResumenItem({ titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

