import React from "react";
import { CheckCircle2, Save } from "lucide-react";
import { useNavigate } from "react-router";

// Recibimos de la vista padre:
// - comision: objeto de datos con los atributos de la comisión creada.
// - comisionId: identificador generado de la comisión.
// - comisionesAsignaturasCargadas: materias asociadas a esta comisión.
// - autoridadesCargadas: autoridades asignadas.
// - cargarOtraComision: callback para reiniciar el asistente.
export default function PasoResumenComision({
  comision,
  comisionId,
  comisionesAsignaturasCargadas,
  autoridadesCargadas,
  cargarOtraComision,
}) {
  const navigate = useNavigate();

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          <CheckCircle2 size={26} />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">Resumen</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ResumenItem
          titulo="Comision"
          texto={`${comision.descripcion || "-"} - ID ${comisionId || "-"}`}
        />
        <ResumenItem
          titulo="Asignaturas"
          texto={comisionesAsignaturasCargadas.length}
        />
        <ResumenItem
          titulo="Autoridades"
          texto={autoridadesCargadas.length}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
        {/* Navega de regreso al panel general de comisiones */}
        <button
          type="button"
          onClick={() => navigate("/comisiones")}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100 transition"
        >
          Volver a comisiones
        </button>
        {/* Reinicia el wizard para dar de alta otra comision limpia */}
        <button
          type="button"
          onClick={cargarOtraComision}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800 transition"
        >
          <Save size={22} />
          Cargar otra comision
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

