import { GraduationCap } from "lucide-react";
import { TituloPaso, CampoTexto, Acciones } from "../FormHelpers";

// Recibimos de la vista padre:
// - comision: objeto local de formulario con la descripción.
// - cambiarComision: callback para actualizar el estado del formulario.
// - guardando: bandera para deshabilitar controles y mostrar el spinner.
// - guardarComision: callback onSubmit para crear la comisión física.
export default function StepComision({
  comision,
  cambiarComision,
  guardando,
  guardarComision,
}) {
  return (
    // Disparamos la creación inicial del registro de comisión
    <form onSubmit={guardarComision} className="space-y-6">
      <TituloPaso icono={<GraduationCap size={26} />} titulo="Datos de la comisión" />
      <CampoTexto
        label="Descripción"
        name="descripcion"
        value={comision.descripcion}
        onChange={cambiarComision}
        placeholder="Ej: Comisión A"
        icon={<GraduationCap size={20} />}
      />
      <Acciones guardando={guardando} texto="Crear comisión y seguir" />
    </form>
  );
}

