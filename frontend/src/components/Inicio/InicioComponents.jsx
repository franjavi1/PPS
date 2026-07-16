import { ChevronRight } from "lucide-react";

export function TarjetaResumen({ icono, titulo, valor, tono }) {
  const tonos = {
    red: "text-red-700 bg-red-50 border-red-100",
    blue: "text-blue-700 bg-blue-50 border-blue-100",
    green: "text-green-700 bg-green-50 border-green-100",
    amber: "text-amber-700 bg-amber-50 border-amber-100",
    slate: "text-slate-700 bg-slate-50 border-slate-200",
  };

  return (
    <article className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${tonos[tono]}`}>
        {icono}
      </div>
      <p className="text-slate-500 font-bold mt-4">{titulo}</p>
      <p className="text-4xl font-extrabold text-slate-900 mt-1">{valor}</p>
    </article>
  );
}

export function AccesoRapido({ icono, titulo, descripcion, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full border border-slate-200 rounded-xl p-4 text-left hover:bg-slate-50 hover:shadow-sm transition flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-red-50 text-red-700 flex items-center justify-center">
          {icono}
        </div>
        <div>
          <h3 className="text-lg font-extrabold text-slate-800">{titulo}</h3>
          <p className="text-slate-500 text-sm mt-1">{descripcion}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-400 shrink-0" size={24} />
    </button>
  );
}

export function IndicadorOperativo({ titulo, descripcion, valor }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-slate-800">{titulo}</h3>
          <p className="text-slate-500 text-sm mt-2">{descripcion}</p>
        </div>
        <span className="min-w-11 h-11 rounded-lg bg-white border border-slate-200 text-red-700 flex items-center justify-center text-xl font-extrabold">
          {valor}
        </span>
      </div>
    </div>
  );
}
