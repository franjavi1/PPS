import { FileText } from "lucide-react";
import { TituloPaso, CampoTexto, CampoSoloLectura, Acciones } from "../FormHelpers";

// Recibimos de la vista padre:
// - personaResumen: nombre completo de la persona para mostrar en solo lectura.
// - personaId: id único de la persona física previamente creada.
// - legajo: objeto de formulario con los datos del legajo (número).
// - cambiarLegajo: callback para actualizar el estado del formulario.
// - guardando: flag de carga para bloquear UI durante el submit.
// - guardarLegajo: callback onSubmit para procesar la creación.
// - onBack: manejador de acción para volver al paso anterior.
export default function StepLegajo({
  personaResumen,
  personaId,
  legajo,
  cambiarLegajo,
  guardando,
  guardarLegajo,
  onBack,
  tiposLegajo = [],
  tiposLegajoSeleccionados = [],
  onTipoLegajoChange,
}) {
  return (
    // Disparamos la acción de guardar el número de legajo
    <form onSubmit={guardarLegajo} className="space-y-6">
      <TituloPaso icono={<FileText size={26} />} titulo="Datos del legajo" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <CampoSoloLectura label="Persona creada" value={`${personaResumen} - ID ${personaId}`} />
        <CampoTexto
          label="Numero de legajo"
          name="numero"
          value={legajo.numero}
          onChange={cambiarLegajo}
          placeholder="Ej: 1001"
        />
      </div>

      {/* Checkboxes de Selección de Tipos de Legajo */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-base font-extrabold text-slate-800 mb-3">Tipos de Legajo *</h3>
        {tiposLegajo.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {tiposLegajo.map((tipo) => {
              const checked = tiposLegajoSeleccionados.includes(tipo.id);
              return (
                <label
                  key={tipo.id}
                  className={`flex items-center gap-3 p-3.5 border rounded-xl cursor-pointer hover:bg-slate-50/50 transition-all ${
                    checked ? "border-red-500 bg-red-50/30 font-bold text-red-900 shadow-xs" : "border-slate-200 text-slate-700 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onTipoLegajoChange(tipo.id)}
                    className="w-5 h-5 rounded text-red-600 border-slate-300 focus:ring-red-500 cursor-pointer"
                  />
                  <span className="text-sm select-none">{tipo.descripcion}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No hay tipos de legajo configurados en el sistema.</p>
        )}
      </div>

      {/* Botones de navegación con flag guardando */}
      <Acciones guardando={guardando} texto="Crear legajo y seguir" onBack={onBack} />
    </form>
  );
}

