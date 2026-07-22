import { ChevronRight, Bell } from "lucide-react";

// Recibimos de la vista padre:
// - icono: nodo JSX para ilustrar la métrica.
// - titulo: texto de cabecera de la tarjeta.
// - valor: cantidad numérica o texto de estado a mostrar en grande.
// - color: color clave (red, green, yellow, blue) para estilizar la tarjeta.
export function TarjetaResumen({ icono, titulo, valor, color }) {
  const colores = {
    red: "bg-red-100 text-red-700",
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
  };

  const coloresValor = {
    red: "text-red-700",
    green: "text-green-700",
    yellow: "text-yellow-600",
    blue: "text-blue-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 flex items-center gap-5">
      <div className={`w-20 h-20 rounded-full flex items-center justify-center ${colores[color]}`}>
        {icono}
      </div>
      <div>
        <p className="text-slate-500 font-medium">{titulo}</p>
        <p className={`text-4xl font-extrabold mt-1 ${coloresValor[color]}`}>{valor}</p>
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
      className="border border-slate-200 rounded-xl p-6 text-left hover:bg-slate-50 hover:shadow transition flex items-center justify-between gap-4 w-full"
    >
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-red-100 text-red-700 flex items-center justify-center">
          {icono}
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">{titulo}</h3>
          <p className="text-slate-500 mt-2">{descripcion}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-500" size={28} />
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

