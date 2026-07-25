import React from "react";

// Recibimos de la vista padre:
// - paso: objeto con el ícono y el título del paso.
// - activo: boolean flag que indica si es el paso actual del wizard.
// - completo: boolean flag que indica si el paso ya fue aprobado.
// - ultimo: boolean flag para evitar dibujar la línea conectora al final.
export function PasoIndicador({ paso, activo, completo, ultimo }) {
  const resaltado = activo || completo;
  const Icono = paso.icono;

  return (
    <div className="flex flex-1 items-start">
      <div className="flex flex-col items-center min-w-12">
        {/* Renderiza el círculo del paso aplicando colores según si está activo/completo */}
        <div
          className={`w-11 h-11 rounded-full flex items-center justify-center text-base font-extrabold border-2 transition ${
            resaltado
              ? "bg-red-700 border-red-700 text-white shadow-sm"
              : "bg-slate-100 border-slate-300 text-slate-400"
          }`}
        >
          <Icono size={20} />
        </div>
        <p
          className={`hidden md:block mt-2 text-xs font-extrabold text-center ${
            resaltado ? "text-red-700" : "text-slate-400"
          }`}
        >
          {paso.titulo}
        </p>
      </div>

      {/* Renderiza la línea de transición/conexión entre pasos */}
      {!ultimo && (
        <div
          className={`h-1 flex-1 rounded-full mt-5 transition ${
            completo ? "bg-red-700" : "bg-slate-200"
          }`}
        />
      )}
    </div>
  );
}

