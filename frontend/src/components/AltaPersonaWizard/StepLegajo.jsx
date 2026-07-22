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
      {/* Botones de navegación con flag guardando */}
      <Acciones guardando={guardando} texto="Crear legajo y seguir" onBack={onBack} />
    </form>
  );
}

