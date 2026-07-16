import { Save, CheckCircle2 } from "lucide-react";
import { TituloPaso } from "../FormHelpers";

function ResumenItem({ titulo, texto }) {
  return (
    <div className="border border-slate-200 rounded-xl bg-slate-50 p-5">
      <p className="text-sm font-bold text-slate-400 uppercase">{titulo}</p>
      <p className="text-slate-800 font-extrabold mt-1">{texto}</p>
    </div>
  );
}

export default function StepResumen({
  comision,
  comisionId,
  comisionesAsignaturasCargadas,
  autoridadesCargadas,
  volverComisiones,
  cargarOtraComision,
}) {
  return (
    <section className="space-y-6">
      <TituloPaso icono={<CheckCircle2 size={26} />} titulo="Resumen" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <ResumenItem titulo="Comisión" texto={`${comision.descripcion || "-"} - ID ${comisionId || "-"}`} />
        <ResumenItem titulo="Asignaturas" texto={comisionesAsignaturasCargadas.length} />
        <ResumenItem titulo="Autoridades" texto={autoridadesCargadas.length} />
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={volverComisiones}
          className="px-6 py-3 border border-slate-300 rounded-lg font-bold text-slate-700 hover:bg-slate-100"
        >
          Volver a comisiones
        </button>
        <button
          type="button"
          onClick={cargarOtraComision}
          className="flex items-center justify-center gap-2 px-8 py-3 bg-red-700 text-white rounded-lg font-bold hover:bg-red-800"
        >
          <Save size={22} />
          Cargar otra comisión
        </button>
      </div>
    </section>
  );
}
