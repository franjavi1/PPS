import { ChevronRight, Bell } from "lucide-react";

// Recibimos de la vista padre:
// - icono: nodo JSX para ilustrar la métrica.
// - titulo: texto de cabecera de la tarjeta.
// - valor: cantidad numérica o texto de estado a mostrar en grande.
// - color: color clave (red, green, yellow, blue) para estilizar la tarjeta.
export function TarjetaResumen({ icono, titulo, valor, color }) {
  const colores = {
    red: "bg-red-50 text-red-600",
    green: "bg-green-50 text-green-600",
    yellow: "bg-yellow-50 text-yellow-600",
    blue: "bg-blue-50 text-blue-600",
  };

  const coloresValor = {
    red: "text-red-700",
    green: "text-green-700",
    yellow: "text-yellow-600",
    blue: "text-blue-700",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 flex items-center gap-4 hover:shadow-sm transition-all duration-300">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${colores[color]}`}>
        {icono}
      </div>
      <div>
        <p className="text-slate-500 font-semibold text-xs md:text-sm tracking-wide">{titulo}</p>
        <p className={`text-3xl font-extrabold mt-0.5 leading-none ${coloresValor[color]}`}>{valor}</p>
      </div>
    </div>
  );
}

// Recibimos de la vista padre:
// - icono: nodo JSX para ilustrar el acceso directo.
// - titulo: nombre de la acción.
// - descripcion: texto explicativo.
// - onClick: función callback para navegar o disparar un proceso.
export function AccesoRapido({ icono, titulo, descripcion, onClick }) {
  return (
    // Dispara el callback de click definido por el componente principal
    <button
      onClick={onClick}
      className="border border-slate-200 rounded-xl p-5 text-left hover:bg-slate-50 hover:shadow-sm transition flex items-center justify-between gap-4 w-full cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-700 flex items-center justify-center shrink-0">
          {icono}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 leading-snug">{titulo}</h3>
          <p className="text-slate-500 text-sm mt-1">{descripcion}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-400" size={24} />
    </button>
  );
}

// Recibimos de la vista padre:
// - titulo: encabezado del aviso.
// - descripcion: cuerpo de texto del aviso.
// - fecha: marca de tiempo del aviso.
// - color: color de categorización del aviso.
export function Aviso({ titulo, descripcion, fecha, color }) {
  const colores = {
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-600",
    blue: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-5">
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colores[color]}`}>
          <Bell size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{titulo}</h3>
          <p className="text-slate-500 text-sm mt-1">{descripcion}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500">{fecha}</p>
    </div>
  );
}

